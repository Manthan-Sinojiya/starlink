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
  Flame,
  Award,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useDBStore } from "@/context/DBStoreContext";
import { HeroSkeleton } from "./Skeleton";

interface HeroSlideItem {
  id: string;
  name: string;
  headline?: string;
  subheadline?: string;
  image: string;
  imageAlt?: string;
  description: string;
  price: number;
  badge: string;
  fragranceNotes: string[];
  fromDB?: boolean;
  ctaLink?: string;
  ctaText?: string;
}

export default function HeroSection() {
  const { addToCart } = useCart();
  const { heroSlides: dbSlides, products, isLoaded } = useDBStore();

  // Build slides purely from DB: prefer DB heroSlides, then DB products
  const displaySlides: HeroSlideItem[] = (() => {
    if (dbSlides && dbSlides.length > 0) {
      const active = dbSlides.filter((s) => s.isActive).sort((a, b) => a.order - b.order);
      if (active.length > 0) {
        return active.map((s) => ({
          id: s.id,
          name: s.headline.replace("\n", " "),
          headline: s.headline,
          subheadline: s.subheadline,
          image: s.image,
          imageAlt: s.imageAlt,
          description: s.description || "",
          price: 0,
          badge: s.badge || "Signature",
          fragranceNotes: s.subheadline ? [s.subheadline] : ["Handcrafted Artisan Bar"],
          fromDB: true,
          ctaLink: s.ctaLink || "/#all-soaps",
          ctaText: s.ctaText || "Claim Your Bar",
        }));
      }
    }

    if (products && products.length > 0) {
      return products.slice(0, 3).map((p) => ({
        id: p.id,
        name: p.name,
        headline: p.name,
        subheadline: p.tagline || `${p.mainCategory} · Artisanal Masterpiece`,
        image: p.image,
        imageAlt: p.imageAlt || p.name,
        description: p.description,
        price: p.price,
        badge: p.badge || (p.isBestseller ? "Best Seller" : "Artisanal Reserve"),
        fragranceNotes: p.fragranceNotes?.length ? p.fragranceNotes : [p.mainCategory],
        fromDB: true,
        ctaLink: `/products/${p.id}`,
        ctaText: "Shop This Bar",
      }));
    }

    return [];
  })();

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [added, setAdded] = useState(false);

  const nextSlide = useCallback(() => {
    if (displaySlides.length === 0) return;
    setActiveSlideIdx((prev) => (prev + 1) % displaySlides.length);
  }, [displaySlides.length]);

  const prevSlide = useCallback(() => {
    if (displaySlides.length === 0) return;
    setActiveSlideIdx((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  }, [displaySlides.length]);

  // Autoplay slider interval (5 seconds), pauses on user hover
  useEffect(() => {
    if (isPaused || displaySlides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, displaySlides.length]);

  if (!isLoaded || displaySlides.length === 0) {
    return <HeroSkeleton />;
  }

  const currentSlide = displaySlides[activeSlideIdx] || displaySlides[0];

  // For add-to-cart, try to match a real product
  const activeSoap = products.find((p) => p.image === currentSlide.image || p.id === currentSlide.id) || null;

  const handleHeroAdd = () => {
    if (activeSoap) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      addToCart(activeSoap as any, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    }
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
          {/* Left Column: Editorial Headline, Dynamic Description Slider & Actions */}
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={14} color="var(--color-terracotta)" />
              {currentSlide.subheadline || "Cold-Process Artisanal Masterwork • Small-Batch Poured"}
            </div>

            <h1 className="hero-title" key={`hero-h1-${activeSlideIdx}`}>
              {currentSlide.headline ? (
                currentSlide.headline.includes("\n") ? (
                  <>
                    {currentSlide.headline.split("\n")[0]} <br />
                    <span className="highlight">
                      {currentSlide.headline.split("\n").slice(1).join(" ")}
                    </span>
                  </>
                ) : (
                  <>
                    {currentSlide.headline}
                  </>
                )
              ) : (
                <>
                  Ancient Resin Wisdom. <br />
                  <span className="highlight">Silky Cold-Process</span> Luxury.
                </>
              )}
            </h1>

            {/* Slider Description: Updates smoothly per slide */}
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
              <Link href={currentSlide.ctaLink || "#all-soaps"} className="btn-primary">
                {currentSlide.ctaText || "Claim Your Bar"} <ArrowRight size={17} />
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
                  Featured Formulas ({activeSlideIdx + 1} / {displaySlides.length}):
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
                {displaySlides.map((slide, idx) => (
                  <button
                    key={slide.id}
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
                    {slide.name.split("&")[0].trim()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card (SAME LAYOUT, PHOTOS UPDATE WITH SLIDE) */}
          <div className="hero-visual-card">
            <div className="hero-visual-image-wrapper">
              <Link href={currentSlide.ctaLink || "/#all-soaps"}>
                <Image
                  key={`hero-img-${currentSlide.id}`}
                  src={currentSlide.image}
                  alt={currentSlide.imageAlt || currentSlide.name}
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
                <span>{currentSlide.badge || "Signature"}</span>
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
                <Link href={currentSlide.ctaLink || "/#all-soaps"}>
                  <h2
                    className="hero-card-soap-title"
                    style={{ transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-terracotta)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-dragon-black)")}
                  >
                    {currentSlide.name}
                  </h2>
                </Link>
                <p className="hero-card-soap-meta">
                  {currentSlide.fragranceNotes?.slice(0, 2).join(" & ")}
                  {currentSlide.price > 0 && (
                    <> • <strong style={{ color: "var(--color-dragon-black)", fontSize: "0.95rem" }}>₹{currentSlide.price.toLocaleString("en-IN")}</strong></>
                  )}
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
