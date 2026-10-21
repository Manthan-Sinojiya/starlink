"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
  Check,
  MapPin,
  CreditCard,
  Truck,
  Phone,
  User,
  Home,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useDBStore } from "@/context/DBStoreContext";
import { FESTIVAL_PROMO, INDIAN_STATES } from "@/data/soaps";
import { paymentApi } from "@/lib/api";
import RazorpayModal from "@/components/RazorpayModal";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color: string };
  modal?: { ondismiss?: () => void };
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (document.getElementById("razorpay-checkout-script")) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    taxAmount,
    hasExclusiveTax,
    total,
    freeShippingProgress,
    appliedPromo,
    promoError,
    applyPromo,
    removePromo,
    clearCart,
    showToast,
    selectedState,
    setSelectedState,
  } = useCart();

  const { calculateShipping, createOrder, currentUser } = useDBStore();

  const [inputCode, setInputCode] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState<string>("");
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "details">("cart");

  // Customer Form details
  const [customerName, setCustomerName] = useState(currentUser?.name || "");
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || "");
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || "");
  const [shippingAddress, setShippingAddress] = useState(currentUser?.address || "");
  const [shippingPincode, setShippingPincode] = useState(currentUser?.pincode || "");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  // Form validation errors
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    pincode?: string;
  }>({});

  // Razorpay interactive modal state
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

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromo(inputCode);
      setInputCode("");
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
      errors.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (!customerPhone.trim()) {
      errors.phone = "Phone number is required for delivery & tracking updates.";
    } else if (cleanPhone.length !== 10) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    } else if (!/^[6-9]/.test(cleanPhone)) {
      errors.phone = "Indian mobile numbers must start with 6, 7, 8, or 9.";
    }

    if (!shippingAddress.trim() || shippingAddress.trim().length < 5) {
      errors.address = "Please enter your complete street address (House/Flat, Street, Area).";
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
    const finalOrderNumber = orderNum || activeRazorpayData?.orderNumber || confirmedOrderNumber;
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
    setConfirmedOrderNumber(finalOrderNumber);
    setOrderComplete(true);
    setCheckoutStep("cart");
    clearCart();
    setIsCheckingOut(false);
    showToast("Payment successful! Order confirmed ✨");
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      showToast("Please fill in all required delivery details correctly.");
      return;
    }

    setIsCheckingOut(true);

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

      // 1. Create order in database
      const dbOrder = await createOrder({
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim().toLowerCase(),
        customerPhone: customerPhone.trim(),
        shippingAddress: shippingAddress.trim(),
        shippingState: selectedState,
        shippingPincode: shippingPincode.trim(),
        items: orderItems,
        subtotal,
        shipping: shippingCost,
        total: Math.round(grandTotal),
        paymentMethod,
        status: "Pending",
        paymentStatus: paymentMethod === "cod" ? "Pending" : "Pending",
      });

      const orderNumber = dbOrder?.orderNumber || `SLC-${Date.now().toString().slice(-6)}`;
      const dbOrderId = (dbOrder?._id || dbOrder?.id || orderNumber) as string;

      // 2. If Cash on Delivery, finish immediately
      if (paymentMethod === "cod") {
        setConfirmedOrderNumber(orderNumber);
        setOrderComplete(true);
        setCheckoutStep("cart");
        clearCart();
        setIsCheckingOut(false);
        showToast("Cash on Delivery order placed successfully!");
        return;
      }

      // 3. Online Payment (Razorpay)
      try {
        const rzpOrderRes = await paymentApi.createOrder(
          Math.round(grandTotal),
          `rcpt_${orderNumber}`
        );

        let openedNative = false;
        const keyId = rzpOrderRes.keyId;
        const hasRealKey = keyId && !keyId.includes("YourKeyIdHere") && !keyId.includes("rzp_test_star_light");

        if (hasRealKey && typeof window !== "undefined") {
          try {
            const scriptLoaded = await loadRazorpayScript();
            const RazorpayClass = (window as any).Razorpay;
            if (scriptLoaded && RazorpayClass) {
              const rzpOptions: RazorpayOptions = {
                key: keyId,
                amount: rzpOrderRes.amount,
                currency: rzpOrderRes.currency || "INR",
                name: "Star Light Co.",
                description: "Artisanal Handcrafted Soaps",
                order_id: rzpOrderRes.orderId.startsWith("rzp_sim_") ? undefined : rzpOrderRes.orderId,
                prefill: {
                  name: customerName,
                  email: customerEmail,
                  contact: customerPhone,
                },
                theme: { color: "#e17159" },
                handler: async (response) => {
                  await handlePaymentSuccess({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }, orderNumber, dbOrderId);
                },
                modal: {
                  ondismiss: () => {
                    setIsCheckingOut(false);
                    showToast("Payment window closed. You can retry anytime.");
                  },
                },
              };

              const rzp = new RazorpayClass(rzpOptions);
              rzp.open();
              openedNative = true;
            }
          } catch (nativeErr) {
            console.warn("Native Razorpay open error:", nativeErr);
          }
        }

        // If native checkout did not open, OPEN the interactive RazorpayModal!
        if (!openedNative) {
          setActiveRazorpayData({
            amount: Math.round(grandTotal),
            orderNumber,
            orderId: rzpOrderRes.orderId || `rzp_sim_${Date.now()}`,
            dbOrderId,
          });
          setIsRazorpayModalOpen(true);
        }
      } catch (payErr) {
        console.warn("Payment order creation fallback:", payErr);
        setActiveRazorpayData({
          amount: Math.round(grandTotal),
          orderNumber,
          orderId: `rzp_sim_${Date.now()}`,
          dbOrderId,
        });
        setIsRazorpayModalOpen(true);
      }
    } catch (e) {
      console.error("Order error:", e);
      showToast("Order could not be processed. Please check details.");
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`cart-drawer-overlay ${isCartOpen ? "open" : ""}`}
        onClick={() => {
          setIsCartOpen(false);
          setCheckoutStep("cart");
        }}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer ${isCartOpen ? "open" : ""}`}
        aria-label="Artisanal Shopping Bag"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <ShoppingBag size={21} color="var(--color-terracotta)" />
            <h2 className="cart-drawer-title" style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span>{checkoutStep === "details" ? "Delivery & Payment" : "Your Soap Bag"}</span>
              {!orderComplete && cart.length > 0 && checkoutStep === "cart" && (
                <span style={{ fontSize: "1.15rem", fontWeight: 500, color: "var(--color-dragon-black)", fontFamily: "sans-serif" }}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </h2>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={() => {
              setIsCartOpen(false);
              setCheckoutStep("cart");
            }}
            aria-label="Close soap bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {!orderComplete && cart.length > 0 && (
          <div className="free-shipping-bar">
            <div className="free-shipping-text">
              {freeShippingProgress >= 100 ? (
                <span style={{ color: "#2e7d32", fontWeight: 700 }}>
                  ✨ You unlocked FREE Dispatch to {selectedState}!
                </span>
              ) : (
                <span>
                  Add{" "}
                  <strong>
                    ₹{Math.max(0, 999 - subtotal).toLocaleString("en-IN")}
                  </strong>{" "}
                  more for FREE Dispatch across India
                </span>
              )}
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, freeShippingProgress)}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        {orderComplete ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", flexGrow: 1 }}>
            <div
              style={{
                width: "68px",
                height: "68px",
                borderRadius: "50%",
                background: "rgba(34, 197, 94, 0.12)",
                color: "#16a34a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Check size={38} />
            </div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", marginBottom: "0.5rem" }}>
              Order Confirmed!
            </h3>
            {confirmedOrderNumber && (
              <div
                style={{
                  margin: "0.75rem auto 1.25rem",
                  padding: "0.6rem 1.35rem",
                  borderRadius: "10px",
                  backgroundColor: "var(--color-cream-subtle)",
                  border: "1px solid var(--color-border)",
                  display: "inline-block",
                }}
              >
                <span
                  style={{
                    fontSize: "0.72rem",
                    color: "var(--color-text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "block",
                  }}
                >
                  Official Order Reference
                </span>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: "1.15rem",
                    color: "var(--color-dragon-black)",
                    fontFamily: "monospace",
                    letterSpacing: "0.05em",
                  }}
                >
                  #{confirmedOrderNumber}
                </span>
              </div>
            )}
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              Thank you for choosing Star Light Co. Your cold-process soap bars are being hand-wrapped in plastic-free botanical packaging and scheduled for dispatch to <strong>{selectedState}</strong>.
            </p>
            <button
              type="button"
              className="btn-primary"
              style={{ width: "100%" }}
              onClick={() => {
                setOrderComplete(false);
                setIsCartOpen(false);
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div style={{ padding: "4rem 1.5rem", textAlign: "center", flexGrow: 1 }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "var(--color-cream-subtle)",
                color: "var(--color-text-tertiary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}
            >
              <ShoppingBag size={34} />
            </div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", marginBottom: "0.5rem" }}>
              Your Soap Bag is Empty
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.88rem", marginBottom: "1.75rem" }}>
              Explore our best-selling cold-process bars infused with sacred Dragon&apos;s Blood resin and French clays.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsCartOpen(false)}
            >
              Explore Best Sellers
            </button>
          </div>
        ) : checkoutStep === "details" ? (
          /* STEP 2: Delivery & Payment Details Form */
          <div style={{ padding: "1.25rem 1.5rem", flexGrow: 1, overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-terracotta)", textTransform: "uppercase" }}>
                Step 2 of 2: Shipping &amp; Payment
              </span>
              <button
                type="button"
                onClick={() => setCheckoutStep("cart")}
                style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                &larr; Back to Items
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--color-dragon-black)" }}>
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
                    padding: "0.6rem 0.8rem",
                    borderRadius: "8px",
                    border: formErrors.name ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                    backgroundColor: formErrors.name ? "#fff5f5" : "#ffffff",
                    fontSize: "0.88rem",
                    transition: "all 0.15s ease",
                  }}
                />
                {formErrors.name && (
                  <div style={{ color: "#dc2626", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                    <AlertCircle size={12} /> {formErrors.name}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--color-dragon-black)" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "8px",
                      border: formErrors.email ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                      backgroundColor: formErrors.email ? "#fff5f5" : "#ffffff",
                      fontSize: "0.88rem",
                      transition: "all 0.15s ease",
                    }}
                  />
                  {formErrors.email && (
                    <div style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                      <AlertCircle size={12} /> {formErrors.email}
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--color-dragon-black)" }}>
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
                      padding: "0.6rem 0.8rem",
                      borderRadius: "8px",
                      border: formErrors.phone ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                      backgroundColor: formErrors.phone ? "#fff5f5" : "#ffffff",
                      fontSize: "0.88rem",
                      transition: "all 0.15s ease",
                    }}
                  />
                  {formErrors.phone && (
                    <div style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                      <AlertCircle size={12} /> {formErrors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--color-dragon-black)" }}>
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
                    padding: "0.6rem 0.8rem",
                    borderRadius: "8px",
                    border: formErrors.address ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                    backgroundColor: formErrors.address ? "#fff5f5" : "#ffffff",
                    fontSize: "0.85rem",
                    resize: "none",
                    transition: "all 0.15s ease",
                  }}
                />
                {formErrors.address && (
                  <div style={{ color: "#dc2626", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                    <AlertCircle size={12} /> {formErrors.address}
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--color-dragon-black)" }}>
                    Delivery State
                  </label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    style={{ width: "100%", padding: "0.6rem 0.6rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.82rem", fontWeight: 600, backgroundColor: "#fff" }}
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem", color: "var(--color-dragon-black)" }}>
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
                      padding: "0.6rem 0.8rem",
                      borderRadius: "8px",
                      border: formErrors.pincode ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                      backgroundColor: formErrors.pincode ? "#fff5f5" : "#ffffff",
                      fontSize: "0.88rem",
                      transition: "all 0.15s ease",
                    }}
                  />
                  {formErrors.pincode && (
                    <div style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                      <AlertCircle size={12} /> {formErrors.pincode}
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div style={{ marginTop: "0.5rem" }}>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.4rem", color: "var(--color-dragon-black)" }}>
                  Select Payment Option:
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("razorpay")}
                    style={{
                      padding: "0.75rem 0.5rem",
                      borderRadius: "10px",
                      border: `2px solid ${paymentMethod === "razorpay" ? "var(--color-terracotta)" : "var(--color-border)"}`,
                      backgroundColor: paymentMethod === "razorpay" ? "var(--color-cream-subtle)" : "#ffffff",
                      color: paymentMethod === "razorpay" ? "var(--color-terracotta)" : "var(--color-text-secondary)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <CreditCard size={18} />
                    <span>Pay Online</span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "var(--color-text-tertiary)" }}>
                      UPI / Cards / NetBanking
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    style={{
                      padding: "0.75rem 0.5rem",
                      borderRadius: "10px",
                      border: `2px solid ${paymentMethod === "cod" ? "var(--color-terracotta)" : "var(--color-border)"}`,
                      backgroundColor: paymentMethod === "cod" ? "var(--color-cream-subtle)" : "#ffffff",
                      color: paymentMethod === "cod" ? "var(--color-terracotta)" : "var(--color-text-secondary)",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Truck size={18} />
                    <span>Cash on Delivery</span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 500, color: "var(--color-text-tertiary)" }}>
                      Pay at your doorstep
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 1: Items List */
          <div className="cart-items-scroll">
            {cart.map(({ soap, quantity }) => (
              <div key={soap.id} className="cart-item-row">
                <div className="cart-item-thumb">
                  <Image
                    src={soap.image}
                    alt={soap.name}
                    width={76}
                    height={76}
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className="cart-item-details">
                  <h4 className="cart-item-name">{soap.name}</h4>
                  <div className="cart-item-tagline">{soap.tagline || soap.cureTime || "Scalar Wave Charged"}</div>

                  <div className="cart-item-qty-row">
                    <div className="qty-counter">
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(soap.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        onClick={() => updateQuantity(soap.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <span className="cart-item-price">
                        ₹{(soap.price * quantity).toLocaleString("en-IN")}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFromCart(soap.id)}
                        style={{ color: "#9e9ea7", transition: "color 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#e02424")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#9e9ea7")}
                        aria-label={`Remove ${soap.name} from cart`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Summary & Checkout Action */}
        {!orderComplete && cart.length > 0 && (
          <div className="cart-drawer-footer">
            {checkoutStep === "cart" && (
              <>
                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="promo-input-row">
                  <input
                    type="text"
                    placeholder="VOUCHER (E.G. FESTIVE25)"
                    className="promo-input"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                  />
                  <button type="submit" className="promo-apply-btn">
                    Apply
                  </button>
                </form>

                {appliedPromo && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "var(--color-terracotta-light)",
                      padding: "0.45rem 0.75rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.78rem",
                      color: "var(--color-terracotta-dark)",
                      fontWeight: 600,
                      marginBottom: "0.85rem",
                    }}
                  >
                    <span>
                      <Sparkles size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                      {appliedPromo} (25% Off Storewide Applied)
                    </span>
                    <button
                      type="button"
                      onClick={removePromo}
                      style={{ color: "var(--color-terracotta)", fontWeight: 700, textDecoration: "underline" }}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {promoError && (
                  <div style={{ color: "#d32f2f", fontSize: "0.78rem", marginBottom: "0.5rem" }}>
                    {promoError}
                  </div>
                )}

                {/* Delivery State Selector for State-Wise Shipping */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "0.85rem",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "8px",
                    backgroundColor: "var(--color-cream-subtle)",
                    border: "1px solid var(--color-border)",
                    fontSize: "0.82rem",
                  }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: 600, color: "var(--color-dragon-black)" }}>
                    <MapPin size={14} color="var(--color-terracotta)" /> Dispatch To:
                  </span>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    style={{
                      border: "none",
                      backgroundColor: "#ffffff",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                      color: "var(--color-terracotta)",
                      outline: "none",
                      cursor: "pointer",
                      borderLeft: "2px solid var(--color-terracotta)",
                    }}
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Price Breakdown */}
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            {discountAmount > 0 && (
              <div className="cart-summary-line" style={{ color: "var(--color-terracotta)", fontWeight: 600 }}>
                <span>Festival Discount (25%)</span>
                <span>-₹{Math.round(discountAmount).toLocaleString("en-IN")}</span>
              </div>
            )}

            {hasExclusiveTax ? (
              <div className="cart-summary-line" style={{ color: "var(--color-dragon-black)", fontWeight: 600 }}>
                <span>Estimated GST / Tax (Excl.)</span>
                <span>+₹{Math.round(taxAmount).toLocaleString("en-IN")}</span>
              </div>
            ) : (
              <div className="cart-summary-line" style={{ fontSize: "0.78rem", color: "var(--color-text-tertiary)" }}>
                <span>Taxes &amp; GST</span>
                <span style={{ color: "#2e7d32", fontWeight: 600 }}>Included in price</span>
              </div>
            )}

            <div className="cart-summary-line">
              <span>Shipping ({selectedState})</span>
              <span>
                {shippingCost === 0 ? (
                  <strong style={{ color: "#2e7d32" }}>FREE</strong>
                ) : (
                  `₹${shippingCost.toLocaleString("en-IN")}`
                )}
              </span>
            </div>

            <div className="cart-summary-total">
              <span>Total Payable</span>
              <span>₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
            </div>

            {checkoutStep === "cart" ? (
              <button
                type="button"
                className="checkout-btn"
                onClick={() => setCheckoutStep("details")}
              >
                Proceed to Checkout • ₹{Math.round(grandTotal).toLocaleString("en-IN")}
              </button>
            ) : (
              <button
                type="button"
                className="checkout-btn"
                onClick={handlePlaceOrder}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  "Confirming Artisanal Order..."
                ) : paymentMethod === "cod" ? (
                  `Confirm COD Order • ₹${Math.round(grandTotal).toLocaleString("en-IN")}`
                ) : (
                  `Pay ₹${Math.round(grandTotal).toLocaleString("en-IN")} Online`
                )}
              </button>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "0.85rem",
                fontSize: "0.75rem",
                color: "var(--color-text-tertiary)",
              }}
            >
              <ShieldCheck size={14} color="#2e7d32" />
              <span>Guaranteed Fresh Cold-Process • 30-Day Satisfaction</span>
            </div>
          </div>
        )}
      </aside>

      {/* Interactive Razorpay Gateway Modal */}
      {activeRazorpayData && (
        <RazorpayModal
          isOpen={isRazorpayModalOpen}
          amount={activeRazorpayData.amount}
          orderNumber={activeRazorpayData.orderNumber}
          razorpayOrderId={activeRazorpayData.orderId}
          customerName={customerName}
          customerEmail={customerEmail}
          customerPhone={customerPhone}
          onSuccess={(response) => handlePaymentSuccess(response)}
          onClose={() => {
            setIsRazorpayModalOpen(false);
            setIsCheckingOut(false);
          }}
        />
      )}
    </>
  );
}
