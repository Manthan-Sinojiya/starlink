"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Sparkles, Heart, Phone, MessageCircle } from "lucide-react";
import { useDBStore } from "@/context/DBStoreContext";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";

export default function Footer() {
  const { siteSettings, categories } = useDBStore();

  const socialLinks = siteSettings?.socialLinks || {
    instagram: "https://instagram.com/starlightsoaps",
    facebook: "https://facebook.com/starlightsoaps",
    twitter: "https://x.com/starlightsoaps",
  };

  return (
    <footer id="contact" className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Bio & Socials */}
          <div className="footer-brand-bio">
            <div className="footer-logo-wrap">
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "var(--color-terracotta)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  src={CLOUDINARY_IMAGES.logo}
                  alt="Star Light Co."
                  width={42}
                  height={42}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <span className="footer-brand-title">STAR LIGHT CO.</span>
            </div>

            <p className="footer-text">
              Artisanal cold-process apothecary crafting ultra-nourishing botanical soaps. 
              Infused with wild Dragon&apos;s Blood resin, unrefined plant butters, and therapeutic grade botanicals.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--color-terracotta)", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em" }}>
                100% COLD PROCESS • PLASTIC FREE
              </span>
            </div>

            {/* Social Links (Instagram, Facebook, X) */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
              <a
                href={socialLinks.instagram || "https://instagram.com/starlightsoaps"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Star Light on Instagram"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-terracotta)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a
                href={socialLinks.facebook || "https://facebook.com/starlightsoaps"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Star Light on Facebook"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-terracotta)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href={socialLinks.twitter || "https://x.com/starlightsoaps"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Star Light on X (Twitter)"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-terracotta)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                  e.currentTarget.style.transform = "none";
                }}
              >
                {/* Clean X icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Database-driven Botanical Categories */}
          <div className="footer-column">
            <h4>Botanical Categories</h4>
            <ul>
              {categories && categories.length > 0 ? (
                categories.slice(0, 6).map((cat) => {
                  const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                  return (
                    <li key={cat.id || cat.name}>
                      <Link href={`/category/${slug}`}>
                        {cat.name}
                      </Link>
                    </li>
                  );
                })
              ) : (
                <>
                  <li><Link href="#all-soaps">Face &amp; Gentle Cleansing</Link></li>
                  <li><Link href="#all-soaps">Body Polish &amp; Scrub Bars</Link></li>
                  <li><Link href="#all-soaps">Therapeutic &amp; Herbal Healers</Link></li>
                  <li><Link href="#all-soaps">Luxury Scented &amp; Perfumed</Link></li>
                </>
              )}
              <li>
                <Link href="#bestsellers" style={{ color: "var(--color-terracotta)", fontWeight: 600 }}>
                  Signature Best Sellers &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Soap Care Tips */}
          <div className="footer-column">
            <h4>Artisan Soap Care</h4>
            <ul>
              <li>
                <span style={{ color: "#d1d1dc", fontSize: "0.84rem" }}>
                  <strong>Use Slotted Soap Dish:</strong> Air circulation keeps cold-process bars firm.
                </span>
              </li>
              <li>
                <span style={{ color: "#d1d1dc", fontSize: "0.84rem" }}>
                  <strong>Extend Lifespan:</strong> Cut each bar into two pieces for up to 50 washes.
                </span>
              </li>
              <li>
                <span style={{ color: "#d1d1dc", fontSize: "0.84rem" }}>
                  <strong>Aroma Preservation:</strong> Store unboxed bars inside your linen cabinet.
                </span>
              </li>
            </ul>
          </div>

          {/* Customer Service & Guarantees */}
          <div className="footer-column">
            <h4>Customer Concierge</h4>
            <ul>
              <li>
                <a href={`tel:${siteSettings?.contactPhone || "+91 98765 43210"}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <Phone size={13} style={{ color: "var(--color-terracotta)" }} />
                  {siteSettings?.contactPhone || "+91 98765 43210"}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${(siteSettings?.whatsappNumber || "919876543210").replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <MessageCircle size={13} style={{ color: "#25D366" }} />
                  WhatsApp Direct
                </a>
              </li>
              <li>
                <a href={`mailto:${siteSettings?.contactEmail || "care@starlightsoaps.com"}`}>{siteSettings?.contactEmail || "care@starlightsoaps.com"}</a>
              </li>
              <li>
                <Link href="#ritual">Our Saponification Method</Link>
              </li>
              <li>
                <Link href="#reviews">Verified Customer Reviews</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div style={{ color: "#8b8b98" }}>
            &copy; 2026 Star Light Co. Handcrafted Artisanal Soaps. All rights reserved.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <span className="footer-guarantee-pill">
              <ShieldCheck size={16} /> Secure 256-Bit SSL Checkout
            </span>
            <span className="footer-guarantee-pill">
              <Truck size={16} /> Carbon-Neutral Shipping
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
