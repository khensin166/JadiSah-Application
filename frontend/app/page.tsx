import Link from "next/link";
import { Heart, LayoutDashboard, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-zinc-50 font-sans dark:bg-zinc-950">
      {/* Navigation */}
      <header className="w-full border-b border-rose-100 bg-white/70 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 text-white shadow-md shadow-rose-200 dark:shadow-none">
              <Heart className="h-5 w-5 fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              JadiSah
            </span>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 transition"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Buka Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300 mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Feature Branch: feature/dahsboard-user</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-2xl leading-tight">
          Wedding Planning Jadi Mudah, Teratur &amp; Bebas Stres
        </h1>

        <p className="mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
          Kelola daftar tamu undangan, pantau realisasi anggaran, pantau RSVP kehadiran, dan susun rundown pernikahan Anda dalam satu dashboard interaktif.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-300/40 hover:from-rose-700 hover:to-pink-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Lihat Dashboard Pengguna</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-2" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">RSVP &amp; Manajemen Tamu</h3>
            <p className="text-[11px] text-zinc-500 mt-1">Pantau status konfirmasi hadir, menunggu, dan batal secara real-time.</p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <CheckCircle2 className="h-5 w-5 text-amber-500 mb-2" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Monitoring Anggaran</h3>
            <p className="text-[11px] text-zinc-500 mt-1">Rincian per pos vendor mulai dari venue, catering, hingga busana.</p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <CheckCircle2 className="h-5 w-5 text-rose-500 mb-2" />
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white">Rundown &amp; Checklist</h3>
            <p className="text-[11px] text-zinc-500 mt-1">Susunan sesi acara dan daftar tugas pernikahan interaktif.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/80 bg-white py-4 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900">
        JadiSah Application • Monorepo Frontend &amp; Backend
      </footer>
    </div>
  );
}
