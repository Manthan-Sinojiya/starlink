"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Soap, FESTIVAL_PROMO, DEFAULT_PRIMARY_OFFER, DEFAULT_SECONDARY_OFFER } from "@/data/soaps";

export interface CartItem {
  soap: Soap;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (soap: Soap, quantity?: number) => void;
  removeFromCart: (soapId: string) => void;
  updateQuantity: (soapId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  hasExclusiveTax: boolean;
  total: number;
  freeShippingProgress: number;
  appliedPromo: string | null;
  promoError: string | null;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
  wishlist: string[];
  toggleWishlist: (soapId: string) => void;
  isInWishlist: (soapId: string) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewSoap: Soap | null;
  setQuickViewSoap: (soap: Soap | null) => void;
  enquirySoap: Soap | null;
  setEnquirySoap: (soap: Soap | null) => void;
  toast: string | null;
  showToast: (message: string) => void;
  selectedState: string;
  setSelectedState: (state: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [quickViewSoap, setQuickViewSoap] = useState<Soap | null>(null);
  const [enquirySoap, setEnquirySoap] = useState<Soap | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("Maharashtra");

  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("starlight_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("starlight_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedState = localStorage.getItem("starlight_selected_state");
      if (savedState) setSelectedState(savedState);
    } catch {
      // ignore SSR/storage errors
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem("starlight_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("starlight_wishlist", JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem("starlight_selected_state", selectedState);
    } catch {
      // ignore
    }
  }, [selectedState]);


  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  const addToCart = (soap: Soap, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.soap.id === soap.id);
      if (existing) {
        return prev.map((item) =>
          item.soap.id === soap.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { soap, quantity }];
    });
    showToast(`Added "${soap.name}" to cart ✨`);
  };

  const removeFromCart = (soapId: string) => {
    setCart((prev) => prev.filter((item) => item.soap.id !== soapId));
  };

  const updateQuantity = (soapId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(soapId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.soap.id === soapId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (soapId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(soapId);
      if (exists) {
        showToast("Removed from Wishlist");
        return prev.filter((id) => id !== soapId);
      } else {
        showToast("Saved to your Wishlist ❤️");
        return [...prev, soapId];
      }
    });
  };

  const isInWishlist = (soapId: string) => wishlist.includes(soapId);

  const getOffersData = () => {
    let primary = DEFAULT_PRIMARY_OFFER;
    let secondary = DEFAULT_SECONDARY_OFFER;
    if (typeof window !== "undefined") {
      try {
        const p = localStorage.getItem("starlight_primary_offer");
        if (p) primary = { ...primary, ...JSON.parse(p) };
        const s = localStorage.getItem("starlight_secondary_offer");
        if (s) secondary = { ...secondary, ...JSON.parse(s) };
      } catch {}
    }
    return { primary, secondary };
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    const { primary, secondary } = getOffersData();
    const primaryCode = (primary.promoCode || "FESTIVE25").toUpperCase();
    const secondaryCode = (secondary.promoCode || "AYUR20").toUpperCase();

    if (clean === primaryCode) {
      const hasQualifyingItem = cart.some((item) => {
        if (primary.productId) {
          return item.soap.id === primary.productId || item.soap.id === primary.id;
        }
        return (
          item.soap.id === primary.id ||
          item.soap.isFestive ||
          item.soap.category === "festive" ||
          item.soap.name.toLowerCase().includes("vault") ||
          item.soap.name.toLowerCase().includes("grand festival")
        );
      });
      if (!hasQualifyingItem) {
        setPromoError(`Code ${clean} is only valid for "${primary.title}". Add it to your cart to claim this discount.`);
        return false;
      }
      setAppliedPromo(clean);
      setPromoError(null);
      showToast(`Promo "${clean}" applied! ${primary.discountPercent || 25}% off "${primary.title}" 🎁`);
      return true;
    } else if (clean === secondaryCode) {
      const hasQualifyingItem = cart.some((item) => {
        if (secondary.productId) {
          return item.soap.id === secondary.productId || item.soap.id === secondary.id;
        }
        return (
          item.soap.id === secondary.id ||
          item.soap.name.toLowerCase().includes("ayurvedic") ||
          item.soap.name.toLowerCase().includes("saffron")
        );
      });
      if (!hasQualifyingItem) {
        setPromoError(`Code ${clean} is only valid for "${secondary.title}". Add it to your cart to claim this discount.`);
        return false;
      }
      setAppliedPromo(clean);
      setPromoError(null);
      showToast(`Promo "${clean}" applied! ${secondary.discountPercent || 20}% off "${secondary.title}" ✨`);
      return true;
    } else if (clean === "STARLIGHT10") {
      setAppliedPromo(clean);
      setPromoError(null);
      showToast(`Promo "${clean}" applied! 10% Off Storewide ✨`);
      return true;
    } else {
      setPromoError(`Invalid promo code. Valid vouchers: ${primaryCode} or ${secondaryCode}!`);
      return false;
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.soap.price * item.quantity,
    0
  );

  // Calculate tax for products marked as tax-exclusive
  const taxAmount = cart.reduce((acc, item) => {
    if (item.soap.taxType === "exclusive") {
      const rate = typeof item.soap.taxRate === "number" ? item.soap.taxRate : 18;
      return acc + (item.soap.price * (rate / 100)) * item.quantity;
    }
    return acc;
  }, 0);

  const hasExclusiveTax = cart.some((item) => item.soap.taxType === "exclusive");

  // Specific offer coupon calculation: ONLY discounts qualifying items, not other items!
  const { primary, secondary } = getOffersData();
  const primaryCode = (primary.promoCode || "FESTIVE25").toUpperCase();
  const secondaryCode = (secondary.promoCode || "AYUR20").toUpperCase();

  let discountAmount = 0;
  if (appliedPromo === primaryCode) {
    const qualifyingSubtotal = cart
      .filter((item) => {
        if (primary.productId) {
          return item.soap.id === primary.productId || item.soap.id === primary.id;
        }
        return (
          item.soap.id === primary.id ||
          item.soap.isFestive ||
          item.soap.category === "festive" ||
          item.soap.name.toLowerCase().includes("vault") ||
          item.soap.name.toLowerCase().includes("grand festival")
        );
      })
      .reduce((acc, item) => acc + item.soap.price * item.quantity, 0);
    const pct = (primary.discountPercent || 25) / 100;
    discountAmount = Math.round(qualifyingSubtotal * pct);
  } else if (appliedPromo === secondaryCode) {
    const qualifyingSubtotal = cart
      .filter((item) => {
        if (secondary.productId) {
          return item.soap.id === secondary.productId || item.soap.id === secondary.id;
        }
        return (
          item.soap.id === secondary.id ||
          item.soap.name.toLowerCase().includes("ayurvedic") ||
          item.soap.name.toLowerCase().includes("saffron")
        );
      })
      .reduce((acc, item) => acc + item.soap.price * item.quantity, 0);
    const pct = (secondary.discountPercent || 20) / 100;
    discountAmount = Math.round(qualifyingSubtotal * pct);
  } else if (appliedPromo === "STARLIGHT10") {
    discountAmount = Math.round(subtotal * 0.1);
  }
  const total = Math.max(0, subtotal - discountAmount + taxAmount);

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FESTIVAL_PROMO.freeShippingThreshold) * 100)
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
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
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        quickViewSoap,
        setQuickViewSoap,
        enquirySoap,
        setEnquirySoap,
        toast,
        showToast,
        selectedState,
        setSelectedState: (state: string) => {
          setSelectedState(state);
          try {
            localStorage.setItem("starlight_selected_state", state);
          } catch {}
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
