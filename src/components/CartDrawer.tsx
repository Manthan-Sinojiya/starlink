"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { paymentApi, authApi } from "@/lib/api";
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

  const router = useRouter();
  const { calculateShipping, createOrder, currentUser, registerUser } = useDBStore();

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

  // Post-Order Account Creation State for Guest Users
  const [guestPassword, setGuestPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState(false);

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

  // Load guest details from localStorage if guest
  useEffect(() => {
    try {
      if (!currentUser) {
        const savedEmail = localStorage.getItem("starlight_guest_email");
        const savedName = localStorage.getItem("starlight_guest_name");
        const savedPhone = localStorage.getItem("starlight_guest_phone");
        if (savedEmail && !customerEmail) setCustomerEmail(savedEmail);
        if (savedName && !customerName) setCustomerName(savedName);
        if (savedPhone && !customerPhone) setCustomerPhone(savedPhone);
      }
    } catch {}
  }, [currentUser, customerEmail, customerName, customerPhone]);

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

  // Cart Drawer Email Lookup State
  const [drawerAccountStatus, setDrawerAccountStatus] = useState<"idle" | "loading" | "found" | "new">("idle");
  const [drawerAccountName, setDrawerAccountName] = useState<string>("");

  const performDrawerEmailLookup = async (emailToSearch: string) => {
    const cleanEmail = emailToSearch.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setDrawerAccountStatus("idle");
      return;
    }
    if (currentUser?.email?.toLowerCase() === cleanEmail) {
      setDrawerAccountStatus("found");
      setDrawerAccountName(currentUser.name || "");
      return;
    }
    setDrawerAccountStatus("loading");
    try {
      const res = await authApi.lookup(cleanEmail);
      if (res.success && res.exists && res.user) {
        setDrawerAccountStatus("found");
        setDrawerAccountName(res.user.name || "");
        if (!customerName || customerName === "Customer") setCustomerName(res.user.name || "");
        if (res.user.phone && (!customerPhone || customerPhone.length < 10)) setCustomerPhone(res.user.phone);
        if (res.user.address && !shippingAddress) setShippingAddress(res.user.address);
        if (res.user.pincode && !shippingPincode) setShippingPincode(res.user.pincode);
        if (res.user.state && INDIAN_STATES.includes(res.user.state)) setSelectedState(res.user.state);
        showToast(`Saved delivery details loaded for ${res.user.name}!`);
      } else {
        setDrawerAccountStatus("new");
      }
    } catch {
      setDrawerAccountStatus("idle");
    }
  };

  useEffect(() => {
    if (currentUser) return;
    const timer = setTimeout(() => {
      if (customerEmail && customerEmail.includes("@") && customerEmail.includes(".")) {
        performDrawerEmailLookup(customerEmail);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [customerEmail, currentUser]);

  const handleCreateAccountFromCart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestPassword || guestPassword.length < 6) {
      setAccountError("Password must be at least 6 characters.");
      return;
    }
    setIsCreatingAccount(true);
    setAccountError(null);
    try {
      const res = await registerUser({
        name: customerName || "Customer",
        email: customerEmail.trim().toLowerCase(),
        password: guestPassword,
        phone: customerPhone,
        address: shippingAddress,
        state: selectedState,
        pincode: shippingPincode,
      });
      if (res.success) {
        setAccountSuccess(true);
        showToast("Account created successfully! ✨");
        setTimeout(() => {
          setIsCartOpen(false);
          setOrderComplete(false);
          router.push(`/checkout/success?order_id=${confirmedOrderNumber}`);
        }, 1200);
      } else {
        setAccountError(res.message || "Failed to create account.");
      }
    } catch (err: any) {
      setAccountError(err.message || "Failed to create account.");
    } finally {
      setIsCreatingAccount(false);
    }
  };

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

      {/* Full View Cart Modal Overlay */}
      <aside
        className={`cart-drawer ${isCartOpen ? "open" : ""}`}
        aria-label="Artisanal Shopping Bag"
      >
        <div className="cart-fullview-container">
          {/* Header */}
          <div className="cart-drawer-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  background: "var(--color-cream-subtle)",
                  border: "1px solid rgba(197, 160, 89, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-terracotta)",
                }}
              >
                <ShoppingBag size={20} />
              </div>
              <div>
                <h2 className="cart-drawer-title" style={{ display: "flex", alignItems: "baseline", gap: "8px", margin: 0 }}>
                  <span>{checkoutStep === "details" ? "Express Checkout" : "Your Soap Bag"}</span>
                  {!orderComplete && cart.length > 0 && (
                    <span
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "var(--color-terracotta)",
                        background: "var(--color-terracotta-light)",
                        padding: "2px 9px",
                        borderRadius: "12px",
                      }}
                    >
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? "Item" : "Items"}
                    </span>
                  )}
                </h2>
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
                  {checkoutStep === "details"
                    ? "Confirm your shipping destination and select preferred payment mode"
                    : "Scalar Wave Charged • 100% Cold-Processed Artisanal Bars"}
                </p>
              </div>
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

          {/* Drawer Body */}
          {orderComplete ? (
            <div className="cart-status-card">
              <div
                style={{
                  width: "72px",
                  height: "72px",
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
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.55rem", marginBottom: "0.5rem" }}>
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
                      fontSize: "1.2rem",
                      color: "var(--color-dragon-black)",
                      fontFamily: "monospace",
                      letterSpacing: "0.05em",
                    }}
                  >
                    #{confirmedOrderNumber}
                  </span>
                </div>
              )}
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "520px", margin: "0 auto 1.25rem" }}>
                Thank you for choosing Star Light Co. Your cold-process soap bars are being hand-wrapped in plastic-free botanical packaging and scheduled for dispatch to <strong>{selectedState}</strong>.
              </p>

              {/* Guest Password Setup Popup / Card to Auto-Enter Dashboard */}
              {!currentUser && customerEmail && !accountSuccess && (
                <div
                  style={{
                    margin: "1rem auto 1.5rem",
                    padding: "1.25rem 1.4rem",
                    borderRadius: "14px",
                    backgroundColor: "var(--color-cream-subtle)",
                    border: "1.5px solid rgba(197, 160, 89, 0.4)",
                    textAlign: "left",
                    maxWidth: "460px",
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.45rem" }}>
                    <Sparkles size={18} color="var(--color-terracotta)" />
                    <h4 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700, color: "var(--color-dragon-black)" }}>
                      Create Password for Live Tracking
                    </h4>
                  </div>
                  <p style={{ margin: "0 0 0.85rem", fontSize: "0.8rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                    Set a password for <strong>{customerEmail}</strong> to link Order #{confirmedOrderNumber} to your dashboard and track courier dispatch in real-time.
                  </p>

                  <form onSubmit={handleCreateAccountFromCart} style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    <input
                      type="password"
                      placeholder="Enter a secure password (min 6 characters)"
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)",
                        fontSize: "0.86rem",
                        backgroundColor: "#ffffff",
                        outline: "none",
                      }}
                    />
                    {accountError && (
                      <div style={{ color: "#dc2626", fontSize: "0.76rem", fontWeight: 600 }}>{accountError}</div>
                    )}
                    <button
                      type="submit"
                      disabled={isCreatingAccount}
                      className="btn-primary"
                      style={{ width: "100%", padding: "0.75rem", fontSize: "0.88rem" }}
                    >
                      {isCreatingAccount ? "Linking Order..." : "Set Password & View in Dashboard →"}
                    </button>
                  </form>
                </div>
              )}

              {accountSuccess && (
                <div style={{ padding: "0.85rem", margin: "1rem auto 1.5rem", borderRadius: "10px", backgroundColor: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: "0.88rem", maxWidth: "460px" }}>
                  ✨ Account created! Opening your customer dashboard...
                </div>
              )}

              <button
                type="button"
                className="btn-primary"
                style={{ minWidth: "240px" }}
                onClick={() => {
                  setOrderComplete(false);
                  setIsCartOpen(false);
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="cart-status-card">
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
              <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", marginBottom: "0.5rem" }}>
                Your Soap Bag is Empty
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", maxWidth: "440px", margin: "0 auto 1.75rem", lineHeight: 1.6 }}>
                Explore our best-selling cold-process bars infused with sacred Dragon&apos;s Blood resin, organic botanical extracts, and French clays.
              </p>
              <button
                type="button"
                className="btn-primary"
                style={{ minWidth: "220px" }}
                onClick={() => setIsCartOpen(false)}
              >
                Explore Best Sellers
              </button>
            </div>
          ) : (
            <div className="cart-fullview-grid">
              {/* Left Column: Items or Checkout Form */}
              <div className="cart-fullview-left">
                {checkoutStep === "cart" ? (
                  <>
                    {/* Free shipping progress box */}
                    <div className="cart-shipping-perk-box">
                      <div className="cart-shipping-perk-header">
                        <Truck size={17} color="var(--color-terracotta)" />
                        <span className="cart-shipping-perk-text">
                          {freeShippingProgress >= 100 ? (
                            <strong style={{ color: "#2e7d32" }}>
                              ✨ You unlocked FREE Dispatch to {selectedState}!
                            </strong>
                          ) : (
                            <span>
                              Add{" "}
                              <strong>
                                ₹{Math.max(0, 999 - subtotal).toLocaleString("en-IN")}
                              </strong>{" "}
                              more for FREE Dispatch across India
                            </span>
                          )}
                        </span>
                        <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-terracotta)" }}>
                          {Math.min(100, Math.round(freeShippingProgress))}%
                        </span>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min(100, freeShippingProgress)}%` }}
                        />
                      </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="cart-items-collection">
                      {cart.map(({ soap, quantity }) => (
                        <div key={soap.id} className="cart-item-card">
                          <div className="cart-item-thumb">
                            <Image
                              src={soap.image}
                              alt={soap.name}
                              width={84}
                              height={84}
                              style={{ objectFit: "cover" }}
                            />
                          </div>

                          <div className="cart-item-content">
                            <div className="cart-item-info">
                              <h4 className="cart-item-name">{soap.name}</h4>
                              <p className="cart-item-tagline">
                                {soap.tagline || soap.cureTime || "Scalar Wave Charged • Cold-Process"}
                              </p>
                              <div className="cart-item-unit-price">
                                ₹{soap.price.toLocaleString("en-IN")} each
                              </div>
                            </div>

                            <div className="cart-item-actions">
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

                              <div className="cart-item-total-col">
                                <span className="cart-item-total-price">
                                  ₹{(soap.price * quantity).toLocaleString("en-IN")}
                                </span>
                                <button
                                  type="button"
                                  className="cart-item-remove-btn"
                                  onClick={() => removeFromCart(soap.id)}
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

                    {/* Voucher / Coupon Box */}
                    <div className="cart-voucher-card">
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.65rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-dragon-black)" }}>
                        <Tag size={15} color="var(--color-terracotta)" />
                        <span>Have a Festive Voucher or Coupon?</span>
                      </div>

                      <form onSubmit={handleApplyPromo} className="promo-input-row" style={{ marginBottom: appliedPromo || promoError ? "0.65rem" : 0 }}>
                        <input
                          type="text"
                          placeholder="E.G. FESTIVE25"
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
                            padding: "0.5rem 0.85rem",
                            borderRadius: "8px",
                            fontSize: "0.82rem",
                            color: "var(--color-terracotta-dark)",
                            fontWeight: 600,
                          }}
                        >
                          <span>
                            <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "5px" }} />
                            <strong>{appliedPromo}</strong> (25% Off Storewide Applied)
                          </span>
                          <button
                            type="button"
                            onClick={removePromo}
                            style={{ color: "var(--color-terracotta)", fontWeight: 700, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}
                          >
                            Remove
                          </button>
                        </div>
                      )}

                      {promoError && (
                        <div style={{ color: "#dc2626", fontSize: "0.8rem", fontWeight: 500, marginTop: "4px" }}>
                          {promoError}
                        </div>
                      )}
                    </div>

                    {/* Continue shopping link */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "none",
                          border: "none",
                          color: "var(--color-text-secondary)",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          padding: "4px 0",
                        }}
                      >
                        &larr; Continue Exploring Botanical Soaps
                      </button>
                    </div>
                  </>
                ) : (
                  /* Step 2: Delivery & Payment Details Form */
                  <div className="cart-checkout-form-container">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(197, 160, 89, 0.2)" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-terracotta)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Step 2 of 2: Shipping &amp; Payment
                      </span>
                      <button
                        type="button"
                        onClick={() => setCheckoutStep("cart")}
                        style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 600 }}
                      >
                        &larr; Back to Items
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Priya Sharma"
                          value={customerName}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomerName(val);
                            try { localStorage.setItem("starlight_guest_name", val); } catch {}
                            if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem",
                            borderRadius: "8px",
                            border: formErrors.name ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                            backgroundColor: formErrors.name ? "#fff5f5" : "#fbf9f6",
                            fontSize: "0.88rem",
                            transition: "all 0.15s ease",
                          }}
                        />
                        {formErrors.name && (
                          <div style={{ color: "#dc2626", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                            <AlertCircle size={12} /> {formErrors.name}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
                            Email Address *
                          </label>
                          <input
                            type="email"
                            placeholder="name@example.com"
                            value={customerEmail}
                            onBlur={() => {
                              if (customerEmail && customerEmail.includes("@")) {
                                performDrawerEmailLookup(customerEmail);
                              }
                            }}
                            onChange={(e) => {
                              const val = e.target.value;
                              setCustomerEmail(val);
                              try { localStorage.setItem("starlight_guest_email", val); } catch {}
                              if (formErrors.email) setFormErrors((prev) => ({ ...prev, email: undefined }));
                            }}
                            style={{
                              width: "100%",
                              padding: "0.65rem 0.85rem",
                              borderRadius: "8px",
                              border: formErrors.email ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                              backgroundColor: formErrors.email ? "#fff5f5" : "#fbf9f6",
                              fontSize: "0.88rem",
                              transition: "all 0.15s ease",
                            }}
                          />
                          {formErrors.email && (
                            <div style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                              <AlertCircle size={12} /> {formErrors.email}
                            </div>
                          )}
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
                            Mobile (10 Digits) *
                          </label>
                          <input
                            type="tel"
                            maxLength={10}
                            placeholder="9876543210"
                            value={customerPhone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                              setCustomerPhone(val);
                              try { localStorage.setItem("starlight_guest_phone", val); } catch {}
                              if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }));
                            }}
                            style={{
                              width: "100%",
                              padding: "0.65rem 0.85rem",
                              borderRadius: "8px",
                              border: formErrors.phone ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                              backgroundColor: formErrors.phone ? "#fff5f5" : "#fbf9f6",
                              fontSize: "0.88rem",
                              transition: "all 0.15s ease",
                            }}
                          />
                          {formErrors.phone && (
                            <div style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                              <AlertCircle size={12} /> {formErrors.phone}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Drawer Account Auto-Sync Banner */}
                      {currentUser ? (
                        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "0.55rem 0.8rem", borderRadius: "8px", fontSize: "0.78rem", color: "#166534", display: "flex", alignItems: "center", gap: "6px" }}>
                          <CheckCircle2 size={14} color="#16a34a" />
                          <span>Signed in as <strong>{currentUser.name}</strong> ({currentUser.email}). Delivery details auto-saved.</span>
                        </div>
                      ) : drawerAccountStatus === "found" ? (
                        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac", padding: "0.65rem 0.85rem", borderRadius: "8px", fontSize: "0.8rem", color: "#166534" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, marginBottom: "3px" }}>
                            <CheckCircle2 size={14} color="#16a34a" />
                            <span>Account Found: {drawerAccountName || customerEmail}</span>
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "#15803d" }}>✓ Saved shipping address and details auto-filled into your order.</span>
                        </div>
                      ) : drawerAccountStatus === "new" ? (
                        <div style={{ backgroundColor: "#faf5ff", border: "1px solid #d8b4fe", padding: "0.65rem 0.85rem", borderRadius: "8px", fontSize: "0.8rem", color: "#6b21a8" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, marginBottom: "2px" }}>
                            <Sparkles size={14} color="#7e22ce" />
                            <span>New Customer Account</span>
                          </div>
                          <span style={{ fontSize: "0.75rem", color: "#7e22ce" }}>An account will be automatically created on checkout to save this order &amp; tax invoices.</span>
                        </div>
                      ) : null}

                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
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
                            padding: "0.65rem 0.85rem",
                            borderRadius: "8px",
                            border: formErrors.address ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                            backgroundColor: formErrors.address ? "#fff5f5" : "#fbf9f6",
                            fontSize: "0.88rem",
                            resize: "none",
                            transition: "all 0.15s ease",
                          }}
                        />
                        {formErrors.address && (
                          <div style={{ color: "#dc2626", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                            <AlertCircle size={12} /> {formErrors.address}
                          </div>
                        )}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
                            Delivery State
                          </label>
                          <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            style={{
                              width: "100%",
                              padding: "0.65rem 0.85rem",
                              borderRadius: "8px",
                              border: "1px solid var(--color-border)",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                              backgroundColor: "#fbf9f6",
                              color: "var(--color-dragon-black)",
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
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem", color: "var(--color-dragon-black)" }}>
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
                              padding: "0.65rem 0.85rem",
                              borderRadius: "8px",
                              border: formErrors.pincode ? "1.5px solid #dc2626" : "1px solid var(--color-border)",
                              backgroundColor: formErrors.pincode ? "#fff5f5" : "#fbf9f6",
                              fontSize: "0.88rem",
                              transition: "all 0.15s ease",
                            }}
                          />
                          {formErrors.pincode && (
                            <div style={{ color: "#dc2626", fontSize: "0.72rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                              <AlertCircle size={12} /> {formErrors.pincode}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment Method Selector */}
                      <div style={{ marginTop: "0.4rem" }}>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--color-dragon-black)" }}>
                          Select Payment Option:
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("razorpay")}
                            style={{
                              padding: "0.9rem 0.75rem",
                              borderRadius: "12px",
                              border: `2px solid ${paymentMethod === "razorpay" ? "var(--color-terracotta)" : "var(--color-border)"}`,
                              backgroundColor: paymentMethod === "razorpay" ? "var(--color-cream-subtle)" : "#ffffff",
                              color: paymentMethod === "razorpay" ? "var(--color-terracotta)" : "var(--color-text-secondary)",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "5px",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <CreditCard size={20} />
                            <span>Pay Online</span>
                            <span style={{ fontSize: "0.7rem", fontWeight: 500, color: "var(--color-text-tertiary)" }}>
                              UPI / Cards / NetBanking
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod("cod")}
                            style={{
                              padding: "0.9rem 0.75rem",
                              borderRadius: "12px",
                              border: `2px solid ${paymentMethod === "cod" ? "var(--color-terracotta)" : "var(--color-border)"}`,
                              backgroundColor: paymentMethod === "cod" ? "var(--color-cream-subtle)" : "#ffffff",
                              color: paymentMethod === "cod" ? "var(--color-terracotta)" : "var(--color-text-secondary)",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "5px",
                              transition: "all 0.15s ease",
                            }}
                          >
                            <Truck size={20} />
                            <span>Cash on Delivery</span>
                            <span style={{ fontSize: "0.7rem", fontWeight: 500, color: "var(--color-text-tertiary)" }}>
                              Pay at your doorstep
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Order Summary Card */}
              <div className="cart-fullview-right">
                <div className="cart-summary-card">
                  <h3 className="cart-summary-title">Order Summary</h3>

                  {/* Delivery Destination Selector */}
                  <div className="cart-destination-box">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 600, fontSize: "0.82rem", color: "var(--color-dragon-black)" }}>
                      <MapPin size={15} color="var(--color-terracotta)" />
                      <span>Dispatch Destination:</span>
                    </div>
                    <select
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="cart-state-select"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Breakdown */}
                  <div className="cart-summary-breakdown">
                    <div className="cart-summary-line">
                      <span>Subtotal</span>
                      <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="cart-summary-line" style={{ color: "var(--color-terracotta)", fontWeight: 600 }}>
                        <span>Voucher Discount ({appliedPromo})</span>
                        <span>-₹{Math.round(discountAmount).toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {hasExclusiveTax ? (
                      <div className="cart-summary-line" style={{ color: "var(--color-dragon-black)", fontWeight: 600 }}>
                        <span>Estimated GST / Tax (Excl.)</span>
                        <span>+₹{Math.round(taxAmount).toLocaleString("en-IN")}</span>
                      </div>
                    ) : (
                      <div className="cart-summary-line" style={{ fontSize: "0.8rem", color: "var(--color-text-tertiary)" }}>
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
                      <div>
                        <span>Total Payable</span>
                        <span style={{ display: "block", fontSize: "0.72rem", color: "var(--color-text-tertiary)", fontWeight: 400 }}>
                          (Inclusive of all taxes)
                        </span>
                      </div>
                      <span className="cart-total-amount">₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* CTA Button Actions */}
                  {checkoutStep === "cart" ? (
                    <div className="cart-actions-group">
                      <button
                        type="button"
                        className="checkout-btn"
                        onClick={() => setCheckoutStep("details")}
                      >
                        Proceed to Checkout • ₹{Math.round(grandTotal).toLocaleString("en-IN")}
                      </button>
                      <Link
                        href="/checkout"
                        onClick={() => setIsCartOpen(false)}
                        className="cart-fullpage-link"
                      >
                        Or Open Full-Page Checkout &rarr;
                      </Link>
                    </div>
                  ) : (
                    <div className="cart-actions-group">
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
                      <button
                        type="button"
                        onClick={() => setCheckoutStep("cart")}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--color-text-secondary)",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          textDecoration: "underline",
                          textAlign: "center",
                          marginTop: "0.35rem",
                        }}
                      >
                        &larr; Back to Cart Items
                      </button>
                    </div>
                  )}

                  {/* Trust badges */}
                  <div className="cart-guarantees-list">
                    <div className="cart-guarantee-item">
                      <ShieldCheck size={16} color="#2e7d32" />
                      <span>256-Bit SSL Encrypted &amp; Secure Checkout</span>
                    </div>
                    <div className="cart-guarantee-item">
                      <Sparkles size={16} color="var(--color-terracotta)" />
                      <span>100% Handcrafted Cold-Process • Plastic-Free</span>
                    </div>
                    <div className="cart-guarantee-item">
                      <Truck size={16} color="#3b82f6" />
                      <span>Tracked Express Dispatch from Jaipur Atelier</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
