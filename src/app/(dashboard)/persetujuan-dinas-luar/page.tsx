"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DinasLuar } from "@/components/DinasLuarTable"; // Kita gunakan lagi interface ini
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RejectDialogSupervisor from "@/components/RejectDialogSupervisor"; // Komponen dialog tolak untuk supervisor

// Komponen Tabel Persetujuan
function ApprovalTable({ data, refreshData }: { data: DinasLuar[], refreshData: () => void }) {
  const { toast } = useToast();

  const handleApprove = async (id: number) => {
    try {
      const { error } = await supabase
        .from('dokumen_dinas_luar')
        .update({ status_supervisor: 'Disetujui' })
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
                  <RejectDialogSupervisor submissionId={item.id} tableName="dokumen_dinas_luar" refreshData={refreshData} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                Tidak ada pengajuan yang perlu disetujui.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Halaman Utama Persetujuan
export default function PersetujuanDinasLuarPage() {
  const [submissions, setSubmissions] = useState<DinasLuar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dokumen_dinas_luar')
      .select('*')
      .eq('status_verifikator', 'Disetujui') // Ambil yang sudah disetujui verifikator
      .eq('status_supervisor', 'Menunggu'); // Dan masih menunggu persetujuan supervisor

    if (error) {
      console.error("Gagal mengambil data persetujuan:", error);
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
        <h1 className="text-3xl font-bold">Persetujuan Pengajuan Dinas Luar</h1>
        <p className="text-gray-500 mt-2">
          Berikan persetujuan akhir untuk pengajuan yang telah diverifikasi.
        </p>
      </div>
      
      <div>
        {loading ? <p>Memuat pengajuan...</p> : <ApprovalTable data={submissions} refreshData={fetchData} />}
      </div>
    </div>
  );
}