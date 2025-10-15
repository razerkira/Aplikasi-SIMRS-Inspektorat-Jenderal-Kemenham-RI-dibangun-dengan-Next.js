// src/components/EditIzinCuti.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { IzinCuti } from "./IzinCutiTable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function EditIzinCuti({ data, refreshData }: { data: IzinCuti, refreshData: () => void }) {
  const { toast } = useToast();
  const [nip, setNip] = useState(data.NIP);
  const [nama, setNama] = useState(data.Nama);
  const [jabatan, setJabatan] = useState(data.Jabatan);
  const [pangkat, setPangkat] = useState(data.Pangkat);
  const [unitKerja, setUnitKerja] = useState(data.UnitKerja);
  const [tanggalMulai, setTanggalMulai] = useState(data.TanggalMulai);
  const [tanggalSelesai, setTanggalSelesai] = useState(data.TanggalSelesai);
  const [open, setOpen] = useState(false);

  const cutiOptions = ["Tahunan", "Sakit", "Alasan Penting", "Besar", "Diluar Tanggungan Negara", "Bersalin", "Lainnya..."];
  const isCustomOption = !cutiOptions.includes(data.JenisCuti);
  
  const [jenisCuti, setJenisCuti] = useState(isCustomOption ? "Lainnya..." : data.JenisCuti);
  const [customJenisCuti, setCustomJenisCuti] = useState(isCustomOption ? data.JenisCuti : "");
  const [openCombobox, setOpenCombobox] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalJenisCuti = jenisCuti === "Lainnya..." ? customJenisCuti : jenisCuti;
    
    if (!finalJenisCuti) {
      toast({ variant: "destructive", title: "Gagal!", description: "Jenis Cuti tidak boleh kosong." });
      return;
    }

    try {
      const { error } = await supabase.from('dokumen_izin_cuti').update({
          NIP: nip, Nama: nama, Jabatan: jabatan, Pangkat: pangkat, UnitKerja: unitKerja,
          JenisCuti: finalJenisCuti, 
          TanggalMulai: tanggalMulai, TanggalSelesai: tanggalSelesai,
        }).eq('id', data.id);
      
      if (error) throw error;
      
      setOpen(false);
      refreshData();
      toast({ title: "Sukses!", description: "Data izin cuti telah berhasil diperbarui." });
    } catch (error: any) {
      console.error("Error updating document: ", error.message);
      toast({ variant: "destructive", title: "Gagal!", description: "Terjadi kesalahan saat memperbarui data." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleUpdate}>
          <DialogHeader><DialogTitle>Edit Data Izin Cuti</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <Input placeholder="NIP" value={nip} onChange={(e) => setNip(e.target.value)} required />
            <Input placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} required />
            <Input placeholder="Jabatan" value={jabatan} onChange={(e) => setJabatan(e.target.value)} required />
            <Input placeholder="Pangkat (Gol/Ruang)" value={pangkat} onChange={(e) => setPangkat(e.target.value)} required />
            <Input placeholder="Unit Kerja" value={unitKerja} onChange={(e) => setUnitKerja(e.target.value)} required />
            
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openCombobox} className="w-full justify-between">
                  {jenisCuti ? cutiOptions.find(opt => opt === jenisCuti) : "Pilih Jenis Cuti..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Cari jenis cuti..." />
                  <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {cutiOptions.map((option) => (
                        <CommandItem
                          key={option}
                          value={option}
                          onSelect={(currentValue: string) => {
                            const selectedOption = cutiOptions.find(opt => opt.toLowerCase() === currentValue.toLowerCase()) || "";
                            setJenisCuti(selectedOption === jenisCuti ? "" : selectedOption);
                            if (selectedOption !== "Lainnya...") setCustomJenisCuti("");
                            setOpenCombobox(false);
                          }}
                        >
                          <Check className={cn("mr-2 h-4 w-4", jenisCuti === option ? "opacity-100" : "opacity-0")} />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {jenisCuti === "Lainnya..." && (
              <Input
                placeholder="Masukkan jenis cuti manual..."
                value={customJenisCuti}
                onChange={(e) => setCustomJenisCuti(e.target.value)}
                required
              />
            )}

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label htmlFor="tanggal-mulai" className="text-sm font-medium">Tanggal Mulai Cuti</label>
                  <Input id="tanggal-mulai" type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} required />
               </div>
               <div>
                  <label htmlFor="tanggal-selesai" className="text-sm font-medium">Tanggal Selesai Cuti</label>
                  <Input id="tanggal-selesai" type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} required />
               </div>
            </div>
          </div>
          <DialogFooter><Button type="submit">Simpan Perubahan</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}