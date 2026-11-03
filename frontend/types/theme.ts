export interface ThemeColors {
  /** Warna latar kanvas utama (misal: Ivory Alabaster #FAF6EE) */
  canvas: string;
  /** Warna permukaan kartu/komponen (misal: Ivory Soft #FDFBF7) */
  surface: string;
  /** Warna border halus (misal: Champagne Light #E5D6C3) */
  border: string;
  /** Warna brand utama / aksen emas (misal: Champagne Gold #C5A880) */
  primary: string;
  /** Warna hover brand utama */
  primaryHover: string;
  /** Warna teks kontras di atas tombol primary */
  primaryForeground: string;
  /** Warna sekunder lembut (misal: Champagne Soft #F5EFE6) */
  secondary: string;
  /** Warna aksen alami / harmoni (misal: Olive Sage #7A8A76) */
  accent: string;
  /** Warna aksen lembut untuk badge/tag (misal: Sage Soft #F0F4EF) */
  accentSoft: string;
  /** Warna teks utama (misal: Charcoal Espresso #1C1C1A) */
  textPrimary: string;
  /** Warna teks pendukung / deskripsi (misal: Charcoal Muted #6E6D68) */
  textMuted: string;
}

export interface ThemeFeatureItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  iconName: "users" | "wallet" | "calendar" | "heartHandshake";
}

export interface ThemeAssets {
  /** Nama/inisial brand untuk logo visual */
  brandName: string;
  brandTagline: string;
  logoLetter: string;
  /** Headline & copywriting hero */
  heroPill: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroSubheadline: string;
  /** Gambar/mockup showcase hero */
  heroMockupBadge: string;
  heroMockupTitle: string;
  heroMockupSubtitle: string;
  /** Daftar kartu fitur modular */
  features: ThemeFeatureItem[];
  /** Copywriting CTA banner */
  ctaHeadline: string;
  ctaDescription: string;
  ctaButtonText: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  colors: ThemeColors;
  assets: ThemeAssets;
}

