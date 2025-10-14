// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase"; // Impor 'db' juga
import { collection, query, where, getDocs } from "firebase/firestore"; // Impor fungsi Firestore
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  // 1. Ganti nama state agar lebih generik
  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Tambahkan state loading
  const router = useRouter();

  // 2. Tulis ulang fungsi handleLogin
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let userEmail = identifier;

      // Cek apakah identifier adalah NIP atau email
      if (!identifier.includes('@')) {
        // Jika bukan email, anggap sebagai NIP dan cari emailnya di Firestore
        const pegawaiRef = collection(db, "pegawai");
        const q = query(pegawaiRef, where("NIP", "==", identifier));
        
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("NIP tidak ditemukan.");
        }
        
        // Ambil email dari dokumen yang ditemukan
        userEmail = querySnapshot.docs[0].data().email;
      }
      
      // Lanjutkan login dengan email (baik yang diinput langsung atau yang ditemukan)
      await signInWithEmailAndPassword(auth, userEmail, password);
      router.push("/");

    } catch (err: any) {
      // Tangani semua jenis error (NIP tidak ditemukan, password salah, dll)
      if (err.message === "NIP tidak ditemukan.") {
        setError(err.message);
      } else {
        setError("Email/NIP atau password salah. Silakan coba lagi.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[450px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">SIMRS</CardTitle>
          <CardDescription>
            Smart Integrated Management Reporting System
            <br />
            Inspektorat Jenderal Kemenham RI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              {/* 3. Perbarui input field */}
              <Input
                type="text" // Ganti type menjadi 'text'
                placeholder="Email atau NIP"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Memproses...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}