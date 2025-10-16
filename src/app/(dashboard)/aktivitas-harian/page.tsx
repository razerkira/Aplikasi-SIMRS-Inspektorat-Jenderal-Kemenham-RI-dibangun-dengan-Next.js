"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DinasLuar } from "@/components/DinasLuarTable";
import { IzinCuti } from "@/components/IzinCutiTable";
import Spinner from "@/components/Spinner";

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

export default function AktivitasHarianPage() {
  const [dinasLuar, setDinasLuar] = useState<DinasLuar[]>([]);
  const [cuti, setCuti] = useState<IzinCuti[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      // Ambil data dinas luar yang aktif hari ini
      const { data: dinasLuarData, error: dinasLuarError } = await supabase
        .from('dokumen_dinas_luar')
        .select('*')
        .eq('status_supervisor', 'Disetujui')
        .lte('TanggalMulai', today)
        .gte('TanggalSelesai', today);

      if (dinasLuarError) throw dinasLuarError;
      setDinasLuar(dinasLuarData || []);

      // Ambil data izin cuti yang aktif hari ini
      const { data: cutiData, error: cutiError } = await supabase
        .from('dokumen_izin_cuti')
        .select('*')
        .eq('status_supervisor', 'Disetujui')
        .lte('TanggalMulai', today)
        .gte('TanggalSelesai', today);

      if (cutiError) throw cutiError;
      setCuti(cutiData || []);

    } catch (error) {
      console.error("Gagal mengambil data aktivitas harian:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Aktivitas Pegawai Hari Ini</h1>
        <p className="text-gray-500 mt-2">
          Daftar pegawai yang sedang tidak berada di kantor pada hari ini ({formatDate(new Date().toISOString())}).
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Tabel Dinas Luar */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sedang Dinas Luar</h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nama Pegawai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Deskripsi Kegiatan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Berlaku Hingga</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dinasLuar.length > 0 ? (
                    dinasLuar.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.Nama}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{item.DeskripsiKegiatan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.TanggalSelesai)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada pegawai yang dinas luar hari ini.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tabel Izin Cuti */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sedang Cuti</h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Nama Pegawai</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Jenis Cuti</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Berlaku Hingga</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cuti.length > 0 ? (
                    cuti.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.Nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.JenisCuti}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(item.TanggalSelesai)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">Tidak ada pegawai yang cuti hari ini.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
