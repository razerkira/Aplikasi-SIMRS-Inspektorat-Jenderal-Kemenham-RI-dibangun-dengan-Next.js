// src/components/MobileHeader.tsx
"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

// Komponen ini akan menerima fungsi untuk membuka sidebar
export default function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="md:hidden p-4 border-b">
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu />
      </Button>
    </header>
  );
}