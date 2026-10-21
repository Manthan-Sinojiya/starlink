"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, Eye, Sparkles, MessageCircle, Minus, Plus } from "lucide-react";
import { Soap } from "@/data/soaps";
import { useCart } from "@/context/CartContext";
import { openWhatsAppDirect } from "@/utils/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface ProductCardProps {
  soap: Soap;
}

export default function ProductCard({ soap }: ProductCardProps) {
  const { cart, addToCart, removeFromCart, updateQuantity, setQuickViewSoap, showToast } = useCart();
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const cartItem = cart.find((item) => item.soap.id === soap.id || (item.soap as any)._id === soap.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(soap, 1);
    setIsAddedRecently(true);
    showToast(`Added ${soap.name} to your bag`);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  const handleWhatsAppEnquire = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openWhatsAppDirect(soap);
  };

  const discountPercent =
    soap.originalPrice && soap.originalPrice > soap.price
      ? Math.round(((soap.originalPrice - soap.price) / soap.originalPrice) * 100)
      : null;

  // Truncate description strictly to 40 characters as requested
  const truncatedDescription = soap.description
    ? soap.description.slice(0, 40) + (soap.description.length > 40 ? "..." : "")
    : "";

  return (
    <article className="luxury-product-card" id={`product-${soap.id}`}>
      {/* 1. Image Frame & Interactive Overlays */}
      <div className="card-image-wrap">
        <Link href={`/products/${soap.id}`} aria-label={`View ${soap.name} full details`} className="card-image-link">
          <Image
            src={soap.image}
            alt={soap.name}
            width={450}
            height={450}
            priority={soap.isBestseller}
            className="card-main-image"
          />
        </Link>

        {/* Floating Top Badge */}
        {soap.badge && (
          <span className={`card-top-badge ${soap.isFestive ? "festive-badge" : soap.isBestseller ? "bestseller-badge" : ""}`}>
            {soap.isFestive && <Sparkles size={11} className="badge-sparkle-icon" />}
            {soap.badge}
          </span>
        )}

        {/* Quick View Button (Frosted Luxury Glass Pill) */}
        <button
          type="button"
          className="card-quick-overlay-btn"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickViewSoap(soap);
          }}
          aria-label={`Quick view ${soap.name}`}
        >
          <Eye size={13} /> Quick View
        </button>
      </div>

      {/* 2. Card Content Info Block - Updated with Product Name & 40-char description */}
      <div className="card-info-wrap">
        {/* Product Name */}
        <Link href={`/products/${soap.id}`} className="card-title-anchor">
          <h3 className="card-soap-title" title={soap.name}>
            {soap.name}
          </h3>
        </Link>

        {/* Description limited to 40 characters */}
        <p className="card-short-desc" title={soap.description}>
          {truncatedDescription}
        </p>

        {/* Pricing Row in Indian Rupees with Tax Status */}
        <div className="card-price-row">
          <div className="price-tag-group">
            <span className="current-price">₹{soap.price.toLocaleString("en-IN")}</span>
            {soap.originalPrice && (
              <span className="original-price">₹{soap.originalPrice.toLocaleString("en-IN")}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
            {soap.taxType === "exclusive" ? (
              <span style={{ fontSize: "0.68rem", color: "var(--color-terracotta)", fontWeight: 700, background: "rgba(225, 113, 89, 0.1)", padding: "2px 6px", borderRadius: "9999px" }}>
                +{soap.taxRate || 18}% GST
              </span>
            ) : (
              <span style={{ fontSize: "0.68rem", color: "#2e7d32", fontWeight: 700, background: "rgba(46, 125, 50, 0.08)", padding: "2px 6px", borderRadius: "9999px" }}>
                Incl. Tax
              </span>
            )}
            {discountPercent && (
              <span className="discount-tag">-{discountPercent}%</span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Bag (or Stepper) + WhatsApp Enquire */}
        <div className="card-actions-group">
          {quantityInCart > 0 ? (
            <div
              className="card-qty-stepper"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <button
                type="button"
                className="card-qty-btn minus"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (quantityInCart <= 1) {
                    removeFromCart(soap.id);
                    showToast(`Removed "${soap.name}" from bag`);
                  } else {
                    updateQuantity(soap.id, quantityInCart - 1);
                  }
                }}
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              <span className="card-qty-value">{quantityInCart}</span>
              <button
                type="button"
                className="card-qty-btn plus"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateQuantity(soap.id, quantityInCart + 1);
                }}
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className={`card-add-bag-btn ${isAddedRecently ? "added" : ""}`}
              onClick={handleAddToCart}
              aria-label={`Add ${soap.name} to cart`}
            >
              {isAddedRecently ? (
                <>
                  <Check size={15} /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag size={15} /> Add to Bag
                </>
              )}
            </button>
          )}

          <button
            type="button"
            className="card-whatsapp-btn"
            onClick={handleWhatsAppEnquire}
            aria-label={`Enquire about ${soap.name} on WhatsApp`}
            title="Enquire on WhatsApp"
          >
            <WhatsAppIcon size={19} />
          </button>
        </div>
      </div>
    </article>
  );
}
