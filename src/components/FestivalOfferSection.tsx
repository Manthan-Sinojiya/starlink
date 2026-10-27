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
  Plus,
  Minus,
} from "lucide-react";
import { FESTIVAL_PROMO, Soap } from "@/data/soaps";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";
import { useCart } from "@/context/CartContext";
import { useDBStore } from "@/context/DBStoreContext";
import { openWhatsAppDirect } from "@/utils/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function FestivalOfferSection() {
  const { cart, addToCart, updateQuantity, showToast } = useCart();
  const { primaryOffer, secondaryOffer } = useDBStore();

  const isPrimaryActive = Boolean(primaryOffer?.isActive);
  const isSecondaryActive = Boolean(secondaryOffer?.isActive);

  // Active top-level offer tab: 0 = Primary (Festival Vault), 1 = Secondary (Ayurvedic Saffron)
  const [activeOfferIndex, setActiveOfferIndex] = useState<0 | 1>(() => {
    if (!isPrimaryActive && isSecondaryActive) return 1;
    return 0;
  });

  // Keep activeOfferIndex synchronized if an offer is deactivated/activated by admin
  useEffect(() => {
    if (!isPrimaryActive && isSecondaryActive) {
      setActiveOfferIndex(1);
    } else if (isPrimaryActive && !isSecondaryActive) {
      setActiveOfferIndex(0);
    }
  }, [isPrimaryActive, isSecondaryActive]);

  // Per-offer internal carousel states
  const [primarySelectedView, setPrimarySelectedView] = useState<"box" | number>("box");
  const [secondarySelectedView, setSecondarySelectedView] = useState<"box" | number>("box");

  // Quantity to add
  const [primaryQty, setPrimaryQty] = useState(1);
  const [secondaryQty, setSecondaryQty] = useState(1);

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [addedOffer, setAddedOffer] = useState<string | null>(null);
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isSectionHovered, setIsSectionHovered] = useState(false);

  // Auto-switch between Offer 01 and Offer 02 automatically every 7 seconds (only if BOTH are active)
  useEffect(() => {
    if (isSectionHovered) return;
    if (!isPrimaryActive || !isSecondaryActive) return;

    const timer = setInterval(() => {
      setActiveOfferIndex((prev) => (prev === 0 ? 1 : 0));
    }, 7000);

    return () => clearInterval(timer);
  }, [isSectionHovered, isPrimaryActive, isSecondaryActive]);

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

  // If both offers are deactivated by admin, hide this section completely from the homepage
  if (!isPrimaryActive && !isSecondaryActive) return null;

  // Resolved active offer index (forces active offer if one is deactivated)
  const currentOfferIndex: 0 | 1 = !isPrimaryActive && isSecondaryActive
    ? 1
    : isPrimaryActive && !isSecondaryActive
    ? 0
    : activeOfferIndex;

  const showBothOffers = isPrimaryActive && isSecondaryActive;

  // Single-product vs multi-item bundle check
  const isPrimarySingleProduct = !primaryOffer?.bars || primaryOffer.bars.length <= 1;
  const isSecondarySingleProduct = !secondaryOffer?.bars || secondaryOffer.bars.length <= 1;

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

  // Auto changes slides for The Grand Festival Gift Collection every 3.5 seconds
  useEffect(() => {
    if (activeOfferIndex !== 0 || isPrimaryHovered || isPrimarySingleProduct) return;
    const interval = setInterval(() => {
      setPrimarySelectedView((current) => {
        const total = primaryAllSlides.length;
        const curIdx = current === "box" ? 0 : typeof current === "number" ? current + 1 : 0;
        const nextIdx = (curIdx + 1) % total;
        return nextIdx === 0 ? "box" : nextIdx - 1;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [activeOfferIndex, isPrimaryHovered, isPrimarySingleProduct, primaryAllSlides.length]);


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
    id: primaryOffer.productId || primaryOffer.id,
    name: primaryOffer.title,
    tagline: primaryOffer.subtitle,
    mainCategory: "Festive & Luxury Gift Sets",
    subCategory: "Collector Box Set",
    category: "festive",
    price: primaryOffer.salePrice,
    originalPrice: primaryOffer.originalPrice,
    rating: 5.0,
    reviewsCount: 94,
    weight: isPrimarySingleProduct ? (primaryIncludedBars[0]?.weight || "Single Artisanal Bar") : `${primaryIncludedBars.length}-Bar Keepsake Set`,
    taxType: "inclusive",
    taxRate: 18,
    cureTime: "Limited Holiday Batch",
    fragranceNotes: primaryIncludedBars[0]?.aroma ? [primaryIncludedBars[0].aroma] : ["Botanical resins", "Gold flakes"],
    keyIngredients: primaryIncludedBars[0]?.botanical ? [primaryIncludedBars[0].botanical] : ["24k Cosmetic Gold", "Botanical Resins"],
    fullIngredients: ["Saponified Olive Oil, Shea Butter, Plant Oils, 24k Cosmetic Gold Leaf"],
    skinType: "All Skin Types • Luxury Gifting",
    soapBenefits: primaryIncludedBars[0]?.benefit ? [primaryIncludedBars[0].benefit] : ["Handcrafted cold-process soap formulated with rare natural actives"],
    ritualHowToUse: "Work into a rich lather between wet hands, gently massage onto skin, and rinse thoroughly.",
    description: primaryOffer.description,
    image: primaryOffer.mainImage || primaryIncludedBars[0]?.image || CLOUDINARY_IMAGES.dragonsBlood,
    inStock: true,
    isFestive: true,
  }), [primaryOffer, isPrimarySingleProduct, primaryIncludedBars]);

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
    id: secondaryOffer.productId || secondaryOffer.id,
    name: secondaryOffer.title,
    tagline: secondaryOffer.subtitle,
    mainCategory: "Specialty Curations",
    subCategory: "Ayurvedic Heritage Set",
    category: "festive",
    price: secondaryOffer.salePrice,
    originalPrice: secondaryOffer.originalPrice,
    rating: 5.0,
    reviewsCount: 78,
    weight: isSecondarySingleProduct ? (secondaryIncludedBars[0]?.weight || "Single Artisanal Bar") : `${secondaryIncludedBars.length}-Bar Heritage Curation`,
    taxType: "inclusive",
    taxRate: 18,
    cureTime: "Aged 8 Weeks",
    fragranceNotes: secondaryIncludedBars[0]?.aroma ? [secondaryIncludedBars[0].aroma] : ["Mongra Saffron", "Forest Honey", "Khus Vetiver"],
    keyIngredients: secondaryIncludedBars[0]?.botanical ? [secondaryIncludedBars[0].botanical] : ["Kashmiri Saffron", "Farm Goat Milk", "Raw Honey"],
    fullIngredients: ["Saponified Cold Pressed Oils, Farm Milk, Kashmiri Saffron, Raw Forest Honey"],
    skinType: "All Skin Types • Nourishing Ayurvedic",
    soapBenefits: secondaryIncludedBars[0]?.benefit ? [secondaryIncludedBars[0].benefit] : ["Imparts healthy radiant glow", "Deeply restores moisture barrier"],
    ritualHowToUse: "Work into a dense velvety froth between warm palms, apply in gentle circular motions, rinse thoroughly.",
    description: secondaryOffer.description,
    image: secondaryOffer.mainImage || secondaryIncludedBars[0]?.image || CLOUDINARY_IMAGES.saffronHoney,
    inStock: true,
    isFestive: true,
  }), [secondaryOffer, isSecondarySingleProduct, secondaryIncludedBars]);

  // Find existing items in cart to allow multiple additions / quantity sync
  const primaryCartItem = cart.find(
    (item) => item.soap.id === (primaryOffer.productId || primaryOffer.id)
  );
  const secondaryCartItem = cart.find(
    (item) => item.soap.id === (secondaryOffer.productId || secondaryOffer.id)
  );

  const handleCopyCode = (code: string, discount: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Promo code "${code}" copied! ${discount}% Off ✨`);
    setTimeout(() => setCopiedCode(null), 2400);
  };

  const handleToggleOffer = (dir: "prev" | "next") => {
    if (!showBothOffers) return;
    setActiveOfferIndex((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <section
      id="festival-offers"
      className="festival-collector-showcase"
      aria-label="Exclusive Holiday Gift Offers"
      onMouseEnter={() => setIsSectionHovered(true)}
      onMouseLeave={() => setIsSectionHovered(false)}
    >
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: "1.5rem" }}>
          <span className="section-tag festive-tag">
            <Gift size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
            {currentOfferIndex === 0
              ? (primaryOffer.sectionTag || "2026 LIMITED HOLIDAY COLLECTOR OFFERS")
              : (secondaryOffer.sectionTag || "ARTISANAL ROYAL RESERVE")}
          </span>
          <h2 className="section-title">
            {currentOfferIndex === 0 ? primaryOffer.title : secondaryOffer.title}
          </h2>
          <p className="section-subtitle">
            {currentOfferIndex === 0 ? primaryOffer.subtitle : secondaryOffer.subtitle}
          </p>
        </div>

        {/* Unified Slider Navigation Header (Only shown when BOTH offers are active) */}
        {showBothOffers && (
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
                className={`offer-tab-pill ${currentOfferIndex === 0 ? "active" : ""}`}
                aria-label={`View ${primaryOffer.title}`}
              >
                <span>🎁 Offer 01: {primaryOffer.title}</span>
                <span className="offer-tab-badge">{primaryOffer.discountText}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveOfferIndex(1)}
                className={`offer-tab-pill gold ${currentOfferIndex === 1 ? "active" : ""}`}
                aria-label={`View ${secondaryOffer.title}`}
              >
                <span>✨ Offer 02: {secondaryOffer.title}</span>
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
        )}

        {/* ─────────────────────────────────────────────────────────────
            OFFER 01: PRIMARY FESTIVAL COLLECTOR VAULT BOX
           ───────────────────────────────────────────────────────────── */}
        {currentOfferIndex === 0 && isPrimaryActive && (
          <div className="collector-box-card offers-active-stage">
            {/* Left Column: Visual Showcase */}
            <div
              className="collector-media-col"
              onMouseEnter={() => setIsPrimaryHovered(true)}
              onMouseLeave={() => setIsPrimaryHovered(false)}
            >
              <div className="collector-image-frame" style={isPrimarySingleProduct ? { borderRadius: "16px", overflow: "hidden" } : undefined}>
                <div className="collector-frame-badges">
                  <span className="collector-edition-pill">
                    <Sparkles size={12} /> {primaryOffer.badgeText}
                  </span>
                  <span className="collector-discount-pill">
                    {primaryOffer.discountText}
                  </span>
                </div>

                {!isPrimarySingleProduct && (
                  <>
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
                  </>
                )}

                <Image
                  key={isPrimarySingleProduct ? primaryOffer.mainImage : (primarySelectedView === "box" ? primaryOffer.mainImage : primaryIncludedBars[primarySelectedView]?.image)}
                  src={isPrimarySingleProduct ? primaryOffer.mainImage : (primarySelectedView === "box" ? primaryOffer.mainImage : primaryIncludedBars[primarySelectedView]?.image)}
                  alt={isPrimarySingleProduct ? primaryOffer.title : (primarySelectedView === "box" ? primaryOffer.title : primaryIncludedBars[primarySelectedView]?.name)}
                  width={720}
                  height={540}
                  priority
                  className="collector-box-img"
                  style={isPrimarySingleProduct ? { width: "100%", height: "auto", maxHeight: "480px", objectFit: "cover" } : undefined}
                />

                {!isPrimarySingleProduct && (
                  <>
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
                  </>
                )}
              </div>

              {/* Included Bars Interactive Navigation - Hidden when single product is selected */}
              {!isPrimarySingleProduct && (
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
              )}

              {primaryIncludedBars.length === 1 && (
                <div className="bar-detail-callout" style={{ marginTop: "1rem" }}>
                  <div className="callout-header">
                    <span className="callout-badge">Botanical Profile • {primaryIncludedBars[0].name}</span>
                    {primaryIncludedBars[0].lather && <span className="callout-lather">🫧 {primaryIncludedBars[0].lather}</span>}
                  </div>
                  {primaryIncludedBars[0].aroma && (
                    <div className="callout-scent">
                      <strong>Aroma Notes:</strong> {primaryIncludedBars[0].aroma}
                    </div>
                  )}
                  {primaryIncludedBars[0].benefit && (
                    <div className="callout-benefit">
                      <strong>Skin Ritual:</strong> {primaryIncludedBars[0].benefit}
                    </div>
                  )}
                  {primaryIncludedBars[0].botanical && (
                    <div className="callout-botanicals">
                      <strong>Key Actives:</strong> {primaryIncludedBars[0].botanical}
                    </div>
                  )}
                </div>
              )}
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
                {primaryOffer.title}
              </h3>

              <p className="collector-description">
                {primaryOffer.description || "Handcrafted in limited small batches and cured for eight full weeks. Infused with ancient botanical extracts and skin-replenishing plant oils."}
              </p>

              <div className="collector-price-banner">
                <div className="price-stack">
                  <span className="collector-price-now">₹{primaryOffer.salePrice.toLocaleString("en-IN")}</span>
                  <span className="collector-price-was">₹{primaryOffer.originalPrice.toLocaleString("en-IN")}</span>
                </div>
                <span className="collector-savings-badge">{primaryOffer.discountText}</span>
              </div>

              <div className="collector-value-breakdown">
                <span>
                  {isPrimarySingleProduct
                    ? `Worth ₹${primaryOffer.originalPrice.toLocaleString("en-IN")} • Special Limited Offer Discount`
                    : `Worth ₹${primaryOffer.originalPrice.toLocaleString("en-IN")} if bought individually • Only ₹${Math.round(primaryOffer.salePrice / (primaryIncludedBars.length || 1))} per bar`}
                </span>
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
                  <div className="promo-sub">Use at checkout for an instant {primaryOffer.discountPercent}% discount on this offer</div>
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

              {primaryCartItem && (
                <div className="collector-in-cart-badge">
                  <Check size={13} /> In Your Bag: {primaryCartItem.quantity} {primaryCartItem.quantity === 1 ? "unit" : "units"}
                </div>
              )}

              <div className="collector-actions-bar">
                {/* Quantity Stepper to add more than one */}
                <div className="collector-qty-stepper" title="Select quantity">
                  <button
                    type="button"
                    onClick={() => setPrimaryQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="qty-btn"
                    disabled={primaryQty <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-val">{primaryQty}</span>
                  <button
                    type="button"
                    onClick={() => setPrimaryQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="qty-btn"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(primarySoapObj, primaryQty);
                    setAddedOffer(primaryOffer.id);
                    showToast(
                      primaryCartItem
                        ? `Added ${primaryQty} more "${primaryOffer.title}" to bag! (Total: ${primaryCartItem.quantity + primaryQty}) 🎁`
                        : `Added ${primaryQty}x "${primaryOffer.title}" to bag! 🎁`
                    );
                    setTimeout(() => setAddedOffer(null), 1800);
                  }}
                  className={`btn-primary collector-add-btn ${addedOffer === primaryOffer.id ? "added" : ""}`}
                >
                  {addedOffer === primaryOffer.id ? (
                    <>
                      <Check size={18} /> Added {primaryQty} to Bag!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> {primaryCartItem ? `Add More (${primaryQty})` : `Add ${primaryQty > 1 ? `${primaryQty}x ` : ""}to Bag`} • ₹{(primaryOffer.salePrice * primaryQty).toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="card-whatsapp-btn"
                  onClick={() => openWhatsAppDirect(primarySoapObj)}
                  aria-label="Enquire on WhatsApp"
                  title="Enquire on WhatsApp"
                  style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)", flexShrink: 0 }}
                >
                  <WhatsAppIcon size={24} />
                </button>
              </div>

              {/* Luxury Trust Badges Ribbon */}
              <div className="collector-perks-row terracotta-theme">
                <div className="perk-item">
                  <div className="perk-item-icon-box">
                    <Truck size={14} color="var(--color-terracotta)" />
                  </div>
                  <span>Free Express Dispatch</span>
                </div>
                <div className="perk-item-divider" />
                <div className="perk-item">
                  <div className="perk-item-icon-box">
                    <Gift size={14} color="var(--color-terracotta)" />
                  </div>
                  <span>Free Teak Dish & Box</span>
                </div>
                <div className="perk-item-divider" />
                <div className="perk-item">
                  <div className="perk-item-icon-box">
                    <ShieldCheck size={14} color="var(--color-terracotta)" />
                  </div>
                  <span>100% Cold-Process Purity</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            OFFER 02: SECONDARY ROYAL AYURVEDIC SAFFRON CURATION
           ───────────────────────────────────────────────────────────── */}
        {currentOfferIndex === 1 && isSecondaryActive && (
          <div className="collector-box-card offers-active-stage" style={{ borderColor: "rgba(201, 147, 59, 0.32)" }}>
            {/* Left Column: Visual Showcase */}
            <div className="collector-media-col">
              <div className="collector-image-frame" style={isSecondarySingleProduct ? { borderRadius: "16px", overflow: "hidden" } : undefined}>
                <div className="collector-frame-badges">
                  <span className="collector-edition-pill" style={{ backgroundColor: "var(--color-dragon-black)", color: "#ffffff" }}>
                    <Sparkles size={12} color="var(--color-gold)" /> {secondaryOffer.badgeText}
                  </span>
                  <span className="collector-discount-pill" style={{ backgroundColor: "var(--color-gold)", color: "#ffffff" }}>
                    {secondaryOffer.discountText}
                  </span>
                </div>

                {!isSecondarySingleProduct && (
                  <>
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
                  </>
                )}

                <Image
                  key={isSecondarySingleProduct ? secondaryOffer.mainImage : (secondarySelectedView === "box" ? secondaryOffer.mainImage : secondaryIncludedBars[secondarySelectedView]?.image)}
                  src={isSecondarySingleProduct ? secondaryOffer.mainImage : (secondarySelectedView === "box" ? secondaryOffer.mainImage : secondaryIncludedBars[secondarySelectedView]?.image)}
                  alt={isSecondarySingleProduct ? secondaryOffer.title : (secondarySelectedView === "box" ? secondaryOffer.title : secondaryIncludedBars[secondarySelectedView]?.name)}
                  width={720}
                  height={540}
                  priority
                  className="collector-box-img"
                  style={isSecondarySingleProduct ? { width: "100%", height: "auto", maxHeight: "480px", objectFit: "cover" } : undefined}
                />

                {!isSecondarySingleProduct && (
                  <>
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
                  </>
                )}
              </div>

              {/* Interactive Bar Selector - Hidden when single product is selected */}
              {!isSecondarySingleProduct && (
                <div className="collector-bars-nav" style={{ borderColor: "rgba(201, 147, 59, 0.28)", background: "rgba(253, 246, 242, 0.6)" }}>
                  <div className="bars-nav-header">
                    <div>
                      <h4 className="bars-nav-title" style={{ color: "#78350f" }}>Included Inside The Curation:</h4>
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
                        style={{ borderColor: "rgba(201, 147, 59, 0.4)" }}
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
                        style={{ borderColor: secondarySelectedView === idx ? "var(--color-gold)" : "rgba(201, 147, 59, 0.22)" }}
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
                          <span className="bar-thumb-num" style={{ background: "var(--color-gold)", color: "#ffffff" }}>0{idx + 1}</span>
                        </div>
                        <div className="bar-thumb-info">
                          <span className="bar-thumb-name">{bar.name}</span>
                          <span className="bar-thumb-weight" style={{ color: "var(--color-gold-dark)" }}>{bar.weight}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div
                    className="bar-detail-callout"
                    style={{
                      background: "linear-gradient(135deg, rgba(254, 250, 240, 0.95) 0%, rgba(253, 246, 242, 0.95) 100%)",
                      border: "1px solid rgba(201, 147, 59, 0.35)",
                      borderLeft: "4px solid var(--color-gold)",
                      borderRadius: "10px",
                      padding: "0.9rem 1.1rem",
                      boxShadow: "0 4px 16px rgba(180, 83, 9, 0.05)",
                    }}
                  >
                    <div className="callout-header" style={{ marginBottom: "0.4rem" }}>
                      <span
                        className="callout-badge"
                        style={{
                          backgroundColor: "rgba(201, 147, 59, 0.14)",
                          color: "#8a5814",
                          border: "1px solid rgba(201, 147, 59, 0.3)",
                          padding: "3px 10px",
                          borderRadius: "20px",
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          letterSpacing: "0.03em",
                        }}
                      >
                        ✨ Ayurvedic Formulation • {secondaryActiveBar.name}
                      </span>
                      <span className="callout-lather" style={{ color: "var(--color-gold-dark)", fontWeight: 700 }}>
                        🫧 {secondaryActiveBar.lather}
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", fontSize: "0.78rem" }}>
                      <div className="callout-scent">
                        <strong>Aroma:</strong> {secondaryActiveBar.aroma}
                      </div>
                      <div className="callout-benefit">
                        <strong>Ritual:</strong> {secondaryActiveBar.benefit}
                      </div>
                    </div>
                    <div className="callout-botanicals" style={{ marginTop: "4px", fontSize: "0.78rem" }}>
                      <strong>Sacred Botanicals:</strong> {secondaryActiveBar.botanical}
                    </div>
                  </div>
                </div>
              )}

              {secondaryIncludedBars.length === 1 && (
                <div
                  className="bar-detail-callout"
                  style={{
                    marginTop: "1rem",
                    background: "linear-gradient(135deg, rgba(254, 250, 240, 0.95) 0%, rgba(253, 246, 242, 0.95) 100%)",
                    border: "1px solid rgba(201, 147, 59, 0.35)",
                    borderLeft: "4px solid var(--color-gold)",
                    borderRadius: "10px",
                    padding: "0.9rem 1.1rem",
                    boxShadow: "0 4px 16px rgba(180, 83, 9, 0.05)",
                  }}
                >
                  <div className="callout-header" style={{ marginBottom: "0.4rem" }}>
                    <span
                      className="callout-badge"
                      style={{
                        backgroundColor: "rgba(201, 147, 59, 0.14)",
                        color: "#8a5814",
                        border: "1px solid rgba(201, 147, 59, 0.3)",
                        padding: "3px 10px",
                        borderRadius: "20px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                      }}
                    >
                      ✨ Ayurvedic Formulation • {secondaryIncludedBars[0].name}
                    </span>
                    {secondaryIncludedBars[0].lather && (
                      <span className="callout-lather" style={{ color: "var(--color-gold-dark)", fontWeight: 700 }}>
                        🫧 {secondaryIncludedBars[0].lather}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem", fontSize: "0.78rem" }}>
                    {secondaryIncludedBars[0].aroma && (
                      <div className="callout-scent">
                        <strong>Aroma:</strong> {secondaryIncludedBars[0].aroma}
                      </div>
                    )}
                    {secondaryIncludedBars[0].benefit && (
                      <div className="callout-benefit">
                        <strong>Ritual:</strong> {secondaryIncludedBars[0].benefit}
                      </div>
                    )}
                  </div>
                  {secondaryIncludedBars[0].botanical && (
                    <div className="callout-botanicals" style={{ marginTop: "4px", fontSize: "0.78rem" }}>
                      <strong>Sacred Botanicals:</strong> {secondaryIncludedBars[0].botanical}
                    </div>
                  )}
                </div>
              )}
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
                {secondaryOffer.description || "Authentic Ayurvedic cold-process soap handcrafted with raw goat milk, saffron stigmas, and cold-pressed botanical infusions."}
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
                <span>
                  {isSecondarySingleProduct
                    ? `Worth ₹${secondaryOffer.originalPrice.toLocaleString("en-IN")} • Special Limited Offer Discount`
                    : `Worth ₹${secondaryOffer.originalPrice.toLocaleString("en-IN")} individually • Hand-aged 8 full weeks`}
                </span>
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
                  <span className="promo-badge" style={{ backgroundColor: "rgba(201, 147, 59, 0.15)", color: "#8a5814", border: "1px solid rgba(201, 147, 59, 0.3)" }}>
                    HERITAGE SAVINGS CODE
                  </span>
                  <div className="promo-headline">VOUCHER CODE: <strong>{secondaryOffer.promoCode}</strong></div>
                  <div className="promo-sub">Use at checkout for an instant {secondaryOffer.discountPercent}% discount on this offer</div>
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

              {secondaryCartItem && (
                <div className="collector-in-cart-badge" style={{ color: "#8a5814", background: "rgba(201, 147, 59, 0.12)", borderColor: "rgba(201, 147, 59, 0.3)" }}>
                  <Check size={13} /> In Your Bag: {secondaryCartItem.quantity} {secondaryCartItem.quantity === 1 ? "unit" : "units"}
                </div>
              )}

              <div className="collector-actions-bar">
                {/* Quantity Stepper to add more than one */}
                <div className="collector-qty-stepper" title="Select quantity">
                  <button
                    type="button"
                    onClick={() => setSecondaryQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="qty-btn"
                    disabled={secondaryQty <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-val">{secondaryQty}</span>
                  <button
                    type="button"
                    onClick={() => setSecondaryQty((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="qty-btn"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToCart(secondarySoapObj, secondaryQty);
                    setAddedOffer(secondaryOffer.id);
                    showToast(
                      secondaryCartItem
                        ? `Added ${secondaryQty} more "${secondaryOffer.title}" to bag! (Total: ${secondaryCartItem.quantity + secondaryQty}) ✨`
                        : `Added ${secondaryQty}x "${secondaryOffer.title}" to bag! ✨`
                    );
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
                      <Check size={18} /> Added {secondaryQty} to Bag!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> {secondaryCartItem ? `Add More (${secondaryQty})` : `Add ${secondaryQty > 1 ? `${secondaryQty}x ` : ""}to Bag`} • ₹{(secondaryOffer.salePrice * secondaryQty).toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="card-whatsapp-btn"
                  onClick={() => openWhatsAppDirect(secondarySoapObj)}
                  aria-label="Enquire on WhatsApp"
                  title="Enquire on WhatsApp"
                  style={{ width: "48px", height: "48px", borderRadius: "var(--radius-full)", flexShrink: 0 }}
                >
                  <WhatsAppIcon size={24} />
                </button>
              </div>

              {/* Luxury Trust Perks Ribbon */}
              <div className="collector-perks-row">
                <div className="perk-item">
                  <div className="perk-item-icon-box">
                    <Truck size={14} color="var(--color-gold)" />
                  </div>
                  <span>Free Express Dispatch</span>
                </div>
                <div className="perk-item-divider" />
                <div className="perk-item">
                  <div className="perk-item-icon-box">
                    <Gift size={14} color="var(--color-gold)" />
                  </div>
                  <span>Kashmiri Saffron Certificate</span>
                </div>
                <div className="perk-item-divider" />
                <div className="perk-item">
                  <div className="perk-item-icon-box">
                    <ShieldCheck size={14} color="var(--color-gold)" />
                  </div>
                  <span>100% Ayurvedic Purity</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
