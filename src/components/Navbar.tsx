"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { SOAPS, FESTIVAL_PROMO, CATEGORIES_DATA, Soap } from "@/data/soaps";

interface NavbarProps {
  onSearchChange?: (query: string) => void;
}

export default function Navbar({ onSearchChange }: NavbarProps) {
  const { cartCount, wishlist, setIsCartOpen, setQuickViewSoap, showToast } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Soap[]>([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);

    if (val.trim().length > 1) {
      const filtered = SOAPS.filter(
        (s) =>
          s.name.toLowerCase().includes(val.toLowerCase()) ||
          s.mainCategory.toLowerCase().includes(val.toLowerCase()) ||
          s.subCategory.toLowerCase().includes(val.toLowerCase()) ||
          s.fragranceNotes.some((n) => n.toLowerCase().includes(val.toLowerCase())) ||
          s.keyIngredients.some((i) => i.toLowerCase().includes(val.toLowerCase()))
      );
      setSearchResults(filtered);
      setIsSearchDropdownOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchDropdownOpen(false);
    }
  };

  const handleSelectSearchResult = (soap: Soap) => {
    setQuickViewSoap(soap);
    setIsSearchDropdownOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* Top Festival Announcement Bar */}
      <div className="announcement-bar" role="region" aria-label="Special Offers">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <span>
            <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px", color: "var(--color-terracotta)" }} />
            GRAND FESTIVE CELEBRATION: CODE <strong style={{ letterSpacing: "0.08em" }}>{FESTIVAL_PROMO.code}</strong> FOR 25% OFF
          </span>
          <span className="badge-pill">LIMITED TIME</span>
          <span>FREE KEEPSAKE BOX ON ORDERS $50+</span>
        </div>
      </div>

      {/* Main Sticky Header with Modern Logo UI */}
      <header className={`site-header ${isScrolled ? "scrolled" : ""}`}>
        <div className="container">
          <nav className="navbar-inner" aria-label="Main Navigation">
            {/* Updated Modern Brand Logo */}
            <Link href="/" className="brand-logo-link" aria-label="Star Light Co. Home">
              <div className="brand-dragon-crest">
                <Image
                  src="/images/logo.png"
                  alt="Star Light Co. Dragon Crest"
                  width={52}
                  height={52}
                  priority
                  style={{ objectFit: "cover", width: "auto", height: "auto" }}
                />
              </div>
              <div className="brand-title-group">
                <span className="brand-name">STAR LIGHT CO.</span>
                <span className="brand-subtitle">ARTISANAL APOTHECARY</span>
              </div>
            </Link>

            {/* Desktop Navigation Links with Category Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }} className="desktop-links-container">
              <Link href="/#bestsellers" className="nav-link">
                Best Sellers
              </Link>
              <Link href="/#festival-offers" className="nav-link" style={{ display: "flex", alignItems: "center" }}>
                Festival Offers
                <span className="nav-festive-badge">25% OFF</span>
              </Link>

              {/* Categories Link with Hover Menu */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <Link href="/#all-soaps" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                  Categories <ChevronDown size={14} />
                </Link>

                {isCategoryMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "-20px",
                      width: "280px",
                      background: "white",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-xl)",
                      border: "1px solid var(--color-border)",
                      padding: "0.75rem",
                      zIndex: 90,
                    }}
                  >
                    {CATEGORIES_DATA.filter((c) => c.id !== "all").map((cat) => (
                      <Link
                        key={cat.id}
                        href="/#all-soaps"
                        onClick={() => setIsCategoryMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "0.6rem 0.75rem",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          color: "var(--color-dragon-black)",
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-cream-subtle)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <div>{cat.name}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", fontWeight: 500 }}>
                          {cat.subcategories.slice(0, 2).join(" • ")}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/#ritual" className="nav-link">
                The Ritual
              </Link>
              <Link href="/#reviews" className="nav-link">
                Reviews
              </Link>
            </div>

            {/* Right Action Icons & Search */}
            <div className="header-actions">
              {/* Search with Live Dropdown */}
              <div className="search-bar-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search soaps or scents..."
                  className="search-input"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => searchQuery.length > 1 && setIsSearchDropdownOpen(true)}
                  aria-label="Search soaps"
                />

                {isSearchDropdownOpen && searchResults.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: "320px",
                      background: "white",
                      borderRadius: "var(--radius-md)",
                      boxShadow: "var(--shadow-xl)",
                      border: "1px solid var(--color-border)",
                      padding: "0.75rem",
                      zIndex: 80,
                      maxHeight: "360px",
                      overflowY: "auto",
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", textTransform: "uppercase", fontWeight: 700, padding: "0.3rem 0.5rem" }}>
                      Found {searchResults.length} Formula(s)
                    </div>
                    {searchResults.map((soap) => (
                      <div
                        key={soap.id}
                        onClick={() => handleSelectSearchResult(soap)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.6rem",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-cream-subtle)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                      >
                        <Image
                          src={soap.image}
                          alt={soap.name}
                          width={44}
                          height={44}
                          style={{ borderRadius: "8px", objectFit: "cover" }}
                        />
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-dragon-black)" }}>
                            {soap.name}
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "var(--color-terracotta)", fontWeight: 700 }}>
                            ${soap.price.toFixed(2)} • {soap.subCategory}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                type="button"
                className="action-btn"
                onClick={() => {
                  if (wishlist.length === 0) {
                    showToast("Your wishlist is empty. Tap the heart on any soap!");
                  } else {
                    showToast(`You have ${wishlist.length} item(s) in your wishlist ❤️`);
                  }
                }}
                aria-label={`Wishlist items: ${wishlist.length}`}
              >
                <Heart size={18} />
                {wishlist.length > 0 && <span className="action-badge">{wishlist.length}</span>}
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                className="cart-cta-btn"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping Cart with ${cartCount} items`}
              >
                <ShoppingBag size={17} />
                <span style={{ display: "none" }} className="cart-text-label">Bag</span>
                <span
                  style={{
                    background: "rgba(255, 255, 255, 0.28)",
                    padding: "0.1rem 0.5rem",
                    borderRadius: "9999px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                  }}
                >
                  {cartCount}
                </span>
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            style={{
              background: "white",
              borderTop: "1px solid var(--color-border)",
              padding: "1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div className="search-bar-wrap" style={{ display: "block", width: "100%" }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search soaps or scents..."
                className="search-input"
                style={{ width: "100%" }}
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.95rem", fontWeight: 700 }}>
              <Link
                href="/#bestsellers"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0", borderBottom: "1px solid var(--color-cream-subtle)" }}
              >
                Best Sellers
              </Link>
              <Link
                href="/#festival-offers"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0", color: "var(--color-terracotta)", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <span>Festival Offers</span>
                <span className="nav-festive-badge">25% OFF</span>
              </Link>
              <Link
                href="/#all-soaps"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0", borderBottom: "1px solid var(--color-cream-subtle)" }}
              >
                Categories &amp; Subcategories
              </Link>
              <Link
                href="/#ritual"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0", borderBottom: "1px solid var(--color-cream-subtle)" }}
              >
                The Soap Ritual
              </Link>
              <Link
                href="/#reviews"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0" }}
              >
                Customer Reviews
              </Link>
            </div>
          </div>
        )}
      </header>

      <style jsx>{`
        @media (max-width: 1023px) {
          .desktop-links-container {
            display: none !important;
          }
        }
        @media (min-width: 600px) {
          .cart-text-label {
            display: inline !important;
          }
        }
      `}</style>
    </>
  );
}
