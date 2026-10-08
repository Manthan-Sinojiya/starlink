"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Copy, Check, Gift, Truck, ShieldCheck, ShoppingBag, Star, ArrowRight, Eye, RefreshCw } from "lucide-react";
import { SOAPS, FESTIVAL_PROMO } from "@/data/soaps";
import { useCart } from "@/context/CartContext";

export default function FestivalOfferSection() {
  const { addToCart, showToast } = useCart();
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  // viewMode: 'box' or index 0..3 for specific soap bar
  const [selectedView, setSelectedView] = useState<"box" | number>("box");

  const festiveSoap = SOAPS.find((s) => s.id === "festive-dragons-glow-gift-set") || SOAPS[0];

  const includedBars = [
    {
      id: "cinnamon-embers",
      name: "Cinnamon Embers",
      aroma: "Star Anise, Ceylon Cinnamon & Dried Clove",
      benefit: "Warming circulation stimulation for dry winter skin",
      lather: "Dense Velvet Warm Foam",
      botanical: "Cinnamon Bark & Star Anise Resin",
      weight: "120g Bar",
      image: "/images/products/terracotta-orange.jpg",
    },
    {
      id: "dragons-blood",
      name: "Dragon's Blood & Myrrh",
      aroma: "Wild Daemonorops Resin & Somalian Myrrh",
      benefit: "Profound cellular renewal & firming micro-lather",
      lather: "Silky Cashmere Micro-lather",
      botanical: "Sacred Dragon's Blood & Organic Shea",
      weight: "120g Bar",
      image: "/images/products/dragons-blood.jpg",
    },
    {
      id: "forest-gold",
      name: "Forest Spice & 24k Gold",
      aroma: "Balsam Fir, Pine Needle & 24k Gold Leaf",
      benefit: "Pure radiance infused with real cosmetic gold flakes",
      lather: "Golden Froth with Shimmer",
      botanical: "24K Cosmetic Gold & Balsam Fir Needle",
      weight: "120g Bar",
      image: "/images/products/saffron-honey.jpg",
    },
    {
      id: "wild-berry",
      name: "Wild Berry & Cedarwood",
      aroma: "Himalayan Cedar & Sweet Winterberry",
      benefit: "Deep calming relaxation for evening bath rituals",
      lather: "Ultra-Hydrating Cream Lather",
      botanical: "Himalayan Cedarwood & Wild Winterberry",
      weight: "120g Bar",
      image: "/images/products/oud-sandalwood.jpg",
    },
  ];

  // Active bar details (default to bar 0 if box is selected)
  const activeBar = typeof selectedView === "number" ? includedBars[selectedView] : includedBars[0];

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
    navigator.clipboard.writeText(FESTIVAL_PROMO.code);
    setCopied(true);
    showToast(`Promo code "${FESTIVAL_PROMO.code}" copied! 25% Off storewide ✨`);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleAddCollectorBox = () => {
    addToCart(festiveSoap, 1);
    setAdded(true);
    showToast("Dragon's Glow Collector Box added to your bag! 🎁");
    setTimeout(() => setAdded(false), 1800);
  };

  // Current display image
  const displayImage = selectedView === "box" ? festiveSoap.image : includedBars[selectedView].image;
  const displayTitle = selectedView === "box" ? "The Complete 4-Piece Keepsake Box" : includedBars[selectedView].name;

  return (
    <section id="festival-offers" className="festival-collector-showcase" aria-label="Limited Holiday Collector Box">
      <div className="container">
        {/* Section Header */}
        <div className="section-header" style={{ marginBottom: "2rem" }}>
          <span className="section-tag festive-tag">
            <Gift size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
            2026 Limited Holiday Collector Vault
          </span>
          <h2 className="section-title">The Grand Festival Gift Collection</h2>
          <p className="section-subtitle">
            An opulent holiday centerpiece. Four full-sized 120g artisanal cold-process bars infused with 24k cosmetic gold leaf,
            presented in a rigid dragon-embossed keepsake box with copper satin ribbon and complimentary teak dish.
          </p>
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
                  <Sparkles size={12} /> Only 450 Numbered Boxes Made
                </span>
                <span className="collector-discount-pill">
                  SAVE $20.00 • 25% OFF
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

            {/* Pricing Callout & Savings Breakdown */}
            <div className="collector-price-banner">
              <div className="price-stack">
                <span className="collector-price-now">${festiveSoap.price.toFixed(2)}</span>
                <span className="collector-price-was">$78.00</span>
              </div>
              <span className="collector-savings-badge">SAVE $20.00 (25% OFF)</span>
            </div>

            <div className="collector-value-breakdown">
              <span>Worth $88 if bought individually • Only <strong>$14.50</strong> per 120g bar + Free Teak Dish ($18 value)</span>
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
                <div className="promo-headline">VOUCHER CODE: <strong>{FESTIVAL_PROMO.code}</strong></div>
                <div className="promo-sub">Use at checkout for an instant 25% storewide discount</div>
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
                  <span><strong>Free Teak Dish Included:</strong> Hand-carved organic draining tray ($18 value)</span>
                </li>
                <li>
                  <Check size={16} className="check-icon" />
                  <span><strong>Numbered Collector Keepsake Box:</strong> Rigid dragon crest box with copper satin ribbon</span>
                </li>
              </ul>
            </div>

            {/* Action CTA Row */}
            <div className="collector-cta-row">
              <button
                type="button"
                className={`collector-add-btn ${added ? "added-state" : ""}`}
                onClick={handleAddCollectorBox}
                aria-label="Add Holiday Collector Box to Bag"
              >
                {added ? (
                  <>
                    <Check size={18} /> Added to Your Bag!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Claim Collector Box • ${festiveSoap.price.toFixed(2)}
                  </>
                )}
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
