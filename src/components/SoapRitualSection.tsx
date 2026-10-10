"use client";

import React from "react";
import { Droplet, Flame, Leaf, PackageCheck } from "lucide-react";

export default function SoapRitualSection() {
  const pillars = [
    {
      icon: <Flame size={26} />,
      title: "Ancient Dragon's Blood",
      desc: "Wild-harvested sacred resin used for centuries to tone, fortify skin elasticity, and guard against cellular stressors.",
    },
    {
      icon: <Droplet size={26} />,
      title: "Glycerin Retention",
      desc: "Commercial soap factories strip natural glycerin for lotion profits. Our cold-process method seals every drop inside the bar.",
    },
    {
      icon: <Leaf size={26} />,
      title: "Unrefined Botanical Lipids",
      desc: "Formulated with raw Ghanaian shea butter, organic virgin coconut oil, and cold-pressed sweet almond nectar.",
    },
    {
      icon: <PackageCheck size={26} />,
      title: "Zero Plastic Guarantee",
      desc: "Every bar arrives swaddled in recyclable terracotta parchment paper and compostable unbleached plant fibers.",
    },
  ];

  return (
    <section id="about" className="ritual-section" aria-label="About Us & Artisanal Soap Saponification">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">The Star Light Standard</span>
          <h2 className="section-title">The Art of True Cold-Process Saponification</h2>
          <p className="section-subtitle">
            Most shelf soaps are synthetic detergents masquerading as soap. Here is why our cold-cured bars 
            transform your daily bathing into a transformative skincare ritual.
          </p>
        </div>

        <div className="ritual-grid">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="ritual-card">
              <div className="ritual-icon-bubble">{pillar.icon}</div>
              <h3 className="ritual-card-title">{pillar.title}</h3>
              <p className="ritual-card-desc">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
