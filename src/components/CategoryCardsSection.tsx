"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Layers } from "lucide-react";

export default function CategoryCardsSection() {
  const categories = [
    {
      id: "face",
      title: "Face & Gentle Cleansing",
      tagline: "Ultra-pure botanical clay & delicate facial bars",
      badge: "Facial Atelier",
      count: "3 Formulations",
      image: "/images/products/charcoal-clay.jpg",
      href: "/#all-soaps",
      botanicals: "Activated Charcoal • White Kaolin • Damask Rose",
    },
    {
      id: "body",
      title: "Body & Deep Hydration",
      tagline: "Sacred resin infusions & farm milk nourishment",
      badge: "Signature Body",
      count: "3 Formulations",
      image: "/images/products/dragons-blood.jpg",
      href: "/#all-soaps",
      botanicals: "Dragon's Blood • Kashmiri Saffron • Blood Orange",
    },
    {
      id: "aromatherapy",
      title: "Aromatherapy & Calming",
      tagline: "High-altitude French lavender & sacred smoky oud",
      badge: "Evening Rituals",
      count: "2 Formulations",
      image: "/images/products/lavender-silk.jpg",
      href: "/#all-soaps",
      botanicals: "Provence Lavender • Mysore Sandalwood • Dead Sea Salt",
    },
    {
      id: "festive",
      title: "Festive & Luxury Gift Sets",
      tagline: "Handcrafted collector boxes with 24k cosmetic gold",
      badge: "Limited Release",
      count: "Holiday Edition",
      image: "/images/products/festive-box.jpg",
      href: "/#festival-offers",
      botanicals: "Dragon's Glow 4-Bar Box • Silk Ribbon & Wax Seal",
    },
  ];

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

        {/* 4 Category Cards in One Row Layout */}
        <div className="category-grid-4">
          {categories.map((cat) => (
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
