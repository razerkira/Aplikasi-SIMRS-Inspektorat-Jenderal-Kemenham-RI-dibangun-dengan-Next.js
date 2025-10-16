"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Spinner from "./Spinner";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SupabaseUploadIzinCutiForm() {
  const { user } = useAuth();
  const router = useRouter(); // Pastikan router diinisialisasi
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [pangkat, setPangkat] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [jenisCuti, setJenisCuti] = useState("");
  const [customJenisCuti, setCustomJenisCuti] = useState("");
  const [openCombobox, setOpenCombobox] = useState(false);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const cutiOptions = ["Tahunan", "Sakit", "Alasan Penting", "Besar", "Diluar Tanggungan Negara", "Bersalin", "Lainnya..."];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalJenisCuti = jenisCuti === "Lainnya..." ? customJenisCuti : jenisCuti;
    if (!file || !finalJenisCuti) {
      setError("Silakan pilih/isi jenis cuti dan pilih file untuk di-upload.");
      return;
    }
    if (!user) {
      setError("Anda harus login untuk mengupload dokumen.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("Mengupload file izin cuti...");
    try {
      const fileName = `izin_cuti_${Date.now()}_${file.name}`;
      const { error: storageError } = await supabase.storage.from('dokumen-uploads').upload(fileName, file);

      if (storageError) throw new Error(`Gagal meng-upload file: ${storageError.message}`);
      setMessage("File berhasil diupload! Menyimpan data...");

      const { data: urlData } = supabase.storage.from('dokumen-uploads').getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      const { error: dbError } = await supabase.from('dokumen_izin_cuti').insert([{
          user_id: user.uid,
          NIP: nip, Nama: nama, Jabatan: jabatan, Pangkat: pangkat, UnitKerja: unitKerja,
          JenisCuti: finalJenisCuti,
          TanggalMulai: tanggalMulai, TanggalSelesai: tanggalSelesai, DokumenURL: publicUrl,
        }]);

      if (dbError) throw new Error(`Gagal menyimpan data izin cuti: ${dbError.message}`);
      setMessage("Data Izin Cuti berhasil disimpan! Anda akan diarahkan.");
      
      setTimeout(() => { router.push("/pengajuan-izin-cuti"); }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tanggal-mulai" className="text-sm font-medium">Tanggal Mulai Cuti</label>
                <Input id="tanggal-mulai" type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} required />
              </div>
              <div>
                <label htmlFor="tanggal-selesai" className="text-sm font-medium">Tanggal Selesai Cuti</label>
                <Input id="tanggal-selesai" type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} required />
              </div>
            </div>
            <div>
              <label htmlFor="file-upload" className="text-sm font-medium">Upload Dokumen Izin Cuti (Word/PDF)</label>
              <Input id="file-upload" type="file" onChange={handleFileChange} accept=".doc,.docx,.pdf" required />
              {file && <p className="text-sm text-gray-500 mt-1">File terpilih: {file.name}</p>}
            </div>
            
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
                Batal
              </Button>
              <Button type="submit" disabled={uploading} className="w-full">
                {uploading ? <Spinner /> : "Submit Dokumen Izin Cuti"}
              </Button>
            </div>

            {message && <p className="text-green-600 text-sm text-center mt-2">{message}</p>}
            {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}

import React from "react";
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
));
Card.displayName = "Card";
const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";