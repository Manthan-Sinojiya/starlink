"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  Gift,
  Truck,
  ShieldCheck,
  ShoppingBag,
  Star,
  ArrowRight,
  Eye,
  RefreshCw,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Layers,
} from "lucide-react";
import { FESTIVAL_PROMO, Soap } from "@/data/soaps";
import { useCart } from "@/context/CartContext";
import { useDBStore } from "@/context/DBStoreContext";
import { openWhatsAppDirect } from "@/utils/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function FestivalOfferSection() {
  const { addToCart, showToast } = useCart();
  const { primaryOffer, secondaryOffer } = useDBStore();

  // Active top-level offer tab: 0 = Primary (Festival Vault), 1 = Secondary (Ayurvedic Saffron)
  const [activeOfferIndex, setActiveOfferIndex] = useState<0 | 1>(0);

  // Per-offer internal carousel states
  const [primarySelectedView, setPrimarySelectedView] = useState<"box" | number>("box");
  const [secondarySelectedView, setSecondarySelectedView] = useState<"box" | number>("box");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [addedOffer, setAddedOffer] = useState<string | null>(null);

  // Live countdown timers
  const [primaryTimeLeft, setPrimaryTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 32,
    seconds: 48,
  });

  const [secondaryTimeLeft, setSecondaryTimeLeft] = useState({
    days: 5,
    hours: 18,
    minutes: 45,
    seconds: 20,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setPrimaryTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });

      setSecondaryTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!primaryOffer?.isActive && !secondaryOffer?.isActive) return null;

  // ── Primary Offer Setup ──
  const primaryIncludedBars = primaryOffer?.bars || [];
  const primaryAllSlides = useMemo(() => [
    {
      type: "box" as const,
      name: primaryOffer.title,
      image: primaryOffer.mainImage,
      label: "Full Collector Vault Box",
    },
    ...primaryIncludedBars.map((bar, idx) => ({
      type: idx,
      name: bar.name,
      image: bar.image,
      label: `Bar 0${idx + 1}: ${bar.name}`,
    })),
  ], [primaryOffer, primaryIncludedBars]);

  const primaryCurrentSlideIndex =
    primarySelectedView === "box" ? 0 : (typeof primarySelectedView === "number" ? primarySelectedView + 1 : 0);

  const goToPrimarySlide = (index: number) => {
    if (index === 0) setPrimarySelectedView("box");
    else setPrimarySelectedView(index - 1);
  };

  const handlePrevPrimarySlide = () => {
    const newIdx = (primaryCurrentSlideIndex - 1 + primaryAllSlides.length) % primaryAllSlides.length;
    goToPrimarySlide(newIdx);
  };

  const handleNextPrimarySlide = () => {
    const newIdx = (primaryCurrentSlideIndex + 1) % primaryAllSlides.length;
    goToPrimarySlide(newIdx);
  };

  const primaryActiveBar =
    typeof primarySelectedView === "number" && primaryIncludedBars[primarySelectedView]
      ? primaryIncludedBars[primarySelectedView]
      : (primaryIncludedBars[0] || {
          name: "Artisanal Bar",
          lather: "Velvet foam",
          aroma: "Botanical oils",
          benefit: "Nourishes skin",
          botanical: "Pure extracts",
          image: primaryOffer.mainImage,
        });

  const primarySoapObj: Soap = useMemo(() => ({
    id: primaryOffer.id,
    name: primaryOffer.title,
    tagline: primaryOffer.subtitle,
    mainCategory: "Festive & Luxury Gift Sets",
    subCategory: "Collector Box Set",
    category: "festive",
    price: primaryOffer.salePrice,
    originalPrice: primaryOffer.originalPrice,
    rating: 5.0,
    reviewsCount: 94,
    weight: "4-Bar Keepsake Set",
    taxType: "inclusive",
    taxRate: 18,
    cureTime: "Limited Holiday Batch",
    fragranceNotes: ["Botanical resins", "Gold flakes"],
    keyIngredients: ["24k Cosmetic Gold", "Botanical Resins"],
    fullIngredients: ["Saponified Olive Oil, Shea Butter, Plant Oils, 24k Cosmetic Gold Leaf"],
    skinType: "All Skin Types • Luxury Gifting",
    soapBenefits: ["Four distinct holiday sensory rituals in one keepsake box"],
    ritualHowToUse: "Unbox each numbered bar as part of your holiday bathing ritual.",
    description: primaryOffer.description,
    image: primaryOffer.mainImage,
    inStock: true,
    isFestive: true,
  }), [primaryOffer]);

  // ── Secondary Offer Setup ──
  const secondaryIncludedBars = secondaryOffer?.bars || [];
  const secondaryAllSlides = useMemo(() => [
    {
      type: "box" as const,
      name: secondaryOffer.title,
      image: secondaryOffer.mainImage,
      label: "Full Curation Set",
    },
    ...secondaryIncludedBars.map((bar, idx) => ({
      type: idx,
      name: bar.name,
      image: bar.image,
      label: `Bar 0${idx + 1}: ${bar.name}`,
    })),
  ], [secondaryOffer, secondaryIncludedBars]);

  const secondaryCurrentSlideIndex =
    secondarySelectedView === "box" ? 0 : (typeof secondarySelectedView === "number" ? secondarySelectedView + 1 : 0);

  const goToSecondarySlide = (index: number) => {
    if (index === 0) setSecondarySelectedView("box");
    else setSecondarySelectedView(index - 1);
  };

  const handlePrevSecondarySlide = () => {
    const newIdx = (secondaryCurrentSlideIndex - 1 + secondaryAllSlides.length) % secondaryAllSlides.length;
    goToSecondarySlide(newIdx);
  };

  const handleNextSecondarySlide = () => {
    const newIdx = (secondaryCurrentSlideIndex + 1) % secondaryAllSlides.length;
    goToSecondarySlide(newIdx);
  };

  const secondaryActiveBar =
    typeof secondarySelectedView === "number" && secondaryIncludedBars[secondarySelectedView]
      ? secondaryIncludedBars[secondarySelectedView]
      : (secondaryIncludedBars[0] || {
          name: "Heritage Bar",
          lather: "Rich velvet foam",
          aroma: "Kashmiri saffron & goat milk",
          benefit: "Imparts golden radiance",
          botanical: "Grade A Saffron",
          image: secondaryOffer.mainImage,
        });

  const secondarySoapObj: Soap = useMemo(() => ({
    id: secondaryOffer.id,
    name: secondaryOffer.title,
    tagline: secondaryOffer.subtitle,
    mainCategory: "Specialty Curations",
    subCategory: "Ayurvedic Heritage Set",
    category: "festive",
    price: secondaryOffer.salePrice,
    originalPrice: secondaryOffer.originalPrice,
    rating: 5.0,
    reviewsCount: 78,
    weight: "3-Bar Heritage Curation",
    taxType: "inclusive",
    taxRate: 18,
    cureTime: "Aged 8 Weeks",
    fragranceNotes: ["Mongra Saffron", "Forest Honey", "Khus Vetiver"],
    keyIngredients: ["Kashmiri Saffron", "Farm Goat Milk", "Raw Honey"],
    fullIngredients: ["Saponified Cold Pressed Oils, Farm Milk, Kashmiri Saffron, Raw Forest Honey"],
    skinType: "All Skin Types • Nourishing Ayurvedic",
    soapBenefits: ["Imparts healthy radiant glow", "Deeply restores moisture barrier"],
    ritualHowToUse: "Work into a dense velvety froth between warm palms, apply in gentle circular motions, rinse thoroughly.",
    description: secondaryOffer.description,
    image: secondaryOffer.mainImage,
    inStock: true,
    isFestive: true,
  }), [secondaryOffer]);

  const handleCopyCode = (code: string, discount: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code "${code}" copied! ${discount}% Off storewide ✨`);
    setTimeout(() => setCopiedCode(null), 2400);
  };

  const handleToggleOffer = (dir: "prev" | "next") => {
    setActiveOfferIndex((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <section id="festival-offers" className="festival-collector-showcase" aria-label="Exclusive Holiday Gift Offers">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: "1.5rem" }}>
          <span className="section-tag festive-tag">
            <Gift size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
            2026 LIMITED HOLIDAY COLLECTOR OFFERS
          </span>
          <h2 className="section-title">
            {activeOfferIndex === 0 ? primaryOffer.title : secondaryOffer.title}
          </h2>
          <p className="section-subtitle">
            {activeOfferIndex === 0 ? primaryOffer.subtitle : secondaryOffer.subtitle}
          </p>
        </div>

        {/* Unified Slider Navigation Header (Switch between Main Offer & Secondary Offer) */}
        <div className="offers-slider-controls-wrap">
          <button
            type="button"
            onClick={() => handleToggleOffer("prev")}
            className="offers-nav-arrow-btn"
            aria-label="Previous offer"
            title="Previous offer"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="offers-tabs-track">
            <button
              type="button"
              onClick={() => setActiveOfferIndex(0)}
              className={`offer-tab-pill ${activeOfferIndex === 0 ? "active" : ""}`}
              aria-label="View Grand Festival Vault Box offer"
            >
              <span>🎁 Offer 01: Grand Festival Vault Box</span>
              <span className="offer-tab-badge">{primaryOffer.discountText}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveOfferIndex(1)}
              className={`offer-tab-pill gold ${activeOfferIndex === 1 ? "active" : ""}`}
              aria-label="View Royal Ayurvedic Saffron Curation offer"
            >
              <span>✨ Offer 02: Royal Ayurvedic Saffron Curation</span>
              <span className="offer-tab-badge">{secondaryOffer.discountText}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleToggleOffer("next")}
            className="offers-nav-arrow-btn"
            aria-label="Next offer"
            title="Next offer"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            OFFER 01: PRIMARY FESTIVAL COLLECTOR VAULT BOX
           ───────────────────────────────────────────────────────────── */}
        {activeOfferIndex === 0 && (
          <div className="collector-box-card offers-active-stage">
            {/* Left Column: Visual Showcase & Interactive Bar Explorer */}
            <div className="collector-media-col">
              <div className="collector-image-frame">
                <div className="collector-frame-badges">
                  <span className="collector-edition-pill">
                    <Sparkles size={12} /> {primaryOffer.badgeText}
                  </span>
                  <span className="collector-discount-pill">
                    {primaryOffer.discountText}
                  </span>
                </div>

                {/* Main Carousel Slider Arrows */}
                <button
                  type="button"
                  onClick={handlePrevPrimarySlide}
                  className="collector-slider-arrow prev"
                  aria-label="Previous bar in offer"
                  title="Previous item"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={handleNextPrimarySlide}
                  className="collector-slider-arrow next"
                  aria-label="Next bar in offer"
                  title="Next item"
                >
                  <ChevronRight size={22} />
                </button>

                <Image
                  key={primarySelectedView === "box" ? primaryOffer.mainImage : primaryIncludedBars[primarySelectedView]?.image}
                  src={primarySelectedView === "box" ? primaryOffer.mainImage : primaryIncludedBars[primarySelectedView]?.image}
                  alt={primarySelectedView === "box" ? primaryOffer.title : primaryIncludedBars[primarySelectedView]?.name}
                  width={720}
                  height={540}
                  priority
                  className="collector-box-img"
                />

                {/* Slider Dots Indicator */}
                <div className="collector-slider-dots">
                  {primaryAllSlides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goToPrimarySlide(i)}
                      className={`slider-dot ${primaryCurrentSlideIndex === i ? "active" : ""}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* View Indicator Overlay */}
                <div className="collector-image-caption-bar">
                  <span className="caption-text">
                    Viewing: <strong>{primarySelectedView === "box" ? primaryOffer.title : primaryIncludedBars[primarySelectedView]?.name}</strong>
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="collector-slide-counter">
                      {primaryCurrentSlideIndex + 1} / {primaryAllSlides.length}
                    </span>
                    {primarySelectedView !== "box" && (
                      <button
                        type="button"
                        onClick={() => setPrimarySelectedView("box")}
                        className="caption-reset-btn"
                      >
                        <RefreshCw size={12} /> Full Box
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Included Bars Interactive Navigation */}
              <div className="collector-bars-nav">
                <div className="bars-nav-header">
                  <div>
                    <h4 className="bars-nav-title">Included Inside The Vault Box:</h4>
                    <p className="bars-nav-subtitle">Click any bar or use &larr; &rarr; arrows to browse</p>
                  </div>
                  <div className="bars-nav-controls">
                    <button
                      type="button"
                      onClick={handlePrevPrimarySlide}
                      className="bars-scroll-btn prev"
                      aria-label="Previous bar"
                      title="Previous bar"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPrimarySlide}
                      className="bars-scroll-btn next"
                      aria-label="Next bar"
                      title="Next bar"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrimarySelectedView("box")}
                      className={`box-overview-tab-btn ${primarySelectedView === "box" ? "active" : ""}`}
                    >
                      <Eye size={13} /> Full Box Overview
                    </button>
                  </div>
                </div>

                <div className="bars-thumbnails-grid">
                  {primaryIncludedBars.map((bar, idx) => (
                    <button
                      key={bar.id}
                      type="button"
                      onClick={() => setPrimarySelectedView(idx)}
                      className={`bar-thumb-card ${primarySelectedView === idx ? "active" : ""}`}
                      aria-label={`View ${bar.name}`}
                    >
                      <div className="bar-thumb-img-wrap">
                        <Image
                          src={bar.image}
                          alt={bar.name}
                          width={90}
                          height={90}
                          className="bar-thumb-img"
                        />
                        <span className="bar-thumb-num">0{idx + 1}</span>
                      </div>
                      <div className="bar-thumb-info">
                        <span className="bar-thumb-name">{bar.name}</span>
                        <span className="bar-thumb-weight">{bar.weight}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bar-detail-callout">
                  <div className="callout-header">
                    <span className="callout-badge">Botanical Profile • {primaryActiveBar.name}</span>
                    <span className="callout-lather">🫧 {primaryActiveBar.lather}</span>
                  </div>
                  <div className="callout-scent">
                    <strong>Aroma Notes:</strong> {primaryActiveBar.aroma}
                  </div>
                  <div className="callout-benefit">
                    <strong>Skin Ritual:</strong> {primaryActiveBar.benefit}
                  </div>
                  <div className="callout-botanicals">
                    <strong>Key Actives:</strong> {primaryActiveBar.botanical}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details, Countdown, Promo, Actions */}
            <div className="collector-details-col">
              <div className="collector-prestige-row">
                <span className="collector-eyebrow-badge">
                  <Sparkles size={13} color="var(--color-terracotta)" />
                  Star Light Co. Annual Masterpiece 2026
                </span>
                <div className="collector-review-pill">
                  <div className="stars-mini">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#c9933b" stroke="#c9933b" />
                    ))}
                  </div>
                  <span>5.0 (94 Collector Reviews)</span>
                </div>
              </div>

              <h3 className="collector-card-title">
                Dragon&apos;s Glow 4-Piece Grand Collector Vault Box
              </h3>

              <p className="collector-description">
                Hand-poured in limited small batches and cured for eight full weeks. Each bar is infused with 
                ancient botanical resins and genuine 24k cosmetic gold flakes. Encased in a rigid gold-foiled 
                dragon keepsake box with a free hand-carved teak soap dish.
              </p>

              <div className="collector-price-banner">
                <div className="price-stack">
                  <span className="collector-price-now">₹{primaryOffer.salePrice.toLocaleString("en-IN")}</span>
                  <span className="collector-price-was">₹{primaryOffer.originalPrice.toLocaleString("en-IN")}</span>
                </div>
                <span className="collector-savings-badge">{primaryOffer.discountText}</span>
              </div>

              <div className="collector-value-breakdown">
                <span>Worth ₹{primaryOffer.originalPrice.toLocaleString("en-IN")} if bought individually • Only <strong>₹{Math.round(primaryOffer.salePrice / (primaryIncludedBars.length || 1))}</strong> per bar</span>
              </div>

              <div className="collector-countdown-wrapper">
                <div className="countdown-eyebrow">
                  <Sparkles size={13} color="var(--color-terracotta)" />
                  <span>Holiday Allocation Vault Closes In:</span>
                </div>
                <div className="collector-countdown-blocks">
                  <div className="time-block">
                    <span className="time-digits">{String(primaryTimeLeft.days).padStart(2, "0")}</span>
                    <span className="time-unit">Days</span>
                  </div>
                  <div className="time-sep">:</div>
                  <div className="time-block">
                    <span className="time-digits">{String(primaryTimeLeft.hours).padStart(2, "0")}</span>
                    <span className="time-unit">Hours</span>
                  </div>
                  <div className="time-sep">:</div>
                  <div className="time-block">
                    <span className="time-digits">{String(primaryTimeLeft.minutes).padStart(2, "0")}</span>
                    <span className="time-unit">Mins</span>
                  </div>
                  <div className="time-sep">:</div>
                  <div className="time-block pulse-sec">
                    <span className="time-digits">{String(primaryTimeLeft.seconds).padStart(2, "0")}</span>
                    <span className="time-unit">Secs</span>
                  </div>
                </div>
              </div>

              <div className="collector-promo-card">
                <div className="promo-info">
                  <span className="promo-badge">HOLIDAY SAVINGS CODE</span>
                  <div className="promo-headline">VOUCHER CODE: <strong>{primaryOffer.promoCode}</strong></div>
                  <div className="promo-sub">Use at checkout for an instant {primaryOffer.discountPercent}% storewide discount</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(primaryOffer.promoCode, primaryOffer.discountPercent)}
                  className="promo-copy-action-btn"
                >
                  {copiedCode === primaryOffer.promoCode ? (
                    <>
                      <Check size={14} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="collector-actions-bar">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(primarySoapObj, 1);
                    setAddedOffer(primaryOffer.id);
                    showToast(`"${primaryOffer.title}" added to your bag! 🎁`);
                    setTimeout(() => setAddedOffer(null), 1800);
                  }}
                  className={`btn-primary collector-add-btn ${addedOffer === primaryOffer.id ? "added" : ""}`}
                >
                  {addedOffer === primaryOffer.id ? (
                    <>
                      <Check size={18} /> Added to Your Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add Grand Vault Box • ₹{primaryOffer.salePrice.toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="card-whatsapp-btn"
                  onClick={() => openWhatsAppDirect(primarySoapObj)}
                  aria-label="Enquire on WhatsApp"
                  title="Enquire on WhatsApp"
                  style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)" }}
                >
                  <WhatsAppIcon size={24} />
                </button>
              </div>

              <div className="collector-perks-row">
                <span className="perk-item">
                  <Truck size={14} color="var(--color-terracotta)" /> Free Express Dispatch
                </span>
                <span className="perk-item">
                  <Gift size={14} color="var(--color-terracotta)" /> Free Wooden Teak Dish
                </span>
                <span className="perk-item">
                  <ShieldCheck size={14} color="var(--color-terracotta)" /> Gold Leaf Certificate
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            OFFER 02: SECONDARY ROYAL AYURVEDIC SAFFRON CURATION
           ───────────────────────────────────────────────────────────── */}
        {activeOfferIndex === 1 && (
          <div className="collector-box-card offers-active-stage" style={{ borderColor: "rgba(201, 147, 59, 0.28)" }}>
            {/* Left Column: Visual Showcase & Interactive Bar Explorer */}
            <div className="collector-media-col">
              <div className="collector-image-frame">
                <div className="collector-frame-badges">
                  <span className="collector-edition-pill" style={{ backgroundColor: "var(--color-dragon-black)", color: "#ffffff" }}>
                    <Sparkles size={12} color="var(--color-gold)" /> {secondaryOffer.badgeText}
                  </span>
                  <span className="collector-discount-pill" style={{ backgroundColor: "var(--color-gold)", color: "#ffffff" }}>
                    {secondaryOffer.discountText}
                  </span>
                </div>

                {/* Main Carousel Slider Arrows */}
                <button
                  type="button"
                  onClick={handlePrevSecondarySlide}
                  className="collector-slider-arrow prev"
                  aria-label="Previous item in curation"
                  title="Previous item"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={handleNextSecondarySlide}
                  className="collector-slider-arrow next"
                  aria-label="Next item in curation"
                  title="Next item"
                >
                  <ChevronRight size={22} />
                </button>

                <Image
                  key={secondarySelectedView === "box" ? secondaryOffer.mainImage : secondaryIncludedBars[secondarySelectedView]?.image}
                  src={secondarySelectedView === "box" ? secondaryOffer.mainImage : secondaryIncludedBars[secondarySelectedView]?.image}
                  alt={secondarySelectedView === "box" ? secondaryOffer.title : secondaryIncludedBars[secondarySelectedView]?.name}
                  width={720}
                  height={540}
                  priority
                  className="collector-box-img"
                />

                {/* Slider Dots Indicator */}
                <div className="collector-slider-dots">
                  {secondaryAllSlides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goToSecondarySlide(i)}
                      className={`slider-dot ${secondaryCurrentSlideIndex === i ? "active" : ""}`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>

                {/* View Indicator Overlay */}
                <div className="collector-image-caption-bar">
                  <span className="caption-text">
                    Viewing: <strong>{secondarySelectedView === "box" ? secondaryOffer.title : secondaryIncludedBars[secondarySelectedView]?.name}</strong>
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span className="collector-slide-counter">
                      {secondaryCurrentSlideIndex + 1} / {secondaryAllSlides.length}
                    </span>
                    {secondarySelectedView !== "box" && (
                      <button
                        type="button"
                        onClick={() => setSecondarySelectedView("box")}
                        className="caption-reset-btn"
                      >
                        <RefreshCw size={12} /> View Full Set
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Interactive Bar Selector with Fixed Plural CSS Class */}
              <div className="collector-bars-nav" style={{ borderColor: "rgba(201, 147, 59, 0.25)" }}>
                <div className="bars-nav-header">
                  <div>
                    <h4 className="bars-nav-title">Included Inside The Curation:</h4>
                    <p className="bars-nav-subtitle">Click any formula or use &larr; &rarr; arrows to browse</p>
                  </div>
                  <div className="bars-nav-controls">
                    <button
                      type="button"
                      onClick={handlePrevSecondarySlide}
                      className="bars-scroll-btn prev"
                      aria-label="Previous formula"
                      title="Previous formula"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextSecondarySlide}
                      className="bars-scroll-btn next"
                      aria-label="Next formula"
                      title="Next formula"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSecondarySelectedView("box")}
                      className={`box-overview-tab-btn ${secondarySelectedView === "box" ? "active" : ""}`}
                    >
                      <Eye size={13} /> Full Set Overview
                    </button>
                  </div>
                </div>

                <div className="bars-thumbnails-grid" style={{ gridTemplateColumns: `repeat(${Math.min(secondaryIncludedBars.length, 4)}, 1fr)` }}>
                  {secondaryIncludedBars.map((bar, idx) => (
                    <button
                      key={bar.id || idx}
                      type="button"
                      className={`bar-thumb-card ${secondarySelectedView === idx ? "active" : ""}`}
                      onClick={() => setSecondarySelectedView(idx)}
                      aria-label={`View ${bar.name}`}
                    >
                      <div className="bar-thumb-img-wrap">
                        <Image
                          src={bar.image}
                          alt={bar.name}
                          width={90}
                          height={90}
                          className="bar-thumb-img"
                        />
                        <span className="bar-thumb-num">0{idx + 1}</span>
                      </div>
                      <div className="bar-thumb-info">
                        <span className="bar-thumb-name">{bar.name}</span>
                        <span className="bar-thumb-weight">{bar.weight}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="bar-detail-callout" style={{ borderColor: "rgba(201, 147, 59, 0.2)" }}>
                  <div className="callout-header">
                    <span className="callout-badge" style={{ backgroundColor: "#fef3c7", color: "#b45309" }}>
                      Ayurvedic Profile • {secondaryActiveBar.name}
                    </span>
                    <span className="callout-lather">🫧 {secondaryActiveBar.lather}</span>
                  </div>
                  <div className="callout-scent">
                    <strong>Aroma Notes:</strong> {secondaryActiveBar.aroma}
                  </div>
                  <div className="callout-benefit">
                    <strong>Skin Ritual:</strong> {secondaryActiveBar.benefit}
                  </div>
                  <div className="callout-botanicals">
                    <strong>Sacred Ingredients:</strong> {secondaryActiveBar.botanical}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details, Countdown, Promo, Actions */}
            <div className="collector-details-col">
              <div className="collector-prestige-row">
                <span className="collector-eyebrow-badge" style={{ color: "var(--color-gold)", borderColor: "rgba(201, 147, 59, 0.3)" }}>
                  <Sparkles size={13} color="var(--color-gold)" />
                  {secondaryOffer.badgeText || "Artisan Heritage Collection"}
                </span>
                <div className="collector-review-pill">
                  <div className="stars-mini">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} fill="#c9933b" stroke="#c9933b" />
                    ))}
                  </div>
                  <span>5.0 (78 Heritage Reviews)</span>
                </div>
              </div>

              <h3 className="collector-card-title">
                {secondaryOffer.title}
              </h3>

              <p className="collector-description">
                {secondaryOffer.description}
              </p>

              <div className="collector-price-banner">
                <div className="price-stack">
                  <span className="collector-price-now">₹{secondaryOffer.salePrice.toLocaleString("en-IN")}</span>
                  <span className="collector-price-was">₹{secondaryOffer.originalPrice.toLocaleString("en-IN")}</span>
                </div>
                <span className="collector-savings-badge" style={{ backgroundColor: "var(--color-gold)", borderColor: "var(--color-gold)" }}>
                  {secondaryOffer.discountText}
                </span>
              </div>

              <div className="collector-value-breakdown">
                <span>Worth ₹{secondaryOffer.originalPrice.toLocaleString("en-IN")} individually • Hand-aged 8 full weeks</span>
              </div>

              <div className="collector-countdown-wrapper">
                <div className="countdown-eyebrow">
                  <Sparkles size={13} color="var(--color-gold)" />
                  <span>Heritage Allocation Window Closes In:</span>
                </div>
                <div className="collector-countdown-blocks">
                  <div className="time-block">
                    <span className="time-digits">{String(secondaryTimeLeft.days).padStart(2, "0")}</span>
                    <span className="time-unit">Days</span>
                  </div>
                  <div className="time-sep">:</div>
                  <div className="time-block">
                    <span className="time-digits">{String(secondaryTimeLeft.hours).padStart(2, "0")}</span>
                    <span className="time-unit">Hours</span>
                  </div>
                  <div className="time-sep">:</div>
                  <div className="time-block">
                    <span className="time-digits">{String(secondaryTimeLeft.minutes).padStart(2, "0")}</span>
                    <span className="time-unit">Mins</span>
                  </div>
                  <div className="time-sep">:</div>
                  <div className="time-block pulse-sec">
                    <span className="time-digits">{String(secondaryTimeLeft.seconds).padStart(2, "0")}</span>
                    <span className="time-unit">Secs</span>
                  </div>
                </div>
              </div>

              <div className="collector-promo-card" style={{ borderColor: "rgba(201, 147, 59, 0.3)" }}>
                <div className="promo-info">
                  <span className="promo-badge" style={{ backgroundColor: "#fef3c7", color: "#b45309" }}>HERITAGE SAVINGS CODE</span>
                  <div className="promo-headline">VOUCHER CODE: <strong>{secondaryOffer.promoCode}</strong></div>
                  <div className="promo-sub">Use at checkout for an instant {secondaryOffer.discountPercent}% storewide discount</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(secondaryOffer.promoCode, secondaryOffer.discountPercent)}
                  className="promo-copy-action-btn"
                  style={{ backgroundColor: "var(--color-gold)" }}
                >
                  {copiedCode === secondaryOffer.promoCode ? (
                    <>
                      <Check size={14} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="collector-actions-bar">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(secondarySoapObj, 1);
                    setAddedOffer(secondaryOffer.id);
                    showToast(`"${secondaryOffer.title}" added to your bag! 🎁`);
                    setTimeout(() => setAddedOffer(null), 1800);
                  }}
                  className={`btn-primary collector-add-btn ${addedOffer === secondaryOffer.id ? "added" : ""}`}
                  style={{
                    backgroundColor: addedOffer === secondaryOffer.id ? "#1b7a43" : "var(--color-dragon-black)",
                    borderColor: "var(--color-gold)",
                  }}
                >
                  {addedOffer === secondaryOffer.id ? (
                    <>
                      <Check size={18} /> Added to Your Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add Heritage Curation • ₹{secondaryOffer.salePrice.toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="card-whatsapp-btn"
                  onClick={() => openWhatsAppDirect(secondarySoapObj)}
                  aria-label="Enquire on WhatsApp"
                  title="Enquire on WhatsApp"
                  style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)" }}
                >
                  <WhatsAppIcon size={24} />
                </button>
              </div>

              <div className="collector-perks-row">
                <span className="perk-item">
                  <Truck size={14} color="var(--color-gold)" /> Free Express Dispatch
                </span>
                <span className="perk-item">
                  <Gift size={14} color="var(--color-gold)" /> Kashmiri Saffron Certificate
                </span>
                <span className="perk-item">
                  <ShieldCheck size={14} color="var(--color-gold)" /> 100% Ayurvedic Purity
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
