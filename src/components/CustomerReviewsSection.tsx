"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { useDBStore, DEFAULT_SITE_SETTINGS } from "@/context/DBStoreContext";

export default function CustomerReviewsSection() {
  const { siteSettings } = useDBStore();
  const reviewsSection = siteSettings?.reviewsSection || DEFAULT_SITE_SETTINGS.reviewsSection;
  const reviews =
    reviewsSection.reviews && reviewsSection.reviews.length > 0
      ? reviewsSection.reviews
      : DEFAULT_SITE_SETTINGS.reviewsSection.reviews;

  return (
    <section id="reviews" className="reviews-section" aria-label="Customer Reviews">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{reviewsSection.tag || "Tested & Loved"}</span>
          <h2 className="section-title">{reviewsSection.title || "Skin Stories from Our Community"}</h2>
          <p className="section-subtitle">
            {reviewsSection.subtitle ||
              "Over 14,000 satisfied customers have swapped commercial harsh cleansers for our gentle botanical cold-process soaps."}
          </p>
        </div>

        <div className="reviews-grid-3">
          {reviews.map((rev, index) => {
            const initials =
              rev.initials ||
              rev.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

            return (
              <div key={rev.id || index} className="review-card">
                <div className="review-card-stars">
                  {[...Array(Math.min(5, Math.max(1, rev.rating || 5)))].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <blockquote className="review-card-quote">{rev.review}</blockquote>

                <div className="review-author">
                  <div className="author-avatar">{initials}</div>
                  <div className="author-info">
                    <h4>{rev.name}</h4>
                    <p>
                      {rev.location ? `${rev.location} • ` : ""}
                      {rev.verified && (
                        <span style={{ color: "var(--color-terracotta)", fontWeight: 600 }}>
                          <CheckCircle size={11} style={{ display: "inline", verticalAlign: "middle" }} /> Verified Buyer
                        </span>
                      )}
                    </p>
                    {rev.soapPurchased && (
                      <p style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
                        Ordered: {rev.soapPurchased}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
