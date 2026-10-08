"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, ShoppingBag, Check, Eye, Sparkles } from "lucide-react";
import { Soap } from "@/data/soaps";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  soap: Soap;
}

export default function ProductCard({ soap }: ProductCardProps) {
  const { addToCart, isInWishlist, toggleWishlist, setQuickViewSoap, showToast } = useCart();
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(soap, 1);
    setIsAddedRecently(true);
    showToast(`Added ${soap.name} to your bag`);
    setTimeout(() => setIsAddedRecently(false), 1600);
  };

  const isFavorite = isInWishlist(soap.id);

  const discountPercent =
    soap.originalPrice && soap.originalPrice > soap.price
      ? Math.round(((soap.originalPrice - soap.price) / soap.originalPrice) * 100)
      : null;

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

        {/* Wishlist Heart Button */}
        <button
          type="button"
          className={`card-heart-btn ${isFavorite ? "favorited" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(soap.id);
          }}
          aria-label={isFavorite ? `Remove ${soap.name} from wishlist` : `Add ${soap.name} to wishlist`}
        >
          <Heart size={16} fill={isFavorite ? "#e02424" : "none"} color={isFavorite ? "#e02424" : "currentColor"} />
        </button>

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

      {/* 2. Card Content Info Block */}
      <div className="card-info-wrap">
        {/* Eyebrow: Cold-Process, Weight & Cure */}
        <div className="card-meta-eyebrow">
          <span>Cold-Process</span>
          <span className="dot-sep">•</span>
          <span>{soap.weight}</span>
          <span className="dot-sep">•</span>
          <span>{soap.cureTime}</span>
        </div>

        {/* Title (2-line clamped with uniform height) */}
        <Link href={`/products/${soap.id}`} className="card-title-anchor">
          <h3 className="card-soap-title">{soap.name}</h3>
        </Link>

        {/* Aroma / Scent Notes */}
        <p className="card-aroma-notes" title={soap.fragranceNotes.join(", ")}>
          <span className="aroma-label">Aroma:</span> {soap.fragranceNotes.slice(0, 3).join(" • ")}
        </p>

        {/* 5-Star Rating Row */}
        <div className="card-stars-row">
          <div className="stars-group" aria-label={`Rating ${soap.rating} out of 5`}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(soap.rating) ? "#c9933b" : "none"}
                stroke="#c9933b"
              />
            ))}
          </div>
          <span className="card-rating-text">{soap.rating.toFixed(1)}</span>
          <span className="card-reviews-count">({soap.reviewsCount})</span>
        </div>

        {/* Pricing Row */}
        <div className="card-price-row">
          <div className="price-tag-group">
            <span className="current-price">${soap.price.toFixed(2)}</span>
            {soap.originalPrice && (
              <span className="original-price">${soap.originalPrice.toFixed(2)}</span>
            )}
          </div>
          {discountPercent && (
            <span className="discount-tag">-{discountPercent}% OFF</span>
          )}
        </div>

        {/* Full-width Sleek Add to Bag Button */}
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
      </div>
    </article>
  );
}
