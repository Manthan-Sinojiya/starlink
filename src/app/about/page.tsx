"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Clock,
  Droplets,
  Heart,
  Award,
  Layers,
  CheckCircle2,
  Gift,
  MessageCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import WhatsAppEnquiryModal from "@/components/WhatsAppEnquiryModal";
import Toast from "@/components/Toast";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";
import { openWhatsAppDirect } from "@/utils/whatsapp";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function AboutPage() {

  return (
    <>
      <div className="site-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <main id="main-content" style={{ flexGrow: 1 }}>
          {/* Hero Banner */}
          <section
            style={{
              position: "relative",
              padding: "clamp(3rem, 6vw, 5.5rem) 0 clamp(2.5rem, 5vw, 4rem)",
              backgroundColor: "var(--color-cream-subtle)",
              borderBottom: "1px solid var(--color-border)",
              overflow: "hidden",
            }}
          >
            <div className="container" style={{ position: "relative", zIndex: 2 }}>
              <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "rgba(225, 113, 89, 0.12)",
                    color: "var(--color-terracotta)",
                    border: "1px solid rgba(225, 113, 89, 0.25)",
                    padding: "0.35rem 1rem",
                    borderRadius: "9999px",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: "1.25rem",
                  }}
                >
                  <Sparkles size={13} /> The Artisanal Apothecary Story
                </span>

                <h1
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(2.3rem, 4.5vw, 3.8rem)",
                    lineHeight: 1.15,
                    fontWeight: 800,
                    color: "var(--color-dragon-black)",
                    letterSpacing: "-0.01em",
                    marginBottom: "1.25rem",
                  }}
                >
                  Ancient Botanicals. <br />
                  <span style={{ color: "var(--color-terracotta)" }}>Patient Slow-Cured</span> Mastery.
                </h1>

                <p
                  style={{
                    fontSize: "clamp(1.05rem, 1.3vw, 1.2rem)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                    margin: "0 auto 2rem",
                    maxWidth: "700px",
                  }}
                >
                  Star Light Co. was established with a singular devotion: to resurrect the lost art of true cold-process soapmaking. We reject mass detergent chemistry in pursuit of pure plant lipids, wild tree resins, and slow curing rituals.
                </p>

                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/#all-soaps" className="btn-primary">
                    Explore Soap Formulations <ArrowRight size={17} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => openWhatsAppDirect(null, "Hello Star Light Co.! I would like to enquire with the Atelier Concierge about your luxury artisanal soaps.")}
                    className="btn-secondary"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                  >
                    <WhatsAppIcon size={18} style={{ color: "#25D366" }} /> Atelier Concierge
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Master Visual Grid & Philosophy */}
          <section style={{ padding: "clamp(3rem, 5vw, 5rem) 0", backgroundColor: "#ffffff" }}>
            <div className="container">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "3rem",
                  alignItems: "center",
                }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "relative",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 20px 40px rgba(17, 17, 19, 0.08)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <Image
                      src={CLOUDINARY_IMAGES.dragonsBlood}
                      alt="Artisanal Dragon's Blood Saponification"
                      width={600}
                      height={600}
                      style={{ width: "100%", height: "auto", objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: "1rem",
                        left: "1rem",
                        right: "1rem",
                        padding: "1rem 1.25rem",
                        backgroundColor: "rgba(17, 17, 19, 0.88)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "14px",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.85rem",
                        border: "1px solid rgba(225, 113, 89, 0.35)",
                      }}
                    >
                      <Clock size={24} color="var(--color-terracotta)" />
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "0.92rem" }}>8 to 9 Weeks Curing Vault</div>
                        <div style={{ fontSize: "0.78rem", color: "#d1d5db" }}>Zero heat acceleration. Retains 100% natural glycerin.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="section-tag" style={{ marginBottom: "0.85rem" }}>
                    <Layers size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                    Cold-Process Philosophy
                  </span>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "clamp(1.8rem, 2.8vw, 2.5rem)",
                      fontWeight: 800,
                      color: "var(--color-dragon-black)",
                      lineHeight: 1.25,
                      marginBottom: "1rem",
                    }}
                  >
                    Why Cold-Process Saponification Truly Matters
                  </h2>
                  <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "1.25rem", fontSize: "0.98rem" }}>
                    Commercial supermarket cleansers are manufactured at extreme industrial temperatures, which strips and extracts natural glycerin for resale into synthetic moisturisers. What remains is a harsh detergent surfactant bar that dries dermal layers.
                  </p>
                  <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "1.75rem", fontSize: "0.98rem" }}>
                    At <strong>Star Light Co.</strong>, our saponification never exceeds gentle room temperatures. Through 60 days in our cedar-lined curing vaults, water naturally evaporates while pure vegetable glycerin crystallises into each micro-cell of the bar, leaving your skin soft, soothed, and profoundly supple.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={{ padding: "1rem", backgroundColor: "var(--color-cream-subtle)", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
                      <Leaf size={20} color="var(--color-terracotta)" style={{ marginBottom: "0.35rem" }} />
                      <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.9rem", fontWeight: 700 }}>Zero Palm Oil</h4>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>Ethically compounded with virgin coconut, shea, and avocado lipids.</p>
                    </div>

                    <div style={{ padding: "1rem", backgroundColor: "var(--color-cream-subtle)", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
                      <Droplets size={20} color="var(--color-terracotta)" style={{ marginBottom: "0.35rem" }} />
                      <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.9rem", fontWeight: 700 }}>Dense Velvet Foam</h4>
                      <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>Rich, micro-bubbled cushion that cushions the skin barrier.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4 Pillars of Excellence */}
          <section style={{ padding: "clamp(3.5rem, 5vw, 5rem) 0", backgroundColor: "var(--color-cream-bg)", borderTop: "1px solid var(--color-border)" }}>
            <div className="container">
              <div className="section-header" style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 3rem" }}>
                <span className="section-tag">
                  <Award size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                  Our Botanical Commitments
                </span>
                <h2 className="section-title">The Four Pillars of Star Light Co.</h2>
                <p className="section-subtitle">
                  Every bar that leaves our studio reflects an unhurried, meticulous standard of artisanal formulation.
                </p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "1.75rem",
                }}
              >
                <div className="admin-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "var(--color-terracotta-light)", color: "var(--color-terracotta)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Sparkles size={24} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: 0 }}>Sacred Resins &amp; Clays</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                    We forage and sustainably source rare botanical treasures: wild Socotran Dragon&apos;s Blood resin, Kashmiri Mongra saffron stigmas, and French kaolin clays.
                  </p>
                </div>

                <div className="admin-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "var(--color-terracotta-light)", color: "var(--color-terracotta)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Clock size={24} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: 0 }}>Patience Over Speed</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                    No chemical hardeners or speed cure ovens. We permit nature to cure our bars over 8 full weeks, yielding a longer-lasting bar with exceptional hardness.
                  </p>
                </div>

                <div className="admin-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "var(--color-terracotta-light)", color: "var(--color-terracotta)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldCheck size={24} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: 0 }}>100% Plastic-Free</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                    Conscious luxury means zero single-use plastic. We wrap in breathable unbleached botanical parchment, sealed with molten wax and stamped by hand.
                  </p>
                </div>

                <div className="admin-card" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", backgroundColor: "var(--color-terracotta-light)", color: "var(--color-terracotta)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Heart size={24} />
                  </div>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: 0 }}>Small-Batch Integrity</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                    Each small batch produces only 48 numbered bars. Every bevelled bevel and silk top swirl is unique, testifying to true human artisan craft.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Master Founder Note & Callout */}
          <section style={{ padding: "clamp(3.5rem, 5vw, 5rem) 0", backgroundColor: "#ffffff" }}>
            <div className="container">
              <div
                style={{
                  maxWidth: "860px",
                  margin: "0 auto",
                  backgroundColor: "var(--color-cream-subtle)",
                  borderRadius: "24px",
                  padding: "clamp(2rem, 4vw, 3.5rem)",
                  border: "1px solid var(--color-border)",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 1.5rem", overflow: "hidden", border: "2px solid var(--color-terracotta)" }}>
                  <Image
                    src={CLOUDINARY_IMAGES.logo}
                    alt="Star Light Co. Seal"
                    width={64}
                    height={64}
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <blockquote
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(1.2rem, 2vw, 1.6rem)",
                    fontStyle: "italic",
                    color: "var(--color-dragon-black)",
                    lineHeight: 1.5,
                    margin: "0 0 1.5rem",
                  }}
                >
                  &ldquo;A bathing ritual should not merely be a routine of hygiene; it is a sacred pause in the tumult of modern hours. We pour our hearts, pure oils, and ancient botanical wisdom into every single bar so you may experience tranquility with every lather.&rdquo;
                </blockquote>

                <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--color-dragon-black)" }}>
                  Master Soapmaker &amp; Botanical Alchemist
                </div>
                <div style={{ fontSize: "0.84rem", color: "var(--color-terracotta)", fontWeight: 700, marginTop: "2px" }}>
                  Star Light Co. Artisanal Atelier
                </div>

                <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <Link href="/#all-soaps" className="btn-primary">
                    Shop The Collection <ArrowRight size={16} />
                  </Link>
                  <Link href="/contact" className="btn-secondary">
                    Visit Our Contact Concierge
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      <CartDrawer />
      <QuickViewModal />
      <WhatsAppEnquiryModal />
      <Toast />
    </>
  );
}
