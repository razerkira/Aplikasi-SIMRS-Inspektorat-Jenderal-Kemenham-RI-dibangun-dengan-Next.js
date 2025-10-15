// src/components/AddEmployee.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export function AddEmployee({ refreshData }: { refreshData: () => void }) {
  const { toast } = useToast();
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [pangkat, setPangkat] = useState(""); // State baru
  const [unitKerja, setUnitKerja] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [open, setOpen] = useState(false);

  const resetForm = () => {
    setNip("");
    setNama("");
    setEmail("");
    setJabatan("");
    setPangkat(""); // Reset state baru
    setUnitKerja("");
    setJenisKelamin("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "pegawai"), {
        NIP: nip,
        Nama: nama,
        email: email,
        Jabatan: jabatan,
        Pangkat: pangkat, // Kirim state baru
        UnitKerja: unitKerja,
        JenisKelamin: jenisKelamin,
      });

      setOpen(false);
      refreshData();
      resetForm();
      
      toast({
        title: "Sukses!",
        description: "Data pegawai baru telah berhasil ditambahkan.",
      });

    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah Pegawai</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Pegawai Baru</DialogTitle>
            <DialogDescription>
              Isi detail pegawai di bawah ini. Klik simpan jika sudah selesai.
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
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">Email</label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="jabatan" className="text-right">Jabatan</label>
              <Input id="jabatan" value={jabatan} onChange={(e) => setJabatan(e.target.value)} className="col-span-3" required />
            </div>
            {/* Input baru untuk Pangkat */}
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="pangkat" className="text-right">Pangkat</label>
              <Input id="pangkat" value={pangkat} onChange={(e) => setPangkat(e.target.value)} className="col-span-3" placeholder="Contoh: Penata Muda (III/a)" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="unitkerja" className="text-right">Unit Kerja</label>
              <Input id="unitkerja" value={unitKerja} onChange={(e) => setUnitKerja(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="jeniskelamin" className="text-right">Jenis Kelamin</label>
              <Select onValueChange={setJenisKelamin} value={jenisKelamin}>
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
            <Button type="submit">Simpan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}