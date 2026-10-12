import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Console | JadiSah",
  description: "Panel administrasi JadiSah untuk Admin dan Super Admin.",
};

// Placeholder — panel admin lengkap dijadwalkan pada tahap berikutnya.
export default function AdminPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-ivory-50 p-6">
      <div className="max-w-md text-center space-y-4">
        <div className="mx-auto size-12 rounded-xl bg-gradient-to-br from-champagne to-champagne-dark flex items-center justify-center text-white font-cormorant text-2xl font-bold shadow-md">
          J
        </div>
        <h1 className="font-cormorant text-3xl font-semibold text-charcoal-900">Admin Console</h1>
        <p className="text-sm text-charcoal-600">
          Panel admin sedang dalam pengembangan. Anda masuk sebagai Admin / Super Admin.
        </p>
        <Link href="/dashboard" className="inline-block text-sm font-medium text-champagne-dark hover:underline">
          Lihat dashboard user →
        </Link>
      </div>
    </main>
  );
}
