import { NextResponse, NextRequest } from "next/server";
import admin from "firebase-admin";

// Fungsi untuk menginisialisasi Firebase Admin dengan aman
// Ini memastikan inisialisasi hanya berjalan sekali.
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return;
  }

  // 1. Ambil string Base64 dari environment variable
  const serviceAccountBase64 = process.env.FIREBASE_ADMIN_CREDENTIALS_BASE64;
  if (!serviceAccountBase64) {
    throw new Error("FIREBASE_ADMIN_CREDENTIALS_BASE64 environment variable is not set.");
  }

  // 2. Decode string Base64 kembali menjadi JSON string biasa
  const serviceAccountJson = Buffer.from(serviceAccountBase64, 'base64').toString('utf8');
  
  // 3. Parse JSON string menjadi objek kredensial
  const serviceAccount = JSON.parse(serviceAccountJson);

  // 4. Inisialisasi app dengan kredensial yang sudah di-decode dan utuh
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Panggil fungsi inisialisasi saat file ini dimuat
initializeFirebaseAdmin();

const db = admin.firestore();

export async function POST(req: NextRequest) {
  try {
    const { email, nip } = await req.json();

    if (!email || !nip) {
      return NextResponse.json({ error: "Email dan NIP diperlukan." }, { status: 400 });
    }

    // Langkah A: Buat pengguna di Firebase Authentication
    // Kita gunakan NIP sebagai password default untuk pengguna baru
    const userRecord = await admin.auth().createUser({
      email: email,
      password: nip,
      emailVerified: true, // Anggap email sudah valid karena diinput oleh admin
      disabled: false,
    });
    
    // Langkah B: Buat profil pengguna di Firestore dengan role 'user'
    await db.collection("users").doc(userRecord.uid).set({
      email: email,
      role: "user",
    });

    return NextResponse.json({ 
      message: `Akun untuk ${email} berhasil dibuat.`, 
      uid: userRecord.uid 
    }, { status: 201 });

  } catch (error: any) {
    console.error("Gagal membuat akun:", error);
    // Tangani error jika email sudah terdaftar
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: "Email ini sudah terdaftar." }, { status: 409 });
    }
    // Tangani error umum lainnya
    return NextResponse.json({ error: "Terjadi kesalahan di server.", details: error.message }, { status: 500 });
  }
}
