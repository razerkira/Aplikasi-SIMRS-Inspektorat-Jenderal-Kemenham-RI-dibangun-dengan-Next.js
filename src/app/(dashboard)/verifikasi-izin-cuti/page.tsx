// src/app/(dashboard)/verifikasi-izin-cuti/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { IzinCuti } from "@/components/IzinCutiTable"; // Kita gunakan lagi interface ini
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import RejectDialog from "@/components/RejectDialog"; // Kita gunakan kembali dialog tolak
import PaginationControls from "@/components/PaginationControls";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

// Komponen Tabel Verifikasi untuk Izin Cuti
function VerificationTable({ data, refreshData }: { data: IzinCuti[], refreshData: () => void }) {
  const { toast } = useToast();

  const handleApprove = async (id: number) => {
    try {
      const { error } = await supabase
        .from('dokumen_izin_cuti') // Pastikan menargetkan tabel yang benar
        .update({ status_verifikator: 'Disetujui' })
        .eq('id', id);
      
      if (error) throw error;

      toast({ title: "Sukses", description: "Pengajuan Izin Cuti telah disetujui." });
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Jenis Cuti</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.JenisCuti}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateRange(item.TanggalMulai, item.TanggalSelesai)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a href={item.DokumenURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Lihat
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleApprove(item.id)}>Setujui</Button>
                  {/* Komponen RejectDialog yang generik kita gunakan lagi di sini */}
                  <RejectDialog submissionId={item.id} tableName="dokumen_izin_cuti" refreshData={refreshData} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                Tidak ada pengajuan izin cuti yang perlu diverifikasi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// Halaman Utama Verifikasi
export default function VerifikasiIzinCutiPage() {
  const [submissions, setSubmissions] = useState<IzinCuti[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // Tentukan jumlah item per halaman
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchData = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    let query = supabase
      .from('dokumen_izin_cuti') // Ambil dari tabel yang benar
      .select('*', { count: 'exact' })
      .eq('status_verifikator', 'Menunggu');

    if (search) {
      // Gunakan ilike untuk pencarian case-insensitive
      query = query.ilike('Nama', `%${search}%`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("Gagal mengambil data verifikasi:", error);
      setSubmissions([]);
    } else if (data) {
      setSubmissions(data as IzinCuti[]);
      setTotalItems(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
    }
    setLoading(false);
  }, [itemsPerPage]);

  useEffect(() => {
    // Reset ke halaman 1 setiap kali pencarian berubah
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    fetchData(1, debouncedSearchTerm);
  }, [fetchData, debouncedSearchTerm]);

  useEffect(() => {
    // Fetch data untuk halaman lain (selain halaman 1) saat paginasi diklik
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
        <h1 className="text-3xl font-bold">Verifikasi Pengajuan Izin Cuti</h1>
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
