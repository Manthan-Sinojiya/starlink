"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Phone,
  HelpCircle,
  Truck,
  Gift,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import QuickViewModal from "@/components/QuickViewModal";
import WhatsAppEnquiryModal from "@/components/WhatsAppEnquiryModal";
import Toast from "@/components/Toast";
import { useCart } from "@/context/CartContext";

export default function ContactPage() {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Artisanal Soap Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in all required fields.");
      return;
    }

    setSubmitted(true);
    showToast("Thank you! Your message has been received by our atelier concierge. ✨");
  };

  const handleOpenDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Star Light Co.! I would like to inquire with your atelier concierge about your artisanal cold-process soaps.`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, "_blank");
  };

  return (
    <>
      <div className="site-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <main id="main-content" style={{ flexGrow: 1 }}>
          {/* Header */}
          <section
            style={{
              padding: "clamp(3rem, 5vw, 4.5rem) 0 2.5rem",
              backgroundColor: "var(--color-cream-subtle)",
              borderBottom: "1px solid var(--color-border)",
              textAlign: "center",
            }}
          >
            <div className="container" style={{ maxWidth: "750px" }}>
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
                  marginBottom: "1rem",
                }}
              >
                <Sparkles size={13} /> Dedicated Concierge &amp; Customer Care
              </span>

              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                  fontWeight: 800,
                  color: "var(--color-dragon-black)",
                  margin: "0 0 1rem",
                }}
              >
                Connect With Our Atelier
              </h1>

              <p style={{ color: "var(--color-text-secondary)", fontSize: "1.05rem", lineHeight: 1.6, margin: 0 }}>
                Whether seeking bespoke batch formulations, wedding favor curations, or order assistance, our master soapmakers are delighted to assist you.
              </p>
            </div>
          </section>

          {/* Contact Details & Form Grid */}
          <section style={{ padding: "clamp(3rem, 5vw, 5rem) 0", backgroundColor: "#ffffff" }}>
            <div className="container">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "2.5rem",
                  alignItems: "start",
                }}
              >
                {/* Left: Contact Channels */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", margin: "0 0 0.5rem" }}>
                      Direct Atelier Concierge
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.88rem", color: "var(--color-text-secondary)" }}>
                      Reach our client advisors instantly through your preferred channel.
                    </p>
                  </div>

                  {/* WhatsApp Quick Action Card */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #128c7e 0%, #075e54 100%)",
                      color: "#ffffff",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      boxShadow: "0 10px 25px rgba(18, 140, 126, 0.25)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.5rem" }}>
                      <MessageCircle size={24} />
                      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>WhatsApp Concierge</h3>
                    </div>
                    <p style={{ margin: "0 0 1.25rem", fontSize: "0.85rem", opacity: 0.9 }}>
                      Fast responses for custom curations, ingredient inquiries, and live tracking.
                    </p>
                    <button
                      type="button"
                      onClick={handleOpenDirectWhatsApp}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "0.65rem 1.25rem",
                        borderRadius: "9999px",
                        backgroundColor: "#ffffff",
                        color: "#075e54",
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        border: "none",
                        cursor: "pointer",
                        transition: "transform 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <MessageCircle size={16} /> Chat on WhatsApp Now
                    </button>
                  </div>

                  {/* Channel Cards */}
                  <div className="admin-card" style={{ padding: "1.25rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "var(--color-cream-subtle)", color: "var(--color-terracotta)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Email Support</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-dragon-black)", marginTop: "2px" }}>
                        concierge@starlightsoaps.com
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
                        Response time: within 4 hours
                      </div>
                    </div>
                  </div>

                  <div className="admin-card" style={{ padding: "1.25rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "var(--color-cream-subtle)", color: "var(--color-terracotta)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Studio Atelier</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-dragon-black)", marginTop: "2px" }}>
                        Heritage Arts Quarter, Colaba Causeway
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
                        Mumbai, Maharashtra 400005, India
                      </div>
                    </div>
                  </div>

                  <div className="admin-card" style={{ padding: "1.25rem", display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", backgroundColor: "var(--color-cream-subtle)", color: "var(--color-terracotta)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase" }}>Atelier Operating Hours</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--color-dragon-black)", marginTop: "2px" }}>
                        Monday – Saturday: 10:00 AM – 7:00 PM IST
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
                        Closed Sundays &amp; National Holidays
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Contact Form */}
                <div className="admin-card" style={{ padding: "2rem" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", margin: "0 0 0.35rem" }}>
                    Send an Inquiry Message
                  </h3>
                  <p style={{ margin: "0 0 1.5rem", fontSize: "0.84rem", color: "var(--color-text-secondary)" }}>
                    Please fill out the form below. Our soapmaker team will review your requirements.
                  </p>

                  {submitted ? (
                    <div style={{ textAlign: "center", padding: "2.5rem 1rem", backgroundColor: "var(--color-cream-subtle)", borderRadius: "14px" }}>
                      <CheckCircle2 size={48} color="#16a34a" style={{ margin: "0 auto 1rem" }} />
                      <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: "0 0 0.5rem" }}>
                        Inquiry Received with Pleasure
                      </h4>
                      <p style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)", margin: "0 0 1.5rem" }}>
                        We have logged your note and our atelier concierge will reply within 4 business hours.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: "", email: "", phone: "", subject: "Artisanal Soap Inquiry", message: "" });
                        }}
                        className="btn-secondary"
                        style={{ fontSize: "0.85rem", padding: "0.55rem 1.25rem" }}
                      >
                        Send Another Note
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div className="admin-form-row-2">
                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                            Your Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ananya Roy"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="e.g. ananya@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                          />
                        </div>
                      </div>

                      <div className="admin-form-row-2">
                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                            Phone Number / WhatsApp
                          </label>
                          <input
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                            Inquiry Type
                          </label>
                          <select
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem", backgroundColor: "#fff" }}
                          >
                            <option value="Artisanal Soap Inquiry">Artisanal Soap Inquiry</option>
                            <option value="Custom Wedding Favors">Bespoke Wedding Favors</option>
                            <option value="Corporate Gifting Curation">Corporate Gifting Curation</option>
                            <option value="Order Tracking & Support">Order Tracking &amp; Delivery</option>
                            <option value="Retail & Stockist Partnership">Retail &amp; Stockist Partnership</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Message / Requirements *
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Tell us about the soap formulas you love or custom batch specifications..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: "100%", border: "none", cursor: "pointer", display: "flex", justifyContent: "center" }}
                      >
                        <Send size={16} /> Send Message to Concierge
                      </button>
                    </form>
                  )}
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
