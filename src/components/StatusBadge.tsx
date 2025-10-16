import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function StatusBadge({ status }: { status: string | null }) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  if (status === 'Disetujui') {
    return <span className={`${baseClasses} bg-green-100 text-green-800`}><CheckCircle className="mr-1.5 h-3 w-3" />{status}</span>;
  }
  if (status === 'Ditolak') {
    return <span className={`${baseClasses} bg-red-100 text-red-800`}><XCircle className="mr-1.5 h-3 w-3" />{status}</span>;
  }
  return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
    <Clock className="mr-1.5 h-3 w-3" />{status || 'Menunggu'}
  </span>;
}
