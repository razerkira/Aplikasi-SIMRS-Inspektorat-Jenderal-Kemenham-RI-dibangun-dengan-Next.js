// src/app/upload-spj/page.tsx
import SupabaseUploadSPJForm from "@/components/SupabaseUploadSPJForm";

export default function UploadSPJPage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Upload Dokumen SPJ Dinas Luar</h1>
        <p className="text-gray-500 mt-2">
          Silakan isi detail dan upload dokumen SPJ Anda (Word/PDF).
        </p>
      </div>

      <div className="mt-8">
        <SupabaseUploadSPJForm />
      </div>
    </>
  );
}