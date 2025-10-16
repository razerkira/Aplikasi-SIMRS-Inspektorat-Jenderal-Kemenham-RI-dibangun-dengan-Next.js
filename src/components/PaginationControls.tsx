"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: PaginationControlsProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null; // Jangan tampilkan paginasi jika hanya ada satu halaman
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-gray-700">
        Menampilkan {startItem} - {endItem} dari {totalItems} data
      </span>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={handlePrevious} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-2">Sebelumnya</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
          <span className="mr-2">Selanjutnya</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}