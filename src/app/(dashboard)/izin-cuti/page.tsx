// src/app/(dashboard)/izin-cuti/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { IzinCutiTable, IzinCuti } from "@/components/IzinCutiTable";
import ExportButton from "@/components/ExportButton";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function IzinCutiPage() {
  const [izinCutiData, setIzinCutiData] = useState<IzinCuti[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    // PERBAIKAN: Pastikan kita mengambil data dari tabel 'dokumen_izin_cuti'
    const { data, error } = await supabase.from('dokumen_izin_cuti').select('*');
    if (error) {
      console.error("Error fetching Izin Cuti data from Supabase:", error);
    } else if (data) {
      const sortedData = data.sort((a, b) => b.id - a.id);
      setIzinCutiData(sortedData as IzinCuti[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredData = izinCutiData.filter(item =>
    item.Nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.NIP.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headers = [
    { label: "NIP", key: "NIP" }, { label: "Nama", key: "Nama" },
    { label: "Jabatan", key: "Jabatan" }, { label: "Pangkat (Gol/Ruang)", key: "Pangkat" },
    { label: "Unit Kerja", key: "UnitKerja" }, { label: "Jenis Cuti", key: "JenisCuti" },
    { label: "Tanggal Mulai", key: "TanggalMulai" }, { label: "Tanggal Selesai", key: "TanggalSelesai" },
    { label: "Dokumen URL", key: "DokumenURL" },
  ];

  const dataForExport = filteredData.map(item => ({ ...item, NIP: `\t${item.NIP}` }));

  return (
    <AdminRouteGuard>
      <>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Data Izin Cuti Inspektorat Jenderal</h1>
            <p className="text-gray-500 mt-2">
              Kelola data pengajuan izin cuti yang telah di-upload.
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton data={dataForExport} headers={headers} filename="data_izin_cuti.csv" />
          </div>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari berdasarkan Nama atau NIP..." className="pl-8" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className="mt-8">
          {loading ? <p>Memuat data...</p> : <IzinCutiTable data={filteredData} refreshData={fetchData} />}
        </div>
      </>
    </AdminRouteGuard>
  );
}