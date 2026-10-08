"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";

export default function CustomerReviewsSection() {
  const reviews = [
    {
      name: "Seraphina Vance",
      location: "San Francisco, CA",
      verified: true,
      soapPurchased: "Dragon's Blood & Smoked Amber",
      rating: 5,
      review:
        "“I threw away all liquid body washes after one shower with Star Light Co. The lather is creamy like dense whipped velvet, and the scent of warm amber and star anise lingers subtly all day without being overpowering. My skin has never felt this hydrated.”",
      initials: "SV",
    },
    {
      name: "Julian Thorne",
      location: "London, UK",
      verified: true,
      soapPurchased: "Festival Dragon's Glow Gift Set",
      rating: 5,
      review:
        "“The packaging alone is worth an art exhibit. The dark collector box with the terracotta ribbon and dragon seal blew my partner away. The soaps with the gold leaf look and smell like imperial apothecary treasures. Will be buying these as gifts every season!”",
      initials: "JT",
    },
    {
      name: "Aria Montgomery",
      location: "Austin, TX",
      verified: true,
      soapPurchased: "Kashmiri Saffron & Raw Honey",
      rating: 5,
      review:
        "“The saffron threads and goat milk formula completely healed my winter dryness in less than a week. You can feel the real cold-process glycerin difference immediately. Plus, knowing it comes in plastic-free terracotta packaging makes it even better.”",
      initials: "AM",
    },
  ];

  return (
    <section id="reviews" className="reviews-section" aria-label="Customer Reviews">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Tested &amp; Loved</span>
          <h2 className="section-title">Skin Stories from Our Community</h2>
          <p className="section-subtitle">
            Over 14,000 satisfied customers have swapped commercial harsh cleansers for 
            our gentle botanical cold-process soaps.
          </p>
        </div>

        <div className="reviews-grid-3">
          {reviews.map((rev, index) => (
            <div key={index} className="review-card">
              <div className="review-card-stars">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <blockquote className="review-card-quote">{rev.review}</blockquote>

              <div className="review-author">
                <div className="author-avatar">{rev.initials}</div>
                <div className="author-info">
                  <h4>{rev.name}</h4>
                  <p>
                    {rev.location} •{" "}
                    <span style={{ color: "var(--color-terracotta)", fontWeight: 600 }}>
                      <CheckCircle size={11} style={{ display: "inline", verticalAlign: "middle" }} /> Verified Buyer
                    </span>
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
                    Ordered: {rev.soapPurchased}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
