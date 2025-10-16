"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Spinner from "./Spinner";

interface RoleBasedGuardProps {
  accessibleRoles: string[];
  children: React.ReactNode;
}

export default function RoleBasedGuard({ accessibleRoles, children }: RoleBasedGuardProps) {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && userProfile && !accessibleRoles.includes(userProfile.role)) {
      // Jika peran pengguna tidak diizinkan, arahkan ke halaman utama (Dashboard)
      router.push('/');
    }
  }, [userProfile, loading, router, accessibleRoles]);

  // Jika peran pengguna diizinkan, tampilkan konten halaman
  if (!loading && userProfile && accessibleRoles.includes(userProfile.role)) {
    return <>{children}</>;
  }

  // Selama loading atau saat proses redirect, tampilkan spinner
  return (
    <div className="flex items-center justify-center min-h-screen"><Spinner /></div>
  );
}
