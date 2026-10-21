"use client";

import React, { useState, useMemo } from "react";
import { useDBStore } from "@/context/DBStoreContext";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton, Skeleton } from "./Skeleton";
import { Sparkles, SlidersHorizontal, Layers, Check } from "lucide-react";

interface AllSoapsSectionProps {
  externalSearch?: string;
}

export default function AllSoapsSection({ externalSearch = "" }: AllSoapsSectionProps) {
  const { products, categories, isLoaded, isLoadingProducts } = useDBStore();
  const [selectedMainCat, setSelectedMainCat] = useState<string>("all");
  const [selectedSubCat, setSelectedSubCat] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Get active subcategories based on the chosen main category
  const activeCategoryData = categories.find((c) => (c.id && c.id === selectedMainCat) || c.name === selectedMainCat || c.slug === selectedMainCat);
  const subcategories = activeCategoryData ? activeCategoryData.subcategories : [];

  const handleMainCatChange = (catId: string) => {
    setSelectedMainCat(catId);
    setSelectedSubCat("all"); // reset subcategory on main change
  };

  const filteredSoaps = useMemo(() => {
    return products.filter((soap) => {
      // 1. Main Category filter
      if (selectedMainCat !== "all") {
        const catTarget = (activeCategoryData?.name || selectedMainCat).toLowerCase();
        const catSlug = (activeCategoryData?.slug || "").toLowerCase();
        const matchesCat =
          soap.mainCategory?.toLowerCase() === catTarget ||
          soap.category?.toLowerCase() === catTarget ||
          (Boolean(catSlug) && soap.mainCategory?.toLowerCase() === catSlug) ||
          soap.mainCategory?.toLowerCase() === selectedMainCat.toLowerCase();
        if (!matchesCat) return false;
      }

      // 2. Subcategory filter
      if (selectedSubCat !== "all") {
        if (selectedSubCat === "Best Sellers") {
          if (!soap.isBestseller) return false;
        } else if (soap.subCategory?.toLowerCase() !== selectedSubCat.toLowerCase()) {
          return false;
        }
      }

      // 3. Search query filter
      if (externalSearch.trim() !== "") {
        const q = externalSearch.toLowerCase();
        const matchesName = soap.name?.toLowerCase().includes(q);
        const matchesNotes = soap.fragranceNotes?.some((n) => n.toLowerCase().includes(q));
        const matchesIngredients = soap.keyIngredients?.some((i) => i.toLowerCase().includes(q));
        const matchesSub = soap.subCategory?.toLowerCase().includes(q);
        return matchesName || matchesNotes || matchesIngredients || matchesSub;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviewsCount - a.reviewsCount;
      return 0; // default featured
    });
  }, [selectedMainCat, selectedSubCat, sortBy, externalSearch, activeCategoryData, products]);

  return (
    <section id="all-soaps" className="all-soaps-section" aria-label="Sacred Healing & Artisanal Collection">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            The Sacred Healing Atelier
          </span>
          <h2 className="section-title">Sacred Healing Creations &amp; Vibrational Art</h2>
          <p className="section-subtitle">
            Explore handcrafted healing soaps, consecrated stained glass &amp; copper yantras, sacred mandalas, 
            crystal chakra necklaces, and aura cleansers charged with divine frequencies.
          </p>
        </div>

        {/* Category & Sub-Category Interactive System */}
        <div className="category-browser-container">
          {/* Main Category Tabs */}
          <div className="main-category-tabs" role="tablist" aria-label="Main Soap Categories">
            {!isLoaded || isLoadingProducts ? (
              <div style={{ display: "flex", gap: "10px" }}>
                <Skeleton width="130px" height="40px" borderRadius="9999px" />
                <Skeleton width="150px" height="40px" borderRadius="9999px" />
                <Skeleton width="140px" height="40px" borderRadius="9999px" />
                <Skeleton width="160px" height="40px" borderRadius="9999px" />
              </div>
            ) : (
              <>
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedMainCat === "all"}
                  className={`main-cat-tab ${selectedMainCat === "all" ? "active" : ""}`}
                  onClick={() => handleMainCatChange("all")}
                >
                  All Formulations <span style={{ opacity: 0.75, fontSize: "0.76rem" }}>({products.length})</span>
                </button>
                {categories.filter((c) => c.id !== "all" && c.slug !== "all").map((cat) => {
                  const catKey = cat.id || cat.slug || cat.name;
                  const catNameLower = cat.name.toLowerCase();
                  const catSlugLower = (cat.slug || "").toLowerCase();
                  const count = products.filter((s) => 
                    (s.mainCategory && s.mainCategory.toLowerCase() === catNameLower) ||
                    (s.category && s.category.toLowerCase() === catNameLower) ||
                    (catSlugLower && s.mainCategory && s.mainCategory.toLowerCase() === catSlugLower)
                  ).length;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      role="tab"
                      aria-selected={selectedMainCat === catKey || selectedMainCat === cat.name}
                      className={`main-cat-tab ${selectedMainCat === catKey || selectedMainCat === cat.name ? "active" : ""}`}
                      onClick={() => handleMainCatChange(catKey)}
                    >
                      {cat.name} <span style={{ opacity: 0.75, fontSize: "0.76rem" }}>({count})</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Sub-Category Pills and Sort Dropdown */}
          <div className="sub-category-bar">
            <div className="sub-category-pills" role="tablist" aria-label="Sub Categories">
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "4px" }}>
                <Layers size={13} /> Subcategory:
              </span>

              {!isLoaded || isLoadingProducts ? (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Skeleton width="100px" height="32px" borderRadius="9999px" />
                  <Skeleton width="120px" height="32px" borderRadius="9999px" />
                  <Skeleton width="110px" height="32px" borderRadius="9999px" />
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className={`sub-cat-pill ${selectedSubCat === "all" ? "active" : ""}`}
                    onClick={() => setSelectedSubCat("all")}
                  >
                    All in {selectedMainCat === "all" ? "Atelier" : (activeCategoryData?.name || selectedMainCat)}
                  </button>

                  {subcategories.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      className={`sub-cat-pill ${selectedSubCat === sub ? "active" : ""}`}
                      onClick={() => setSelectedSubCat(sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="sort-select-wrap">
              <SlidersHorizontal size={15} color="var(--color-text-secondary)" />
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort soaps by"
              >
                <option value="featured">Featured Artisanal Order</option>
                <option value="rating">Highest Customer Rating (5★)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="reviews">Most Reviewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4 Cards in One Row Responsive Grid or Skeletons */}
        {!isLoaded || isLoadingProducts ? (
          <div className="soap-grid-4">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredSoaps.length > 0 ? (
          <div className="soap-grid-4">
            {filteredSoaps.map((soap) => (
              <ProductCard key={soap.id} soap={soap} />
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "3.5rem 1rem",
              background: "white",
              borderRadius: "var(--radius-md)",
              border: "1px dashed var(--color-border)",
            }}
          >
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", marginBottom: "0.5rem" }}>
              No Soaps Match This Subcategory
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.88rem" }}>
              Try switching subcategories or resetting filters to see all available formulas.
            </p>
            <button
              type="button"
              className="btn-primary"
              style={{ marginTop: "1rem", fontSize: "0.85rem" }}
              onClick={() => {
                setSelectedMainCat("all");
                setSelectedSubCat("all");
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
