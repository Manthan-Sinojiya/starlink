"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SOAPS, Soap } from "@/data/soaps";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { openWhatsAppDirect } from "@/utils/whatsapp";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import WhatsAppEnquiryModal from "@/components/WhatsAppEnquiryModal";
import Toast from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import {
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Leaf,
  ChevronRight,
  Check,
  Sparkles,
  Share2,
  MessageCircle,
} from "lucide-react";

interface ProductDetailViewProps {
  soap?: Soap | null;
  initialSoap?: Soap | null;
  id?: string;
}

export default function ProductDetailView({ soap, initialSoap, id }: ProductDetailViewProps) {
  const { addToCart, setIsCartOpen, showToast } = useCart();
  const { products, shippingSettings } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Dynamically resolve product from store if added via admin
  const activeSoap =
    (id ? products.find((s) => s.id === id || s.slug === id) : null) ||
    soap ||
    initialSoap;

  const handleAddToCart = () => {
    if (!activeSoap) return;
    addToCart(activeSoap, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (!activeSoap) return;
    addToCart(activeSoap, quantity);
    setIsCartOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard! ✨");
    }
  };

  const handleDirectWhatsApp = () => {
    if (!activeSoap) return;
    openWhatsAppDirect(activeSoap);
  };

  if (!activeSoap) {
    return (
      <div className="product-detail-page-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div className="container" style={{ padding: "6rem 1rem", textAlign: "center", flexGrow: 1 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "1rem" }}>
            Apothecary Formulation Not Found
          </h2>
          <p style={{ color: "var(--color-text-secondary)", marginBottom: "2rem", maxWidth: "480px", margin: "0 auto 2rem" }}>
            This artisanal soap may still be curing or was recently removed from our seasonal collection.
          </p>
          <Link href="/#all-soaps" className="btn-primary">
            Explore All Artisanal Soaps
          </Link>
        </div>
        <Footer />
        <CartDrawer />
        <QuickViewModal />
        <WhatsAppEnquiryModal />
        <Toast />
      </div>
    );
  }

  // 4 related recommendations from dynamic store
  const relatedSoaps = products.filter((s) => s.id !== activeSoap.id).slice(0, 4);

  const discountPercent =
    activeSoap.originalPrice && activeSoap.originalPrice > activeSoap.price
      ? Math.round(((activeSoap.originalPrice - activeSoap.price) / activeSoap.originalPrice) * 100)
      : null;

  // Filter sections so ONLY content added from admin side is displayed
  const cleanTopNotes = activeSoap.scentPyramid?.top?.filter((n) => n && n.trim() !== "") || [];
  const cleanHeartNotes = activeSoap.scentPyramid?.heart?.filter((n) => n && n.trim() !== "") || [];
  const cleanBaseNotes = activeSoap.scentPyramid?.base?.filter((n) => n && n.trim() !== "") || [];
  const hasScentPyramid = cleanTopNotes.length > 0 || cleanHeartNotes.length > 0 || cleanBaseNotes.length > 0;

  const cleanBenefits = (activeSoap.soapBenefits || []).filter((b) => b && b.trim() !== "");
  const hasBenefits = cleanBenefits.length > 0;

  const hasRitual = Boolean(activeSoap.ritualHowToUse && activeSoap.ritualHowToUse.trim() !== "");

  const cleanIngredients = (activeSoap.fullIngredients || []).filter((i) => i && i.trim() !== "");
  const hasIngredients = cleanIngredients.length > 0;

  return (
    <div className="product-detail-page-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <main id="product-main-content" style={{ flexGrow: 1 }}>
        <div className="container product-detail-hero">
          {/* Breadcrumbs Navigation */}
          <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
            <Link href="/">Home</Link>
            <ChevronRight size={14} />
            <Link href="/#all-soaps">All Artisanal Soaps</Link>
            <ChevronRight size={14} />
            <span>{activeSoap.mainCategory}</span>
            <ChevronRight size={14} />
            <span style={{ color: "var(--color-dragon-black)", fontWeight: 700 }}>{activeSoap.name}</span>
          </nav>

          {/* Product Hero Grid (Image + Info) */}
          <div className="product-detail-grid">
            {/* Left: Product Image */}
            <div className="detail-gallery-main">
              {activeSoap.badge && <span className="detail-badge-corner">{activeSoap.badge}</span>}
              <Image
                src={activeSoap.image}
                alt={activeSoap.name}
                width={800}
                height={800}
                priority
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="detail-info-block">
              <div className="detail-eyebrow">
                {activeSoap.mainCategory} {activeSoap.subCategory ? `• ${activeSoap.subCategory}` : ""}
              </div>

              <h1 className="detail-title">{activeSoap.name}</h1>
              {activeSoap.tagline && <p className="detail-tagline">{activeSoap.tagline}</p>}

              {/* Rating & Review Summary */}
              <div className="detail-meta-bar">
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(activeSoap.rating || 5) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <strong style={{ fontSize: "0.92rem" }}>{(activeSoap.rating || 5).toFixed(1)}</strong>
                  <span style={{ fontSize: "0.82rem", color: "var(--color-text-tertiary)" }}>
                    ({activeSoap.reviewsCount || 12} reviews)
                  </span>
                </div>

                {activeSoap.cureTime && (
                  <>
                    <div style={{ color: "var(--color-text-tertiary)", fontSize: "0.82rem" }}>•</div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-terracotta)" }}>
                      {activeSoap.cureTime}
                    </div>
                  </>
                )}

                <div style={{ color: "var(--color-text-tertiary)", fontSize: "0.82rem" }}>•</div>

                <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                  {activeSoap.weightValue ? `${activeSoap.weightValue} ${activeSoap.weightUnit || "g"}` : (activeSoap.weight || "125g")}
                </div>
              </div>

              {/* Price Row in Indian Rupees */}
              <div className="detail-price-box" style={{ flexWrap: "wrap", gap: "0.6rem", alignItems: "baseline" }}>
                <span className="detail-current-price">₹{activeSoap.price.toLocaleString("en-IN")}</span>
                {activeSoap.originalPrice && activeSoap.originalPrice > activeSoap.price && (
                  <span className="detail-original-price">₹{activeSoap.originalPrice.toLocaleString("en-IN")}</span>
                )}
                {discountPercent && (
                  <span className="detail-save-pill">SAVE {discountPercent}%</span>
                )}
                <span
                  style={{
                    fontSize: "0.8rem",
                    padding: "3px 8px",
                    borderRadius: "6px",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    backgroundColor: activeSoap.taxType === "exclusive" ? "#fff3e0" : "#e8f5e9",
                    color: activeSoap.taxType === "exclusive" ? "#b76e00" : "#2e7d32",
                    border: `1px solid ${activeSoap.taxType === "exclusive" ? "#ffe082" : "#c8e6c9"}`,
                  }}
                >
                  {activeSoap.taxType === "exclusive"
                    ? `+${activeSoap.taxRate ?? 18}% GST Exclusive`
                    : "Inclusive of all taxes"}
                </span>
              </div>

              {/* Description from Admin */}
              {activeSoap.description && (
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>
                  {activeSoap.description}
                </p>
              )}

              {/* Quantity & Direct Action Buttons (Add to Cart, Buy Now, Direct WhatsApp) */}
              <div className="detail-actions-row">
                <div className="detail-qty-counter">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    style={{ fontSize: "1.1rem", fontWeight: 700 }}
                  >
                    -
                  </button>
                  <span style={{ minWidth: "24px", textAlign: "center" }}>{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    style={{ fontSize: "1.1rem", fontWeight: 700 }}
                  >
                    +
                  </button>
                </div>

                <button type="button" className="detail-add-btn" onClick={handleAddToCart}>
                  {isAdded ? (
                    <>
                      <Check size={18} /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add to Bag • ₹{(activeSoap.price * quantity).toLocaleString("en-IN")}
                    </>
                  )}
                </button>

                <button type="button" className="detail-buy-now-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>

                {/* Direct WhatsApp Enquire Button: One Click Direct to WhatsApp (Icon Only) */}
                <button
                  type="button"
                  className="detail-whatsapp-btn"
                  onClick={handleDirectWhatsApp}
                  title="Enquire on WhatsApp"
                  aria-label={`Enquire about ${activeSoap.name} directly on WhatsApp`}
                >
                  <WhatsAppIcon size={22} />
                </button>

                <button type="button" className="action-btn" onClick={handleShare} aria-label="Share product" title="Share link">
                  <Share2 size={18} />
                </button>
              </div>

              {/* Trust Features: Dynamic from Admin Shipping Settings */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "1rem 0", borderTop: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                  <Truck size={16} color="var(--color-terracotta)" />
                  <span>
                    {shippingSettings.enableFreeThreshold
                      ? `Free shipping on orders over ₹${shippingSettings.freeShippingThreshold.toLocaleString("en-IN")}`
                      : `Flat shipping ₹${shippingSettings.flatRate} nationwide`}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                  <ShieldCheck size={16} color="var(--color-terracotta)" />
                  <span>{activeSoap.skinType ? activeSoap.skinType : "30-Day Freshness Guarantee"}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                  <Leaf size={16} color="var(--color-terracotta)" />
                  <span>100% Biodegradable &amp; Plastic-Free</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                  <Sparkles size={16} color="var(--color-terracotta)" />
                  <span>Retains 100% Plant Glycerin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scent Pyramid Breakdown: ONLY if added from admin side */}
          {hasScentPyramid && (
            <div className="scent-pyramid-card">
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", margin: "0 0 0.35rem" }}>
                Fragrance Architecture &amp; Olfactory Pyramid
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.84rem", margin: "0 0 1rem" }}>
                Formulated strictly with steam-distilled essential oils, rare botanical resins, and plant extracts.
              </p>

              {cleanTopNotes.length > 0 && (
                <div className="pyramid-level">
                  <span className="pyramid-level-title">Top Notes</span>
                  <span className="pyramid-notes">{cleanTopNotes.join(" • ")}</span>
                </div>
              )}
              {cleanHeartNotes.length > 0 && (
                <div className="pyramid-level">
                  <span className="pyramid-level-title">Heart Notes</span>
                  <span className="pyramid-notes">{cleanHeartNotes.join(" • ")}</span>
                </div>
              )}
              {cleanBaseNotes.length > 0 && (
                <div className="pyramid-level">
                  <span className="pyramid-level-title">Base Notes</span>
                  <span className="pyramid-notes">{cleanBaseNotes.join(" • ")}</span>
                </div>
              )}
            </div>
          )}

          {/* Skin Benefits Grid: ONLY if added from admin side */}
          {hasBenefits && (
            <div style={{ marginBottom: "1.25rem" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", margin: "0 0 0.65rem" }}>
                Key Skin Transformation Benefits
              </h3>
              <div className="detail-benefits-grid">
                {cleanBenefits.map((benefit, i) => (
                  <div key={i} className="benefit-card">
                    <Check size={16} color="var(--color-terracotta)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saponification Ritual & Ingredients Disclosure: ONLY if added from admin side */}
          {(hasRitual || hasIngredients) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.85rem", marginBottom: "1.75rem" }}>
              {hasRitual && (
                <div className="detail-disclosure-box">
                  <h4>The Lather Ritual &amp; Application</h4>
                  <p style={{ margin: 0 }}>{activeSoap.ritualHowToUse}</p>
                </div>
              )}

              {hasIngredients && (
                <div className="detail-disclosure-box">
                  <h4>Complete Botanical INCI Disclosure</h4>
                  <p style={{ fontSize: "0.84rem", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    {cleanIngredients.join(" • ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Related Artisanal Soaps (strictly 4 cards in one row!) */}
          <section style={{ borderTop: "1px solid var(--color-border)", paddingTop: "1.75rem", marginBottom: "1.5rem" }}>
            <div className="section-header" style={{ marginBottom: "1.25rem" }}>
              <span className="section-tag">Curated Companions</span>
              <h2 className="section-title" style={{ fontSize: "1.65rem" }}>You May Also Cherish</h2>
              <p className="section-subtitle">
                Explore companion cold-process soap bars crafted with matching botanical essences.
              </p>
            </div>

            <div className="soap-grid-4">
              {relatedSoaps.map((item) => (
                <ProductCard key={item.id} soap={item} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <WhatsAppEnquiryModal />
      <Toast />
    </div>
  );
}
