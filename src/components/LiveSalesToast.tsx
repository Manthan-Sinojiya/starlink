"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDBStore } from "@/context/DBStoreContext";
import { Sparkles, X } from "lucide-react";

const PATRON_NAMES = [
  { name: "Elena R.", city: "Mumbai, MH", time: "2 minutes ago" },
  { name: "Marcus K.", city: "Bengaluru, KA", time: "6 minutes ago" },
  { name: "Chloe V.", city: "New Delhi, DL", time: "11 minutes ago" },
  { name: "Jonathan S.", city: "Pune, MH", time: "15 minutes ago" },
];

export default function LiveSalesToast() {
  const { products, isLoaded } = useDBStore();
  const [visible, setVisible] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!isLoaded || products.length === 0) return;

    // Show first after 4 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Toggle every 16 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % products.length);
        setVisible(true);
      }, 1500);
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isLoaded, products.length]);

  if (!visible || !isLoaded || products.length === 0) return null;

  const currentSoap = products[currentIdx % products.length];
  const patron = PATRON_NAMES[currentIdx % PATRON_NAMES.length];

  if (!currentSoap) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.75rem",
        left: "1.75rem",
        zIndex: 90,
        background: "white",
        borderRadius: "var(--radius-md)",
        padding: "0.75rem 1rem",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.14)",
        border: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        gap: "0.85rem",
        maxWidth: "360px",
        animation: "slideInLeft 0.35s ease",
      }}
      role="status"
      aria-live="polite"
    >
      <div style={{ width: "46px", height: "46px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, border: "1px solid var(--color-border)" }}>
        <Image
          src={currentSoap.image}
          alt={currentSoap.name}
          width={46}
          height={46}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>

      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
          <Sparkles size={11} color="var(--color-terracotta)" />
          <span>{patron.name} from {patron.city}</span>
        </div>
        <Link href={`/products/${currentSoap.id}`} style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--color-dragon-black)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
          Purchased {currentSoap.name}
        </Link>
        <div style={{ fontSize: "0.7rem", color: "var(--color-terracotta)", fontWeight: 600 }}>
          {patron.time} • Verified Customer
        </div>
      </div>

      <button
        type="button"
        onClick={() => setVisible(false)}
        style={{ color: "#a0a0ad", padding: "2px", cursor: "pointer" }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-40px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @media (max-width: 600px) {
          div[role="status"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
