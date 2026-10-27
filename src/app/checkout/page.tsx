"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  MapPin,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RazorpayModal from "@/components/RazorpayModal";
import { useCart } from "@/context/CartContext";
import { useDBStore } from "@/context/DBStoreContext";
import { INDIAN_STATES } from "@/data/soaps";
import { CLOUDINARY_IMAGES } from "@/data/cloudinaryImages";
import { paymentApi, authApi } from "@/lib/api";

function CheckoutContent() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    discountAmount,
    taxAmount,
    hasExclusiveTax,
    total,
    appliedPromo,
    selectedState,
    setSelectedState,
    clearCart,
    showToast,
  } = useCart();

  const { calculateShipping, createOrder, currentUser, loginUser } = useDBStore();

  const [customerName, setCustomerName] = useState(currentUser?.name || "");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "");
  const [shippingAddress, setShippingAddress] = useState(currentUser?.address || "");
  const [shippingPincode, setShippingPincode] = useState(currentUser?.pincode || "");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  // Customer Account Auto-sync and Password States
  const [accountLookupStatus, setAccountLookupStatus] = useState<"idle" | "loading" | "found" | "new">("idle");
  const [accountLookupName, setAccountLookupName] = useState<string>("");
  const [customerPassword, setCustomerPassword] = useState<string>("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    pincode?: string;
  }>({});

  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [activeRazorpayData, setActiveRazorpayData] = useState<{
    amount: number;
    orderNumber: string;
    orderId: string;
    dbOrderId: string;
  } | null>(null);

  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name || "");
      if (!customerEmail) setCustomerEmail(currentUser.email || "");
      if (!customerPhone) setCustomerPhone(currentUser.phone || "");
      if (!shippingAddress) setShippingAddress(currentUser.address || "");
      if (!shippingPincode) setShippingPincode(currentUser.pincode || "");
      if (currentUser.state && INDIAN_STATES.includes(currentUser.state)) {
        setSelectedState(currentUser.state);
      }
    }
  }, [currentUser, setSelectedState, customerName, customerEmail, customerPhone, shippingAddress, shippingPincode]);

  const performEmailLookup = async (emailToSearch: string) => {
    const cleanEmail = emailToSearch.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setAccountLookupStatus("idle");
      return;
    }
    if (currentUser?.email?.toLowerCase() === cleanEmail) {
      setAccountLookupStatus("found");
      setAccountLookupName(currentUser.name || "");
      return;
    }
    setAccountLookupStatus("loading");
    try {
      const res = await authApi.lookup(cleanEmail);
      if (res.success && res.exists && res.user) {
        setAccountLookupStatus("found");
        setAccountLookupName(res.user.name || "");
        // Auto-fill delivery details saved in DB
        if (!customerName || customerName === "Valued Customer") {
          setCustomerName(res.user.name || "");
        }
        if (res.user.phone && (!customerPhone || customerPhone.length < 10)) {
          setCustomerPhone(res.user.phone);
        }
        if (res.user.address && !shippingAddress) {
          setShippingAddress(res.user.address);
        }
        if (res.user.pincode && !shippingPincode) {
          setShippingPincode(res.user.pincode);
        }
        if (res.user.state && INDIAN_STATES.includes(res.user.state)) {
          setSelectedState(res.user.state);
        }
        showToast(`Welcome back ${res.user.name}! Saved delivery details loaded.`);
      } else {
        setAccountLookupStatus("new");
      }
    } catch {
      setAccountLookupStatus("idle");
    }
  };

  useEffect(() => {
    if (currentUser) return;
    const timer = setTimeout(() => {
      if (customerEmail && customerEmail.includes("@") && customerEmail.includes(".")) {
        performEmailLookup(customerEmail);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [customerEmail, currentUser]);

  const handleInlineLogin = async () => {
    if (!customerEmail || !customerPassword) {
      setSignInError("Please enter your account password.");
      return;
    }
    setIsSigningIn(true);
    setSignInError(null);
    try {
      const res = await loginUser(customerEmail.trim(), customerPassword);
      if (res.success) {
        showToast("Signed in! Details saved to your account.");
      } else {
        setSignInError(res.message || "Invalid password. Please check and try again.");
      }
    } catch {
      setSignInError("Login error. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const shippingCost = calculateShipping(subtotal, selectedState);
  const grandTotal = subtotal === 0 ? 0 : total + shippingCost;

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      pincode?: string;
    } = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(customerEmail.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (!customerPhone.trim()) {
      errors.phone = "Phone number is required for dispatch & updates.";
    } else if (cleanPhone.length !== 10) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    } else if (!/^[6-9]/.test(cleanPhone)) {
      errors.phone = "Indian mobile numbers must start with 6, 7, 8, or 9.";
    }

    if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
      errors.address = "Please enter your full street delivery address.";
    }

    const cleanPincode = shippingPincode.trim();
    if (!cleanPincode) {
      errors.pincode = "PIN code is required.";
    } else if (!/^[1-9][0-9]{5}$/.test(cleanPincode)) {
      errors.pincode = "Please enter a valid 6-digit Indian PIN code.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSuccess = async (
    paymentDetails: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string },
    orderNum?: string,
    orderDbId?: string
  ) => {
    const finalOrderNumber = orderNum || activeRazorpayData?.orderNumber || `SLC-${Date.now().toString().slice(-6)}`;
    const finalDbId = orderDbId || activeRazorpayData?.dbOrderId || finalOrderNumber;

    try {
      await paymentApi.verifyPayment({
        razorpayOrderId: paymentDetails.razorpay_order_id,
        razorpayPaymentId: paymentDetails.razorpay_payment_id,
        razorpaySignature: paymentDetails.razorpay_signature,
        orderId: finalDbId,
      });
    } catch (e) {
      console.warn("Payment verification notice:", e);
    }

    setIsRazorpayModalOpen(false);
    clearCart();
    setIsProcessing(false);
    router.push(`/checkout/success?order_id=${encodeURIComponent(finalOrderNumber)}`);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast("Your cart is empty.");
      return;
    }

    if (!validateForm()) {
      showToast("Please correct highlighted fields before submitting.");
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.soap.id || (item.soap as any)._id || "soap",
        name: item.soap.name,
        image: item.soap.image,
        imageAlt: item.soap.imageAlt || item.soap.name,
        price: item.soap.price,
        quantity: item.quantity,
        weight: item.soap.weight,
      }));

      const dbOrder = await createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        shippingState: selectedState,
        shippingPincode: shippingPincode.trim(),
        customerPassword: customerPassword.trim() || undefined,
        password: customerPassword.trim() || undefined,
        items: orderItems,
        subtotal,
        shipping: shippingCost,
        total: Math.round(grandTotal),
        paymentMethod,
        status: "Pending",
        paymentStatus: "Pending",
      });

      const orderNumber = dbOrder?.orderNumber || `SLC-${Date.now().toString().slice(-6)}`;
      const dbOrderId = (dbOrder?._id || dbOrder?.id || orderNumber) as string;

      if (paymentMethod === "cod") {
        clearCart();
        setIsProcessing(false);
        router.push(`/checkout/success?order_id=${encodeURIComponent(orderNumber)}`);
        return;
      }

      // Online payment via Razorpay
      try {
        const rzpOrderRes = await paymentApi.createOrder(
          Math.round(grandTotal),
          `rcpt_${orderNumber}`
        );

        setActiveRazorpayData({
          amount: Math.round(grandTotal),
          orderNumber,
          orderId: rzpOrderRes.orderId || `rzp_sim_${Date.now()}`,
          dbOrderId,
        });
        setIsRazorpayModalOpen(true);
      } catch (payErr) {
        console.warn("Payment init fallback:", payErr);
        setActiveRazorpayData({
          amount: Math.round(grandTotal),
          orderNumber,
          orderId: `rzp_sim_${Date.now()}`,
          dbOrderId,
        });
        setIsRazorpayModalOpen(true);
      }
    } catch (err) {
      console.error("Order error:", err);
      showToast("Could not place order. Please review information.");
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem", textAlign: "center" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "var(--color-cream-subtle)", color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <ShoppingBag size={34} />
        </div>
        <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", marginBottom: "0.5rem" }}>
          Your Bag is Empty
        </h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.95rem", maxWidth: "420px", marginBottom: "2rem" }}>
          Add our cold-process botanical bars to proceed with express delivery across India.
        </p>
        <Link href="/" className="btn-primary">
          Explore Best Sellers
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#faf8f5", minHeight: "100vh", padding: "2rem 1rem 4rem" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.88rem", color: "var(--color-text-secondary)", textDecoration: "none" }}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--color-dragon-black)", marginTop: "0.5rem" }}>
            Secure Checkout
          </h1>
        </div>

        <style>{`
          .checkout-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            align-items: start;
          }
          @media (min-width: 960px) {
            .checkout-grid {
              grid-template-columns: 1.35fr 1fr;
            }
          }
        `}</style>

        <div className="checkout-grid">
          {/* Left Column: Delivery & Payment Details Form */}
          <div style={{ width: "100%" }}>
            <form onSubmit={handleSubmitOrder} style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "1.75rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.85rem" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--color-terracotta)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  1. Contact &amp; Delivery Information
                </span>
                {!currentUser && (
                  <Link href="/login?redirect=/checkout" style={{ fontSize: "0.82rem", color: "var(--color-terracotta)", fontWeight: 600 }}>
                    Log in for faster checkout &rarr;
                  </Link>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "8px",
                      border: formErrors.name ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                      backgroundColor: formErrors.name ? "#fff5f5" : "#ffffff",
                      fontSize: "0.9rem",
                    }}
                  />
                  {formErrors.name && (
                    <div style={{ color: "#dc2626", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                      <AlertCircle size={12} /> {formErrors.name}
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={customerEmail}
                      onBlur={() => {
                        if (customerEmail && customerEmail.includes("@")) {
                          performEmailLookup(customerEmail);
                        }
                      }}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem",
                        borderRadius: "8px",
                        border: formErrors.email ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                        backgroundColor: formErrors.email ? "#fff5f5" : "#ffffff",
                        fontSize: "0.9rem",
                      }}
                    />
                    {formErrors.email && (
                      <div style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                        <AlertCircle size={12} /> {formErrors.email}
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
                      Mobile Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={customerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setCustomerPhone(val);
                        if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem",
                        borderRadius: "8px",
                        border: formErrors.phone ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                        backgroundColor: formErrors.phone ? "#fff5f5" : "#ffffff",
                        fontSize: "0.9rem",
                      }}
                    />
                    {formErrors.phone && (
                      <div style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                        <AlertCircle size={12} /> {formErrors.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Auto-Sync & Verification Feedback */}
                {currentUser ? (
                  <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "0.65rem 0.9rem", borderRadius: "8px", fontSize: "0.82rem", color: "#166534", display: "flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={15} color="#16a34a" />
                    <span>Signed in as <strong>{currentUser.name}</strong> ({currentUser.email}). Delivery details will be auto-saved.</span>
                  </div>
                ) : accountLookupStatus === "found" ? (
                  <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac", padding: "0.85rem 1rem", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#15803d", fontWeight: 700, fontSize: "0.85rem" }}>
                        <CheckCircle2 size={16} />
                        <span>Registered Customer Found: <strong>{accountLookupName || customerEmail}</strong></span>
                      </div>
                      <span style={{ fontSize: "0.72rem", backgroundColor: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "12px", fontWeight: 700 }}>
                        ✓ Saved Details Auto-Filled
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#166534" }}>
                      Your saved delivery details have been prefilled. Enter your password to sign in or submit order to save updates:
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                      <div style={{ position: "relative", flexGrow: 1, minWidth: "200px" }}>
                        <Lock size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                        <input
                          type="password"
                          placeholder="Enter your account password"
                          value={customerPassword}
                          onChange={(e) => {
                            setCustomerPassword(e.target.value);
                            if (signInError) setSignInError(null);
                          }}
                          style={{
                            width: "100%",
                            padding: "0.55rem 0.75rem 0.55rem 2rem",
                            borderRadius: "6px",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.85rem",
                            backgroundColor: "#ffffff",
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleInlineLogin}
                        disabled={isSigningIn || !customerPassword}
                        style={{
                          padding: "0.55rem 1rem",
                          borderRadius: "6px",
                          backgroundColor: "var(--color-terracotta)",
                          color: "#ffffff",
                          border: "none",
                          fontWeight: 700,
                          fontSize: "0.82rem",
                          cursor: "pointer",
                          opacity: isSigningIn || !customerPassword ? 0.7 : 1,
                        }}
                      >
                        {isSigningIn ? "Signing In..." : "1-Click Sign In"}
                      </button>
                    </div>
                    {signInError && (
                      <div style={{ color: "#dc2626", fontSize: "0.75rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        <AlertCircle size={12} /> {signInError}
                      </div>
                    )}
                  </div>
                ) : accountLookupStatus === "new" ? (
                  <div style={{ backgroundColor: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.85rem 1rem", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#7e22ce", fontWeight: 700, fontSize: "0.85rem" }}>
                      <Sparkles size={16} />
                      <span>Automatic Customer Account Creation</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#6b21a8" }}>
                      A customer account will be automatically created with this email so you can view all paid orders, tax invoices, and track dispatch anytime.
                    </p>
                    <div>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#6b21a8", marginBottom: "3px" }}>
                        Set Account Password (optional — auto-secure key will be assigned if left blank)
                      </label>
                      <div style={{ position: "relative", maxWidth: "340px" }}>
                        <Lock size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                        <input
                          type="password"
                          placeholder="Choose password (min 6 characters)"
                          value={customerPassword}
                          onChange={(e) => setCustomerPassword(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.55rem 0.75rem 0.55rem 2rem",
                            borderRadius: "6px",
                            border: "1px solid #d8b4fe",
                            fontSize: "0.85rem",
                            backgroundColor: "#ffffff",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
                    Delivery Street Address *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="House/Flat #, Building, Street, Landmark"
                    value={shippingAddress}
                    onChange={(e) => {
                      setShippingAddress(e.target.value);
                      if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: undefined }));
                    }}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.9rem",
                      borderRadius: "8px",
                      border: formErrors.address ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                      backgroundColor: formErrors.address ? "#fff5f5" : "#ffffff",
                      fontSize: "0.88rem",
                      resize: "none",
                    }}
                  />
                  {formErrors.address && (
                    <div style={{ color: "#dc2626", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                      <AlertCircle size={12} /> {formErrors.address}
                    </div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
                      Delivery State
                    </label>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)",
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        backgroundColor: "#fff",
                      }}
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
                      PIN Code (6 digits) *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="400001"
                      value={shippingPincode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setShippingPincode(val);
                        if (formErrors.pincode) setFormErrors((prev) => ({ ...prev, pincode: undefined }));
                      }}
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem",
                        borderRadius: "8px",
                        border: formErrors.pincode ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                        backgroundColor: formErrors.pincode ? "#fff5f5" : "#ffffff",
                        fontSize: "0.9rem",
                      }}
                    />
                    {formErrors.pincode && (
                      <div style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                        <AlertCircle size={12} /> {formErrors.pincode}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Selection */}
                <div style={{ marginTop: "1rem" }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--color-dragon-black)" }}>
                    Payment Method:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("razorpay")}
                      style={{
                        padding: "0.85rem 0.75rem",
                        borderRadius: "10px",
                        border: `2px solid ${paymentMethod === "razorpay" ? "var(--color-terracotta)" : "var(--color-border)"}`,
                        backgroundColor: paymentMethod === "razorpay" ? "var(--color-cream-subtle)" : "#ffffff",
                        color: paymentMethod === "razorpay" ? "var(--color-terracotta)" : "var(--color-text-secondary)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <CreditCard size={18} />
                      <span>Pay Online (Razorpay)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      style={{
                        padding: "0.85rem 0.75rem",
                        borderRadius: "10px",
                        border: `2px solid ${paymentMethod === "cod" ? "var(--color-terracotta)" : "var(--color-border)"}`,
                        backgroundColor: paymentMethod === "cod" ? "var(--color-cream-subtle)" : "#ffffff",
                        color: paymentMethod === "cod" ? "var(--color-terracotta)" : "var(--color-text-secondary)",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <Truck size={18} />
                      <span>Cash on Delivery</span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    width: "100%",
                    padding: "0.95rem",
                    borderRadius: "10px",
                    backgroundColor: "var(--color-terracotta)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    border: "none",
                    cursor: isProcessing ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 16px var(--color-terracotta-glow)",
                    marginTop: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Lock size={18} />
                  {isProcessing
                    ? "Securing Artisanal Order..."
                    : paymentMethod === "cod"
                    ? `Confirm COD Order • ₹${Math.round(grandTotal).toLocaleString("en-IN")}`
                    : `Pay ₹${Math.round(grandTotal).toLocaleString("en-IN")} Online`}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div style={{ width: "100%", position: "sticky", top: "2rem" }}>
            <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", padding: "1.5rem", border: "1px solid var(--color-border)", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", color: "var(--color-dragon-black)", marginBottom: "1rem" }}>
                Order Summary ({cart.reduce((acc, i) => acc + i.quantity, 0)} items)
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.25rem", maxHeight: "320px", overflowY: "auto", paddingRight: "4px" }}>
                {cart.map(({ soap, quantity }) => (
                  <div key={soap.id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <Image
                      src={soap.image}
                      alt={soap.name}
                      width={56}
                      height={56}
                      style={{ borderRadius: "8px", objectFit: "cover", backgroundColor: "#f5ebe6" }}
                    />
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "var(--color-dragon-black)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {soap.name}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                        Qty: {quantity} • ₹{soap.price.toLocaleString("en-IN")} each
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--color-dragon-black)" }}>
                      ₹{(soap.price * quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>

              {appliedPromo && (
                <div style={{ background: "var(--color-terracotta-light)", padding: "0.5rem 0.75rem", borderRadius: "8px", fontSize: "0.8rem", color: "var(--color-terracotta-dark)", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px", marginBottom: "1rem" }}>
                  <Sparkles size={14} />
                  <span>Promo {appliedPromo} applied (25% off)</span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "var(--color-text-secondary)" }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {discountAmount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "var(--color-terracotta)", fontWeight: 600 }}>
                    <span>Voucher Discount ({appliedPromo})</span>
                    <span>-₹{Math.round(discountAmount).toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                  <span>Taxes &amp; GST</span>
                  <span style={{ color: "#2e7d32", fontWeight: 600 }}>Included in price</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", color: "var(--color-text-secondary)" }}>
                  <span>Shipping ({selectedState})</span>
                  <span>{shippingCost === 0 ? <strong style={{ color: "#2e7d32" }}>FREE</strong> : `₹${shippingCost.toLocaleString("en-IN")}`}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.25rem", fontWeight: 800, color: "var(--color-dragon-black)", borderTop: "1px dashed var(--color-border)", paddingTop: "0.85rem", marginTop: "0.35rem" }}>
                  <span>Total Payable</span>
                  <span>₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.75rem", color: "var(--color-text-tertiary)", marginTop: "1.25rem" }}>
                <ShieldCheck size={16} color="#2e7d32" />
                <span>30-Day Happiness Guarantee • Plastic-Free Botanical Packaging</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeRazorpayData && (
        <RazorpayModal
          isOpen={isRazorpayModalOpen}
          amount={activeRazorpayData.amount}
          orderNumber={activeRazorpayData.orderNumber}
          razorpayOrderId={activeRazorpayData.orderId}
          customerName={customerName}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          onSuccess={(response) => handlePaymentSuccess(response, activeRazorpayData.orderNumber, activeRazorpayData.dbOrderId)}
          onClose={() => {
            setIsRazorpayModalOpen(false);
            setIsProcessing(false);
          }}
        />
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div style={{ backgroundColor: "#faf8f5", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Clean Distraction-Free Checkout Header */}
      <header
        style={{
          borderBottom: "1px solid rgba(197, 160, 89, 0.25)",
          backgroundColor: "#ffffff",
          padding: "1rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.65rem", textDecoration: "none" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "9px",
                backgroundColor: "var(--color-terracotta)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <Image src={CLOUDINARY_IMAGES.logo} alt="Star Light Co." width={36} height={36} style={{ objectFit: "cover" }} />
            </div>
            <div>
              <span style={{ fontFamily: "var(--font-serif)", fontWeight: 800, fontSize: "1.1rem", color: "var(--color-dragon-black)", letterSpacing: "0.08em" }}>
                STAR LIGHT CO.
              </span>
              <span style={{ display: "block", fontSize: "0.62rem", color: "var(--color-terracotta)", fontWeight: 700, letterSpacing: "0.15em" }}>
                ARTISANAL APOTHECARY
              </span>
            </div>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--color-text-secondary)", fontWeight: 600 }}>
            <Lock size={15} color="#2e7d32" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Content */}
      <main style={{ flexGrow: 1 }}>
        <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Loading Checkout...</div>}>
          <CheckoutContent />
        </Suspense>
      </main>

      {/* Minimalist Checkout Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(197, 160, 89, 0.2)",
          backgroundColor: "#ffffff",
          padding: "1.25rem 1.5rem",
          textAlign: "center",
          fontSize: "0.78rem",
          color: "var(--color-text-tertiary)",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
          <div>&copy; 2026 Star Light Co. Jaipur Atelier. All rights reserved.</div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>🌿 100% Cold-Process Saponification</span>
            <span>📦 Plastic-Free Recyclable Packaging</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
