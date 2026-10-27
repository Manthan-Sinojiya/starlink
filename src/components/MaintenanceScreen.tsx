"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useDBStore, DEFAULT_SITE_SETTINGS } from "@/context/DBStoreContext";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";

export default function MaintenanceScreen() {
  const { siteSettings } = useDBStore();
  const settings = siteSettings || DEFAULT_SITE_SETTINGS;

  const socialLinks = settings.socialLinks || {
    twitter: "https://x.com/starlightsoaps",
    facebook: "https://facebook.com/starlightsoaps",
    instagram: "https://instagram.com/starlightsoaps",
  };

  const customNotice = settings.maintenanceMessage?.trim();
  const isShortHeading = customNotice && customNotice.length <= 40;
  const mainHeading = isShortHeading
    ? customNotice.toUpperCase()
    : "UNDER MAINTENANCE";

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#DE775B",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        textAlign: "center",
        position: "relative",
        boxSizing: "border-box",
        fontFamily: "var(--font-sans), sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "840px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        {/* Dragon Crest & Brand Title Image */}
        <div
          style={{
            width: "min(280px, 68vw)",
            display: "flex",
            justifyContent: "center",
            marginBottom: "0.5rem",
          }}
        >
          <Image
            src={CLOUDINARY_IMAGES.logo}
            alt="Star Light Co."
            width={280}
            height={280}
            priority
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>

        {/* Main Status / Notice Heading (Under Maintenance or Admin Custom Message) */}
        <h1
          style={{
            color: "#ffffff",
            fontSize: "clamp(2.2rem, 6.5vw, 4.2rem)",
            fontWeight: 900,
            letterSpacing: "0.08em",
            margin: "0.75rem 0 0",
            textTransform: "uppercase",
            lineHeight: 1.15,
          }}
        >
          {mainHeading}
        </h1>

        {/* Extended Admin Notice (if longer explanation was provided) */}
        {customNotice && !isShortHeading && (
          <p
            style={{
              color: "#ffffff",
              fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
              lineHeight: 1.6,
              maxWidth: "580px",
              margin: "1rem auto 0",
              opacity: 0.95,
              fontWeight: 500,
            }}
          >
            {customNotice}
          </p>
        )}

        {/* Distinctive Solid Black Divider Line */}
        <div
          style={{
            width: "min(560px, 88vw)",
            height: "3px",
            backgroundColor: "#111111",
            margin: "2rem auto 2.25rem",
            borderRadius: "2px",
          }}
        />

        {/* Subtitle: JOIN THE STAR LIGHT FAMILY */}
        <div
          style={{
            color: "#ffffff",
            fontSize: "clamp(0.85rem, 1.8vw, 1rem)",
            fontWeight: 500,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: "0.35rem",
            opacity: 0.95,
          }}
        >
          JOIN THE STAR LIGHT FAMILY
        </div>

        {/* Label: FOLLOW US */}
        <div
          style={{
            color: "#ffffff",
            fontSize: "clamp(1.3rem, 3.2vw, 1.75rem)",
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          FOLLOW US
        </div>

        {/* Violet / Purple Social Media Buttons matching uploaded design */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.1rem",
          }}
        >
          {/* X (formerly Twitter) */}
          <a
            href={socialLinks.twitter || "https://x.com/starlightsoaps"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Star Light on X"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              backgroundColor: "#613FB5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.15)";
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href={socialLinks.facebook || "https://facebook.com/starlightsoaps"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Star Light on Facebook"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              backgroundColor: "#613FB5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.15)";
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href={socialLinks.instagram || "https://instagram.com/starlightsoaps"}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow Star Light on Instagram"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              backgroundColor: "#613FB5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(0, 0, 0, 0.15)";
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </div>

      {/* Discreet Admin Login Link */}
      <div
        style={{
          position: "fixed",
          bottom: "1.25rem",
          right: "1.25rem",
          zIndex: 10,
        }}
      >
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "0.45rem 0.85rem",
            borderRadius: "999px",
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            backdropFilter: "blur(8px)",
            color: "#ffffff",
            fontSize: "0.78rem",
            fontWeight: 600,
            textDecoration: "none",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.35)";
          }}
        >
          <LogIn size={13} />
          <span>Admin Portal</span>
        </Link>
      </div>
    </main>
  );
}
