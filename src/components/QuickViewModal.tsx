"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Star, ShoppingBag, ShieldCheck, Clock, Check, MessageCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { openWhatsAppDirect } from "@/utils/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function QuickViewModal() {
  const { quickViewSoap, setQuickViewSoap, addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!quickViewSoap) return null;

  const handleAdd = () => {
    addToCart(quickViewSoap, qty);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewSoap(null);
    }, 1200);
  };

  const handleWhatsApp = () => {
    const soap = quickViewSoap;
    openWhatsAppDirect(soap);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setQuickViewSoap(null)}
      role="dialog"
      aria-modal="true"
      aria-label={`${quickViewSoap.name} Quick View`}
    >
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={() => setQuickViewSoap(null)}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Modal Left Gallery Image */}
        <div className="modal-gallery">
          <Image
            src={quickViewSoap.image}
            alt={quickViewSoap.name}
            width={600}
            height={600}
            style={{ objectFit: "cover" }}
          />

          <div
            style={{
              position: "absolute",
              bottom: "1rem",
              left: "1rem",
              background: "rgba(17, 17, 19, 0.85)",
              color: "#fff",
              backdropFilter: "blur(6px)",
              padding: "0.4rem 0.85rem",
              borderRadius: "9999px",
              fontSize: "0.78rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <Clock size={14} color="var(--color-terracotta)" />
            <span>{quickViewSoap.cureTime}</span>
          </div>
        </div>

        {/* Modal Right Info & Buy */}
        <div className="modal-details-col">
          <div className="modal-category">
            {quickViewSoap.mainCategory} • {quickViewSoap.weight}
          </div>

          <h2 className="modal-title">{quickViewSoap.name}</h2>
          <p className="modal-tagline">{quickViewSoap.tagline}</p>

          <div className="modal-stars-row">
            <div className="stars-group" style={{ color: "#c9933b" }}>
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

          {/* Pricing in Indian Rupees & Tax / Weight */}
          <div className="modal-soap-price" style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem" }}>
            <span>₹{quickViewSoap.price.toLocaleString("en-IN")}</span>
            {quickViewSoap.originalPrice && (
              <span style={{ fontSize: "1rem", color: "var(--color-text-tertiary)", textDecoration: "line-through" }}>
                ₹{quickViewSoap.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            <span
              style={{
                fontSize: "0.75rem",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: 600,
                backgroundColor: quickViewSoap.taxType === "exclusive" ? "#fff3e0" : "#e8f5e9",
                color: quickViewSoap.taxType === "exclusive" ? "#b76e00" : "#2e7d32",
                border: `1px solid ${quickViewSoap.taxType === "exclusive" ? "#ffe082" : "#c8e6c9"}`,
              }}
            >
              {quickViewSoap.taxType === "exclusive" ? `+${quickViewSoap.taxRate || 18}% GST Exclusive` : "Incl. of all taxes"}
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>
              • {quickViewSoap.weightValue ? `${quickViewSoap.weightValue} ${quickViewSoap.weightUnit || "g"}` : (quickViewSoap.weight || "125g")}
            </span>
          </div>

          <p className="modal-desc">{quickViewSoap.description}</p>

          {/* Skin Type & Scent Notes */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-dragon-black)", marginBottom: "0.35rem" }}>
              Ideal Skin Profile
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
              {quickViewSoap.skinType || "All skin types"}
            </div>
          </div>

          {/* Key Ingredients */}
          {((quickViewSoap.keyIngredients && quickViewSoap.keyIngredients.length > 0) || (quickViewSoap.fullIngredients && quickViewSoap.fullIngredients.length > 0)) && (
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-dragon-black)", marginBottom: "0.45rem" }}>
                Key Botanical Ingredients
              </div>
              <div className="modal-ingredients-list">
                {(quickViewSoap.keyIngredients || quickViewSoap.fullIngredients?.slice(0, 4) || []).map((ing, i) => (
                  <span key={i} className="ingredient-chip">
                    🌿 {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
                    <ShoppingBag size={18} /> Add to Bag • ₹{(quickViewSoap.price * qty).toLocaleString("en-IN")}
                  </>
                )}
              </button>

              {/* WhatsApp Direct Icon Button (No Text) */}
              <button
                type="button"
                className="card-whatsapp-btn"
                onClick={handleWhatsApp}
                title="Enquire on WhatsApp"
                aria-label={`Enquire about ${quickViewSoap.name} on WhatsApp`}
                style={{ width: "46px", height: "46px", minWidth: "46px" }}
              >
                <WhatsAppIcon size={22} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
