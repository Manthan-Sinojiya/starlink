"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, MessageCircle, Send, CheckCircle2, User, Phone, Mail, Sparkles, AlertCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useDBStore } from "@/context/DBStoreContext";

export default function WhatsAppEnquiryModal() {
  const { enquirySoap, setEnquirySoap, showToast } = useCart();
  const { siteSettings } = useDBStore();


  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset or preset form when soap changes
  useEffect(() => {
    if (enquirySoap) {
      setError("");
      setNotes(
        `Hi Star Light Co., I would like to enquire about ordering "${enquirySoap.name}". Please let me know the availability and estimated delivery time.`
      );
    }
  }, [enquirySoap]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && enquirySoap) {
        setEnquirySoap(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enquirySoap, setEnquirySoap]);

  if (!enquirySoap) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phoneNumber.trim()) {
      setError("Please enter your WhatsApp/phone number.");
      return;
    }

    setIsSubmitting(true);

    const origin = typeof window !== "undefined" ? window.location.origin : "https://starlightsoaps.com";
    const productUrl = `${origin}/products/${enquirySoap.id}`;

    const textLines = [
      `*🌿 Star Light Co. - Product Enquiry*`,
      ``,
      `*Product Details:*`,
      `• *Name:* ${enquirySoap.name}`,
      `• *Price:* ₹${enquirySoap.price.toLocaleString("en-IN")}${enquirySoap.taxType === "exclusive" ? ` (+${enquirySoap.taxRate || 18}% GST Exclusive)` : " (Inclusive of all taxes)"}`,
      `• *Category:* ${enquirySoap.mainCategory} (${enquirySoap.subCategory})`,
      `• *Weight:* ${enquirySoap.weightValue ? `${enquirySoap.weightValue} ${enquirySoap.weightUnit || "g"}` : (enquirySoap.weight || "125g")}`,
      `• *Product Link:* ${productUrl}`,
      ``,
      `*Customer Information:*`,
      `• *Name:* ${fullName.trim()}`,
      `• *Phone:* ${phoneNumber.trim()}`,
      email.trim() ? `• *Email:* ${email.trim()}` : null,
      notes.trim() ? `• *Message:* ${notes.trim()}` : null,
      ``,
      `_Sent via Star Light Co. Online Apothecary_`,
    ].filter(Boolean);

    const fullMessage = textLines.join("\n");
    // Dynamic WhatsApp merchant contact number configured by admin
    const merchantPhone = (siteSettings?.whatsappNumber || "919876543210").replace(/\D/g, "");
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${merchantPhone}&text=${encodeURIComponent(
      fullMessage
    )}`;

    showToast("Opening WhatsApp with your enquiry... 💬");

    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank");
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setEnquirySoap(null);
    }, 600);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="whatsapp-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(17, 17, 19, 0.65)",
        backdropFilter: "blur(6px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={() => setEnquirySoap(null)}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#ffffff",
          borderRadius: "18px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          border: "1px solid rgba(225, 113, 89, 0.2)",
          animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1b7a43 0%, #25D366 100%)",
            color: "#ffffff",
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MessageCircle size={22} color="#ffffff" />
            </div>
            <div>
              <h3
                id="whatsapp-modal-title"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  margin: 0,
                  color: "#ffffff",
                  lineHeight: 1.2,
                }}
              >
                WhatsApp Enquiry
              </h3>
              <p style={{ margin: 0, fontSize: "0.78rem", opacity: 0.9 }}>
                Direct consultation with our Soap Artisans
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEnquirySoap(null)}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "none",
              color: "#ffffff",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            aria-label="Close Enquiry Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", flexGrow: 1 }}>
          {/* Selected Product Card Summary */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              padding: "0.85rem",
              borderRadius: "12px",
              backgroundColor: "var(--color-cream-subtle)",
              border: "1px solid var(--color-border)",
              marginBottom: "1.25rem",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "10px",
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <Image
                src={enquirySoap.image}
                alt={enquirySoap.name}
                width={64}
                height={64}
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </div>

            <div style={{ flexGrow: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-terracotta)",
                }}
              >
                Selected Formula
              </div>
              <h4
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "0.98rem",
                  fontWeight: 700,
                  color: "var(--color-dragon-black)",
                  margin: "2px 0 4px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {enquirySoap.name}
              </h4>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    color: "var(--color-dragon-black)",
                  }}
                >
                  ₹{enquirySoap.price.toLocaleString("en-IN")}
                </span>
                {enquirySoap.originalPrice && (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-tertiary)",
                      textDecoration: "line-through",
                    }}
                  >
                    ₹{enquirySoap.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    background: "rgba(225, 113, 89, 0.12)",
                    color: "var(--color-terracotta-dark)",
                    fontWeight: 700,
                  }}
                >
                  {enquirySoap.weightValue ? `${enquirySoap.weightValue} ${enquirySoap.weightUnit || "g"}` : (enquirySoap.weight || "125g")}
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    background: enquirySoap.taxType === "exclusive" ? "#fff3e0" : "#e8f5e9",
                    color: enquirySoap.taxType === "exclusive" ? "#b76e00" : "#2e7d32",
                    fontWeight: 700,
                  }}
                >
                  {enquirySoap.taxType === "exclusive" ? `+${enquirySoap.taxRate || 18}% GST` : "Incl. Tax"}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <div
                style={{
                  backgroundColor: "#fee2e2",
                  border: "1px solid #f87171",
                  color: "#b91c1c",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="enquiry-name"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginBottom: "4px",
                  color: "var(--color-dragon-black)",
                }}
              >
                Your Full Name <span style={{ color: "#e02424" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-tertiary)",
                  }}
                />
                <input
                  id="enquiry-name"
                  type="text"
                  required
                  placeholder="e.g. Aarav Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.75rem 0.65rem 2.25rem",
                    borderRadius: "10px",
                    border: "1.5px solid var(--color-border)",
                    fontSize: "0.88rem",
                    fontFamily: "inherit",
                    backgroundColor: "#fafafa",
                    outline: "none",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#25D366";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.backgroundColor = "#fafafa";
                  }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="enquiry-phone"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginBottom: "4px",
                  color: "var(--color-dragon-black)",
                }}
              >
                WhatsApp / Phone Number <span style={{ color: "#e02424" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Phone
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-tertiary)",
                  }}
                />
                <input
                  id="enquiry-phone"
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.75rem 0.65rem 2.25rem",
                    borderRadius: "10px",
                    border: "1.5px solid var(--color-border)",
                    fontSize: "0.88rem",
                    fontFamily: "inherit",
                    backgroundColor: "#fafafa",
                    outline: "none",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#25D366";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.backgroundColor = "#fafafa";
                  }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="enquiry-email"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginBottom: "4px",
                  color: "var(--color-dragon-black)",
                }}
              >
                Email Address <span style={{ fontSize: "0.74rem", color: "var(--color-text-tertiary)", fontWeight: 500 }}>(Optional)</span>
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-tertiary)",
                  }}
                />
                <input
                  id="enquiry-email"
                  type="email"
                  placeholder="e.g. aarav@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.75rem 0.65rem 2.25rem",
                    borderRadius: "10px",
                    border: "1.5px solid var(--color-border)",
                    fontSize: "0.88rem",
                    fontFamily: "inherit",
                    backgroundColor: "#fafafa",
                    outline: "none",
                    transition: "border-color 0.2s, background-color 0.2s",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#25D366";
                    e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.backgroundColor = "#fafafa";
                  }}
                />
              </div>
            </div>

            {/* Notes / Message */}
            <div>
              <label
                htmlFor="enquiry-notes"
                style={{
                  display: "block",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  marginBottom: "4px",
                  color: "var(--color-dragon-black)",
                }}
              >
                Enquiry Note / Special Request
              </label>
              <textarea
                id="enquiry-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.75rem",
                  borderRadius: "10px",
                  border: "1.5px solid var(--color-border)",
                  fontSize: "0.84rem",
                  fontFamily: "inherit",
                  backgroundColor: "#fafafa",
                  outline: "none",
                  resize: "vertical",
                  lineHeight: 1.5,
                  transition: "border-color 0.2s, background-color 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#25D366";
                  e.currentTarget.style.backgroundColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                  e.currentTarget.style.backgroundColor = "#fafafa";
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "0.85rem 1.25rem",
                borderRadius: "9999px",
                background: "linear-gradient(135deg, #1b7a43 0%, #25D366 100%)",
                color: "#ffffff",
                border: "none",
                fontSize: "0.95rem",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(37, 211, 102, 0.35)",
                transition: "transform 0.2s, box-shadow 0.2s, opacity 0.2s",
                marginTop: "0.5rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 6px 18px rgba(37, 211, 102, 0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 14px rgba(37, 211, 102, 0.35)";
              }}
            >
              <MessageCircle size={18} />
              {isSubmitting ? "Redirecting to WhatsApp..." : "Send Enquiry via WhatsApp"}
            </button>

            <div
              style={{
                textAlign: "center",
                fontSize: "0.73rem",
                color: "var(--color-text-tertiary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <CheckCircle2 size={13} color="#25D366" />
              <span>We typically reply within 15 minutes during apothecary hours.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
