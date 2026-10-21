"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Copy,
  Check,
  Gift,
  ShoppingBag,
  Star,
  RefreshCw,
  MessageCircle,
  Truck,
  ShieldCheck,
  ArrowRight,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Soap } from "@/data/soaps";
import { useCart } from "@/context/CartContext";
import { useDBStore } from "@/context/DBStoreContext";
import { openWhatsAppDirect } from "@/utils/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function SecondaryOfferSection() {
  const { addToCart, showToast } = useCart();
  const { secondaryOffer } = useDBStore();
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedView, setSelectedView] = useState<"box" | number>("box");

  // Timer
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 14,
    minutes: 36,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!secondaryOffer || !secondaryOffer.isActive) return null;

  const includedBars = secondaryOffer.bars || [];

  const allSlides = [
    {
      type: "box" as const,
      name: secondaryOffer.title,
      image: secondaryOffer.mainImage,
      label: "Full Curation Set",
    },
    ...includedBars.map((bar, idx) => ({
      type: idx,
      name: bar.name,
      image: bar.image,
      label: `Bar 0${idx + 1}: ${bar.name}`,
    })),
  ];

  const currentSlideIndex = selectedView === "box" ? 0 : (typeof selectedView === "number" ? selectedView + 1 : 0);

  const goToSlide = (index: number) => {
    if (index === 0) {
      setSelectedView("box");
    } else {
      setSelectedView(index - 1);
    }
  };

  const handlePrevSlide = () => {
    const newIdx = (currentSlideIndex - 1 + allSlides.length) % allSlides.length;
    goToSlide(newIdx);
  };

  const handleNextSlide = () => {
    const newIdx = (currentSlideIndex + 1) % allSlides.length;
    goToSlide(newIdx);
  };
  const activeBar =
    typeof selectedView === "number" && includedBars[selectedView]
      ? includedBars[selectedView]
      : includedBars[0] || {
          name: "Heritage Bar",
          lather: "Rich velvet foam",
          aroma: "Kashmiri saffron & goat milk",
          benefit: "Imparts golden radiance",
          botanical: "Grade A Saffron",
          image: secondaryOffer.mainImage,
        };

  const customSoap: Soap = {
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
  };

  const handleCopyCode = () => {
    const code = secondaryOffer.promoCode || "AYUR20";
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast(`Promo code "${code}" copied! ${secondaryOffer.discountPercent}% Off ✨`);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleAddCollectorBox = () => {
    addToCart(customSoap, 1);
    setAdded(true);
    showToast(`"${secondaryOffer.title}" added to your bag! 🎁`);
    setTimeout(() => setAdded(false), 1800);
  };

  const displayImage = selectedView === "box" ? secondaryOffer.mainImage : includedBars[selectedView]?.image || secondaryOffer.mainImage;
  const displayTitle = selectedView === "box" ? secondaryOffer.title : includedBars[selectedView]?.name || secondaryOffer.title;

  return (
    <section id="seasonal-curations" className="festival-collector-showcase" style={{ backgroundColor: "rgba(201, 147, 59, 0.04)", borderTop: "1px solid var(--color-border)" }} aria-label="Royal Ayurvedic Wellness Curation">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: "2rem" }}>
          <span className="section-tag festive-tag" style={{ backgroundColor: "var(--color-gold-light)", color: "var(--color-gold)", borderColor: "var(--color-gold-border)" }}>
            <Gift size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
            {secondaryOffer.sectionTag}
          </span>
          <h2 className="section-title">{secondaryOffer.title}</h2>
          <p className="section-subtitle">{secondaryOffer.subtitle}</p>
        </div>

        {/* The Collector Box Feature Card */}
        <div className="collector-box-card" style={{ borderColor: "rgba(201, 147, 59, 0.28)" }}>
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

              {/* Left / Right Carousel Slider Arrows */}
              <button
                type="button"
                onClick={handlePrevSlide}
                className="collector-slider-arrow prev"
                aria-label="Previous item in curation"
                title="Previous item"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={handleNextSlide}
                className="collector-slider-arrow next"
                aria-label="Next item in curation"
                title="Next item"
              >
                <ChevronRight size={22} />
              </button>

              <Image
                key={displayImage}
                src={displayImage}
                alt={displayTitle}
                width={720}
                height={540}
                priority
                className="collector-box-img"
              />

              {/* Slider Dots Indicator */}
              <div className="collector-slider-dots">
                {allSlides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToSlide(i)}
                    className={`slider-dot ${currentSlideIndex === i ? "active" : ""}`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="collector-image-caption-bar">
                <span className="caption-text">
                  Viewing: <strong>{displayTitle}</strong>
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className="collector-slide-counter">
                    {currentSlideIndex + 1} / {allSlides.length}
                  </span>
                  {selectedView !== "box" && (
                    <button
                      type="button"
                      onClick={() => setSelectedView("box")}
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
                    onClick={handlePrevSlide}
                    className="bars-scroll-btn prev"
                    aria-label="Previous formula"
                    title="Previous formula"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    className="bars-scroll-btn next"
                    aria-label="Next formula"
                    title="Next formula"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedView("box")}
                    className={`box-overview-tab-btn ${selectedView === "box" ? "active" : ""}`}
                  >
                    <Eye size={13} /> Full Set Overview
                  </button>
                </div>
              </div>

              {/* 3 Interactive Soap Cards */}
              <div className="bars-thumbnails-grid" style={{ gridTemplateColumns: `repeat(${Math.min(includedBars.length, 4)}, 1fr)` }}>
                {includedBars.map((bar, idx) => (
                  <button
                    key={bar.id || idx}
                    type="button"
                    className={`bar-thumb-card ${selectedView === idx ? "active" : ""}`}
                    onClick={() => setSelectedView(idx)}
                    aria-label={`View ${bar.name}`}
                  >
                    <div className="bar-thumb-img-wrap">
                      <Image
                        src={bar.image}
                        alt={bar.name}
                        width={90}
                        height={90}
                        className="bar-thumb-img"
                        style={{ objectFit: "cover" }}
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

              {/* Botanical Profile Spotlight */}
              <div className="bar-detail-callout" style={{ borderLeftColor: "var(--color-gold)", backgroundColor: "rgba(201, 147, 59, 0.05)" }}>
                <div className="callout-header">
                  <span className="callout-badge" style={{ backgroundColor: "var(--color-gold-light)", color: "var(--color-gold)" }}>Botanical Profile • {activeBar.name}</span>
                  <span className="callout-lather">🫧 {activeBar.lather}</span>
                </div>
                <div className="callout-scent">
                  <strong>Aroma Notes:</strong> {activeBar.aroma}
                </div>
                <div className="callout-benefit">
                  <strong>Skin Ritual:</strong> {activeBar.benefit}
                </div>
                <div className="callout-botanicals">
                  <strong>Key Actives:</strong> {activeBar.botanical}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Countdown, Promo, and Actions */}
          <div className="collector-details-col">
            <div className="collector-prestige-row">
              <span className="collector-eyebrow-badge" style={{ color: "var(--color-gold)" }}>
                <Sparkles size={13} color="var(--color-gold)" />
                Atelier Seasonal Masterpiece
              </span>
              <div className="collector-review-pill">
                <div className="stars-mini">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#c9933b" stroke="#c9933b" />
                  ))}
                </div>
                <span>5.0 (78 Reviews)</span>
              </div>
            </div>

            <h3 className="collector-card-title">{secondaryOffer.title}</h3>

            <p className="collector-description">{secondaryOffer.description}</p>

            <div className="collector-price-banner">
              <div className="price-stack">
                <span className="collector-price-now">₹{secondaryOffer.salePrice.toLocaleString("en-IN")}</span>
                <span className="collector-price-was">₹{secondaryOffer.originalPrice.toLocaleString("en-IN")}</span>
              </div>
              <span className="collector-savings-badge" style={{ backgroundColor: "var(--color-gold-light)", color: "var(--color-gold)" }}>
                {secondaryOffer.discountText}
              </span>
            </div>

            <div className="collector-value-breakdown">
              <span>Worth ₹{secondaryOffer.originalPrice.toLocaleString("en-IN")} if bought individually • Only <strong>₹{Math.round(secondaryOffer.salePrice / (includedBars.length || 1))}</strong> per bar</span>
            </div>

            {/* Countdown Timer */}
            <div className="collector-countdown-wrapper" style={{ borderColor: "rgba(201, 147, 59, 0.25)" }}>
              <div className="countdown-eyebrow">
                <Sparkles size={13} color="var(--color-gold)" />
                <span>Special Batch Allocation Closes In:</span>
              </div>
              <div className="collector-countdown-blocks">
                <div className="time-block">
                  <span className="time-digits">{String(timeLeft.days).padStart(2, "0")}</span>
                  <span className="time-unit">Days</span>
                </div>
                <div className="time-sep">:</div>
                <div className="time-block">
                  <span className="time-digits">{String(timeLeft.hours).padStart(2, "0")}</span>
                  <span className="time-unit">Hours</span>
                </div>
                <div className="time-sep">:</div>
                <div className="time-block">
                  <span className="time-digits">{String(timeLeft.minutes).padStart(2, "0")}</span>
                  <span className="time-unit">Mins</span>
                </div>
                <div className="time-sep">:</div>
                <div className="time-block pulse-sec">
                  <span className="time-digits">{String(timeLeft.seconds).padStart(2, "0")}</span>
                  <span className="time-unit">Secs</span>
                </div>
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="collector-promo-card">
              <div className="promo-info">
                <span className="promo-badge" style={{ backgroundColor: "var(--color-gold-light)", color: "var(--color-gold)" }}>EXCLUSIVE ATELIER CODE</span>
                <div className="promo-headline">VOUCHER CODE: <strong>{secondaryOffer.promoCode}</strong></div>
                <div className="promo-sub">Use at checkout for {secondaryOffer.discountPercent}% storewide discount</div>
              </div>
              <button
                type="button"
                className="promo-copy-action-btn"
                onClick={handleCopyCode}
                aria-label="Copy voucher code"
              >
                {copied ? (
                  <>
                    <Check size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Code
                  </>
                )}
              </button>
            </div>

            {/* Perks */}
            <div className="collector-inclusions-wrap">
              <span className="inclusions-title">Set Inclusions:</span>
              <ul className="collector-perks-checklist">
                <li>
                  <Check size={16} className="check-icon" style={{ color: "var(--color-gold)" }} />
                  <span><strong>{includedBars.length}x Full-Sized Artisanal Bars:</strong> {includedBars.map((b) => b.name).join(", ")}</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" style={{ color: "var(--color-gold)" }} />
                  <span><strong>Handmade Teak Wood Dish:</strong> Crafted from aged reclaimed wood for bar longevity</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" style={{ color: "var(--color-gold)" }} />
                  <span><strong>Signature Gold Wax Seal:</strong> Hand-stamped certificate of authenticity</span>
                </li>
              </ul>
            </div>

            {/* Action CTA Row with WhatsApp Enquire and Details */}
            <div className="collector-cta-row" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                className={`collector-add-btn ${added ? "added-state" : ""}`}
                onClick={handleAddCollectorBox}
                style={{ flex: "1 1 220px", backgroundColor: "var(--color-dragon-black)" }}
                aria-label={`Claim ${secondaryOffer.title}`}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Claim Curation • ₹{secondaryOffer.salePrice.toLocaleString("en-IN")}
                  </>
                )}
              </button>

              <button
                type="button"
                className="offer-whatsapp-icon-btn"
                onClick={() => openWhatsAppDirect(customSoap)}
                title="Enquire on WhatsApp"
                aria-label={`Enquire about ${customSoap.name} on WhatsApp`}
              >
                <WhatsAppIcon size={22} />
              </button>

              <Link
                href="/#all-soaps"
                className="collector-details-link"
              >
                <span>Browse All Bars</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Guarantees Footer */}
            <div className="collector-guarantees-row">
              <div className="guarantee-item">
                <Truck size={14} />
                <span>Free Express Courier Delivery</span>
              </div>
              <div className="guarantee-item">
                <Gift size={14} />
                <span>Complimentary Gift Box &amp; Ribbon</span>
              </div>
              <div className="guarantee-item">
                <ShieldCheck size={14} />
                <span>30-Day Satisfaction Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
