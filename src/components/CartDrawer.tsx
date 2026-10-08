"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Sparkles, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { FESTIVAL_PROMO } from "@/data/soaps";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    total,
    freeShippingProgress,
    appliedPromo,
    promoError,
    applyPromo,
    removePromo,
    clearCart,
    showToast,
  } = useCart();

  const [inputCode, setInputCode] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromo(inputCode);
      setInputCode("");
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 1800);
  };

  const isFreeShipping = subtotal >= FESTIVAL_PROMO.freeShippingThreshold;
  const shippingCost = isFreeShipping || subtotal === 0 ? 0 : 5.0;
  const grandTotal = total + shippingCost;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`cart-drawer-overlay ${isCartOpen ? "open" : ""}`}
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer ${isCartOpen ? "open" : ""}`}
        aria-label="Shopping Cart Drawer"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShoppingBag size={20} color="var(--color-terracotta)" />
            <h2 className="cart-drawer-title">Your Soap Bag</h2>
            <span style={{ fontSize: "0.85rem", color: "var(--color-text-tertiary)" }}>
              ({cart.reduce((a, b) => a + b.quantity, 0)})
            </span>
          </div>

          <button
            type="button"
            className="cart-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="shipping-progress-box">
          <div className="shipping-progress-text">
            {isFreeShipping ? (
              <span style={{ color: "#2e7d32", fontWeight: 700 }}>
                🎉 You qualify for FREE Express Botanical Delivery!
              </span>
            ) : (
              <span>
                Add <strong>${(FESTIVAL_PROMO.freeShippingThreshold - subtotal).toFixed(2)}</strong> more for FREE Shipping!
              </span>
            )}
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>

        {/* Cart Items List */}
        {orderComplete ? (
          <div style={{ padding: "3rem 1.5rem", textAlign: "center", flexGrow: 1 }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "var(--color-terracotta-light)",
                color: "var(--color-terracotta)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem",
              }}
            >
              <Check size={36} />
            </div>
            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.45rem", marginBottom: "0.5rem" }}>
              Order Confirmed!
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "2rem" }}>
              Thank you for supporting artisanal craftsmanship. Your cold-process soap bars are being lovingly hand-wrapped 
              in plastic-free terracotta packaging.
            </p>
            <button
              type="button"
              className="btn-primary"
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
              Explore our best-selling cold-process bars infused with sacred Dragon&apos;s Blood resin.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsCartOpen(false)}
            >
              Explore Best Sellers
            </button>
          </div>
        ) : (
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
                  <div className="cart-item-tagline">{soap.cureTime}</div>

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
                        ${(soap.price * quantity).toFixed(2)}
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

        {/* Footer Summary & Checkout */}
        {!orderComplete && cart.length > 0 && (
          <div className="cart-drawer-footer">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="promo-input-row">
              <input
                type="text"
                placeholder="Voucher (e.g. FESTIVE25)"
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

            {/* Calculations */}
            <div className="cart-summary-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="cart-summary-line" style={{ color: "var(--color-terracotta)", fontWeight: 600 }}>
                <span>Festival Discount (25%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="cart-summary-line">
              <span>Botanical Shipping</span>
              <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
            </div>

            <div className="cart-summary-total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? "Preparing Your Botanical Order..." : `Proceed to Checkout • $${grandTotal.toFixed(2)}`}
            </button>

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
    </>
  );
}
