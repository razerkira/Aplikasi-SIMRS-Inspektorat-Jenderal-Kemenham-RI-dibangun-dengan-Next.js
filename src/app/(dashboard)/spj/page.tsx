"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { SPJTable, SPJ } from "@/components/SPJTable";
import ExportButton from "@/components/ExportButton";
import AdminRouteGuard from "@/components/AdminRouteGuard";

export default function SPJPage() {
  const [spjData, setSpjData] = useState<SPJ[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('dokumen_spj')
      .select('*');

    if (error) {
      console.error("Error fetching SPJ data from Supabase:", error);
    } else if (data) {
      const sortedData = data.sort((a, b) => b.id - a.id);
      setSpjData(sortedData as SPJ[]);
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
  const dataForExport = spjData.map(item => ({
    ...item,
    // Tambahkan karakter Tab (\t) di depan NIP
    NIP: `\t${item.NIP}`
  }));

  return (
    <AdminRouteGuard>
      <>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Data SPJ Inspektorat Jenderal</h1>
            <p className="text-gray-500 mt-2">
              Kelola data Surat Pertanggung Jawaban (SPJ) yang telah di-upload.
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton
              data={dataForExport}
              headers={headers}
              filename="data_spj.csv"
            />
          </div>
        </div>
        <div className="mt-8">
          {loading ? <p>Memuat data...</p> : <SPJTable data={spjData} refreshData={fetchData} />}
        </div>
      </>
    </AdminRouteGuard>
  );
}