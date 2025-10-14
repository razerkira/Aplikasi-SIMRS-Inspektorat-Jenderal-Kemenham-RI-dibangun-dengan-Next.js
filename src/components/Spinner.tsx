// src/components/Spinner.tsx
import { Loader2 } from 'lucide-react';

export default function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
    </div>
  );
}