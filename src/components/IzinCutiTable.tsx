// src/components/IzinCutiTable.tsx
"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditIzinCuti } from "./EditIzinCuti";
import { DeleteIzinCuti } from "./DeleteIzinCuti";

// PERBAIKI: Tambahkan semua kolom status baru ke interface
export interface IzinCuti {
  id: number;
  created_at: string;
  NIP: string;
  Nama: string;
  Jabatan: string;
  Pangkat: string;
  UnitKerja: string;
  JenisCuti: string;
  TanggalMulai: string;
  TanggalSelesai: string;
  DokumenURL: string;
  user_id: string;
  status_verifikator: string | null;
  alasan_penolakan_verifikator: string | null;
  status_supervisor: string | null;
  alasan_penolakan_supervisor: string | null;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

export function IzinCutiTable({ data, refreshData }: { data: IzinCuti[], refreshData: () => void }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Daftar Pengajuan Izin Cuti Terbaru</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>NIP</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Pangkat (Gol/Ruang)</TableHead>
            <TableHead>Unit Kerja</TableHead>
            <TableHead>Jenis Cuti</TableHead>
            <TableHead>Tanggal Mulai</TableHead>
            <TableHead>Tanggal Selesai</TableHead>
            <TableHead>Dokumen</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.NIP}</TableCell>
                <TableCell>{item.Nama}</TableCell>
                <TableCell>{item.Jabatan}</TableCell>
                <TableCell>{item.Pangkat}</TableCell>
                <TableCell>{item.UnitKerja}</TableCell>
                <TableCell>{item.JenisCuti}</TableCell>
                <TableCell>{formatDate(item.TanggalMulai)}</TableCell>
                <TableCell>{formatDate(item.TanggalSelesai)}</TableCell>
                <TableCell>
                  <a href={item.DokumenURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Lihat Dokumen
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <EditIzinCuti data={item} refreshData={refreshData} />
                    <DeleteIzinCuti dataId={item.id} refreshData={refreshData} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                Tidak ada data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}