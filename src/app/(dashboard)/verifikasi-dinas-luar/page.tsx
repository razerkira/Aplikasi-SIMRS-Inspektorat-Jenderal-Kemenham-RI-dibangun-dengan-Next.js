// src/app/(dashboard)/verifikasi-dinas-luar/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { DinasLuar } from "@/components/DinasLuarTable"; // Kita gunakan lagi interface ini
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RejectDialog from "@/components/RejectDialog";
import PaginationControls from "@/components/PaginationControls";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

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

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString("id-ID");
    const endDate = new Date(end).toLocaleDateString("id-ID");
    return `${startDate} - ${endDate}`;
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nama Pengaju</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Deskripsi</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Tanggal</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Dokumen</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Aksi</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.Nama}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.DeskripsiKegiatan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateRange(item.TanggalMulai, item.TanggalSelesai)}</td>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchData = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    let query = supabase
      .from('dokumen_dinas_luar')
      .select('*', { count: 'exact' })
      .eq('status_verifikator', 'Menunggu'); // Ambil hanya yang statusnya 'Menunggu'

    if (search) {
      query = query.ilike('Nama', `%${search}%`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("Gagal mengambil data verifikasi:", error);
      setSubmissions([]);
    } else if (data) {
      setSubmissions(data as DinasLuar[]);
      setTotalItems(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    }
    setLoading(false);
  }, [itemsPerPage]);

  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
    fetchData(1, debouncedSearchTerm);
  }, [fetchData, debouncedSearchTerm]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchData(currentPage, debouncedSearchTerm);
    }
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Verifikasi Pengajuan Dinas Luar</h1>
        <p className="text-gray-500 mt-2">
          Setujui atau tolak pengajuan yang masuk dari pegawai.
        </p>
      </div>

      <div>
        <Input
          placeholder="Cari berdasarkan nama pengaju..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div>
        {loading ? (
          <p>Memuat pengajuan...</p>
        ) : (
          <>
            <VerificationTable data={submissions} refreshData={() => fetchData(currentPage, debouncedSearchTerm)} />
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
