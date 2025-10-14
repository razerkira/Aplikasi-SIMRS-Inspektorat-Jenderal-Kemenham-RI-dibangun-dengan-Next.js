// src/context/AuthContext.tsx
"use client";

import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase"; // Impor 'db' dari firebase
import { doc, getDoc } from "firebase/firestore"; // Impor fungsi Firestore

// Definisikan tipe untuk profil pengguna kita
interface UserProfile {
  email: string;
  role: 'admin' | 'user'; // Definisikan role yang mungkin ada
}

// Perbarui tipe context untuk menyertakan profil pengguna
interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null; // Tambahkan state untuk profil
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userProfile: null, loading: true });

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null); // State baru
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Jika pengguna login, ambil profilnya dari Firestore
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          // Jika profil ditemukan, simpan di state
          setUserProfile(userDocSnap.data() as UserProfile);
        } else {
          // Kasus jika pengguna ada di Auth tapi tidak punya profil di Firestore
          console.error("Profil pengguna tidak ditemukan di Firestore!");
          setUserProfile(null);
        }
      } else {
        // Jika pengguna logout, bersihkan semua state
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    // Sediakan userProfile ke seluruh aplikasi
    <AuthContext.Provider value={{ user, userProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};