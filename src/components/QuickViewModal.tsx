"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Star, Heart, ShoppingBag, ShieldCheck, Clock, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function QuickViewModal() {
  const { quickViewSoap, setQuickViewSoap, addToCart, isInWishlist, toggleWishlist } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewSoap) return null;

  const isFav = isInWishlist(quickViewSoap.id);

  const handleAdd = () => {
    addToCart(quickViewSoap, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewSoap(null);
    }, 1200);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setQuickViewSoap(null)}
      role="dialog"
      aria-modal="true"
      aria-label={`${quickViewSoap.name} Quick View`}
    >
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setQuickViewSoap(null)}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Left Column: Soap Image */}
        <div className="modal-media-col">
          <Image
            src={quickViewSoap.image}
            alt={quickViewSoap.name}
            width={600}
            height={600}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Right Column: Soap Details */}
        <div className="modal-info-col">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--color-terracotta)",
                letterSpacing: "0.08em",
              }}
            >
              {quickViewSoap.cureTime}
            </span>
            <span style={{ color: "var(--color-text-tertiary)" }}>•</span>
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
              {quickViewSoap.weight}
            </span>
          </div>

          <h2 className="modal-soap-title">{quickViewSoap.name}</h2>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
            <div style={{ display: "flex", color: "var(--color-gold)", gap: "2px" }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  fill={i < Math.floor(quickViewSoap.rating) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{quickViewSoap.rating}</span>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-tertiary)" }}>
              ({quickViewSoap.reviewsCount} verified reviews)
            </span>
          </div>

          <div className="modal-soap-price">
            ${quickViewSoap.price.toFixed(2)}{" "}
            {quickViewSoap.originalPrice && (
              <span style={{ fontSize: "1rem", color: "var(--color-text-tertiary)", textDecoration: "line-through", marginLeft: "6px" }}>
                ${quickViewSoap.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="modal-desc">{quickViewSoap.description}</p>

          {/* Skin Type & Scent Notes */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-dragon-black)", marginBottom: "0.35rem" }}>
              Ideal Skin Profile
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
              {quickViewSoap.skinType}
            </div>
          </div>

          {/* Key Ingredients */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-dragon-black)", marginBottom: "0.45rem" }}>
              Key Botanical Ingredients
            </div>
            <div className="modal-ingredients-list">
              {quickViewSoap.keyIngredients.map((ing, i) => (
                <span key={i} className="ingredient-chip">
                  🌿 {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "auto" }}>
            <div className="qty-counter" style={{ padding: "0.4rem 0.85rem" }}>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                -
              </button>
              <span>{qty}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={() => setQty(qty + 1)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn-primary"
              style={{ flexGrow: 1 }}
              onClick={handleAdd}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to Bag • ${(quickViewSoap.price * qty).toFixed(2)}
                </>
              )}
            </button>

            <button
              type="button"
              className={`action-btn ${isFav ? "active" : ""}`}
              onClick={() => toggleWishlist(quickViewSoap.id)}
              aria-label="Wishlist toggle"
            >
              <Heart size={20} fill={isFav ? "var(--color-terracotta)" : "none"} color={isFav ? "var(--color-terracotta)" : "currentColor"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
