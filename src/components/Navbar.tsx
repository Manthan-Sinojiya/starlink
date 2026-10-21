"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, Sparkles, ChevronDown, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useDBStore } from "@/context/DBStoreContext";
import { FESTIVAL_PROMO, Soap } from "@/data/soaps";

interface NavbarProps {
  onSearchChange?: (query: string) => void;
}

export default function Navbar({ onSearchChange }: NavbarProps) {
  const { cartCount, setIsCartOpen, setQuickViewSoap } = useCart();
  const { products, categories, currentUser } = useDBStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
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
      const q = val.toLowerCase();
      const filtered = products.filter(
        (s) =>
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.mainCategory && s.mainCategory.toLowerCase().includes(q)) ||
          (s.subCategory && s.subCategory.toLowerCase().includes(q)) ||
          (s.fragranceNotes && s.fragranceNotes.some((n) => n.toLowerCase().includes(q))) ||
          (s.keyIngredients && s.keyIngredients.some((i) => i.toLowerCase().includes(q)))
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
      {/* Top Festival Announcement Bar with Indian Rupee threshold */}
      <div className="announcement-bar" role="region" aria-label="Special Offers">
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "0.5rem" }}>
          <span>
            <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px", color: "var(--color-terracotta)" }} />
            GRAND FESTIVE CELEBRATION: CODE <strong style={{ letterSpacing: "0.08em" }}>{FESTIVAL_PROMO.code}</strong> FOR 25% OFF
          </span>
          <span className="badge-pill">LIMITED TIME</span>
          <span>FREE KEEPSAKE BOX ON ORDERS ₹1,499+</span>
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

            {/* Desktop Navigation Links: Home, About Us, Collection, Festival Offers, Contact Us */}
            <div className="desktop-links-container">
              <Link href="/" className="nav-link">
                Home
              </Link>

              <Link href="/about" className="nav-link">
                About Us
              </Link>

              {/* Collection Link with 2-Column Luxury Mega-Dropdown */}
              <div
                style={{ position: "relative" }}
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <Link
                  href="/#all-soaps"
                  className="nav-link"
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  Collection <ChevronDown size={14} style={{ transform: isCategoryMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }} />
                </Link>

                {isCategoryMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: "-80px",
                      width: "560px",
                      background: "rgba(255, 255, 255, 0.98)",
                      backdropFilter: "blur(16px)",
                      borderRadius: "16px",
                      boxShadow: "0 22px 50px rgba(17, 17, 19, 0.16), 0 4px 16px rgba(225, 113, 89, 0.08)",
                      border: "1px solid var(--color-border)",
                      padding: "1rem 1.15rem 0.85rem",
                      zIndex: 100,
                      maxHeight: "78vh",
                      overflowY: "auto",
                    }}
                  >
                    {/* Header bar */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingBottom: "0.6rem",
                        borderBottom: "1px solid var(--color-cream-subtle)",
                        marginBottom: "0.6rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          color: "var(--color-terracotta)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <Sparkles size={12} /> Curated Botanical Vault
                      </span>
                      <Link
                        href="/#all-soaps"
                        onClick={() => setIsCategoryMenuOpen(false)}
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-text-tertiary)",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        All Formulations ({products.length}) →
                      </Link>
                    </div>

                    {/* 2-Column Category Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.4rem 0.75rem",
                      }}
                    >
                      {categories
                        .filter((c) => c.id !== "all" && c.slug !== "all")
                        .map((cat) => {
                          const count = products.filter(
                            (p) =>
                              p.mainCategory?.toLowerCase() === cat.name.toLowerCase() ||
                              p.category?.toLowerCase() === cat.name.toLowerCase()
                          ).length;

                          return (
                            <Link
                              key={cat.id || cat.slug}
                              href={`/category/${cat.slug || cat.id}`}
                              onClick={() => setIsCategoryMenuOpen(false)}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                padding: "0.55rem 0.75rem",
                                borderRadius: "10px",
                                borderLeft: "2px solid transparent",
                                background: "transparent",
                                transition: "all 0.16s ease",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--color-cream-subtle)";
                                e.currentTarget.style.borderLeftColor = "var(--color-terracotta)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                                e.currentTarget.style.borderLeftColor = "transparent";
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.85rem",
                                    fontWeight: 700,
                                    color: "var(--color-dragon-black)",
                                  }}
                                >
                                  {cat.name}
                                </span>
                                {count > 0 && (
                                  <span
                                    style={{
                                      fontSize: "0.68rem",
                                      fontWeight: 600,
                                      color: "var(--color-terracotta)",
                                      background: "var(--color-terracotta-subtle)",
                                      padding: "1px 6px",
                                      borderRadius: "9999px",
                                    }}
                                  >
                                    {count}
                                  </span>
                                )}
                              </div>
                              {cat.subcategories && cat.subcategories.length > 0 && (
                                <div
                                  style={{
                                    fontSize: "0.71rem",
                                    color: "var(--color-text-tertiary)",
                                    marginTop: "2px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {cat.subcategories.slice(0, 2).join(" · ")}
                                </div>
                              )}
                            </Link>
                          );
                        })}
                    </div>

                    {/* Footer bar */}
                    <div
                      style={{
                        borderTop: "1px solid var(--color-cream-subtle)",
                        marginTop: "0.6rem",
                        paddingTop: "0.55rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.71rem",
                          color: "var(--color-text-tertiary)",
                          fontStyle: "italic",
                        }}
                      >
                        100% Handcrafted · Cold-Process Formulations
                      </span>
                      <Link
                        href="/#all-soaps"
                        onClick={() => setIsCategoryMenuOpen(false)}
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "var(--color-terracotta)",
                        }}
                      >
                        Explore Atelier Catalog →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/#festival-offers" className="nav-link" style={{ display: "flex", alignItems: "center" }}>
                Festival Offers
                <span className="nav-festive-badge">25% OFF</span>
              </Link>

              <Link href="/contact" className="nav-link">
                Contact Us
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
                            ₹{soap.price.toLocaleString("en-IN")} • {soap.subCategory}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                className="cart-cta-btn"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Shopping Cart with ${cartCount} items`}
              >
                <ShoppingBag size={17} />
                <span className="cart-text-label">Bag</span>
                <span className="cart-count-pill">
                  {cartCount}
                </span>
              </button>

              {/* Patron Account / Login Trigger */}
              <Link
                href="/login"
                className="nav-patron-btn"
                title={currentUser ? `Signed in as ${currentUser.name}` : "Patron Sign In / Register"}
              >
                <User size={15} color="var(--color-terracotta)" />
                <span className="cart-text-label">
                  {currentUser ? currentUser.name.split(" ")[0] : "Sign In"}
                </span>
              </Link>

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
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0", borderBottom: "1px solid var(--color-cream-subtle)" }}
              >
                Home
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0", borderBottom: "1px solid var(--color-cream-subtle)" }}
              >
                About Us
              </Link>
              <Link
                href="/#all-soaps"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0", borderBottom: "1px solid var(--color-cream-subtle)" }}
              >
                Collection
              </Link>
              <Link
                href="/#festival-offers"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0", color: "var(--color-terracotta)", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--color-cream-subtle)" }}
              >
                <span>Festival Offers</span>
                <span className="nav-festive-badge">25% OFF</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0", borderBottom: "1px solid var(--color-cream-subtle)" }}
              >
                Contact Us
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ padding: "0.45rem 0", display: "flex", alignItems: "center", gap: "6px" }}
              >
                <User size={16} color="var(--color-terracotta)" />
                <span>{currentUser ? `Account (${currentUser.name})` : "Patron Sign In / Register"}</span>
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
        @media (min-width: 1200px) {
          .cart-text-label {
            display: inline !important;
          }
        }
      `}</style>
    </>
  );
}
