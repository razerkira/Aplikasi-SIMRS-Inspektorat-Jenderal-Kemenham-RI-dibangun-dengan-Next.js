// src/app/(dashboard)/pengajuan-dinas-luar/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { DinasLuar } from "@/components/DinasLuarTable";

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

function MySubmissionsTable({ data }: { data: DinasLuar[] }) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi Kegiatan</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Mulai</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Verifikator</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Supervisor</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumen</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.DeskripsiKegiatan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.TanggalMulai)}</td>
                <td className="px-6 py-4 align-top text-sm">
                  <div>
                    <StatusBadge status={item.status_verifikator} />
                    {item.status_verifikator === 'Ditolak' && item.alasan_penolakan_verifikator && (
                      <p className="text-xs text-red-600 mt-1 max-w-xs whitespace-normal">
                        Alasan: {item.alasan_penolakan_verifikator}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 align-top text-sm">
                  <div>
                    <StatusBadge status={item.status_supervisor} />
                    {item.status_supervisor === 'Ditolak' && item.alasan_penolakan_supervisor && (
                      <p className="text-xs text-red-600 mt-1 max-w-xs whitespace-normal">
                        Alasan: {item.alasan_penolakan_supervisor}
                      </p>
                    )}
                  </div>
                </td>
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
                Anda belum memiliki pengajuan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function PengajuanDinasLuarPage() {
  const { user } = useAuth();
  const [myData, setMyData] = useState<DinasLuar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('dokumen_dinas_luar')
      .select('*')
      .eq('user_id', user.uid)
      .order('id', { ascending: false });

    if (error) {
      console.error("Gagal mengambil data pengajuan:", error);
    } else if (data) {
      setMyData(data as DinasLuar[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Pengajuan Dinas Luar Saya</h1>
          <p className="text-gray-500 mt-2">
            Lihat status semua pengajuan dinas luar yang telah Anda buat.
          </p>
        </div>
        <Link href="/upload-dokumen" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Pengajuan Baru
          </Button>
        </Link>
      </div>
      
      <div>
        {loading ? <p>Memuat pengajuan...</p> : <MySubmissionsTable data={myData} />}
      </div>
    </div>
  );
}