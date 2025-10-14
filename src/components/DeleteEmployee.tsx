// src/components/DeleteEmployee.tsx
"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export function DeleteEmployee({ employeeId, refreshData }: { employeeId: string, refreshData: () => void }) {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "pegawai", employeeId));
      refreshData();
      toast({
        title: "Sukses!",
        description: "Data pegawai telah berhasil dihapus.",
      });
    } catch (error) {
      console.error("Error removing document: ", error);
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: "Terjadi kesalahan saat menghapus data.",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Hapus</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak bisa dibatalkan. Ini akan menghapus data
            pegawai secara permanen dari server.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Lanjutkan</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}