// src/components/ChangePasswordDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, ShieldCheck } from "lucide-react";
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";

export default function ChangePasswordDialog() {
  const { toast } = useToast();
  const { user } = useAuth(); // Dapatkan pengguna saat ini dari context

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: "Gagal!", description: "Password baru tidak cocok." });
      setLoading(false);
      return;
    }
    
    if (!user || !user.email) {
      toast({ variant: "destructive", title: "Gagal!", description: "Pengguna tidak ditemukan." });
      setLoading(false);
      return;
    }
    
    const auth = getAuth();
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
      // Langkah 1: Re-autentikasi pengguna
      await reauthenticateWithCredential(user, credential);
      
      // Langkah 2: Jika berhasil, perbarui password
      await updatePassword(user, newPassword);
      
      toast({
        title: "Sukses!",
        description: "Password Anda telah berhasil diperbarui.",
      });
      
      setOpen(false);
      resetForm();

    } catch (error: any) {
      console.error("Error changing password:", error);
      if (error.code === 'auth/wrong-password') {
        toast({ variant: "destructive", title: "Gagal!", description: "Password saat ini salah." });
      } else {
        toast({ variant: "destructive", title: "Gagal!", description: "Terjadi kesalahan saat mengubah password." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <KeyRound className="w-6 h-6 text-gray-500 mr-3" />
          <span>Ganti Password</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleChangePassword}>
          <DialogHeader>
            <DialogTitle>Ubah Password Anda</DialogTitle>
            <DialogDescription>
              Untuk keamanan, masukkan password Anda saat ini terlebih dahulu.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              type="password"
              placeholder="Password Saat Ini"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password Baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Konfirmasi Password Baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Memproses...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}