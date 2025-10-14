"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { AddEmployee } from "@/components/AddEmployee";
import { EmployeeTable, Employee } from "@/components/EmployeeTable";
import ExportButton from "@/components/ExportButton";
import AdminRouteGuard from "@/components/AdminRouteGuard";

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const employeeCollection = collection(db, "pegawai");
      const employeeSnapshot = await getDocs(employeeCollection);
      const employeeList = employeeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Employee[];
      setEmployees(employeeList);
    } catch (error) {
      console.error("Gagal mengambil data pegawai:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const headers = [
    { label: "NIP", key: "NIP" },
    { label: "Nama", key: "Nama" },
    { label: "Email", key: "email" },
    { label: "Jabatan", key: "Jabatan" },
    { label: "Unit Kerja", key: "UnitKerja" },
    { label: "Jenis Kelamin", key: "JenisKelamin" },
  ];

  // 1. Siapkan data khusus untuk ekspor
  const dataForExport = employees.map(emp => ({
    ...emp,
    // 2. "Tipu" Excel dengan menambahkan karakter Tab (\t) di depan NIP
    // Ini akan memaksa Excel untuk memperlakukannya sebagai teks
    NIP: `\t${emp.NIP}`
  }));

  return (
    <AdminRouteGuard>
      <>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Manajemen Pegawai Inspektorat Jenderal</h1>
            <p className="text-gray-500 mt-2">
              Berikut adalah daftar pegawai yang terdaftar di dalam sistem.
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton
              // 3. Gunakan data yang sudah diformat untuk tombol ekspor
              data={dataForExport}
              headers={headers}
              filename="daftar_pegawai.csv"
            />
            <AddEmployee refreshData={fetchData} />
          </div>
        </div>

        <div className="mt-8">
          {loading ? <p>Memuat data...</p> : <EmployeeTable employees={employees} refreshData={fetchData} />}
        </div>
      </>
    </AdminRouteGuard>
  );
}