// src/components/ExportButton.tsx
"use client";

import { CSVLink } from "react-csv";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  data: any[]; // Data yang akan diekspor
  headers: { label: string; key: string }[]; // Header untuk kolom CSV
  filename: string; // Nama file CSV
}

export default function ExportButton({ data, headers, filename }: ExportButtonProps) {
  return (
    <CSVLink data={data} headers={headers} filename={filename}>
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export to CSV
      </Button>
    </CSVLink>
  );
}