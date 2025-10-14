// src/components/DinasLuarTable.tsx
"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditDinasLuar } from "./EditDinasLuar";
import { DeleteDinasLuar } from "./DeleteDinasLuar";

export interface DinasLuar {
  id: number;
  created_at: string;
  NIP: string;
  Nama: string;
  Jabatan: string;
  UnitKerja: string;
  DeskripsiKegiatan: string;
  TanggalMulai: string;
  TanggalSelesai: string;
  DokumenURL: string;
}

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

export function DinasLuarTable({ data, refreshData }: { data: DinasLuar[], refreshData: () => void }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Daftar Perjalanan Dinas Luar Terbaru</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>NIP</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Unit Kerja</TableHead>
            <TableHead>Deskripsi Kegiatan</TableHead>
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
                <TableCell>{item.UnitKerja}</TableCell>
                <TableCell>{item.DeskripsiKegiatan}</TableCell>
                <TableCell>{formatDate(item.TanggalMulai)}</TableCell>
                <TableCell>{formatDate(item.TanggalSelesai)}</TableCell>
                <TableCell>
                  <a href={item.DokumenURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Lihat Dokumen
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <EditDinasLuar data={item} refreshData={refreshData} />
                    <DeleteDinasLuar dataId={item.id} refreshData={refreshData} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
             <TableRow>
              <TableCell colSpan={9} className="text-center">
                Tidak ada data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}