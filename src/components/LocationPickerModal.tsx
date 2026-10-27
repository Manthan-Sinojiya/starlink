"use client";

import React, { useState, useMemo } from "react";
import {
  MapPin,
  X,
  Crosshair,
  Search,
  Check,
  CheckCircle2,
  Sparkles,
  Truck,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { INDIAN_STATES } from "@/data/soaps";
import { useDBStore } from "@/context/DBStoreContext";
import { useCart } from "@/context/CartContext";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationPickerModal({ isOpen, onClose }: LocationPickerModalProps) {
  const { userLocation, setUserLocation, detectUserLocation, isDetectingLocation } = useDBStore();
  const { selectedState, setSelectedState, showToast } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);

  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return INDIAN_STATES;
    const q = searchQuery.toLowerCase();
    return INDIAN_STATES.filter((s) => s.toLowerCase().includes(q));
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSelectState = (state: string) => {
    setSelectedState(state);
    setUserLocation(state);
    showToast(`Delivery location set to ${state} 📍`);
    onClose();
  };

  const handleAutoDetect = async () => {
    const res = await detectUserLocation();
    if (res.success && res.state) {
      setSelectedState(res.state);
      showToast(`Accurate location detected: ${res.city || res.state} 📍`);
      onClose();
    } else if (res.error === "permission_denied") {
      showToast("Location permission denied. Please allow location in browser or pick your state below.");
    } else {
      showToast("Could not detect location. Please select your state below.");
    }
  };

  const handlePincodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pincodeInput.trim();
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      setPincodeMessage("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    try {
      // Lookup pincode via India Post API
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      if (res.ok) {
        const data = await res.json();
        if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const st = po.State;
          const district = po.District;
          const matched = INDIAN_STATES.find(
            (s) => s.toLowerCase() === st.toLowerCase() || st.toLowerCase().includes(s.toLowerCase())
          );
          const finalState = matched || st;
          setSelectedState(finalState);
          setUserLocation(finalState, district);
          showToast(`Delivering to ${district}, ${finalState} (${pin}) 📍`);
          onClose();
          return;
        }
      }
      setPincodeMessage("Pincode verified. Please confirm your state below.");
    } catch {
      setPincodeMessage("Pincode entered. Please pick your state from the list.");
    }
  };

  return (
    <div
      className="cart-drawer-overlay open"
      onClick={onClose}
      style={{
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "560px",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.3)",
          overflow: "hidden",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--color-cream-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "rgba(225, 113, 89, 0.15)",
                color: "var(--color-terracotta)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.15rem",
                  margin: 0,
                  color: "var(--color-dragon-black)",
                }}
              >
                Choose Delivery Location
              </h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                Delivering across all 36 Indian States &amp; Union Territories
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="cart-close-btn"
            aria-label="Close location picker"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Location Pill & Auto-Detect Button */}
        <div style={{ padding: "1.25rem 1.5rem 0.75rem" }}>
          <div
            style={{
              padding: "0.85rem 1rem",
              borderRadius: "12px",
              background: "rgba(225, 113, 89, 0.08)",
              border: "1px solid rgba(225, 113, 89, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", fontWeight: 700, color: "var(--color-terracotta)", letterSpacing: "0.06em" }}>
                Active Delivery Destination
              </div>
              <div style={{ fontSize: "0.98rem", fontWeight: 700, color: "var(--color-dragon-black)", marginTop: "2px" }}>
                📍 {userLocation.city ? `${userLocation.city}, ` : ""}{selectedState || userLocation.state}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoDetect}
              disabled={isDetectingLocation}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.5rem 0.9rem",
                borderRadius: "8px",
                background: "var(--color-terracotta)",
                color: "white",
                border: "none",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: isDetectingLocation ? "wait" : "pointer",
                transition: "opacity 0.2s ease",
              }}
            >
              {isDetectingLocation ? (
                <>
                  <Loader2 size={14} className="spin" /> Detecting...
                </>
              ) : (
                <>
                  <Crosshair size={14} /> Auto-Detect
                </>
              )}
            </button>
          </div>

          {/* Quick PIN Code Lookup Form */}
          <form onSubmit={handlePincodeSubmit} style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Enter 6-digit Indian PIN code..."
                value={pincodeInput}
                maxLength={6}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                style={{
                  flexGrow: 1,
                  padding: "0.6rem 0.85rem",
                  borderRadius: "10px",
                  border: "1px solid var(--color-border)",
                  fontSize: "0.88rem",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "0.6rem 1rem",
                  borderRadius: "10px",
                  background: "var(--color-dragon-black)",
                  color: "white",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.84rem",
                  cursor: "pointer",
                }}
              >
                Apply PIN
              </button>
            </div>
            {pincodeMessage && (
              <p style={{ margin: "0.35rem 0 0", fontSize: "0.76rem", color: "var(--color-terracotta)" }}>
                {pincodeMessage}
              </p>
            )}
          </form>

          {/* Search State Input */}
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-text-tertiary)",
              }}
            />
            <input
              type="text"
              placeholder="Search Indian State or UT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem 0.65rem 2.25rem",
                borderRadius: "10px",
                border: "1px solid var(--color-border)",
                fontSize: "0.88rem",
              }}
            />
          </div>
        </div>

        {/* States List */}
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            padding: "0.5rem 1.5rem 1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {filteredStates.map((state) => {
            const isSelected = (selectedState || userLocation.state) === state;
            return (
              <button
                key={state}
                type="button"
                onClick={() => handleSelectState(state)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "10px",
                  background: isSelected ? "rgba(225, 113, 89, 0.12)" : "var(--color-cream-subtle)",
                  border: isSelected
                    ? "1px solid var(--color-terracotta)"
                    : "1px solid transparent",
                  color: isSelected ? "var(--color-terracotta)" : "var(--color-dragon-black)",
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: "0.86rem",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{state}</span>
                {isSelected && <Check size={16} style={{ color: "var(--color-terracotta)" }} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
