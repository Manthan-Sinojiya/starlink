"use client";

import React, { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  Filter,
  Layers,
  SlidersHorizontal,
  Home,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import WhatsAppEnquiryModal from "@/components/WhatsAppEnquiryModal";
import Toast from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import { useDBStore } from "@/context/DBStoreContext";
import { CategoryPageSkeleton } from "@/components/Skeleton";

function CategoryContent() {
  const params = useParams();
  const slugParam =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : "";

  const { categories, products, isLoaded } = useDBStore();
  const [selectedSubcat, setSelectedSubcat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [searchQuery, setSearchQuery] = useState("");

  // Find category by slug, id, or normalized name
  const currentCategory = useMemo(() => {
    if (!slugParam) return null;
    const lower = decodeURIComponent(slugParam).toLowerCase().trim();
    return (
      categories.find(
        (c) =>
          c.slug?.toLowerCase() === lower ||
          c.id?.toLowerCase() === lower ||
          c.name?.toLowerCase().replace(/[^a-z0-9]+/g, "-") === lower ||
          c.name?.toLowerCase() === lower
      ) || null
    );
  }, [categories, slugParam]);

  // Determine subcategories for this category
  const availableSubcategories = useMemo(() => {
    if (!currentCategory) return [];
    const directList = currentCategory.subcategories || [];
    const childCats = categories
      .filter(
        (c) =>
          c.parentCategory &&
          c.parentCategory.toLowerCase() === currentCategory.name.toLowerCase()
      )
      .map((c) => c.name);

    return Array.from(new Set([...directList, ...childCats])).filter(Boolean);
  }, [currentCategory, categories]);

  // Filter products belonging to this category
  const categoryProducts = useMemo(() => {
    if (!currentCategory) return [];
    const catNameLower = currentCategory.name.toLowerCase();
    const catSlugLower = (currentCategory.slug || "").toLowerCase();

    return products.filter((p) => {
      const matchMain =
        (p.mainCategory && p.mainCategory.toLowerCase() === catNameLower) ||
        (p.mainCategory && p.mainCategory.toLowerCase().includes(catNameLower)) ||
        (Boolean(catSlugLower) && p.mainCategory && p.mainCategory.toLowerCase() === catSlugLower) ||
        (p.mainCategory && catNameLower.includes(p.mainCategory.toLowerCase()));

      const matchCategoryField =
        (p.category && p.category.toLowerCase() === catNameLower) ||
        (p.category && p.category.toLowerCase().includes(catNameLower));

      return matchMain || matchCategoryField;
    });
  }, [currentCategory, products]);

  // Apply subcategory filter, search, and sorting
  const filteredProducts = useMemo(() => {
    let list = [...categoryProducts];

    if (selectedSubcat !== "all") {
      const subLower = selectedSubcat.toLowerCase();
      list = list.filter(
        (p) =>
          p.subCategory?.toLowerCase() === subLower ||
          p.subCategory?.toLowerCase().includes(subLower) ||
          p.tagline?.toLowerCase().includes(subLower) ||
          p.name?.toLowerCase().includes(subLower)
      );
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.fragranceNotes?.some((n) => n.toLowerCase().includes(q)) ||
          p.keyIngredients?.some((i) => i.toLowerCase().includes(q)) ||
          p.subCategory?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    } else if (sortBy === "reviews") {
      list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    return list;
  }, [categoryProducts, selectedSubcat, sortBy, searchQuery]);

  // Fallback view when category is not found or still loading from database
  if (!currentCategory) {
    if (!isLoaded) {
      return (
        <div className="site-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar onSearchChange={(q) => setSearchQuery(q)} />
          <CategoryPageSkeleton />
          <Footer />
          <CartDrawer />
          <QuickViewModal />
          <WhatsAppEnquiryModal />
          <Toast />
        </div>
      );
    }

    return (
      <div className="site-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar onSearchChange={(q) => setSearchQuery(q)} />
        <main id="main-content" style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 1.5rem", backgroundColor: "#faf8f5" }}>
          <div className="container" style={{ maxWidth: "600px", textAlign: "center" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "var(--color-cream-subtle)",
                color: "var(--color-terracotta)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Layers size={32} />
            </div>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", marginBottom: "0.75rem" }}>
              Collection Not Found
            </h1>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.6 }}>
              We could not find the artisanal soap collection you requested. Explore our complete botanical vault on the homepage.
            </p>
            <Link href="/#categories" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              Explore All Collections <ArrowRight size={16} />
            </Link>
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

  const bannerImg =
    currentCategory.bannerImage ||
    currentCategory.image ||
    "/images/products/dragons-blood.jpg";

  const bannerHeadline =
    currentCategory.bannerHeadline || currentCategory.name;

  const bannerDesc =
    currentCategory.bannerSubheadline ||
    currentCategory.description ||
    "Handcrafted cold-process soap bars formulated with sacred resins, wild botanicals, and unrefined plant butters.";

  return (
    <div className="site-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 1. Universal Sticky Navbar */}
      <Navbar onSearchChange={(q) => setSearchQuery(q)} />

      {/* 2. Main Page Content */}
      <main id="main-content" style={{ flexGrow: 1, backgroundColor: "#faf8f5", paddingBottom: "5rem" }}>
        {/* Category Hero Banner */}
        <section
          className="category-hero-banner"
          style={{
            position: "relative",
            minHeight: "clamp(280px, 35vw, 420px)",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#161618",
            color: "#ffffff",
            overflow: "hidden",
            borderBottom: "1px solid rgba(225, 113, 89, 0.25)",
          }}
        >
          {/* Background Image with Dark Terracotta Gradient */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <Image
              src={bannerImg}
              alt={currentCategory.name}
              fill
              priority
              sizes="100vw"
              style={{
                objectFit: "cover",
                filter: "brightness(0.32) saturate(1.15)",
                transform: "scale(1.04)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to right, rgba(17, 17, 19, 0.94) 0%, rgba(24, 24, 27, 0.82) 55%, rgba(225, 113, 89, 0.28) 100%)",
              }}
            />
          </div>

          <div
            className="container"
            style={{
              position: "relative",
              zIndex: 2,
              paddingTop: "clamp(2rem, 5vw, 4rem)",
              paddingBottom: "clamp(2rem, 5vw, 4rem)",
            }}
          >
            {/* Breadcrumbs Navigation */}
            <nav
              aria-label="Breadcrumb"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.8rem",
                color: "#a1a1aa",
                marginBottom: "1rem",
                fontWeight: 600,
                flexWrap: "wrap",
              }}
            >
              <Link href="/" style={{ color: "#d4d4d8", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Home size={13} /> Home
              </Link>
              <ChevronRight size={12} />
              <Link href="/#categories" style={{ color: "#d4d4d8", textDecoration: "none" }}>
                Collections
              </Link>
              <ChevronRight size={12} />
              <span style={{ color: "var(--color-terracotta)", fontWeight: 700 }}>
                {currentCategory.name}
              </span>
            </nav>

            {/* Curated Category Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: "rgba(225, 113, 89, 0.22)",
                color: "#ffaa96",
                padding: "4px 12px",
                borderRadius: "9999px",
                fontSize: "0.74rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
                border: "1px solid rgba(225, 113, 89, 0.35)",
              }}
            >
              <Sparkles size={12} />
              {currentCategory.badge || "Signature Botanical"}
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
                margin: "0 0 0.85rem",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#ffffff",
                maxWidth: "850px",
                letterSpacing: "-0.01em",
              }}
            >
              {bannerHeadline}
            </h1>

            {/* Description */}
            <p
              style={{
                fontSize: "clamp(0.92rem, 1.5vw, 1.05rem)",
                color: "#d4d4d8",
                maxWidth: "700px",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {bannerDesc}
            </p>

            {/* Botanical Meta Highlights */}
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
                fontSize: "0.82rem",
                color: "#d4d4d8",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                🌿 <strong>{categoryProducts.length}</strong> Formulations
              </span>
              <span>•</span>
              <span>⏱️ <strong>Cold-Poured 6-Week Curing</strong></span>
              <span>•</span>
              <span>🌱 <strong>100% Biodegradable &amp; Clean</strong></span>
            </div>
          </div>
        </section>

        {/* Filter & Subcategory Navigation Bar */}
        <section
          style={{
            backgroundColor: "#ffffff",
            borderBottom: "1px solid var(--color-border)",
            padding: "0.85rem 0",
            position: "sticky",
            top: "70px",
            zIndex: 30,
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.03)",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.85rem",
            }}
          >
            {/* Horizontal Scrolling Subcategory Pills */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                overflowX: "auto",
                maxWidth: "100%",
                paddingBottom: "2px",
                scrollbarWidth: "none",
              }}
            >
              <span
                style={{
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  color: "var(--color-text-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginRight: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                Subcategory:
              </span>

              <button
                type="button"
                onClick={() => setSelectedSubcat("all")}
                style={{
                  padding: "0.4rem 0.95rem",
                  borderRadius: "9999px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  border: "1px solid",
                  borderColor: selectedSubcat === "all" ? "var(--color-terracotta)" : "var(--color-border)",
                  backgroundColor: selectedSubcat === "all" ? "var(--color-terracotta)" : "#ffffff",
                  color: selectedSubcat === "all" ? "#ffffff" : "var(--color-text-secondary)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                All in {currentCategory.name} ({categoryProducts.length})
              </button>

              {availableSubcategories.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSubcat(sub)}
                  style={{
                    padding: "0.4rem 0.95rem",
                    borderRadius: "9999px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    border: "1px solid",
                    borderColor: selectedSubcat === sub ? "var(--color-terracotta)" : "var(--color-border)",
                    backgroundColor: selectedSubcat === sub ? "var(--color-terracotta)" : "#ffffff",
                    color: selectedSubcat === sub ? "#ffffff" : "var(--color-text-secondary)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              <SlidersHorizontal size={14} color="var(--color-text-tertiary)" />
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "0.4rem 0.75rem",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  backgroundColor: "#ffffff",
                  color: "var(--color-dragon-black)",
                  cursor: "pointer",
                  outline: "none",
                }}
                aria-label="Sort products by"
              >
                <option value="featured">Featured Artisanal Order</option>
                <option value="rating">Highest Rating (5★)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>
        </section>

        {/* 3. Product Catalog Grid (Responsive for Mobile, Laptop, and 4K) */}
        <section className="container" style={{ paddingTop: "2.5rem" }}>
          {filteredProducts.length === 0 ? (
            <div
              style={{
                padding: "4rem 1.5rem",
                textAlign: "center",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "var(--color-cream-subtle)",
                  color: "var(--color-text-tertiary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1rem",
                }}
              >
                <Filter size={24} />
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", margin: "0 0 0.5rem" }}>
                No Bars Match the Selected Filter
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                Try selecting &ldquo;All&rdquo; or explore other botanical collections in our atelier.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setSelectedSubcat("all");
                  setSearchQuery("");
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="soap-grid-4">
              {filteredProducts.map((soap) => (
                <ProductCard key={soap.id || (soap as any)._id} soap={soap as any} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 4. Brand Footer */}
      <Footer />

      {/* 5. Floating Overlays & Modals */}
      <CartDrawer />
      <QuickViewModal />
      <WhatsAppEnquiryModal />
      <Toast />
    </div>
  );
}

export default function CategoryDetailPage() {
  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryContent />
    </Suspense>
  );
}
