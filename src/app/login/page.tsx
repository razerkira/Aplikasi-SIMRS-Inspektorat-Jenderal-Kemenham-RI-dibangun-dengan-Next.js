"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let userEmail = identifier;

      if (!identifier.includes('@')) {
        const pegawaiRef = collection(db, "pegawai");
        const q = query(pegawaiRef, where("NIP", "==", identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) throw new Error("NIP tidak ditemukan.");
        userEmail = querySnapshot.docs[0].data().email;
      }
      
      // Dapatkan kredensial pengguna setelah login
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      const user = userCredential.user;

      // Ambil profil pengguna dari Firestore untuk mendapatkan perannya
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userProfile = userDocSnap.data();
        // Lakukan redirect berdasarkan peran
        router.push("/"); // Arahkan semua role ke Dashboard utama
      } else {
        // Fallback jika profil tidak ditemukan
        throw new Error("Profil pengguna tidak ditemukan.");
      }

    } catch (err: any) {
      if (err.message.includes("NIP tidak ditemukan") || err.message.includes("Profil pengguna tidak ditemukan")) {
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
              <Input
                type="text"
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