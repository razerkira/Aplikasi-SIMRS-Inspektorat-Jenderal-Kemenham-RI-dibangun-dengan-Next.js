// src/components/EditEmployee.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Employee } from "./EmployeeTable";

export function EditEmployee({ employee, refreshData }: { employee: Employee, refreshData: () => void }) {
  const { toast } = useToast();
  const [nip, setNip] = useState(employee.NIP);
  const [nama, setNama] = useState(employee.Nama);
  const [email, setEmail] = useState(employee.email); // State baru
  const [jabatan, setJabatan] = useState(employee.Jabatan);
  const [unitKerja, setUnitKerja] = useState(employee.UnitKerja);
  const [jenisKelamin, setJenisKelamin] = useState(employee.JenisKelamin);
  const [open, setOpen] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const employeeRef = doc(db, "pegawai", employee.id);
    try {
      await updateDoc(employeeRef, {
        NIP: nip,
        Nama: nama,
        email: email, // Kirim state baru
        Jabatan: jabatan,
        UnitKerja: unitKerja,
        JenisKelamin: jenisKelamin,
      });
      setOpen(false);
      refreshData();
      toast({
        title: "Sukses!",
        description: "Data pegawai telah berhasil diperbarui.",
      });
    } catch (error) {
      console.error("Error updating document: ", error);
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Terjadi kesalahan saat memperbarui data.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle>Edit Data Pegawai</DialogTitle>
            <DialogDescription>
              Ubah data di bawah ini. Klik simpan jika sudah selesai.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nip" className="text-right">NIP</label>
              <Input id="nip" value={nip} onChange={(e) => setNip(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nama" className="text-right">Nama</label>
              <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} className="col-span-3" required />
            </div>
            {/* Input baru untuk email */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">Email</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="jabatan" className="text-right">Jabatan</label>
              <Input id="jabatan" value={jabatan} onChange={(e) => setJabatan(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="unitkerja" className="text-right">Unit Kerja</label>
              <Input id="unitkerja" value={unitKerja} onChange={(e) => setUnitKerja(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="jeniskelamin" className="text-right">Jenis Kelamin</label>
              <Select value={jenisKelamin} onValueChange={setJenisKelamin}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pria">Pria</SelectItem>
                  <SelectItem value="Wanita">Wanita</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}