// c:/Users/User58/Documents/dashboard-pegawai/Aplikasi-SIMRS-Inspektorat-Jenderal-Kemenham-RI-dibangun-dengan-Next.js/src/app/(dashboard)/pengajuan-dinas-luar/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth, UserProfile } from "@/context/AuthContext";
import Link from "next/link";
import { PlusCircle, FileText, AlertCircle } from "lucide-react";
import { DinasLuar } from "@/components/DinasLuarTable";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Skeleton from "@/components/Skeleton";
import StatusBadge from "@/components/StatusBadge";
import { supabase } from "@/lib/supabaseClient";

function MyDinasLuarSubmissionsTable({ data }: { data: DinasLuar[] }) {
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start).toLocaleDateString("id-ID");
    const endDate = new Date(end).toLocaleDateString("id-ID");
    return `${startDate} - ${endDate}`;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Deskripsi Kegiatan</TableHead>
              <TableHead>Tanggal Pengajuan</TableHead>
              <TableHead>Status Verifikator</TableHead>
              <TableHead>Status Supervisor</TableHead>
              <TableHead className="text-right">Dokumen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{item.DeskripsiKegiatan}</TableCell>
                <TableCell>{formatDateRange(item.TanggalMulai, item.TanggalSelesai)}</TableCell>
                <TableCell><StatusBadge status={item.status_verifikator} /></TableCell>
                <TableCell><StatusBadge status={item.status_supervisor} /></TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <a href={item.DokumenURL} target="_blank" rel="noopener noreferrer">
                      <FileText className="mr-2 h-4 w-4" /> Lihat
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                  <AlertCircle className="h-8 w-8" />
                  <p>Anda belum memiliki pengajuan dinas luar.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function PengajuanDinasLuarPage() {
  const { user } = useAuth();
  const [myData, setMyData] = useState<DinasLuar[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const fetchData = useCallback(async (page = 1) => {
    if (!user) return;
    setLoading(true);
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    
    const { data, error, count } = await supabase
      .from('dokumen_dinas_luar')
      .select('*', { count: 'exact' })
      .eq('user_id', user.uid)
      .order('id', { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Gagal mengambil data pengajuan dinas luar:", error);
      setMyData([]);
    } else if (data) {
      setMyData(data as DinasLuar[]);
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

  const renderSkeletons = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );

  return (
    <main className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
            Pengajuan Dinas Luar Saya
          </h1>
          <p className="text-muted-foreground">
            Lihat status semua pengajuan dinas luar yang telah Anda buat.
          </p>
        </div>
        <Link href="/upload-dinas-luar" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Pengajuan Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? renderSkeletons() : <MyDinasLuarSubmissionsTable data={myData} />}
        </CardContent>
      </Card>
      {!loading && totalPages > 1 && <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} totalItems={totalItems} itemsPerPage={itemsPerPage} />}
    </main>
  );
}
