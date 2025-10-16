"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Users, 
  Plane, 
  UploadCloud, 
  LayoutDashboard, 
  CalendarOff, 
  CalendarCheck, 
  ShieldCheck,
  UserCheck, // Ikon baru untuk persetujuan
  X, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from '@/context/AuthContext';
import ChangePasswordDialog from './ChangePasswordDialog';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile } = useAuth();

  const navItems = [
    // --- Menu Admin ---
    { href: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin'] }, 
    { href: '/manajemen-pegawai', label: 'Manajemen Pegawai', icon: Users, roles: ['admin'] }, 
    { href: '/dinas-luar', label: 'Dinas Luar', icon: Plane, roles: ['admin'] },
    { href: '/izin-cuti', label: 'Izin Cuti', icon: CalendarOff, roles: ['admin'] },

    // --- Menu Verifikasi ---
    { href: '/verifikasi-dinas-luar', label: 'Verifikasi Dinas Luar', icon: ShieldCheck, roles: ['verificator', 'admin'] },
    { href: '/verifikasi-izin-cuti', label: 'Verifikasi Izin Cuti', icon: ShieldCheck, roles: ['verificator', 'admin'] },

    // --- Menu Persetujuan ---
    { href: '/persetujuan-dinas-luar', label: 'Persetujuan Dinas Luar', icon: UserCheck, roles: ['supervisor', 'admin'] },
    { href: '/persetujuan-izin-cuti', label: 'Persetujuan Izin Cuti', icon: UserCheck, roles: ['supervisor', 'admin'] },

    // --- Menu User ---
    { href: '/pengajuan-dinas-luar', label: 'Pengajuan Dinas Luar', icon: UploadCloud, roles: ['user', 'admin'] },
    { href: '/pengajuan-izin-cuti', label: 'Pengajuan Izin Cuti', icon: CalendarCheck, roles: ['user', 'admin'] },
  ];

  const visibleNavItems = navItems.filter(item =>
    userProfile && item.roles.includes(userProfile.role)
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden ${
          isOpen ? 'block' : 'hidden'
        }`}
        onClick={onClose}
      ></div>
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-gray-100 p-4 border-r z-20 
                   flex flex-col justify-between
                   transform transition-transform md:relative md:translate-x-0
                   ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800">My Dashboard</h2>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
              <X />
            </Button>
          </div>
          <nav>
            <ul>
              {visibleNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label} className="mb-2">
                    <Link
                      href={item.href}
                      className={`flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-200 ${
                        isActive ? 'bg-gray-300' : ''
                      }`}
                      onClick={onClose}
                    >
                      <item.icon className="w-6 h-6 text-gray-500" />
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div>
          <div className="mb-2">
            <ChangePasswordDialog />
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <LogOut className="w-6 h-6 text-gray-500 mr-3" />
                <span>Logout</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin ingin logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda akan dikembalikan ke halaman login dan sesi Anda akan berakhir.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>
    </>
  );
}