"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

interface RejectDialogProps {
  submissionId: number;
  tableName: "dokumen_dinas_luar" | "dokumen_izin_cuti";
  refreshData: () => void;
}

export default function RejectDialogSupervisor({
  submissionId,
  tableName,
  refreshData,
}: RejectDialogProps) {
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const handleReject = async () => {
    if (!reason.trim()) {
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Alasan penolakan tidak boleh kosong.",
      });
      return;
    }

    try {
      // Bagian ini diperbarui untuk mengubah kolom status supervisor
      const { error } = await supabase
        .from(tableName)
        .update({
          status_supervisor: "Ditolak",
          alasan_penolakan_supervisor: reason,
        })
        .eq("id", submissionId);

      if (error) throw error;

      toast({ title: "Sukses", description: "Pengajuan telah ditolak." });
      setOpen(false);
      refreshData();
    } catch (error: any) {
      console.error("Gagal menolak pengajuan:", error);
      toast({
        variant: "destructive",
        title: "Gagal",
        description: "Terjadi kesalahan.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Tolak
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tolak Pengajuan</DialogTitle>
          <DialogDescription>
            Harap berikan alasan yang jelas mengapa pengajuan ini ditolak.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Ketik alasan penolakan di sini..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleReject}>Kirim Penolakan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

