"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Spinner from "./Spinner";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika proses loading selesai dan profil pengguna ada, periksa perannya
    if (!loading && userProfile && userProfile.role !== 'admin') {
      // Arahkan ke halaman utama (Dashboard) jika bukan admin
      router.push('/');
    }
  }, [userProfile, loading, router]);

  // Jika pengguna adalah admin yang sudah terverifikasi, tampilkan konten halaman
  if (userProfile?.role === 'admin') {
    return <>{children}</>;
  }

  // Selama loading atau saat proses redirect, tampilkan spinner
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
}