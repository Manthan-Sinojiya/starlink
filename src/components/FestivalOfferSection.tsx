"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Copy, Check, Gift, Truck, ShieldCheck, ShoppingBag, Star, ArrowRight, Eye, RefreshCw, MessageCircle } from "lucide-react";
import { SOAPS, FESTIVAL_PROMO, Soap } from "@/data/soaps";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { openWhatsAppDirect } from "@/utils/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function FestivalOfferSection() {
  const { addToCart, showToast } = useCart();
  const { primaryOffer } = useStore();
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const [selectedView, setSelectedView] = useState<"box" | number>("box");

  if (!primaryOffer || !primaryOffer.isActive) return null;

  const includedBars = primaryOffer.bars || [];
  const activeBar = typeof selectedView === "number" && includedBars[selectedView]
    ? includedBars[selectedView]
    : (includedBars[0] || {
        name: "Artisanal Bar",
        lather: "Velvet foam",
        aroma: "Botanical oils",
        benefit: "Nourishes skin",
        botanical: "Pure extracts",
        image: primaryOffer.mainImage,
      });

  // Live countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 32,
    seconds: 48,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    const code = primaryOffer.promoCode || FESTIVAL_PROMO.code;
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToast(`Promo code "${code}" copied! ${primaryOffer.discountPercent}% Off storewide ✨`);
    setTimeout(() => setCopied(false), 2400);
  };

  const festiveSoap: Soap = useMemo(() => ({
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

  const handleAddCollectorBox = () => {
    addToCart(festiveSoap, 1);
    setAdded(true);
    showToast(`"${primaryOffer.title}" added to your bag! 🎁`);
    setTimeout(() => setAdded(false), 1800);
  };

  // Current display image
  const displayImage = selectedView === "box" ? primaryOffer.mainImage : includedBars[selectedView].image;
  const displayTitle = selectedView === "box" ? primaryOffer.title : includedBars[selectedView].name;

  return (
    <section id="festival-offers" className="festival-collector-showcase" aria-label="Limited Holiday Collector Box">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: "2rem" }}>
          <span className="section-tag festive-tag">
            <Gift size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
            {primaryOffer.sectionTag}
          </span>
          <h2 className="section-title">{primaryOffer.title}</h2>
          <p className="section-subtitle">{primaryOffer.subtitle}</p>
        </div>

        {/* The Collector Box Feature Card */}
        <div className="collector-box-card">
          {/* Left Column: Visual Showcase & Interactive Bar Explorer */}
          <div className="collector-media-col">
            {/* Main Stage Frame */}
            <div className="collector-image-frame">
              {/* Badges on Visual */}
              <div className="collector-frame-badges">
                <span className="collector-edition-pill">
                  <Sparkles size={12} /> {primaryOffer.badgeText}
                </span>
                <span className="collector-discount-pill">
                  {primaryOffer.discountText}
                </span>
              </div>

              <Image
                src={displayImage}
                alt={displayTitle}
                width={720}
                height={540}
                priority
                className="collector-box-img"
              />

              {/* View Indicator Overlay */}
              <div className="collector-image-caption-bar">
                <span className="caption-text">
                  Viewing: <strong>{displayTitle}</strong>
                </span>
                {selectedView !== "box" && (
                  <button
                    type="button"
                    onClick={() => setSelectedView("box")}
                    className="caption-reset-btn"
                  >
                    <RefreshCw size={12} /> View Full Box
                  </button>
                )}
              </div>
            </div>

            {/* Included Bars Interactive Navigation */}
            <div className="collector-bars-nav">
              <div className="bars-nav-header">
                <div>
                  <h4 className="bars-nav-title">Included Inside The Vault Box:</h4>
                  <p className="bars-nav-subtitle">Click any bar to inspect its formula & soap profile</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedView("box")}
                  className={`box-overview-tab-btn ${selectedView === "box" ? "active" : ""}`}
                >
                  <Eye size={13} /> Full Box Overview
                </button>
              </div>

              {/* 4 Interactive Soap Cards */}
              <div className="bars-thumbnails-grid">
                {includedBars.map((bar, idx) => (
                  <button
                    key={bar.id}
                    type="button"
                    onClick={() => setSelectedView(idx)}
                    className={`bar-thumb-card ${selectedView === idx ? "active" : ""}`}
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

              {/* Dynamic Botanical Profile Spotlight */}
              <div className="bar-detail-callout">
                <div className="callout-header">
                  <span className="callout-badge">Botanical Profile • {activeBar.name}</span>
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
            {/* Header / Prestige Tag */}
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

            {/* Pricing Callout & Savings Breakdown in Indian Rupees */}
            <div className="collector-price-banner">
              <div className="price-stack">
                <span className="collector-price-now">₹{primaryOffer.salePrice.toLocaleString("en-IN")}</span>
                <span className="collector-price-was">₹{primaryOffer.originalPrice.toLocaleString("en-IN")}</span>
              </div>
              <span className="collector-savings-badge">{primaryOffer.discountText}</span>
            </div>

            <div className="collector-value-breakdown">
              <span>Worth ₹{primaryOffer.originalPrice.toLocaleString("en-IN")} if bought individually • Only <strong>₹{Math.round(primaryOffer.salePrice / (includedBars.length || 1))}</strong> per bar</span>
            </div>

            {/* Vault Countdown Timer */}
            <div className="collector-countdown-wrapper">
              <div className="countdown-eyebrow">
                <Sparkles size={13} color="var(--color-terracotta)" />
                <span>Holiday Allocation Vault Closes In:</span>
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

            {/* Perforated Holiday Voucher Coupon Box */}
            <div className="collector-promo-card">
              <div className="promo-info">
                <span className="promo-badge">HOLIDAY SAVINGS CODE</span>
                <div className="promo-headline">VOUCHER CODE: <strong>{primaryOffer.promoCode}</strong></div>
                <div className="promo-sub">Use at checkout for an instant {primaryOffer.discountPercent}% storewide discount</div>
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

            {/* Perks & Inclusions Checklist */}
            <div className="collector-inclusions-wrap">
              <span className="inclusions-title">What&apos;s Included In Every Collector Box:</span>
              <ul className="collector-perks-checklist">
                <li>
                  <Check size={16} className="check-icon" />
                  <span><strong>4x Full-Sized 120g Bars:</strong> Cinnamon, Dragon&apos;s Blood, Forest Gold & Wild Berry</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" />
                  <span><strong>24K Cosmetic Gold Flakes:</strong> Ethically sourced pure radiance flakes in every bar</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" />
                  <span><strong>Free Teak Dish Included:</strong> Hand-carved organic draining tray (₹499 value)</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" />
                  <span><strong>Numbered Collector Keepsake Box:</strong> Rigid dragon crest box with copper satin ribbon</span>
                </li>
              </ul>
            </div>

            {/* Action CTA Row with WhatsApp Enquire */}
            <div className="collector-cta-row" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                className={`collector-add-btn ${added ? "added-state" : ""}`}
                onClick={handleAddCollectorBox}
                aria-label="Add Holiday Collector Box to Bag"
                style={{ flex: "1 1 220px" }}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Your Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Claim Collector Box • ₹{festiveSoap.price.toLocaleString("en-IN")}
                  </>
                )}
              </button>

              <button
                type="button"
                className="offer-whatsapp-icon-btn"
                onClick={() => openWhatsAppDirect(festiveSoap)}
                title="Enquire on WhatsApp"
                aria-label={`Enquire about ${festiveSoap.name} on WhatsApp`}
              >
                <WhatsAppIcon size={22} />
              </button>

              <Link
                href={`/products/${festiveSoap.id}`}
                className="collector-details-link"
              >
                <span>Full Box Details</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Holiday Guarantees Footer */}
            <div className="collector-guarantees-row">
              <div className="guarantee-item">
                <Truck size={14} />
                <span>Free Express Courier Delivery</span>
              </div>
              <div className="guarantee-item">
                <Gift size={14} />
                <span>Complimentary Holiday Gift Note</span>
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
