"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Layers } from "lucide-react";
import { useStore } from "@/context/StoreContext";

const FALLBACK_CATEGORY_IMAGES: Record<string, { image: string; badge: string; tagline: string; botanicals: string }> = {
  face: {
    image: "/images/products/charcoal-clay.jpg",
    badge: "Facial Atelier",
    tagline: "Ultra-pure botanical clay & delicate facial bars for balanced pores",
    botanicals: "Activated Charcoal • White Kaolin • Damask Rose",
  },
  body: {
    image: "/images/products/dragons-blood.jpg",
    badge: "Signature Body",
    tagline: "Sacred resin infusions & farm milk nourishment for deep dermal renewal",
    botanicals: "Dragon's Blood • Kashmiri Saffron • Blood Orange",
  },
  aroma: {
    image: "/images/products/lavender-silk.jpg",
    badge: "Evening Rituals",
    tagline: "High-altitude French lavender & sacred smoky oud for restorative rituals",
    botanicals: "Provence Lavender • Mysore Sandalwood • Dead Sea Salt",
  },
  festive: {
    image: "/images/products/festive-box.jpg",
    badge: "Limited Release",
    tagline: "Handcrafted collector boxes with 24k cosmetic gold & teak dishes",
    botanicals: "Dragon's Glow 4-Bar Box • Silk Ribbon & Wax Seal",
  },
};

function getCategoryMeta(cat: { id: string; name: string; image?: string; badge?: string; description?: string; subcategories: string[]; order?: number }, index: number) {
  const lowerName = (cat.name + " " + cat.id).toLowerCase();
  let defaultPreset = FALLBACK_CATEGORY_IMAGES.body;
  if (lowerName.includes("face") || lowerName.includes("cleans") || lowerName.includes("clay")) {
    defaultPreset = FALLBACK_CATEGORY_IMAGES.face;
  } else if (lowerName.includes("aroma") || lowerName.includes("calm") || lowerName.includes("lavender")) {
    defaultPreset = FALLBACK_CATEGORY_IMAGES.aroma;
  } else if (lowerName.includes("festiv") || lowerName.includes("gift") || lowerName.includes("box")) {
    defaultPreset = FALLBACK_CATEGORY_IMAGES.festive;
  }

  const image = cat.image && cat.image.trim() !== "" ? cat.image : defaultPreset.image;
  const badge = cat.badge || defaultPreset.badge || `Curated #${(cat.order ?? index) + 1}`;
  const tagline = cat.description || defaultPreset.tagline || cat.subcategories.slice(0, 3).join(", ") || "Handcrafted cold-process soap collection";
  const botanicals = cat.subcategories.length > 0 ? cat.subcategories.join(" • ") : defaultPreset.botanicals;

  return { image, badge, tagline, botanicals };
}

export default function CategoryCardsSection() {
  const { categories: storeCategories, products } = useStore();

  const validCategories = storeCategories.filter((c) => c.id !== "all");

  const displayCategories = validCategories.map((cat, index) => {
    const meta = getCategoryMeta(cat, index);

    const count = products.filter(
      (p) =>
        p.mainCategory.toLowerCase() === cat.name.toLowerCase() ||
        p.mainCategory.toLowerCase().includes(cat.name.toLowerCase()) ||
        cat.name.toLowerCase().includes(p.mainCategory.toLowerCase())
    ).length;

    return {
      id: cat.id,
      title: cat.name,
      tagline: meta.tagline,
      badge: meta.badge,
      count: `${count || 3} Formulations`,
      image: meta.image,
      href: `/#all-soaps`,
      botanicals: meta.botanicals,
    };
  });


  return (
    <section id="categories" className="categories-showcase-section" aria-label="Soap Categories">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">
            <Layers size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            Curated Soap Collections
          </span>
          <h2 className="section-title">Explore by Botanical Category</h2>
          <p className="section-subtitle">
            Choose your personal bathing ritual. Formulated for specific skin requirements and sensory journeys.
          </p>
        </div>

        {/* Dynamic Category Cards in sequence */}
        <div className="category-grid-4">
          {displayCategories.map((cat) => (
            <Link key={cat.id} href={cat.href} className="category-card" aria-label={`Explore ${cat.title}`}>
              {/* Media Image */}
              <div className="category-card-media">
                <span className="category-card-count-badge">
                  {cat.badge}
                </span>

                <Image
                  src={cat.image}
                  alt={cat.title}
                  width={400}
                  height={400}
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Card Body */}
              <div className="category-card-body">
                <div style={{ fontSize: "0.72rem", color: "var(--color-terracotta)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>
                  {cat.count}
                </div>

                <h3 className="category-card-title">{cat.title}</h3>

                <p className="category-card-desc">{cat.tagline}</p>

                <div style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", marginBottom: "0.85rem", fontStyle: "italic" }}>
                  {cat.botanicals}
                </div>

                <div className="category-card-action">
                  <span>Explore Collection</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
