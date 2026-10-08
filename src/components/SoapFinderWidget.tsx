"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShoppingBag, Check, RefreshCw } from "lucide-react";
import { SOAPS } from "@/data/soaps";
import { useCart } from "@/context/CartContext";

export default function SoapFinderWidget() {
  const { addToCart } = useCart();
  const [selectedGoal, setSelectedGoal] = useState<string>("glow");
  const [selectedScent, setSelectedScent] = useState<string>("warm");
  const [added, setAdded] = useState(false);

  const goals = [
    { id: "glow", label: "Luminous Glow", desc: "For dull, uneven or tired skin" },
    { id: "detox", label: "Pore Detox", desc: "For congested, oily or acne-prone skin" },
    { id: "hydration", label: "Royal Hydration", desc: "For dry, parched or flaky skin" },
    { id: "calming", label: "Calm & Relax", desc: "For reactive skin or nighttime sleep" },
  ];

  const scents = [
    { id: "warm", label: "Amber & Sacred Resins" },
    { id: "citrus", label: "Zesty Blood Orange & Citrus" },
    { id: "herbal", label: "Crisp Tea Tree & Mint" },
    { id: "floral", label: "Damask Rose & Lavender" },
  ];

  // Match the soap based on preferences
  const getMatchedSoap = () => {
    if (selectedGoal === "detox") {
      return selectedScent === "herbal" ? SOAPS[1] : SOAPS[7]; // Charcoal or Matcha
    }
    if (selectedGoal === "hydration") {
      return selectedScent === "warm" ? SOAPS[5] : SOAPS[3]; // Oud or Saffron
    }
    if (selectedGoal === "calming") {
      return selectedScent === "floral" ? SOAPS[4] : SOAPS[6]; // Damask Rose or Lavender
    }
    // Default glow
    return selectedScent === "citrus" ? SOAPS[2] : SOAPS[0]; // Terracotta Orange or Dragon's Blood
  };

  const matchedSoap = getMatchedSoap();

  const handleAddMatched = () => {
    addToCart(matchedSoap, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <section className="soap-finder-section" style={{ padding: "clamp(2rem, 3.5vw, 3rem) 0", background: "linear-gradient(135deg, #fff5f0 0%, #fffbf8 100%)", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
      <div className="container">
        <div style={{ width: "100%", margin: "0 auto", background: "white", borderRadius: "var(--radius-lg)", border: "1.5px solid var(--color-border)", padding: "clamp(1.75rem, 3.5vw, 2.75rem)", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span className="section-tag">
              <Sparkles size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
              Interactive Botanical Matchmaker
            </span>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 2.8vw, 2.3rem)", color: "var(--color-dragon-black)", fontWeight: 800, marginBottom: "0.4rem" }}>
              Find Your Skin&apos;s Signature Soap Bar
            </h2>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.92rem", maxWidth: "600px", margin: "0 auto" }}>
              Select your primary skin need and aromatic preference to discover your bespoke cold-process remedy.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }} className="finder-grid">
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.75rem" }}>
              {/* Step 1: Skin Goal */}
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-dragon-black)", marginBottom: "0.65rem" }}>
                  Step 1: Your Primary Skin Goal
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
                  {goals.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGoal(g.id)}
                      style={{
                        padding: "0.75rem 0.95rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1.5px solid " + (selectedGoal === g.id ? "var(--color-terracotta)" : "var(--color-border)"),
                        background: selectedGoal === g.id ? "var(--color-terracotta-light)" : "white",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: selectedGoal === g.id ? "var(--color-terracotta-dark)" : "var(--color-dragon-black)" }}>
                        {g.label}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
                        {g.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Scent Preference */}
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-dragon-black)", marginBottom: "0.65rem" }}>
                  Step 2: Preferred Botanical Aroma
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
                  {scents.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedScent(s.id)}
                      style={{
                        padding: "0.65rem 0.95rem",
                        borderRadius: "var(--radius-sm)",
                        border: "1.5px solid " + (selectedScent === s.id ? "var(--color-dragon-black)" : "var(--color-border)"),
                        background: selectedScent === s.id ? "var(--color-dragon-black)" : "white",
                        color: selectedScent === s.id ? "white" : "var(--color-text-secondary)",
                        textAlign: "left",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Match Result Reveal Card */}
            <div
              style={{
                background: "var(--color-cream-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1.5px solid var(--color-border)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  background: "var(--color-terracotta)",
                  color: "white",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "9999px",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                ✨ Your Bespoke Formula
              </div>

              <div style={{ width: "140px", height: "140px", borderRadius: "16px", overflow: "hidden", margin: "0.75rem 0 1rem", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-md)" }}>
                <Image
                  src={matchedSoap.image}
                  alt={matchedSoap.name}
                  width={140}
                  height={140}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>

              <div style={{ fontSize: "0.74rem", fontWeight: 700, color: "var(--color-terracotta)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {matchedSoap.cureTime} • {matchedSoap.weight}
              </div>

              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-dragon-black)", margin: "0.3rem 0 0.5rem" }}>
                {matchedSoap.name}
              </h3>

              <p style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "1rem", maxWidth: "340px" }}>
                {matchedSoap.tagline}
              </p>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-dragon-black)" }}>
                  ${matchedSoap.price.toFixed(2)}
                </span>
                {matchedSoap.originalPrice && (
                  <span style={{ textDecoration: "line-through", color: "var(--color-text-tertiary)", fontSize: "0.9rem" }}>
                    ${matchedSoap.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", width: "100%", maxWidth: "320px" }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flexGrow: 1, padding: "0.65rem 1.25rem", fontSize: "0.88rem" }}
                  onClick={handleAddMatched}
                >
                  {added ? (
                    <>
                      <Check size={16} /> Added
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} /> Add to Bag
                    </>
                  )}
                </button>

                <Link
                  href={`/products/${matchedSoap.id}`}
                  className="btn-secondary"
                  style={{ padding: "0.65rem 1rem", fontSize: "0.85rem", whiteSpace: "nowrap" }}
                >
                  Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 860px) {
          .finder-grid {
            grid-template-columns: 1.25fr 0.85fr !important;
          }
        }
      `}</style>
    </section>
  );
}
