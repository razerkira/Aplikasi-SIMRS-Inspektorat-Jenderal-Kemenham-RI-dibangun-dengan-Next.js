// src/app/(dashboard)/pengajuan-izin-cuti/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { IzinCuti } from "@/components/IzinCutiTable"; // Impor interface dari tabel yang benar
import PaginationControls from "@/components/PaginationControls";

function StatusBadge({ status }: { status: string | null }) {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full inline-block";
  if (status === 'Disetujui') {
    return <span className={`${baseClasses} bg-green-100 text-green-800`}>{status}</span>;
  }
  if (status === 'Ditolak') {
    return <span className={`${baseClasses} bg-red-100 text-red-800`}>{status}</span>;
  }
  return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>{status || 'Menunggu'}</span>;
}

function MyIzinCutiSubmissionsTable({ data }: { data: IzinCuti[] }) {
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
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500">Jenis Cuti</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500">Tanggal Pengajuan</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500">Status Verifikator</th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500">Status Supervisor</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500">Dokumen</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.JenisCuti}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateRange(item.TanggalMulai, item.TanggalSelesai)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status_verifikator} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={item.status_supervisor} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <a href={item.DokumenURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Lihat
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                Anda belum memiliki pengajuan izin cuti.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}


export default function PengajuanIzinCutiPage() {
  const { user } = useAuth();
  const [myData, setMyData] = useState<IzinCuti[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10; // Tentukan jumlah item per halaman

  const fetchData = useCallback(async (page = 1) => {
    if (!user) return;
    setLoading(true);
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    
    const { data, error, count } = await supabase
      .from('dokumen_izin_cuti') // Ambil dari tabel yang benar
      .select('*', { count: 'exact' })
      .eq('user_id', user.uid)
      .order('id', { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Gagal mengambil data pengajuan izin cuti:", error);
      setMyData([]);
    } else if (data) {
      setMyData(data as IzinCuti[]);
      const totalCount = count || 0;
      setTotalItems(totalCount);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    }
    setLoading(false);
  }, [user, itemsPerPage]);

  useEffect(() => {
    if (user) {
      fetchData(currentPage);
    }
  }, [user, fetchData, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pengajuan Izin Cuti Saya</h1>
          <p className="text-gray-500 mt-2">
            Lihat status semua pengajuan izin cuti yang telah Anda buat.
          </p>
        </div>
        <Link href="/upload-izin-cuti" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Pengajuan Cuti Baru
          </Button>
        </Link>
      </div>

      <div>
        {loading ? (
          <p>Memuat pengajuan...</p>
        ) : (
          <>
            <MyIzinCutiSubmissionsTable data={myData} />
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