// src/components/EditDinasLuar.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { DinasLuar } from "./DinasLuarTable";

export function EditDinasLuar({ data, refreshData }: { data: DinasLuar, refreshData: () => void }) {
  const { toast } = useToast();
  const [nip, setNip] = useState(data.NIP);
  const [nama, setNama] = useState(data.Nama);
  const [jabatan, setJabatan] = useState(data.Jabatan);
  const [unitKerja, setUnitKerja] = useState(data.UnitKerja);
  const [deskripsi, setDeskripsi] = useState(data.DeskripsiKegiatan);
  const [tanggalMulai, setTanggalMulai] = useState(data.TanggalMulai);
  const [tanggalSelesai, setTanggalSelesai] = useState(data.TanggalSelesai);
  const [open, setOpen] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('dokumen_dinas_luar')
        .update({
          NIP: nip, Nama: nama, Jabatan: jabatan, UnitKerja: unitKerja,
          DeskripsiKegiatan: deskripsi, TanggalMulai: tanggalMulai, TanggalSelesai: tanggalSelesai,
        })
        .eq('id', data.id);
      
      if (error) throw error;
      
      setOpen(false);
      refreshData();
      toast({
        title: "Sukses!",
        description: "Data dinas luar telah berhasil diperbarui.",
      });
    } catch (error: any) {
      console.error("Error updating document: ", error.message);
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
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleUpdate}>
          <DialogHeader>
            <DialogTitle>Edit Data Dinas Luar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input placeholder="NIP" value={nip} onChange={(e) => setNip(e.target.value)} required />
            <Input placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
            <Input placeholder="Jabatan" value={jabatan} onChange={(e) => setJabatan(e.target.value)} required />
            <Input placeholder="Unit Kerja" value={unitKerja} onChange={(e) => setUnitKerja(e.target.value)} required />
            <Textarea placeholder="Deskripsi Kegiatan..." value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required />
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label htmlFor="tanggal-mulai" className="text-sm font-medium">Tanggal Mulai</label>
                  <Input id="tanggal-mulai" type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} required />
               </div>
               <div>
                  <label htmlFor="tanggal-selesai" className="text-sm font-medium">Tanggal Selesai</label>
                  <Input id="tanggal-selesai" type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} required />
               </div>
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