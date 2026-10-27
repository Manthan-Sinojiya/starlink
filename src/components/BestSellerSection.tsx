"use client";

import React, { useRef } from "react";
import { useDBStore } from "@/context/DBStoreContext";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "./Skeleton";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";

export default function BestSellerSection() {
  const { products, isLoaded } = useDBStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Grab the bestseller soaps (show all bestsellers or top formulas in the scrollable track)
  const filteredBestsellers = products.filter((s) => s.isBestseller);
  const bestSellers = filteredBestsellers.length > 0 ? filteredBestsellers : products.slice(0, 8);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = Math.max(300, scrollRef.current.clientWidth * 0.75);
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="bestsellers" className="bestsellers-section" aria-label="Best Sellers">
      <div className="container">
        {/* Section Header with Scroll Controls */}
        <div className="section-header" style={{ position: "relative" }}>
          <span className="section-tag">
            <Award size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
            Most Cherished Formulas
          </span>
          <h2 className="section-title">Our Best Selling Artisanal Soaps</h2>
          <p className="section-subtitle">
            Slow-cured for up to 8 weeks in small artisan batches. These signature soap bars represent 
            our most loved skin-rejuvenating recipes.
          </p>

          {/* Left/Right Scroll Controls */}
          <div className="section-scroll-arrows-wrap">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              className="section-scroll-arrow-btn"
              aria-label="Scroll bestsellers left"
              title="Previous soaps"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              className="section-scroll-arrow-btn"
              aria-label="Scroll bestsellers right"
              title="Next soaps"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Left-to-Right Scrolling Track for Best Selling Soaps */}
        <div
          ref={scrollRef}
          className="horizontal-scroll-track bestseller-scroll-track"
          id="bestsellers-grid"
          tabIndex={0}
          role="region"
          aria-label="Horizontal scroll of best selling soaps"
        >
          {!isLoaded ? (
            <>
              <div className="horizontal-scroll-item bestseller-scroll-item"><ProductCardSkeleton /></div>
              <div className="horizontal-scroll-item bestseller-scroll-item"><ProductCardSkeleton /></div>
              <div className="horizontal-scroll-item bestseller-scroll-item"><ProductCardSkeleton /></div>
              <div className="horizontal-scroll-item bestseller-scroll-item"><ProductCardSkeleton /></div>
            </>
          ) : (
            bestSellers.map((soap) => (
              <div key={soap.id} className="horizontal-scroll-item bestseller-scroll-item">
                <ProductCard soap={soap} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
