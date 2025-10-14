"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DinasLuarTable, DinasLuar } from "@/components/DinasLuarTable";
import ExportButton from "@/components/ExportButton";
import AdminRouteGuard from "@/components/AdminRouteGuard";

export default function DinasLuarPage() {
  const [dinasLuarData, setDinasLuarData] = useState<DinasLuar[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dokumen_dinas_luar')
      .select('*');

    if (error) {
      console.error("Error fetching data from Supabase:", error);
    } else if (data) {
      const sortedData = data.sort((a, b) => b.id - a.id);
      setDinasLuarData(sortedData as DinasLuar[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const headers = [
    { label: "NIP", key: "NIP" },
    { label: "Nama", key: "Nama" },
    { label: "Jabatan", key: "Jabatan" },
    { label: "Unit Kerja", key: "UnitKerja" },
    { label: "Deskripsi Kegiatan", key: "DeskripsiKegiatan" },
    { label: "Tanggal Mulai", key: "TanggalMulai" },
    { label: "Tanggal Selesai", key: "TanggalSelesai" },
    { label: "Dokumen URL", key: "DokumenURL" },
  ];

  // Siapkan data khusus untuk ekspor
  const dataForExport = dinasLuarData.map(item => ({
    ...item,
    // Tambahkan karakter Tab (\t) di depan NIP
    NIP: `\t${item.NIP}`
  }));

  return (
    <AdminRouteGuard>
      <>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Data Dinas Luar Inspektorat Jenderal</h1>
            <p className="text-gray-500 mt-2">
              Kelola data perjalanan dinas luar yang telah di-upload.
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton
              data={dataForExport}
              headers={headers}
              filename="data_dinas_luar.csv"
            />
          </div>
        </div>
        <div className="mt-8">
          {loading ? <p>Memuat data...</p> : <DinasLuarTable data={dinasLuarData} refreshData={fetchData} />}
        </div>
      </>
    </AdminRouteGuard>
  );
}