"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Clock, Droplets, Star, ShoppingBag, Check } from "lucide-react";
import { SOAPS } from "@/data/soaps";
import { useCart } from "@/context/CartContext";

export default function HeroSection() {
  const { addToCart, setIsCartOpen } = useCart();
  // Hero featured soaps switcher: 3 signature bars
  const featuredSoaps = [SOAPS[0], SOAPS[3], SOAPS[2]]; // Dragon's Blood, Kashmiri Saffron, Terracotta Orange
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [added, setAdded] = useState(false);

  const activeSoap = featuredSoaps[activeHeroIdx];

  const handleHeroAdd = () => {
    addToCart(activeSoap, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section className="hero-section" aria-label="Hero Showcase">
      <div className="hero-glow-blob-1" />
      <div className="hero-glow-blob-2" />

      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={14} color="var(--color-terracotta)" />
              Cold-Process Artisanal Masterwork • Small-Batch Poured
            </div>

            <h1 className="hero-title">
              Ancient Resin Wisdom. <br />
              <span className="highlight">Silky Cold-Process</span> Luxury.
            </h1>

            <p className="hero-description">
              Hand-poured with sacred wild Dragon&apos;s Blood resin, unrefined African plant butters, 
              and steam-distilled pure essences. Cured for up to 9 weeks to preserve 100% natural glycerin.
            </p>

            <div className="hero-cta-group">
              <Link href="#bestsellers" className="btn-primary">
                Shop Best Sellers <ArrowRight size={17} />
              </Link>
              <Link href="#festival-offers" className="btn-secondary">
                Festival Offers (25% Off)
              </Link>
            </div>

            {/* Quick Interactive Soap Selector Tabs */}
            <div style={{ marginTop: "1rem", marginBottom: "1.75rem" }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-tertiary)", marginBottom: "0.6rem" }}>
                Switch Signature Blend:
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {featuredSoaps.map((soap, idx) => (
                  <button
                    key={soap.id}
                    type="button"
                    onClick={() => setActiveHeroIdx(idx)}
                    style={{
                      padding: "0.4rem 0.85rem",
                      borderRadius: "9999px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      background: activeHeroIdx === idx ? "var(--color-dragon-black)" : "white",
                      color: activeHeroIdx === idx ? "white" : "var(--color-text-secondary)",
                      border: "1px solid " + (activeHeroIdx === idx ? "var(--color-dragon-black)" : "var(--color-border)"),
                      boxShadow: activeHeroIdx === idx ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    {soap.name.split("&")[0].trim()}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges Bar */}
            <div className="hero-trust-bar">
              <div className="trust-item">
                <div className="trust-item-icon">
                  <Leaf size={18} />
                </div>
                <div className="trust-item-text">
                  <strong>100% Organic Oils</strong>
                  Zero sulfates or synthetics
                </div>
              </div>

              <div className="trust-item">
                <div className="trust-item-icon">
                  <Clock size={18} />
                </div>
                <div className="trust-item-text">
                  <strong>8-Week Slow Cure</strong>
                  Ultra-dense velvet lather
                </div>
              </div>

              <div className="trust-item">
                <div className="trust-item-icon">
                  <Droplets size={18} />
                </div>
                <div className="trust-item-text">
                  <strong>Retains Glycerin</strong>
                  Deep 24h skin barrier moisture
                </div>
              </div>

              <div className="trust-item">
                <div className="trust-item-icon">
                  <ShieldCheck size={18} />
                </div>
                <div className="trust-item-text">
                  <strong>Eco Plastic-Free</strong>
                  Terracotta plant-fiber wrap
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card with Dynamic Switcher */}
          <div className="hero-visual-card">
            <div className="hero-visual-image-wrapper">
              <Link href={`/products/${activeSoap.id}`}>
                <Image
                  key={activeSoap.id}
                  src={activeSoap.image}
                  alt={activeSoap.name}
                  width={720}
                  height={620}
                  priority
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </Link>

              <div className="hero-floating-badge">
                <Star size={14} fill="#e17159" color="#e17159" />
                <span>{activeSoap.badge || "Signature"}</span> • {activeSoap.rating} ★ ({activeSoap.reviewsCount} Reviews)
              </div>

              {/* Pulsing Flash Banner */}
              <div
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  left: "1rem",
                  background: "rgba(17, 17, 19, 0.88)",
                  backdropFilter: "blur(8px)",
                  color: "#fff",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "9999px",
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  border: "1px solid rgba(225, 113, 89, 0.4)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#52c41a",
                    boxShadow: "0 0 8px #52c41a",
                  }}
                />
                In Stock: Freshly Cured Batch Ready
              </div>
            </div>

            <div className="hero-card-footer">
              <div>
                <Link href={`/products/${activeSoap.id}`}>
                  <h2 className="hero-card-soap-title" style={{ transition: "color 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-terracotta)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-dragon-black)")}>
                    {activeSoap.name}
                  </h2>
                </Link>
                <p className="hero-card-soap-meta">
                  {activeSoap.cureTime} • {activeSoap.fragranceNotes.slice(0, 2).join(" & ")} • <strong style={{ color: "var(--color-dragon-black)", fontSize: "0.95rem" }}>${activeSoap.price.toFixed(2)}</strong>
                </p>
              </div>

              <button
                type="button"
                className="btn-primary"
                style={{ padding: "0.65rem 1.35rem", fontSize: "0.88rem" }}
                onClick={handleHeroAdd}
              >
                {added ? (
                  <>
                    <Check size={16} /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Bag
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
