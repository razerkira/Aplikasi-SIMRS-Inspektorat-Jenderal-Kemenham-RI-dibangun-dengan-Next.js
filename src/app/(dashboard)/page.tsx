"use client";

import { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import BarChartComponent from "@/components/BarChartComponent";
// 1. Impor ikon baru untuk statistik harian
import { Users, Plane, CalendarOff, CalendarClock, CalendarPlus } from "lucide-react"; 
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [totalPegawai, setTotalPegawai] = useState(0);
  const [totalDinasLuar, setTotalDinasLuar] = useState(0);
  const [totalIzinCuti, setTotalIzinCuti] = useState(0);
  // 2. State baru untuk statistik harian
  const [dinasLuarHariIni, setDinasLuarHariIni] = useState(0);
  const [izinCutiHariIni, setIzinCutiHariIni] = useState(0);
  const [chartData, setChartData] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllStats = async () => {
      try {
        // --- Ambil data total (tidak berubah) ---
        const pegawaiSnapshot = await getDocs(collection(db, "pegawai"));
        setTotalPegawai(pegawaiSnapshot.size);

        const { count: dinasLuarCount } = await supabase.from('dokumen_dinas_luar').select('*', { count: 'exact', head: true });
        setTotalDinasLuar(dinasLuarCount || 0);

        const { count: izinCutiCount } = await supabase.from('dokumen_izin_cuti').select('*', { count: 'exact', head: true });
        setTotalIzinCuti(izinCutiCount || 0);

        // --- 3. Ambil data untuk statistik harian ---
        const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Hitung Dinas Luar untuk hari ini
        const { count: dinasLuarTodayCount } = await supabase
          .from('dokumen_dinas_luar')
          .select('*', { count: 'exact', head: true })
          .eq('TanggalMulai', today);
        setDinasLuarHariIni(dinasLuarTodayCount || 0);

        // Hitung Izin Cuti untuk hari ini
        const { count: izinCutiTodayCount } = await supabase
          .from('dokumen_izin_cuti')
          .select('*', { count: 'exact', head: true })
          .eq('TanggalMulai', today);
        setIzinCutiHariIni(izinCutiTodayCount || 0);


        // --- Ambil data untuk grafik (tidak berubah) ---
        const { data: dinasLuarData, error: dinasLuarError } = await supabase.from('dokumen_dinas_luar').select('TanggalMulai');
        
        if (dinasLuarError) throw dinasLuarError;

        if (dinasLuarData) {
          const monthlyCounts = dinasLuarData.reduce((acc, item) => {
            const month = new Date(item.TanggalMulai).toLocaleString('id-ID', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const formattedChartData = Object.keys(monthlyCounts).map(month => ({
            month: month,
            total: monthlyCounts[month],
          }));
          setChartData(formattedChartData as any);
        }

      } catch (error) {
        console.error("Gagal mengambil data statistik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  return <div className="space-y-8">
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-500">
        Ringkasan analitik untuk seluruh sistem.
      </p>
    </div>
    
    {loading ? (
      <p>Memuat statistik...</p>
    ) : (
      <>
        {/* 4. Perbarui grid dan tambahkan kartu baru */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Total Pegawai" value={totalPegawai} icon={Users} />
          <StatCard title="Total Dinas Luar" value={totalDinasLuar} icon={Plane} />
          <StatCard title="Total Izin Cuti" value={totalIzinCuti} icon={CalendarOff} />
          <StatCard title="Dinas Luar Hari Ini" value={dinasLuarHariIni} icon={CalendarClock} />
          <StatCard title="Izin Cuti Hari Ini" value={izinCutiHariIni} icon={CalendarPlus} />
        </div>
        
        <div>
          <BarChartComponent data={chartData} />
        </div>
      </>
    )}
  </div>;
}
