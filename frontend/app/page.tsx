import { getActiveTheme } from "@/lib/theme";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Home() {
  const theme = getActiveTheme();

  return (
    <div className="flex min-h-screen flex-col bg-ivory-100 font-sans text-charcoal-800 antialiased selection:bg-champagne-light selection:text-charcoal-900">
      <LandingNavbar theme={theme} />
      <main className="flex-1">
        <LandingHero theme={theme} />
        <LandingFeatures theme={theme} />
        <LandingCTA theme={theme} />
      </main>
      <LandingFooter theme={theme} />
    </div>
  );
}
