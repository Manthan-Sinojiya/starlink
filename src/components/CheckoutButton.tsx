"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useDBStore } from "@/context/DBStoreContext";
import { paymentApi, ordersApi, OrderItem } from "@/lib/api";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color: string };
  modal?: { ondismiss?: () => void };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface CheckoutButtonProps {
  shippingCost: number;
  shippingAddress: string;
  shippingState: string;
  shippingPincode: string;
  onSuccess: (orderNumber: string) => void;
  onError: (msg: string) => void;
}

export default function CheckoutButton({
  shippingCost,
  shippingAddress,
  shippingState,
  shippingPincode,
  onSuccess,
  onError,
}: CheckoutButtonProps) {
  const { cart, total, clearCart } = useCart();
  const { currentUser, createOrder } = useDBStore();
  const [isLoading, setIsLoading] = useState(false);
  const [payMethod, setPayMethod] = useState<"razorpay" | "cod">("razorpay");

  const grandTotal = total + shippingCost;

  const handleCheckout = async () => {
    if (!currentUser) {
      onError("Please sign in to place an order.");
      return;
    }
    if (cart.length === 0) {
      onError("Your cart is empty.");
      return;
    }

    setIsLoading(true);

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.soap.id || item.soap.slug || "product",
      name: item.soap.name,
      image: item.soap.image,
      imageAlt: item.soap.imageAlt || item.soap.name,
      price: item.soap.price,
      quantity: item.quantity,
      weight: item.soap.weight,
    }));

    try {
      if (payMethod === "cod") {
        // COD order - create directly
        const order = await createOrder({
          customerEmail: currentUser.email,
          customerName: currentUser.name,
          customerPhone: currentUser.phone,
          items: orderItems,
          subtotal: total,
          shipping: shippingCost,
          total: grandTotal,
          shippingState,
          shippingAddress,
          shippingPincode,
          status: "Pending",
          paymentStatus: "Pending",
          paymentMethod: "cod",
        });
        clearCart();
        onSuccess(order.orderNumber);
        return;
      }

      // Razorpay Payment
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        onError("Failed to load payment gateway. Please try again.");
        setIsLoading(false);
        return;
      }

      // Create Razorpay order
      const rzpOrderRes = await paymentApi.createOrder(
        grandTotal,
        `rcpt_${Date.now()}`
      );

      if (!rzpOrderRes.success) {
        onError("Failed to initiate payment. Please try again.");
        setIsLoading(false);
        return;
      }

      // First create the order in DB with pending status
      const dbOrder = await createOrder({
        customerEmail: currentUser.email,
        customerName: currentUser.name,
        customerPhone: currentUser.phone,
        items: orderItems,
        subtotal: total,
        shipping: shippingCost,
        total: grandTotal,
        shippingState,
        shippingAddress,
        shippingPincode,
        status: "Pending",
        paymentStatus: "Pending",
        paymentMethod: "razorpay",
        razorpayOrderId: rzpOrderRes.orderId,
      });

      const rzpOptions: RazorpayOptions = {
        key: rzpOrderRes.keyId,
        amount: rzpOrderRes.amount as number,
        currency: rzpOrderRes.currency,
        name: "Star Light Co.",
        description: "Artisanal Handcrafted Soaps",
        order_id: rzpOrderRes.orderId,
        prefill: {
          name: currentUser.name,
          email: currentUser.email,
          contact: currentUser.phone || "",
        },
        theme: { color: "#e17159" },
        handler: async (response: RazorpayResponse) => {
          try {
            await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: (dbOrder._id || dbOrder.id) as string,
            });
            clearCart();
            onSuccess(dbOrder.orderNumber);
          } catch {
            onError("Payment verification failed. Contact support.");
          }
          setIsLoading(false);
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            onError("Payment cancelled.");
          },
        },
      };

      const RazorpayClass = typeof window !== "undefined" ? (window as any).Razorpay : null;
      if (RazorpayClass) {
        const rzp = new RazorpayClass(rzpOptions);
        rzp.open();
      } else {
        onError("Razorpay SDK could not be loaded.");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      onError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Payment method selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
        {(["razorpay", "cod"] as const).map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => setPayMethod(method)}
            style={{
              padding: "0.6rem",
              borderRadius: "8px",
              border: `2px solid ${payMethod === method ? "var(--color-terracotta)" : "var(--color-border)"}`,
              backgroundColor: payMethod === method ? "var(--color-cream-subtle)" : "#fff",
              color: payMethod === method ? "var(--color-terracotta)" : "var(--color-text-secondary)",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {method === "razorpay" ? "💳 Pay Online" : "🏠 Cash on Delivery"}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading || cart.length === 0}
        style={{
          width: "100%",
          padding: "0.9rem",
          borderRadius: "12px",
          backgroundColor: "var(--color-terracotta)",
          color: "#fff",
          fontWeight: 700,
          fontSize: "1rem",
          border: "none",
          cursor: isLoading || cart.length === 0 ? "not-allowed" : "pointer",
          boxShadow: "0 4px 16px var(--color-terracotta-glow)",
          opacity: isLoading || cart.length === 0 ? 0.7 : 1,
          transition: "all 0.2s",
          letterSpacing: "0.02em",
        }}
      >
        {isLoading
          ? "Processing..."
          : `${payMethod === "cod" ? "Place Order" : "Pay"} ₹${grandTotal.toLocaleString("en-IN")}`}
      </button>

      {!currentUser && (
        <p style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", textAlign: "center", margin: 0 }}>
          <a href="/login" style={{ color: "var(--color-terracotta)", fontWeight: 600 }}>Sign in</a> to checkout
        </p>
      )}
    </div>
  );
}
