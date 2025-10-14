// src/components/CreateUserAccountButton.tsx
"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus } from "lucide-react";
import { Employee } from "./EmployeeTable";

// Komponen ini menerima data pegawai sebagai prop
export default function CreateUserAccountButton({ employee }: { employee: Employee }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    setLoading(true);

    try {
      // Kirim permintaan ke API route kita
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: employee.email,
          nip: employee.NIP,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Jika response tidak OK, lempar error dengan pesan dari server
        throw new Error(result.error || 'Terjadi kesalahan.');
      }

      // Tampilkan notifikasi sukses
      toast({
        title: "Sukses!",
        description: `Akun untuk ${employee.email} berhasil dibuat dengan NIP sebagai password default.`,
      });

    } catch (error: any) {
      // Tampilkan notifikasi gagal
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: error.message || "Tidak dapat membuat akun.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCreateAccount}
      disabled={loading}
    >
      <UserPlus className="h-4 w-4 mr-2" />
      {loading ? 'Memproses...' : 'Buat Akun'}
    </Button>
  );
}