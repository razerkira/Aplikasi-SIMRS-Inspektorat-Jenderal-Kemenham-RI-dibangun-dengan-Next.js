// src/app/(dashboard)/manajemen-pegawai/layout.tsx
import React from 'react';
import RoleBasedGuard from '@/components/RoleBasedGuard';

export default function ManajemenPegawaiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleBasedGuard accessibleRoles={['admin']}>{children}</RoleBasedGuard>;
}
