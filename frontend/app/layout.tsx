import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "JadiSah — Luxury Wedding Planner & Atelier",
  description: "Bespoke wedding planning and concierge management system",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={cn("h-full", "antialiased", cormorant.variable, jakarta.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF6EE] text-[#242321]">{children}</body>
    </html>
  );
}
