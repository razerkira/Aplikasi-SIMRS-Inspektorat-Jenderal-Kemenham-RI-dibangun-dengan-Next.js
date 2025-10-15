// src/components/DeleteIzinCuti.tsx
"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export function DeleteIzinCuti({ dataId, refreshData }: { dataId: number, refreshData: () => void }) {
  const { toast } = useToast();
  const handleDelete = async () => {
    try {
      // PERBAIKAN: Pastikan menghapus dari tabel 'dokumen_izin_cuti'
      const { error } = await supabase.from('dokumen_izin_cuti').delete().eq('id', dataId);
      if (error) throw error;
      refreshData();
      toast({ title: "Sukses!", description: "Data izin cuti telah berhasil dihapus." });
    } catch (error: any) {
      console.error("Error removing document: ", error.message);
      toast({ variant: "destructive", title: "Gagal!", description: "Terjadi kesalahan saat menghapus data." });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild><Button variant="destructive">Hapus</Button></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin ingin menghapus data ini?</AlertDialogTitle>
          <AlertDialogDescription>Tindakan ini tidak bisa dibatalkan.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Lanjutkan</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}