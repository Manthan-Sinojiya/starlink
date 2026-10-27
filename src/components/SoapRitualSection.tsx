"use client";

import React from "react";
import { Droplet, Flame, Leaf, PackageCheck, Sparkles, ShieldCheck } from "lucide-react";
import { useDBStore, DEFAULT_SITE_SETTINGS } from "@/context/DBStoreContext";

export default function SoapRitualSection() {
  const { siteSettings } = useDBStore();
  const ritual = siteSettings?.ritualSection || DEFAULT_SITE_SETTINGS.ritualSection;
  const pillars = ritual.pillars && ritual.pillars.length > 0 ? ritual.pillars : DEFAULT_SITE_SETTINGS.ritualSection.pillars;

  const getPillarIcon = (name?: string) => {
    switch (name?.toLowerCase()) {
      case "flame":
        return <Flame size={26} />;
      case "droplet":
        return <Droplet size={26} />;
      case "packagecheck":
        return <PackageCheck size={26} />;
      case "sparkles":
        return <Sparkles size={26} />;
      case "shieldcheck":
        return <ShieldCheck size={26} />;
      default:
        return <Leaf size={26} />;
    }
  };

  return (
    <section id="about" className="ritual-section" aria-label="About Us & Artisanal Soap Saponification">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{ritual.tag || "The Star Light Standard"}</span>
          <h2 className="section-title">{ritual.title || "The Art of True Cold-Process Saponification"}</h2>
          <p className="section-subtitle">
            {ritual.subtitle || "Most shelf soaps are synthetic detergents masquerading as soap. Here is why our cold-cured bars transform your daily bathing into a transformative skincare ritual."}
          </p>
        </div>

        <div className="ritual-grid">
          {pillars.map((pillar, idx) => (
            <div key={pillar.id || idx} className="ritual-card">
              <div className="ritual-icon-bubble">{getPillarIcon(pillar.iconName)}</div>
              <h3 className="ritual-card-title">{pillar.title}</h3>
              <p className="ritual-card-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
