"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SOAPS } from "@/data/soaps";
import { Sparkles, X } from "lucide-react";

export default function LiveSalesToast() {
  const [visible, setVisible] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  const notifications = [
    { name: "Elena R.", city: "Seattle, WA", soap: SOAPS[0], time: "2 minutes ago" },
    { name: "Marcus K.", city: "Denver, CO", soap: SOAPS[8], time: "6 minutes ago" },
    { name: "Chloe V.", city: "Miami, FL", soap: SOAPS[3], time: "11 minutes ago" },
    { name: "Jonathan S.", city: "Chicago, IL", soap: SOAPS[2], time: "15 minutes ago" },
  ];

  useEffect(() => {
    // Show first after 4 seconds
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 4000);

    // Toggle every 16 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIdx((prev) => (prev + 1) % notifications.length);
        setVisible(true);
      }, 1500);
    }, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [notifications.length]);

  if (!visible) return null;

  const item = notifications[currentIdx];

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
          src={item.soap.image}
          alt={item.soap.name}
          width={46}
          height={46}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>

      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
          <Sparkles size={11} color="var(--color-terracotta)" />
          <span>{item.name} from {item.city}</span>
        </div>
        <Link href={`/products/${item.soap.id}`} style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--color-dragon-black)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
          Purchased {item.soap.name}
        </Link>
        <div style={{ fontSize: "0.7rem", color: "var(--color-terracotta)", fontWeight: 600 }}>
          {item.time} • Verified Customer
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
