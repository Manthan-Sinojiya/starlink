"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Sparkles } from "lucide-react";

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  return (
    <div className="toast-pill" role="status" aria-live="polite">
      <Sparkles size={16} color="var(--color-terracotta)" />
      <span>{toast}</span>
    </div>
  );
}
