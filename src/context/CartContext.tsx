"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Soap, FESTIVAL_PROMO } from "@/data/soaps";

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
  const [appliedPromo, setAppliedPromo] = useState<string | null>("FESTIVE25");
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

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === FESTIVAL_PROMO.code) {
      setAppliedPromo(clean);
      setPromoError(null);
      showToast(`Promo "${clean}" applied! 25% Off 🎁`);
      return true;
    } else {
      setPromoError("Invalid promo code. Try FESTIVE25 for 25% off!");
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

  const discountPercent = appliedPromo === FESTIVAL_PROMO.code ? 0.25 : 0;
  const discountAmount = subtotal * discountPercent;
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
