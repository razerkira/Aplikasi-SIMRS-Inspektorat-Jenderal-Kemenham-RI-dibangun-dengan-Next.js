// src/components/EmployeeTable.tsx
"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EditEmployee } from "./EditEmployee";
import { DeleteEmployee } from "./DeleteEmployee";
import CreateUserAccountButton from "./CreateUserAccountButton";

export interface Employee {
  id: string;
  NIP: string;
  Nama: string;
  email: string;
  Jabatan: string;
  Pangkat: string; // Tambahkan Pangkat di sini
  UnitKerja: string;
  JenisKelamin: string;
}

export function EmployeeTable({ employees, refreshData }: { employees: Employee[], refreshData: () => void }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Daftar Pegawai Terbaru</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>NIP</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Jabatan</TableHead>
            <TableHead>Pangkat (Gol/Ruang)</TableHead> {/* Kolom baru */}
            <TableHead>Unit Kerja</TableHead>
            <TableHead>Jenis Kelamin</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.NIP}</TableCell>
                <TableCell>{employee.Nama}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.Jabatan}</TableCell>
                <TableCell>{employee.Pangkat}</TableCell> {/* Data baru */}
                <TableCell>{employee.UnitKerja}</TableCell>
                <TableCell>{employee.JenisKelamin}</TableCell>
                <TableCell>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <EditEmployee employee={employee} refreshData={refreshData} />
                    <DeleteEmployee employeeId={employee.id} refreshData={refreshData} />
                    <CreateUserAccountButton employee={employee} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              {/* Ubah colSpan menjadi 8 */}
              <TableCell colSpan={8} className="text-center">
                Tidak ada data.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}