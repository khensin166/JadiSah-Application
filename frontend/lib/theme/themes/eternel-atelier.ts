import type { ThemeConfig } from "@/types/theme";

/**
 * Tema Default: Éternel Atelier Luxury
 * Palet: Warm Ivory Alabaster, Champagne Gold, Olive Sage, Charcoal Espresso.
 */
export const eternelAtelierTheme: ThemeConfig = {
  id: "eternel-atelier",
  name: "Éternel Atelier Luxury",
  description: "Nuansa pernikahan klasik dan mewah dengan kehangatan Ivory dan Champagne Gold.",
  colors: {
    canvas: "#FAF6EE",
    surface: "#FDFBF7",
    border: "#E5D6C3",
    primary: "#C5A880",
    primaryHover: "#B8966C",
    primaryForeground: "#1C1C1A",
    secondary: "#F5EFE6",
    accent: "#7A8A76",
    accentSoft: "#F0F4EF",
    textPrimary: "#1C1C1A",
    textMuted: "#6E6D68",
  },
  assets: {
    brandName: "JadiSah",
    brandTagline: "Bespoke Wedding Concierge & Management",
    logoLetter: "J",
    heroPill: "Atelier Pernikahan Modern & Kolaboratif",
    heroHeadline: "Wujudkan Hari Bahagia Tanpa Beban & Penuh",
    heroHeadlineHighlight: "Keanggunan Abadi",
    heroSubheadline:
      "Kelola daftar tamu, sinkronisasi kehadiran RSVP real-time, pantau pagu anggaran vendor, dan bagikan workspace bersama pasangan dalam satu atelier pernikahan yang mewah.",
    heroMockupBadge: "Workspace Pernikahan Terhubung",
    heroMockupTitle: "The Wedding of Sarah & Amanda",
    heroMockupSubtitle: "Concierge Active • Hari H: 24 Oktober 2026",
    features: [
      {
        id: "rsvp-management",
        title: "RSVP & Manajemen Tamu",
        description: "Pantau konfirmasi kehadiran, alokasi meja, dan pengelompokan keluarga secara real-time tanpa tercecer.",
        badge: "Real-time Sync",
        iconName: "users",
      },
      {
        id: "budget-tracking",
        title: "Monitoring Anggaran & Vendor",
        description: "Rincian alokasi pagu dana darurat, komitmen uang muka (DP), dan jadwal pelunasan vendor venue hingga dekorasi.",
        badge: "Smart Budgeting",
        iconName: "wallet",
      },
      {
        id: "rundown-checklist",
        title: "Rundown & Checklist H-Day",
        description: "Susunan jadwal prosesi acara per 15 menit dan checklist persiapan pernikahan bertenggat waktu yang terstruktur.",
        badge: "Interaktif",
        iconName: "calendar",
      },
      {
        id: "couple-collab",
        title: "Kolaborasi Dua Akun Pasangan",
        description: "Undang pasangan Anda untuk mengelola seluruh data pernikahan secara bersama-sama dalam satu sinkronisasi akun.",
        badge: "Couple Sync",
        iconName: "heartHandshake",
      },
    ],
    ctaHeadline: "Mulai Rancang Pernikahan Impian Anda Hari Ini",
    ctaDescription:
      "Daftar gratis dalam 1 menit, undang pasangan Anda, dan nikmati kemudahan merencanakan hari teristimewa bersama JadiSah Atelier.",
    ctaButtonText: "Mulai Rencanakan Gratis",
  },
};

