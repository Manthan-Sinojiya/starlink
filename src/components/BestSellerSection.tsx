"use client";

import React from "react";
import { useDBStore } from "@/context/DBStoreContext";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "./Skeleton";
import { Award } from "lucide-react";

export default function BestSellerSection() {
  const { products, isLoaded } = useDBStore();
  // Grab precisely the top 4 bestseller soaps for the 1-row 4-card layout
  const filteredBestsellers = products.filter((s) => s.isBestseller);
  const bestSellers = (filteredBestsellers.length > 0 ? filteredBestsellers : products).slice(0, 4);

  return (
    <section id="bestsellers" className="bestsellers-section" aria-label="Best Sellers">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <span className="section-tag">
            <Award size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
            Most Cherished Formulas
          </span>
          <h2 className="section-title">Our Best Selling Artisanal Soaps</h2>
          <p className="section-subtitle">
            Slow-cured for up to 8 weeks in small artisan batches. These four signature soap bars represent 
            our most loved skin-rejuvenating recipes.
          </p>
        </div>

        {/* 4 Cards in One Row Grid Layout or Skeletons */}
        <div className="soap-grid-4" id="bestsellers-grid">
          {!isLoaded ? (
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          ) : (
            bestSellers.map((soap) => (
              <ProductCard key={soap.id} soap={soap} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
