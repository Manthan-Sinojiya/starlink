import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="section-tag" style={{ marginBottom: "1rem" }}>
            <Sparkles size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            404 Artisanal Archive
          </span>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--color-dragon-black)", marginBottom: "1rem" }}>
            This Botanical Blend Has Vanished
          </h1>
          <p style={{ color: "var(--color-text-secondary)", maxWidth: "520px", margin: "0 auto 2rem", fontSize: "0.95rem" }}>
            The page or soap bar formulation you are looking for has been moved or retired from our apothecary catalog.
          </p>
          <Link href="/" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
            <ArrowLeft size={16} /> Return to Atelier Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
