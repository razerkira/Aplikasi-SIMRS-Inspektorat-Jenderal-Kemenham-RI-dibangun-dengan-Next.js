// src/components/AddSPJ.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export function AddSPJ() {
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [dokumen, setDokumen] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState<Date>();
  const [tanggalSelesai, setTanggalSelesai] = useState<Date>();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tanggalMulai || !tanggalSelesai) {
      alert("Silakan pilih tanggal mulai dan selesai.");
      return;
    }
    try {
      await addDoc(collection(db, "spj"), {
        NIP: nip,
        Nama: nama,
        Jabatan: jabatan,
        UnitKerja: unitKerja,
        DeskripsiKegiatan: deskripsi,
        Dokumen: dokumen,
        TanggalMulai: Timestamp.fromDate(tanggalMulai),
        TanggalSelesai: Timestamp.fromDate(tanggalSelesai),
      });
      console.log("Data SPJ berhasil ditambahkan!");
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah Data SPJ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Data SPJ</DialogTitle>
            <DialogDescription>
              Isi semua detail SPJ yang diperlukan di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input placeholder="NIP" value={nip} onChange={(e) => setNip(e.target.value)} />
            <Input placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} />
            <Input placeholder="Jabatan" value={jabatan} onChange={(e) => setJabatan(e.target.value)} />
            <Input placeholder="Unit Kerja" value={unitKerja} onChange={(e) => setUnitKerja(e.target.value)} />
            <Textarea placeholder="Deskripsi Kegiatan..." value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
            <Input placeholder="Link Dokumen SPJ" value={dokumen} onChange={(e) => setDokumen(e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("justify-start text-left font-normal", !tanggalMulai && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tanggalMulai ? format(tanggalMulai, "PPP") : <span>Tanggal Mulai</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={tanggalMulai} onSelect={setTanggalMulai} initialFocus /></PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className={cn("justify-start text-left font-normal", !tanggalSelesai && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tanggalSelesai ? format(tanggalSelesai, "PPP") : <span>Tanggal Selesai</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={tanggalSelesai} onSelect={setTanggalSelesai} initialFocus /></PopoverContent>
              </Popover>
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