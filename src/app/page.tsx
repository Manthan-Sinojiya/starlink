"use client";
// Starlight Luxury Artisanal Apothecary

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCardsSection from "@/components/CategoryCardsSection";
import BestSellerSection from "@/components/BestSellerSection";
import FestivalOfferSection from "@/components/FestivalOfferSection";
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
import MaintenanceScreen from "@/components/MaintenanceScreen";
import { useDBStore } from "@/context/DBStoreContext";
import { ShieldAlert } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { siteSettings, currentUser, isLoaded } = useDBStore();

  // If Maintenance mode is ON and visitor is not an authenticated administrator
  if (isLoaded && siteSettings?.maintenanceMode && currentUser?.role !== "admin") {
    return <MaintenanceScreen />;
  }

  return (
    <>
      <SeoStructuredData />

      {/* Admin Maintenance Mode Active Banner */}
      {siteSettings?.maintenanceMode && currentUser?.role === "admin" && (
        <div
          style={{
            background: "#b91c1c",
            color: "#ffffff",
            padding: "0.5rem 1rem",
            fontSize: "0.82rem",
            fontWeight: 600,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            zIndex: 9999,
            position: "sticky",
            top: 0,
          }}
        >
          <ShieldAlert size={15} />
          <span>Maintenance Mode is ON. Public visitors cannot access the store.</span>
          <Link
            href="/backoffice"
            style={{
              color: "#ffffff",
              textDecoration: "underline",
              fontWeight: 700,
              marginLeft: "6px",
            }}
          >
            Manage Backoffice →
          </Link>
        </div>
      )}

      {/* Main Page Layout */}
      <div className="site-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Navigation Bar with Sticky Header, Search & Categories */}
        <Navbar onSearchChange={(q) => setSearchQuery(q)} />

        <main id="main-content" style={{ flexGrow: 1 }}>
          {/* 1. Dynamic Hero Showcase with Live Soap Switcher (Same site background) */}
          <HeroSection />

          {/* 2. Category Cards Section with horizontal scrolling */}
          <CategoryCardsSection />

          {/* 3. Best Sellers Section with horizontal scrolling */}
          <BestSellerSection />

          {/* 4. Unified Festival & Secondary Offers Slider Showcase */}
          <FestivalOfferSection />

          {/* 5. The Soap Ritual & Cold Process Philosophy (Admin Managed) */}
          <SoapRitualSection />

          {/* 6. Complete Soap Atelier with Categories & Subcategories */}
          <AllSoapsSection externalSearch={searchQuery} />

          {/* 7. Verified Customer Reviews & Testimonials (Admin Managed) */}
          <CustomerReviewsSection />

          {/* 8. Follow Us / Social Section */}
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
