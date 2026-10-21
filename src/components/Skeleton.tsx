"use client";

import React from "react";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
  dark?: boolean;
}

export function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "6px",
  className = "",
  style,
  dark = false,
}: SkeletonProps) {
  return (
    <div
      className={`skeleton-box ${dark ? "dark" : ""} ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card" style={{ height: "100%" }}>
      {/* Media Image Box */}
      <div className="skeleton-card-media">
        <Skeleton width="100%" height="100%" borderRadius="0" />
        {/* Floating badge skeleton */}
        <div style={{ position: "absolute", top: "12px", left: "12px" }}>
          <Skeleton width="75px" height="22px" borderRadius="9999px" />
        </div>
      </div>

      {/* Content */}
      <div className="skeleton-card-content">
        {/* Category & weight */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Skeleton width="45%" height="12px" borderRadius="4px" />
          <Skeleton width="25%" height="12px" borderRadius="4px" />
        </div>

        {/* Title */}
        <Skeleton width="85%" height="20px" borderRadius="4px" style={{ marginTop: "4px" }} />
        
        {/* Tagline / Subtitle */}
        <Skeleton width="95%" height="14px" borderRadius="4px" />

        {/* Ratings & reviews */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" }}>
          <Skeleton width="80px" height="14px" borderRadius="4px" />
          <Skeleton width="50px" height="12px" borderRadius="4px" />
        </div>

        {/* Price and Tax */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "auto", paddingTop: "8px" }}>
          <Skeleton width="65px" height="22px" borderRadius="4px" />
          <Skeleton width="45px" height="14px" borderRadius="4px" />
          <Skeleton width="75px" height="18px" borderRadius="9999px" />
        </div>

        {/* Action Button */}
        <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
          <Skeleton width="100%" height="42px" borderRadius="10px" />
          <Skeleton width="42px" height="42px" borderRadius="10px" />
        </div>
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="skeleton-card" style={{ height: "100%" }}>
      {/* Media Area */}
      <div className="skeleton-card-media" style={{ aspectRatio: "4/3" }}>
        <Skeleton width="100%" height="100%" borderRadius="0" />
        <div style={{ position: "absolute", top: "14px", left: "14px" }}>
          <Skeleton width="85px" height="24px" borderRadius="9999px" />
        </div>
      </div>

      {/* Content Area */}
      <div className="skeleton-card-content" style={{ padding: "1.25rem" }}>
        <Skeleton width="30%" height="12px" borderRadius="4px" />
        <Skeleton width="70%" height="22px" borderRadius="4px" style={{ margin: "4px 0" }} />
        <Skeleton width="90%" height="14px" borderRadius="4px" />
        <Skeleton width="60%" height="12px" borderRadius="4px" style={{ fontStyle: "italic" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "0.5rem" }}>
          <Skeleton width="100px" height="14px" borderRadius="4px" />
        </div>
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "560px",
        padding: "clamp(3rem, 6vw, 5rem) 0",
        backgroundColor: "var(--color-cream-bg)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container" style={{ width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            alignItems: "center",
          }}
        >
          {/* Left Hero Text Skeleton */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Skeleton width="140px" height="26px" borderRadius="9999px" />
            <Skeleton width="90%" height="48px" borderRadius="8px" />
            <Skeleton width="75%" height="48px" borderRadius="8px" />
            <Skeleton width="80%" height="20px" borderRadius="4px" style={{ marginTop: "0.5rem" }} />
            <Skeleton width="95%" height="16px" borderRadius="4px" />
            <Skeleton width="85%" height="16px" borderRadius="4px" />

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
              <Skeleton width="160px" height="48px" borderRadius="10px" />
              <Skeleton width="140px" height="48px" borderRadius="10px" />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "1rem" }}>
              <Skeleton width="12px" height="12px" borderRadius="50%" />
              <Skeleton width="12px" height="12px" borderRadius="50%" />
              <Skeleton width="12px" height="12px" borderRadius="50%" />
            </div>
          </div>

          {/* Right Hero Image Showcase Skeleton */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                width: "100%",
                maxWidth: "480px",
                aspectRatio: "1 / 1",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-lg)",
                background: "white",
                padding: "1rem",
              }}
            >
              <Skeleton width="100%" height="100%" borderRadius="14px" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="product-detail-page-wrapper" style={{ minHeight: "80vh", backgroundColor: "var(--color-cream-bg)", padding: "2.5rem 0 5rem" }}>
      <div className="container">
        {/* Breadcrumb Skeleton */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2rem" }}>
          <Skeleton width="60px" height="14px" borderRadius="4px" />
          <span style={{ color: "var(--color-border)" }}>/</span>
          <Skeleton width="100px" height="14px" borderRadius="4px" />
          <span style={{ color: "var(--color-border)" }}>/</span>
          <Skeleton width="140px" height="14px" borderRadius="4px" />
        </div>

        {/* 2-Column Product Detail Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "3rem",
            alignItems: "flex-start",
          }}
        >
          {/* Left Gallery Skeleton */}
          <div>
            <div
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
                backgroundColor: "white",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <Skeleton width="100%" height="100%" borderRadius="0" />
            </div>
            {/* Thumbnail row */}
            <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
              <Skeleton width="72px" height="72px" borderRadius="8px" />
              <Skeleton width="72px" height="72px" borderRadius="8px" />
              <Skeleton width="72px" height="72px" borderRadius="8px" />
            </div>
          </div>

          {/* Right Product Info Skeleton */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <Skeleton width="90px" height="24px" borderRadius="9999px" />
              <Skeleton width="80px" height="24px" borderRadius="9999px" />
            </div>

            <Skeleton width="85%" height="38px" borderRadius="6px" />
            <Skeleton width="95%" height="18px" borderRadius="4px" />

            {/* Rating row */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Skeleton width="100px" height="18px" borderRadius="4px" />
              <Skeleton width="80px" height="14px" borderRadius="4px" />
            </div>

            {/* Price block */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", margin: "0.5rem 0" }}>
              <Skeleton width="100px" height="34px" borderRadius="6px" />
              <Skeleton width="70px" height="20px" borderRadius="4px" />
              <Skeleton width="110px" height="22px" borderRadius="9999px" />
            </div>

            {/* Description lines */}
            <Skeleton width="100%" height="16px" borderRadius="4px" />
            <Skeleton width="95%" height="16px" borderRadius="4px" />
            <Skeleton width="80%" height="16px" borderRadius="4px" />

            {/* Key Ingredients */}
            <div style={{ marginTop: "1rem" }}>
              <Skeleton width="140px" height="16px" borderRadius="4px" style={{ marginBottom: "8px" }} />
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <Skeleton width="100px" height="30px" borderRadius="9999px" />
                <Skeleton width="120px" height="30px" borderRadius="9999px" />
                <Skeleton width="95px" height="30px" borderRadius="9999px" />
                <Skeleton width="110px" height="30px" borderRadius="9999px" />
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "12px", marginTop: "1.5rem" }}>
              <Skeleton width="110px" height="50px" borderRadius="10px" />
              <Skeleton width="200px" height="50px" borderRadius="10px" />
              <Skeleton width="50px" height="50px" borderRadius="10px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategoryPageSkeleton() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-cream-bg)" }}>
      {/* Banner Skeleton */}
      <div
        style={{
          minHeight: "320px",
          backgroundColor: "#1c1c1f",
          display: "flex",
          alignItems: "center",
          padding: "3rem 0",
        }}
      >
        <div className="container" style={{ width: "100%" }}>
          <Skeleton width="120px" height="24px" borderRadius="9999px" dark style={{ marginBottom: "1rem" }} />
          <Skeleton width="50%" height="40px" borderRadius="8px" dark style={{ marginBottom: "1rem" }} />
          <Skeleton width="70%" height="18px" borderRadius="4px" dark />
        </div>
      </div>

      {/* Subcategory Pills Skeleton */}
      <div className="container" style={{ padding: "2rem 0 1rem" }}>
        <div style={{ display: "flex", gap: "10px", overflowX: "hidden", marginBottom: "2rem" }}>
          <Skeleton width="90px" height="36px" borderRadius="9999px" />
          <Skeleton width="120px" height="36px" borderRadius="9999px" />
          <Skeleton width="110px" height="36px" borderRadius="9999px" />
          <Skeleton width="130px" height="36px" borderRadius="9999px" />
        </div>

        {/* 4 Cards in 1 Row Grid */}
        <div className="soap-grid-4">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
