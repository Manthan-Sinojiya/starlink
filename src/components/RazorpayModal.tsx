"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  Lock,
  ArrowRight,
  QrCode,
  Check,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface RazorpayModalProps {
  isOpen: boolean;
  amount: number;
  orderNumber: string;
  razorpayOrderId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onClose: () => void;
}

export default function RazorpayModal({
  isOpen,
  amount,
  orderNumber,
  razorpayOrderId,
  customerName,
  customerEmail,
  customerPhone,
  onSuccess,
  onClose,
}: RazorpayModalProps) {
  const [activeTab, setActiveTab] = useState<"upi" | "card" | "netbanking">("upi");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("gpay");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("•••");
  const [cardName, setCardName] = useState(customerName || "Customer");
  const [selectedBank, setSelectedBank] = useState("HDFC");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>("Connecting to bank...");

  useEffect(() => {
    if (customerName) {
      setCardName(customerName);
    }
  }, [customerName]);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setProcessStep("Connecting securely to Razorpay Gateway...");

    setTimeout(() => {
      setProcessStep("Authorizing payment of ₹" + amount.toLocaleString("en-IN") + "...");
    }, 700);

    setTimeout(() => {
      setProcessStep("Payment verified! Finalizing order...");
    }, 1400);

    setTimeout(() => {
      setIsProcessing(false);
      const paymentId = `pay_${Date.now().toString().slice(-8)}${Math.floor(100 + Math.random() * 900)}`;
      onSuccess({
        razorpay_order_id: razorpayOrderId || `order_${orderNumber}`,
        razorpay_payment_id: paymentId,
        razorpay_signature: `sig_${Date.now()}_valid`,
      });
    }, 1900);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "rgba(10, 15, 29, 0.75)",
        backdropFilter: "blur(6px)",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Razorpay Branded Top Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0c2340 0%, #153860 100%)",
            color: "#ffffff",
            padding: "1.2rem 1.5rem",
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  background: "#0284c7",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "0.75rem",
                  padding: "3px 8px",
                  borderRadius: "4px",
                  letterSpacing: "0.05em",
                }}
              >
                RAZORPAY
              </div>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "4px" }}>
                <Lock size={12} /> Trusted Business
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "none",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
              }}
              aria-label="Close payment modal"
            >
              <X size={16} />
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: "0.5rem" }}>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "#fff" }}>
                Star Light Co.
              </h3>
              <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: "2px 0 0 0" }}>
                Order #{orderNumber} • {customerEmail || customerPhone || "Artisanal checkout"}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.72rem", color: "#94a3b8", textTransform: "uppercase" }}>Amount Payable</div>
              <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#38bdf8", letterSpacing: "-0.02em" }}>
                ₹{amount.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* Processing State Overlay */}
        {isProcessing ? (
          <div
            style={{
              padding: "3.5rem 2rem",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "340px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(2, 132, 199, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1.5rem",
                color: "#0284c7",
              }}
            >
              <Loader2 size={32} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
            </div>
            <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.5rem" }}>
              Processing Razorpay Payment
            </h4>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "1.5rem" }}>
              {processStep}
            </p>
            <div
              style={{
                width: "80%",
                height: "6px",
                backgroundColor: "#e2e8f0",
                borderRadius: "9999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  background: "linear-gradient(90deg, #0284c7, #38bdf8)",
                  animation: "pulse 1.5s infinite",
                }}
              />
            </div>
          </div>
        ) : (
          /* Payment Method Tabs & Body */
          <div style={{ padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Payment Category Selector */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "6px",
                background: "#f1f5f9",
                padding: "4px",
                borderRadius: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab("upi")}
                style={{
                  padding: "0.55rem 0.4rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: activeTab === "upi" ? "#ffffff" : "transparent",
                  color: activeTab === "upi" ? "#0c2340" : "#64748b",
                  fontWeight: activeTab === "upi" ? 700 : 500,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  boxShadow: activeTab === "upi" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Smartphone size={14} /> UPI / QR
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("card")}
                style={{
                  padding: "0.55rem 0.4rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: activeTab === "card" ? "#ffffff" : "transparent",
                  color: activeTab === "card" ? "#0c2340" : "#64748b",
                  fontWeight: activeTab === "card" ? 700 : 500,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  boxShadow: activeTab === "card" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <CreditCard size={14} /> Cards
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("netbanking")}
                style={{
                  padding: "0.55rem 0.4rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: activeTab === "netbanking" ? "#ffffff" : "transparent",
                  color: activeTab === "netbanking" ? "#0c2340" : "#64748b",
                  fontWeight: activeTab === "netbanking" ? 700 : 500,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "5px",
                  boxShadow: activeTab === "netbanking" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.15s ease",
                }}
              >
                <Building2 size={14} /> Net Banking
              </button>
            </div>

            {/* TAB 1: UPI / QR */}
            {activeTab === "upi" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>
                  Instant Pay with UPI App:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px" }}>
                  {[
                    { id: "gpay", name: "Google Pay", icon: "🟢 GPay" },
                    { id: "phonepe", name: "PhonePe", icon: "🟣 PhonePe" },
                    { id: "paytm", name: "Paytm", icon: "🔵 Paytm" },
                    { id: "bhim", name: "BHIM", icon: "🟠 BHIM" },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      style={{
                        padding: "0.6rem 0.3rem",
                        borderRadius: "8px",
                        border: `1.5px solid ${selectedUpiApp === app.id ? "#0284c7" : "#e2e8f0"}`,
                        backgroundColor: selectedUpiApp === app.id ? "#f0f9ff" : "#ffffff",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: selectedUpiApp === app.id ? "#0284c7" : "#475569",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      {app.icon}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    backgroundColor: "#f8fafc",
                    border: "1px dashed #cbd5e1",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      backgroundColor: "#0c2340",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    <QrCode size={26} />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f172a" }}>
                      Scan &amp; Pay with Any App
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      Instant confirmation via UPI QR
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "4px" }}>
                    Or enter UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    placeholder="mobile@okhdfcbank or upi@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Cards */}
            {activeTab === "card" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "3px" }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.85rem",
                      fontFamily: "monospace",
                    }}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "3px" }}>
                      Expiry
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "3px" }}>
                      CVV
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.6rem 0.8rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        fontSize: "0.85rem",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "3px" }}>
                    Name on Card
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.85rem",
                    }}
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Net Banking */}
            {activeTab === "netbanking" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>
                  Select Bank:
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra", "Punjab National"].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      style={{
                        padding: "0.65rem 0.5rem",
                        borderRadius: "8px",
                        border: `1.5px solid ${selectedBank === b ? "#0284c7" : "#e2e8f0"}`,
                        backgroundColor: selectedBank === b ? "#f0f9ff" : "#ffffff",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: selectedBank === b ? "#0284c7" : "#334155",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Building2 size={14} color={selectedBank === b ? "#0284c7" : "#94a3b8"} />
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Action Button */}
            <button
              type="button"
              onClick={handleSimulatePayment}
              style={{
                width: "100%",
                padding: "0.85rem",
                borderRadius: "10px",
                backgroundColor: "#0284c7",
                color: "#ffffff",
                border: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 14px rgba(2, 132, 199, 0.4)",
                transition: "all 0.15s ease",
                marginTop: "0.5rem",
              }}
            >
              <Lock size={16} /> Pay ₹{amount.toLocaleString("en-IN")} Securely
            </button>

            {/* Security Footnote */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                fontSize: "0.72rem",
                color: "#94a3b8",
                marginTop: "0.2rem",
              }}
            >
              <ShieldCheck size={14} color="#16a34a" />
              <span>PCI-DSS Level 1 Compliant • 256-bit Bank Grade Encryption</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
