"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Clock,
  Droplets,
  Star,
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SOAPS } from "@/data/soaps";
import { useCart } from "@/context/CartContext";

export default function HeroSection() {
  const { addToCart } = useCart();

  // Curated hero showcase slides: only description and photo change with the exact same layout
  const heroSlides = [
    {
      soap: SOAPS[0], // Dragon's Blood & Smoked Amber
      description:
        "Hand-poured with sacred wild Dragon's Blood resin, unrefined African plant butters, and steam-distilled pure essences. Cured for up to 9 weeks to preserve 100% natural glycerin.",
    },
    {
      soap: SOAPS[3], // Kashmiri Saffron & Wild Blossom Honey
      description:
        "Infused with rare Grade-A Kashmiri crimson saffron stigmas, farm-fresh whole goat milk, and wild mountain blossom honey. Delivers an opulent, restorative lather and luminous golden glow.",
    },
    {
      soap: SOAPS[2], // Terracotta French Clay & Blood Orange
      description:
        "Sun-drenched Sicilian blood orange peel married with mineral-dense Moroccan rhassoul and French terracotta clays. Awakens morning vitality and restores natural skin radiance.",
    },
    {
      soap: SOAPS[1], // Himalayan Charcoal & White Kaolin
      description:
        "Dual-mineral purifying blend of steam-activated bamboo charcoal and velvety French kaolin clay. Draws away impurities and excess sebum while maintaining deep cellular moisture.",
    },
    {
      soap: SOAPS[5], // Smoky Agarwood Oud & Mysore Sandalwood
      description:
        "Deeply grounding sacred wood resins blended with royal Mysore sandalwood and cold-pressed avocado lipids. Slow-cured for nine weeks for an ultra-dense, meditative bathing experience.",
    },
  ];

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [added, setAdded] = useState(false);

  const currentSlide = heroSlides[activeSlideIdx];
  const activeSoap = currentSlide.soap;

  const nextSlide = useCallback(() => {
    setActiveSlideIdx((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = useCallback(() => {
    setActiveSlideIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  // Autoplay slider interval (5 seconds), pauses on user hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const handleHeroAdd = () => {
    addToCart(activeSoap, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section
      className="hero-section"
      aria-label="Hero Showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hero-glow-blob-1" />
      <div className="hero-glow-blob-2" />

      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Editorial Headline, Dynamic Description Slider & Actions (SAME LAYOUT) */}
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={14} color="var(--color-terracotta)" />
              Cold-Process Artisanal Masterwork • Small-Batch Poured
            </div>

            <h1 className="hero-title">
              Ancient Resin Wisdom. <br />
              <span className="highlight">Silky Cold-Process</span> Luxury.
            </h1>

            {/* Slider Description: Only description updates per slide with smooth transition */}
            <div
              style={{
                minHeight: "4.5rem",
                display: "flex",
                alignItems: "center",
                transition: "opacity 0.3s ease",
              }}
            >
              <p
                key={`desc-${activeSlideIdx}`}
                className="hero-description"
                style={{
                  margin: 0,
                  animation: "fadeInUp 0.35s ease-out",
                }}
              >
                {currentSlide.description}
              </p>
            </div>

            <div className="hero-cta-group">
              <Link href="#all-soaps" className="btn-primary">
                Shop Collection <ArrowRight size={17} />
              </Link>
              <Link href="#festival-offers" className="btn-secondary">
                Festival Offers (25% Off)
              </Link>
            </div>

            {/* Interactive Slider Switcher & Navigation Controls */}
            <div style={{ marginTop: "1rem", marginBottom: "1.75rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "0.6rem",
                }}
              >
                <div
                  style={{
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  Featured Formulas ({activeSlideIdx + 1} / {heroSlides.length}):
                </div>

                {/* Slider Prev / Next Arrows */}
                <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous signature soap"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "1px solid var(--color-border)",
                      background: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--color-dragon-black)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--color-dragon-black)";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "var(--color-dragon-black)";
                    }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next signature soap"
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      border: "1px solid var(--color-border)",
                      background: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--color-dragon-black)",
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--color-dragon-black)";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.color = "var(--color-dragon-black)";
                    }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Slider Dots / Tabs */}
              <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", alignItems: "center" }}>
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.soap.id}
                    type="button"
                    onClick={() => setActiveSlideIdx(idx)}
                    style={{
                      padding: "0.35rem 0.8rem",
                      borderRadius: "9999px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      background: activeSlideIdx === idx ? "var(--color-dragon-black)" : "white",
                      color: activeSlideIdx === idx ? "white" : "var(--color-text-secondary)",
                      border:
                        "1px solid " +
                        (activeSlideIdx === idx ? "var(--color-dragon-black)" : "var(--color-border)"),
                      boxShadow: activeSlideIdx === idx ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                    }}
                  >
                    {slide.soap.name.split("&")[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card (SAME LAYOUT, PHOTOS UPDATE WITH SLIDE) */}
          <div className="hero-visual-card">
            <div className="hero-visual-image-wrapper">
              <Link href={`/products/${activeSoap.id}`}>
                <Image
                  key={`hero-img-${activeSoap.id}`}
                  src={activeSoap.image}
                  alt={activeSoap.name}
                  width={720}
                  height={620}
                  priority
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    animation: "fadeIn 0.4s ease-in-out",
                  }}
                />
              </Link>

              {/* Slider Prev / Next Overlay Buttons on Photo */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous slide"
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.88)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(225, 113, 89, 0.25)",
                  color: "var(--color-dragon-black)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 4,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-dragon-black)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.88)";
                  e.currentTarget.style.color = "var(--color-dragon-black)";
                }}
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next slide"
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.88)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(225, 113, 89, 0.25)",
                  color: "var(--color-dragon-black)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 4,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--color-dragon-black)";
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.88)";
                  e.currentTarget.style.color = "var(--color-dragon-black)";
                }}
              >
                <ChevronRight size={20} />
              </button>

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
                  zIndex: 3,
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

            {/* Visual Card Footer: Updates with active soap and Indian Rupee price */}
            <div className="hero-card-footer">
              <div>
                <Link href={`/products/${activeSoap.id}`}>
                  <h2
                    className="hero-card-soap-title"
                    style={{ transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-terracotta)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-dragon-black)")}
                  >
                    {activeSoap.name}
                  </h2>
                </Link>
                <p className="hero-card-soap-meta">
                  {activeSoap.cureTime} • {activeSoap.fragranceNotes.slice(0, 2).join(" & ")} •{" "}
                  <strong style={{ color: "var(--color-dragon-black)", fontSize: "0.95rem" }}>
                    ₹{activeSoap.price.toLocaleString("en-IN")}
                  </strong>
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

        {/* Trust Badges Bar: Cleanly visible full-width row right below hero cards */}
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
    </section>
  );
}
