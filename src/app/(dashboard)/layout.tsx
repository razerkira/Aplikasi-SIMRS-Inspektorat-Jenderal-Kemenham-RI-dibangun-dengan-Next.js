// src/app/(dashboard)/layout.tsx
"use client";

import { useState } from "react";
import Header from '@/components/MobileHeader';
import Sidebar from '@/components/Sidebar';
import RoleBasedGuard from '@/components/RoleBasedGuard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    // Melindungi semua halaman dashboard, hanya untuk pengguna yang sudah login
    <RoleBasedGuard accessibleRoles={['admin', 'supervisor', 'verificator', 'user']}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">{children}</main>
        </div>
      </div>
    </RoleBasedGuard>
  );
}
