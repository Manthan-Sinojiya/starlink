"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SOAPS, Soap } from "@/data/soaps";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import Toast from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Leaf,
  ChevronRight,
  Check,
  Sparkles,
  Share2,
} from "lucide-react";

interface ProductDetailViewProps {
  soap: Soap;
}

export default function ProductDetailView({ soap }: ProductDetailViewProps) {
  const { addToCart, isInWishlist, toggleWishlist, setIsCartOpen, showToast } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorite = isInWishlist(soap.id);

  const handleAddToCart = () => {
    addToCart(soap, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    addToCart(soap, quantity);
    setIsCartOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard! ✨");
    }
  };

  // 4 related recommendations
  const relatedSoaps = SOAPS.filter((s) => s.id !== soap.id).slice(0, 4);

  const discountPercent =
    soap.originalPrice && soap.originalPrice > soap.price
      ? Math.round(((soap.originalPrice - soap.price) / soap.originalPrice) * 100)
      : null;

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
            <span>{soap.mainCategory}</span>
            <ChevronRight size={14} />
            <span style={{ color: "var(--color-dragon-black)", fontWeight: 700 }}>{soap.name}</span>
          </nav>

          {/* Product Hero Grid (Image + Info) */}
          <div className="product-detail-grid">
            {/* Left: Product Image */}
            <div className="detail-gallery-main">
              {soap.badge && <span className="detail-badge-corner">{soap.badge}</span>}
              <Image
                src={soap.image}
                alt={soap.name}
                width={800}
                height={800}
                priority
                style={{ objectFit: "cover" }}
              />
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="detail-info-block">
              <div className="detail-eyebrow">
                {soap.mainCategory} • {soap.subCategory}
              </div>

              <h1 className="detail-title">{soap.name}</h1>
              <p className="detail-tagline">{soap.tagline}</p>

              {/* Rating & Review Summary */}
              <div className="detail-meta-bar">
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <div className="stars-row">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < Math.floor(soap.rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <strong style={{ fontSize: "0.92rem" }}>{soap.rating.toFixed(1)}</strong>
                  <span style={{ fontSize: "0.82rem", color: "var(--color-text-tertiary)" }}>
                    ({soap.reviewsCount} verified reviews)
                  </span>
                </div>

                <div style={{ color: "var(--color-text-tertiary)", fontSize: "0.82rem" }}>•</div>

                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-terracotta)" }}>
                  {soap.cureTime}
                </div>

                <div style={{ color: "var(--color-text-tertiary)", fontSize: "0.82rem" }}>•</div>

                <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                  {soap.weight}
                </div>
              </div>

              {/* Price Row */}
              <div className="detail-price-box">
                <span className="detail-current-price">${soap.price.toFixed(2)}</span>
                {soap.originalPrice && (
                  <span className="detail-original-price">${soap.originalPrice.toFixed(2)}</span>
                )}
                {discountPercent && (
                  <span className="detail-save-pill">SAVE {discountPercent}%</span>
                )}
              </div>

              {/* Description */}
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.75rem" }}>
                {soap.description}
              </p>

              {/* Quantity & Add to Cart / Buy Now */}
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
                      <ShoppingBag size={18} /> Add to Bag • ${(soap.price * quantity).toFixed(2)}
                    </>
                  )}
                </button>

                <button type="button" className="detail-buy-now-btn" onClick={handleBuyNow}>
                  Buy Now
                </button>

                <button
                  type="button"
                  className="action-btn"
                  onClick={() => toggleWishlist(soap.id)}
                  aria-label="Toggle Wishlist"
                >
                  <Heart size={20} fill={isFavorite ? "#e02424" : "none"} color={isFavorite ? "#e02424" : "currentColor"} />
                </button>

                <button type="button" className="action-btn" onClick={handleShare} aria-label="Share product">
                  <Share2 size={18} />
                </button>
              </div>

              {/* Trust Features */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", padding: "1.25rem 0", borderTop: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                  <Truck size={17} color="var(--color-terracotta)" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                  <ShieldCheck size={17} color="var(--color-terracotta)" />
                  <span>30-Day Freshness Guarantee</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                  <Leaf size={17} color="var(--color-terracotta)" />
                  <span>100% Biodegradable &amp; Plastic-Free</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                  <Sparkles size={17} color="var(--color-terracotta)" />
                  <span>Retains 100% Plant Glycerin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scent Pyramid Breakdown */}
          {soap.scentPyramid && (
            <div className="scent-pyramid-card">
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", marginBottom: "0.5rem" }}>
                Fragrance Architecture &amp; Olfactory Pyramid
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
                Formulated strictly with steam-distilled essential oils, rare botanical resins, and plant extracts.
              </p>

              <div className="pyramid-level">
                <span className="pyramid-level-title">Top Notes</span>
                <span className="pyramid-notes">{soap.scentPyramid.top.join(" • ")}</span>
              </div>
              <div className="pyramid-level">
                <span className="pyramid-level-title">Heart Notes</span>
                <span className="pyramid-notes">{soap.scentPyramid.heart.join(" • ")}</span>
              </div>
              <div className="pyramid-level">
                <span className="pyramid-level-title">Base Notes</span>
                <span className="pyramid-notes">{soap.scentPyramid.base.join(" • ")}</span>
              </div>
            </div>
          )}

          {/* Skin Benefits Grid */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", marginBottom: "1rem" }}>
              Key Skin Transformation Benefits
            </h3>
            <div className="detail-benefits-grid">
              {soap.soapBenefits.map((benefit, i) => (
                <div key={i} className="benefit-card">
                  <Check size={18} color="var(--color-terracotta)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Saponification Ritual & Ingredients Disclosure */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", marginBottom: "3rem" }}>
            <div className="detail-disclosure-box">
              <h4>The Lather Ritual &amp; Application</h4>
              <p>{soap.ritualHowToUse}</p>
            </div>

            <div className="detail-disclosure-box">
              <h4>Complete Botanical INCI Disclosure</h4>
              <p style={{ fontSize: "0.84rem", color: "var(--color-text-secondary)" }}>
                {soap.fullIngredients.join(" • ")}
              </p>
            </div>
          </div>

          {/* Related Artisanal Soaps (strictly 4 cards in one row!) */}
          <section style={{ borderTop: "1px solid var(--color-border)", paddingTop: "2.5rem", marginBottom: "1.5rem" }}>
            <div className="section-header" style={{ marginBottom: "1.75rem" }}>
              <span className="section-tag">Curated Companions</span>
              <h2 className="section-title" style={{ fontSize: "1.85rem" }}>You May Also Cherish</h2>
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
      <Toast />
    </div>
  );
}
