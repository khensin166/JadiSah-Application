"use client";

import React from "react";
import { Users, Wallet, Calendar, HeartHandshake } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ThemeConfig, ThemeFeatureItem } from "@/types/theme";

interface LandingFeaturesProps {
  theme: ThemeConfig;
}

function getFeatureIcon(iconName: ThemeFeatureItem["iconName"]) {
  switch (iconName) {
    case "users":
      return <Users className="size-5 text-champagne-dark" />;
    case "wallet":
      return <Wallet className="size-5 text-champagne-dark" />;
    case "calendar":
      return <Calendar className="size-5 text-champagne-dark" />;
    case "heartHandshake":
      return <HeartHandshake className="size-5 text-champagne-dark" />;
    default:
      return <Users className="size-5 text-champagne-dark" />;
  }
}

export const LandingFeatures: React.FC<LandingFeaturesProps> = ({ theme }) => {
  return (
    <section className="py-16 sm:py-20 bg-ivory-100/60 border-y border-champagne-light/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="outline" className="bg-champagne-soft text-champagne-dark border-champagne font-semibold text-xs">
            Fitur Utama Atelier
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight">
            Semua Kebutuhan Perencanaan Pernikahan Anda dalam Satu Kendali
          </h2>
          <p className="text-sm text-charcoal-600">
            Didesain khusus untuk pasangan modern yang menginginkan kemudahan, transparansi, dan ketenangan pikiran.
          </p>
        </div>

        {/* Modular Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {theme.assets.features.map((feature) => (
            <Card
              key={feature.id}
              className="rounded-3xl border border-champagne-light/80 bg-ivory-50/90 soft-shadow transition-all hover:scale-[1.02] hover:border-champagne"
            >
              <CardHeader className="p-6 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-champagne-soft border border-champagne-light/70 shadow-xs">
                    {getFeatureIcon(feature.iconName)}
                  </div>
                  <Badge variant="outline" className="bg-white/80 text-[10px] text-charcoal-700 font-semibold border-champagne-light">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="font-serif text-xl font-bold text-charcoal-900 leading-snug">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <p className="text-xs text-charcoal-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

