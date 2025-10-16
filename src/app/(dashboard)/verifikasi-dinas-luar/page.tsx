// src/app/(dashboard)/verifikasi-dinas-luar/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { DinasLuar } from "@/components/DinasLuarTable"; // Kita gunakan lagi interface ini
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RejectDialog from "@/components/RejectDialog";

// Komponen Tabel Verifikasi
function VerificationTable({ data, refreshData }: { data: DinasLuar[], refreshData: () => void }) {
  const { toast } = useToast();

  const handleApprove = async (id: number) => {
    try {
      const { error } = await supabase
        .from('dokumen_dinas_luar')
        .update({ status_verifikator: 'Disetujui' })
        .eq('id', id);
      
      if (error) throw error;

      toast({ title: "Sukses", description: "Pengajuan telah disetujui." });
      refreshData();
    } catch (error: any) {
      console.error("Gagal menyetujui pengajuan:", error);
      toast({ variant: "destructive", title: "Gagal", description: "Terjadi kesalahan." });
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("id-ID");

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Pengaju</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dokumen</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.Nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.DeskripsiKegiatan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.TanggalMulai)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a href={item.DokumenURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Lihat
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleApprove(item.id)}>Setujui</Button>
                  <RejectDialog submissionId={item.id} tableName="dokumen_dinas_luar" refreshData={refreshData} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                Tidak ada pengajuan yang perlu diverifikasi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Halaman Utama Verifikasi
export default function VerifikasiDinasLuarPage() {
  const [submissions, setSubmissions] = useState<DinasLuar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dokumen_dinas_luar')
      .select('*')
      .eq('status_verifikator', 'Menunggu'); // Ambil hanya yang statusnya 'Menunggu'

    if (error) {
      console.error("Gagal mengambil data verifikasi:", error);
    } else if (data) {
      setSubmissions(data as DinasLuar[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verifikasi Pengajuan Dinas Luar</h1>
        <p className="text-gray-500 mt-2">
          Setujui atau tolak pengajuan yang masuk dari pegawai.
        </p>
      </div>
      
      <div>
        {loading ? <p>Memuat pengajuan...</p> : <VerificationTable data={submissions} refreshData={fetchData} />}
      </div>
    </div>
  );
}