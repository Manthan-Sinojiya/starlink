"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-top-grid">
          {/* Brand Bio */}
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
                  src="/images/logo.png"
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

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--color-terracotta)" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.08em" }}>
                100% COLD PROCESS • PLASTIC FREE
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4>Curated Collections</h4>
            <ul>
              <li>
                <Link href="#bestsellers">Signature Best Sellers</Link>
              </li>
              <li>
                <Link href="#festival-offers">
                  Festival Offers <span style={{ color: "var(--color-terracotta)" }}>(25% Off)</span>
                </Link>
              </li>
              <li>
                <Link href="#all-soaps">Dragon&apos;s Blood Series</Link>
              </li>
              <li>
                <Link href="#all-soaps">Charcoal &amp; Herbal Detox</Link>
              </li>
              <li>
                <Link href="#all-soaps">Kashmiri Saffron &amp; Honey</Link>
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
                <a href="mailto:care@starlightsoaps.com">care@starlightsoaps.com</a>
              </li>
              <li>
                <Link href="#ritual">Our Saponification Method</Link>
              </li>
              <li>
                <Link href="#reviews">Verified Customer Reviews</Link>
              </li>
              <li>
                <Link href="#festival-offers">Holiday Gift Sets &amp; Hampers</Link>
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
