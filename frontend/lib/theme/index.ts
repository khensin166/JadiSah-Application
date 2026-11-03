import type { ThemeConfig } from "@/types/theme";
import { eternelAtelierTheme } from "./themes/eternel-atelier";

/**
 * Registry tema yang tersedia di aplikasi.
 * Siap dikembangkan untuk multi-theme switcher (misal: rustic, classic romance, dll).
 */
export const availableThemes: Record<string, ThemeConfig> = {
  "eternel-atelier": eternelAtelierTheme,
};

/**
 * Mendapatkan tema yang sedang aktif.
 */
export function getActiveTheme(): ThemeConfig {
  return eternelAtelierTheme;
}

