# Laporan Teknis Aplikasi SIMRS Inspektorat Jenderal Kemenham RI

## 1. Pendahuluan

Dokumen ini memberikan gambaran teknis mengenai aplikasi SIMRS (Sistem Informasi Manajemen Rumah Sakit) yang dibangun untuk Inspektorat Jenderal Kemenham RI. Aplikasi ini dikembangkan menggunakan Next.js, sebuah framework React yang populer untuk membangun aplikasi web modern.

## 2. Struktur Proyek

Proyek ini memiliki struktur direktori sebagai berikut:

```
/
|-- public/                 # Aset statis seperti gambar dan ikon
|-- src/
|   |-- app/                # Halaman dan rute aplikasi
|   |   |-- (dashboard)/    # Grup rute untuk halaman dashboard
|   |   |-- api/            # Rute API untuk backend
|   |   |-- login/          # Halaman login
|   |-- components/         # Komponen React yang dapat digunakan kembali
|   |   |-- ui/             # Komponen UI dasar (Shadcn UI)
|   |-- context/            # Konteks React untuk manajemen state global
|   |-- hooks/              # Custom hooks
|   |-- lib/                # Pustaka dan utilitas
|-- components.json         # Konfigurasi untuk Shadcn UI
|-- next.config.js          # Konfigurasi Next.js
|-- package.json            # Daftar dependensi dan skrip proyek
|-- tailwind.config.ts      # Konfigurasi Tailwind CSS
|-- tsconfig.json           # Konfigurasi TypeScript
```

## 3. Teknologi yang Digunakan

### 3.1. Frontend

- **Next.js**: Framework React untuk rendering sisi server (SSR) dan pembuatan situs statis (SSG).
- **React**: Pustaka JavaScript untuk membangun antarmuka pengguna.
- **TypeScript**: Superset JavaScript yang menambahkan tipe statis.
- **Tailwind CSS**: Framework CSS utility-first untuk desain yang cepat dan responsif.
- **Shadcn UI**: Kumpulan komponen UI yang dapat digunakan kembali.

### 3.2. Backend & Database

- **Supabase**: Platform open-source yang menyediakan database PostgreSQL, otentikasi, dan penyimpanan file.
- **Firebase**: Digunakan untuk beberapa fitur backend, seperti otentikasi (opsional).

### 3.3. Pustaka Lainnya

- **recharts**: Pustaka untuk membuat grafik dan chart.
- **react-hot-toast**: Untuk menampilkan notifikasi toast.
- **date-fns**: Utilitas untuk manipulasi tanggal.

## 4. Fitur Utama

Aplikasi ini memiliki beberapa fitur utama, antara lain:

- **Manajemen Pegawai**: Menambah, mengubah, dan menghapus data pegawai.
- **Pengajuan Izin Cuti**: Pegawai dapat mengajukan izin cuti melalui aplikasi.
- **Pengajuan Dinas Luar**: Pegawai dapat mengajukan perjalanan dinas luar.
- **Verifikasi dan Persetujuan**: Atasan dapat melakukan verifikasi dan persetujuan terhadap pengajuan izin cuti dan dinas luar.
- **Upload Dokumen**: Pegawai dapat mengunggah dokumen pendukung.
- **Dashboard**: Menampilkan statistik dan ringkasan data.
- **Otentikasi**: Sistem login untuk mengamankan akses ke aplikasi.

## 5. Alur Kerja

### 5.1. Alur Pengajuan Izin Cuti

1.  Pegawai login ke aplikasi.
2.  Pegawai mengisi formulir pengajuan izin cuti dan mengunggah dokumen pendukung jika diperlukan.
3.  Data pengajuan disimpan di database Supabase dengan status "Menunggu Verifikasi".
4.  Atasan (verifikator) menerima notifikasi atau melihat daftar pengajuan yang perlu diverifikasi.
5.  Verifikator memeriksa kelengkapan data dan dokumen, kemudian menyetujui atau menolak pengajuan.
6.  Jika disetujui, status berubah menjadi "Menunggu Persetujuan". Jika ditolak, proses selesai.
7.  Atasan (supervisor) menerima notifikasi atau melihat daftar pengajuan yang perlu disetujui.
8.  Supervisor menyetujui atau menolak pengajuan.
9.  Status pengajuan diperbarui di database. Pegawai dapat melihat status pengajuannya.

### 5.2. Alur Pengajuan Dinas Luar

Alur pengajuan dinas luar mirip dengan alur pengajuan izin cuti, dengan beberapa penyesuaian pada formulir dan data yang diperlukan.

## 6. Penjelasan Komponen Penting

- **`src/app/(dashboard)`**: Direktori ini menggunakan fitur "Route Groups" dari Next.js untuk mengelompokkan halaman-halaman yang berada di dalam layout dashboard tanpa mempengaruhi URL.
- **`src/components/ui`**: Komponen-komponen di sini di-generate menggunakan Shadcn UI, yang memungkinkan kustomisasi penuh sesuai kebutuhan.
- **`src/context/AuthContext.tsx`**: Mengelola state otentikasi pengguna di seluruh aplikasi, seperti informasi pengguna yang sedang login dan perannya.
- **`src/lib/supabaseClient.ts`**: Inisialisasi klien Supabase untuk berinteraksi dengan database dan layanan Supabase lainnya.

## 7. Setup dan Instalasi

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repository:**
    ```bash
    git clone https://github.com/razerkira/Aplikasi-SIMRS-Inspektorat-Jenderal-Kemenham-RI-dibangun-dengan-Next.js.git
    ```
2.  **Masuk ke direktori proyek:**
    ```bash
    cd Aplikasi-SIMRS-Inspektorat-Jenderal-Kemenham-RI-dibangun-dengan-Next.js
    ```
3.  **Install dependensi:**
    ```bash
    npm install
    ```
4.  **Buat file `.env.local`** di root proyek dan tambahkan variabel lingkungan untuk koneksi ke Supabase:
    ```
    NEXT_PUBLIC_SUPABASE_URL=URL_SUPABASE_ANDA
    NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON_KEY_SUPABASE_ANDA
    ```
5.  **Jalankan server development:**
    ```bash
    npm run dev
    ```
6.  Buka [http://localhost:3000](http://localhost:3000) di browser Anda.
