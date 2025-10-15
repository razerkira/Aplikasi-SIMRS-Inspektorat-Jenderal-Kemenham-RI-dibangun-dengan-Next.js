// src/app/(dashboard)/upload-izin-cuti/page.tsx
import SupabaseUploadIzinCutiForm from "@/components/SupabaseUploadIzinCutiForm";

export default function UploadIzinCutiPage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Upload Dokumen Izin Cuti</h1>
        <p className="text-gray-500 mt-2">
          Silakan isi detail dan upload dokumen pengajuan cuti Anda (Word/PDF).
        </p>
      </div>

      <div className="mt-8">
        <SupabaseUploadIzinCutiForm />
      </div>
    </>
  );
}