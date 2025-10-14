"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "./Spinner";
import { supabase } from "@/lib/supabaseClient";

export default function SupabaseUploadForm() {
  const [nip, setNip] = useState("");
  const [nama, setNama] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Silakan pilih file untuk di-upload.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("Mengupload file...");

    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error: storageError } = await supabase.storage
        .from('dokumen-uploads')
        .upload(fileName, file);

      if (storageError) {
        throw new Error(`Gagal meng-upload file: ${storageError.message}`);
      }
      setMessage("File berhasil diupload! Mendapatkan URL...");

      const { data: urlData } = supabase.storage
        .from('dokumen-uploads')
        .getPublicUrl(fileName);
      const publicUrl = urlData.publicUrl;

      setMessage("Menyimpan data ke database...");

      const { error: dbError } = await supabase
        .from('dokumen_dinas_luar')
        .insert([{ 
          NIP: nip,
          Nama: nama,
          Jabatan: jabatan,
          UnitKerja: unitKerja,
          DeskripsiKegiatan: deskripsi,
          TanggalMulai: tanggalMulai,
          TanggalSelesai: tanggalSelesai,
          DokumenURL: publicUrl,
        }]);

      if (dbError) {
        throw new Error(`Gagal menyimpan data: ${dbError.message}`);
      }
      
      setMessage("Data berhasil disimpan! Anda akan diarahkan.");
      
      setTimeout(() => {
        router.push("/dinas-luar");
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat menyimpan data.");
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
          <Input placeholder="Unit Kerja" value={unitKerja} onChange={(e) => setUnitKerja(e.target.value)} required />
          {/* PERUBAHAN DI SINI: Ganti placeholder */}
          <Textarea placeholder="Deskripsi Kegiatan Dinas Luar..." value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tanggal-mulai" className="text-sm font-medium">Tanggal Mulai</label>
              <Input id="tanggal-mulai" type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="tanggal-selesai" className="text-sm font-medium">Tanggal Selesai</label>
              <Input id="tanggal-selesai" type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} required />
            </div>
          </div>
          
          <div>
            <label htmlFor="file-upload" className="text-sm font-medium">Upload Dokumen Dinas Luar (Word/PDF)</label>
            <Input id="file-upload" type="file" onChange={handleFileChange} accept=".doc,.docx,.pdf" required />
            {file && <p className="text-sm text-gray-500 mt-1">File terpilih: {file.name}</p>}
          </div>

          <div className="pt-2">
            {/* PERUBAHAN DI SINI: Ganti teks tombol */}
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? <Spinner /> : "Submit Dokumen Dinas Luar"}
            </Button>
            {message && <p className="text-green-600 text-sm text-center mt-2">{message}</p>}
            {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
          </div>
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
