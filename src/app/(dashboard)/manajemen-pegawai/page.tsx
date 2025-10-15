// src/app/(dashboard)/manajemen-pegawai/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { AddEmployee } from "@/components/AddEmployee";
import { EmployeeTable, Employee } from "@/components/EmployeeTable";
import ExportButton from "@/components/ExportButton";
import AdminRouteGuard from "@/components/AdminRouteGuard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredEmployees = employees.filter(employee =>
    employee.Nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.NIP.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headers = [
    { label: "NIP", key: "NIP" },
    { label: "Nama", key: "Nama" },
    { label: "Email", key: "email" },
    { label: "Jabatan", key: "Jabatan" },
    { label: "Pangkat (Gol/Ruang)", key: "Pangkat" }, // Tambahkan header Pangkat
    { label: "Unit Kerja", key: "UnitKerja" },
    { label: "Jenis Kelamin", key: "JenisKelamin" },
  ];

  const dataForExport = filteredEmployees.map(emp => ({
    ...emp,
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
              data={dataForExport}
              headers={headers}
              filename="daftar_pegawai.csv"
            />
            <AddEmployee refreshData={fetchData} />
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan Nama atau NIP..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mt-8">
          {loading ? (
            <p>Memuat data...</p>
          ) : (
            <EmployeeTable employees={filteredEmployees} refreshData={fetchData} />
          )}
        </div>
      </>
    </AdminRouteGuard>
  );
}