"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCardsSection from "@/components/CategoryCardsSection";
import BestSellerSection from "@/components/BestSellerSection";
import FestivalOfferSection from "@/components/FestivalOfferSection";
import SecondaryOfferSection from "@/components/SecondaryOfferSection";
import SoapRitualSection from "@/components/SoapRitualSection";
import AllSoapsSection from "@/components/AllSoapsSection";
import CustomerReviewsSection from "@/components/CustomerReviewsSection";
import FollowUsSection from "@/components/FollowUsSection";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import WhatsAppEnquiryModal from "@/components/WhatsAppEnquiryModal";
import Toast from "@/components/Toast";
import SeoStructuredData from "@/components/SeoStructuredData";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <SeoStructuredData />

      {/* Main Page Layout */}
      <div className="site-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Navigation Bar with Sticky Header, Search & Categories */}
        <Navbar onSearchChange={(q) => setSearchQuery(q)} />

        <main id="main-content" style={{ flexGrow: 1 }}>
          {/* 1. Dynamic Hero Showcase with Live Soap Switcher (Same site background) */}
          <HeroSection />

          {/* 2. Category Cards Section (Card styled like product type - 4 cards in 1 row) */}
          <CategoryCardsSection />

          {/* 3. Best Sellers Section - Exactly 4 Cards in 1 Row */}
          <BestSellerSection />

          {/* 4. Festival Offer Section with Live Countdown & Box Inspector */}
          <FestivalOfferSection />

          {/* 4b. Secondary Promotional Curation Section */}
          <SecondaryOfferSection />

          {/* 5. The Soap Ritual & Cold Process Philosophy */}
          <SoapRitualSection />

          {/* 6. Complete Soap Atelier with Categories & Subcategories (4 Cards in 1 Row) */}
          <AllSoapsSection externalSearch={searchQuery} />

          {/* 7. Verified Customer Reviews & Testimonials */}
          <CustomerReviewsSection />

          {/* 8. Follow Us / Social Section matching User's Image 2 */}
          <FollowUsSection />
        </main>

        {/* Brand Footer */}
        <Footer />
      </div>

      {/* Floating & Interactive Overlays */}
      <CartDrawer />
      <QuickViewModal />
      <WhatsAppEnquiryModal />
      <Toast />
    </>
  );
}
