"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Package,
  Truck,
  Calendar,
  MessageCircle,
  FileText,
  ArrowRight,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";
import { useDBStore } from "@/context/DBStoreContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || `SLC-${Date.now().toString().slice(-6)}`;
  const { orders, currentUser, registerUser } = useDBStore();

  const [matchedOrder, setMatchedOrder] = useState<any | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [guestPassword, setGuestPassword] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const [createAccountMsg, setCreateAccountMsg] = useState<string | null>(null);

  useEffect(() => {
    const found = orders.find(
      (o) => o.orderNumber === orderId || o.id === orderId || (o as any)._id === orderId
    );
    if (found) {
      setMatchedOrder(found);
    } else if (orderId) {
      fetch(`/api/orders/${encodeURIComponent(orderId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.order) setMatchedOrder(data.order);
        })
        .catch(() => {});
    }
  }, [orders, orderId]);

  const handleWhatsAppConfirm = () => {
    const msg = encodeURIComponent(
      `Hello Star Light Co.! I just placed order #${orderId}. Please confirm my artisanal soap dispatch details.`
    );
    window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPassword || guestPassword.length < 6) {
      setCreateAccountMsg("Password must be at least 6 characters.");
      return;
    }
    if (!matchedOrder?.customerEmail) {
      setCreateAccountMsg("Order email details not found.");
      return;
    }
    const res = await registerUser({
      name: matchedOrder.customerName || "Customer",
      email: matchedOrder.customerEmail,
      password: guestPassword,
      phone: matchedOrder.customerPhone,
      address: matchedOrder.shippingAddress,
      state: matchedOrder.shippingState,
      pincode: matchedOrder.shippingPincode,
    });
    if (res.success) {
      setAccountCreated(true);
      setCreateAccountMsg("Account created! You can now track your orders anytime.");
    } else {
      setCreateAccountMsg(res.message);
    }
  };

  return (
    <div style={{ maxWidth: "780px", margin: "2rem auto 4rem", padding: "0 1.25rem" }}>
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          boxShadow: "0 4px 25px rgba(0,0,0,0.06)",
          border: "1px solid var(--color-border)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "rgba(34, 197, 94, 0.12)",
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <CheckCircle2 size={44} />
        </div>

        <span
          style={{
            fontSize: "0.8rem",
            textTransform: "uppercase",
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: "var(--color-terracotta)",
          }}
        >
          Order Confirmed &amp; In Curing Chamber
        </span>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            color: "var(--color-dragon-black)",
            margin: "0.35rem 0 0.85rem",
          }}
        >
          Thank You For Your Order!
        </h1>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.5rem 1.25rem",
            backgroundColor: "var(--color-cream-subtle)",
            borderRadius: "9999px",
            border: "1px solid var(--color-border)",
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>Official Order ID:</span>
          <strong style={{ fontSize: "1rem", color: "var(--color-dragon-black)", fontFamily: "monospace" }}>
            #{orderId}
          </strong>
        </div>

        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.92rem", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 2rem" }}>
          Your handcrafted cold-process bars are being carefully packaged with eco-friendly botanical wraps. You will receive dispatch updates via SMS and WhatsApp.
        </p>

        {/* Payment & Account Connection Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              backgroundColor: matchedOrder?.paymentStatus === "Paid" ? "#ecfdf5" : matchedOrder?.paymentMethod === "cod" ? "#fffbeb" : "#ecfdf5",
              border: `1px solid ${matchedOrder?.paymentStatus === "Paid" ? "#86efac" : matchedOrder?.paymentMethod === "cod" ? "#fde68a" : "#86efac"}`,
              color: matchedOrder?.paymentStatus === "Paid" ? "#166534" : matchedOrder?.paymentMethod === "cod" ? "#92400e" : "#166534",
              fontSize: "0.86rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {matchedOrder?.paymentStatus === "Paid" ? (
              <>💳 Payment Status: Paid &amp; Confirmed (₹{matchedOrder.total?.toLocaleString("en-IN")})</>
            ) : matchedOrder?.paymentMethod === "cod" ? (
              <>🚚 Payment Method: Cash on Delivery (₹{matchedOrder?.total?.toLocaleString("en-IN")})</>
            ) : (
              <>💳 Payment Status: Verified &amp; Confirmed</>
            )}
          </div>

          {(currentUser?.email || matchedOrder?.customerEmail) && (
            <div
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "10px",
                backgroundColor: "#f5f3ff",
                border: "1px solid #ddd6fe",
                color: "#5b21b6",
                fontSize: "0.86rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <CheckCircle2 size={16} /> Customer Account: {currentUser?.email || matchedOrder?.customerEmail}
            </div>
          )}
        </div>

        {/* Order Timeline */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1rem",
            padding: "1.25rem 1rem",
            backgroundColor: "#fdfbf9",
            borderRadius: "14px",
            border: "1px solid var(--color-border)",
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ padding: "8px", borderRadius: "8px", background: "#ecfdf5", color: "#059669" }}>
              <Package size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-dragon-black)" }}>1. Hand Wrapping</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>Within 24 Hours</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ padding: "8px", borderRadius: "8px", background: "#f0f9ff", color: "#0284c7" }}>
              <Truck size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-dragon-black)" }}>2. Express Dispatch</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>Bluedart / Delhivery</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <div style={{ padding: "8px", borderRadius: "8px", background: "#fef3c7", color: "#d97706" }}>
              <Calendar size={20} />
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-dragon-black)" }}>3. Expected Delivery</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>2 - 4 Business Days</div>
            </div>
          </div>
        </div>

        {/* Action Buttons: WhatsApp confirmation + Invoice + View in Dashboard + Continue */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center", marginBottom: "2.5rem" }}>
          <Link
            href="/login"
            style={{
              padding: "0.75rem 1.35rem",
              borderRadius: "10px",
              backgroundColor: "var(--color-terracotta)",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            <Package size={17} /> View My Paid Orders in Account
          </Link>

          <button
            type="button"
            onClick={handleWhatsAppConfirm}
            style={{
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              backgroundColor: "#25D366",
              color: "#ffffff",
              border: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <WhatsAppIcon size={18} /> Get WhatsApp Updates
          </button>

          {matchedOrder && (
            <button
              type="button"
              onClick={() => setShowInvoiceModal(true)}
              style={{
                padding: "0.75rem 1.25rem",
                borderRadius: "10px",
                backgroundColor: "#ffffff",
                color: "var(--color-dragon-black)",
                border: "1.5px solid var(--color-border)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FileText size={18} color="var(--color-terracotta)" /> View &amp; Download Invoice
            </button>
          )}

          <Link
            href="/"
            style={{
              padding: "0.75rem 1.25rem",
              borderRadius: "10px",
              backgroundColor: "var(--color-dragon-black)",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: "0.88rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>

        {/* Guest 1-Click Account Creation Option */}
        {!currentUser && matchedOrder?.customerEmail && !accountCreated && (
          <div
            style={{
              backgroundColor: "#fdfbf9",
              borderRadius: "14px",
              padding: "1.5rem",
              border: "1px dashed var(--color-terracotta)",
              textAlign: "left",
              marginTop: "1.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
              <UserPlus size={18} color="var(--color-terracotta)" />
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-dragon-black)", margin: 0 }}>
                1-Click Account Setup
              </h3>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", marginBottom: "0.85rem" }}>
              Create a password to track this order, view digital tax invoices, and earn wellness loyalty points for <strong>{matchedOrder.customerEmail}</strong>:
            </p>
            <form onSubmit={handleCreateAccount} style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <input
                type="password"
                placeholder="Create password (min 6 characters)"
                value={guestPassword}
                onChange={(e) => setGuestPassword(e.target.value)}
                style={{
                  flexGrow: 1,
                  minWidth: "220px",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.88rem",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "8px",
                  backgroundColor: "var(--color-terracotta)",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Save My Account
              </button>
            </form>
            {createAccountMsg && (
              <div style={{ fontSize: "0.78rem", marginTop: "6px", color: accountCreated ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                {createAccountMsg}
              </div>
            )}
          </div>
        )}
      </div>

      {matchedOrder && (
        <TaxInvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          order={matchedOrder}
        />
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh", backgroundColor: "#faf8f5" }}>
        <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Loading Confirmation...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
