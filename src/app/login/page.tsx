"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  LogOut,
  Package,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { useStore } from "@/context/StoreContext";
import { INDIAN_STATES } from "@/data/soaps";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";

  const {
    currentUser,
    loginUser,
    registerUser,
    logoutUser,
    orders,
  } = useStore();

  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regState, setRegState] = useState("Maharashtra");
  const [regPincode, setRegPincode] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Feedback messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter orders for logged-in user
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
      )
    : [];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = loginUser(loginEmail.trim(), loginPassword);
    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage(res.message);
      if (res.user?.role === "admin") {
        setTimeout(() => router.push("/admin"), 1000);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage("Please fill in your name and email.");
      return;
    }

    const res = registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      address: regAddress.trim(),
      state: regState,
      pincode: regPincode.trim(),
      password: regPassword,
      role: "customer",
    });

    if (!res.success) {
      setErrorMessage(res.message);
    } else {
      setSuccessMessage(res.message);
      setActiveTab("login");
    }
  };

  // Demo Login Quick-Fill
  const handleQuickLogin = (email: string) => {
    loginUser(email);
    setSuccessMessage(`Logged in as ${email}`);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-cream-bg)" }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: "3rem 1.5rem" }}>
        <div className="container" style={{ maxWidth: currentUser ? "860px" : "540px" }}>
          {/* Breadcrumb / Back button */}
          <div style={{ marginBottom: "1.5rem" }}>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.45rem",
                color: "var(--color-text-secondary)",
                fontSize: "0.86rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={16} /> Return to Store
            </Link>
          </div>

          {/* Feedback alerts */}
          {errorMessage && (
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1.25rem",
              }}
            >
              <AlertCircle size={18} /> {errorMessage}
            </div>
          )}

          {successMessage && (
            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                padding: "0.85rem 1rem",
                borderRadius: "10px",
                fontSize: "0.88rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1.25rem",
              }}
            >
              <CheckCircle2 size={18} /> {successMessage}
            </div>
          )}

          {/* USER ACCOUNT VIEW (When logged in) */}
          {currentUser ? (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                border: "1px solid var(--color-border)",
                padding: "2.5rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  borderBottom: "1px solid var(--color-border)",
                  paddingBottom: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "var(--color-cream-subtle)",
                      border: "2px solid var(--color-terracotta)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-terracotta)",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span
                      style={{
                        backgroundColor: currentUser.role === "admin" ? "var(--color-terracotta)" : "var(--color-gold-light)",
                        color: currentUser.role === "admin" ? "#ffffff" : "var(--color-gold)",
                        fontSize: "0.72rem",
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {currentUser.role === "admin" ? "Atelier Master Admin" : "Cherished Patron"}
                    </span>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", margin: "4px 0" }}>
                      {currentUser.name}
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--color-text-secondary)" }}>
                      {currentUser.email} • {currentUser.phone}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {currentUser.role === "admin" && (
                    <Link
                      href="/admin"
                      style={{
                        padding: "0.6rem 1.25rem",
                        borderRadius: "8px",
                        backgroundColor: "var(--color-terracotta)",
                        color: "#ffffff",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        textDecoration: "none",
                        boxShadow: "0 2px 8px var(--color-terracotta-glow)",
                      }}
                    >
                      ⚙️ Open Admin Atelier
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={logoutUser}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      padding: "0.6rem 1.25rem",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#ffffff",
                      color: "var(--color-text-secondary)",
                      fontSize: "0.88rem",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>

              {/* Patron Details Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.25rem",
                  marginBottom: "2.5rem",
                  backgroundColor: "var(--color-cream-bg)",
                  padding: "1.25rem",
                  borderRadius: "12px",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--color-text-tertiary)", fontWeight: 700, textTransform: "uppercase" }}>
                    Delivery Address
                  </div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 600, marginTop: "4px", color: "var(--color-dragon-black)" }}>
                    {currentUser.address || "No saved address"}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                    State: <strong>{currentUser.state || "Not specified"}</strong>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--color-text-tertiary)", fontWeight: 700, textTransform: "uppercase" }}>
                    Account Activity
                  </div>
                  <div style={{ fontSize: "0.92rem", fontWeight: 600, marginTop: "4px", color: "var(--color-dragon-black)" }}>
                    {userOrders.length} Order{userOrders.length === 1 ? "" : "s"} Placed
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                    Member since: {new Date(currentUser.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.3rem", marginBottom: "1rem" }}>
                  Your Botanical Orders
                </h3>

                {userOrders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "2rem", border: "1px dashed var(--color-border)", borderRadius: "12px" }}>
                    <Package size={32} color="var(--color-text-tertiary)" style={{ margin: "0 auto 0.5rem" }} />
                    <p style={{ color: "var(--color-text-secondary)", margin: 0, fontSize: "0.9rem" }}>
                      You have not placed any orders yet. Discover our artisanal formulations!
                    </p>
                    <Link
                      href="/#all-soaps"
                      style={{
                        display: "inline-block",
                        marginTop: "1rem",
                        padding: "0.55rem 1.25rem",
                        borderRadius: "8px",
                        backgroundColor: "var(--color-terracotta)",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontWeight: 600,
                        fontSize: "0.86rem",
                      }}
                    >
                      Explore Soap Catalog
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        style={{
                          border: "1px solid var(--color-border)",
                          borderRadius: "12px",
                          padding: "1.25rem",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                          <div>
                            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.95rem" }}>
                              #{ord.orderNumber}
                            </span>
                            <span style={{ fontSize: "0.78rem", color: "var(--color-text-tertiary)", marginLeft: "8px" }}>
                              {new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                          </div>

                          <span
                            style={{
                              fontSize: "0.75rem",
                              padding: "3px 8px",
                              borderRadius: "6px",
                              fontWeight: 700,
                              backgroundColor:
                                ord.status === "Delivered"
                                  ? "#e8f5e9"
                                  : ord.status === "Shipped"
                                  ? "#e0f2fe"
                                  : "#fef3c7",
                              color:
                                ord.status === "Delivered"
                                  ? "#2e7d32"
                                  : ord.status === "Shipped"
                                  ? "#0369a1"
                                  : "#b45309",
                            }}
                          >
                            ● {ord.status}
                          </span>
                        </div>

                        {/* Order items */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "0.85rem" }}>
                          {ord.items.map((it, idx) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.86rem" }}>
                              <span style={{ color: "var(--color-dragon-black)" }}>
                                {it.quantity}x {it.name} ({it.weight})
                              </span>
                              <span style={{ fontWeight: 600 }}>₹{(it.price * it.quantity).toLocaleString("en-IN")}</span>
                            </div>
                          ))}
                        </div>

                        {/* Order footer */}
                        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "0.75rem", fontSize: "0.84rem", color: "var(--color-text-secondary)" }}>
                          <span>Ship to: {ord.shippingState}</span>
                          <span style={{ fontWeight: 700, color: "var(--color-dragon-black)", fontSize: "0.96rem" }}>
                            Total: ₹{ord.total.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* AUTH FORM VIEW (Sign In / Register) */
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
                boxShadow: "var(--shadow-md)",
              }}
            >
              {/* Tabs Switcher */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--color-border)" }}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("login");
                    setErrorMessage(null);
                  }}
                  style={{
                    padding: "1.1rem",
                    border: "none",
                    background: activeTab === "login" ? "#ffffff" : "var(--color-cream-subtle)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    color: activeTab === "login" ? "var(--color-terracotta)" : "var(--color-text-secondary)",
                    borderBottom: `3px solid ${activeTab === "login" ? "var(--color-terracotta)" : "transparent"}`,
                  }}
                >
                  Patron Sign In
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setErrorMessage(null);
                  }}
                  style={{
                    padding: "1.1rem",
                    border: "none",
                    background: activeTab === "register" ? "#ffffff" : "var(--color-cream-subtle)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    color: activeTab === "register" ? "var(--color-terracotta)" : "var(--color-text-secondary)",
                    borderBottom: `3px solid ${activeTab === "register" ? "var(--color-terracotta)" : "transparent"}`,
                  }}
                >
                  Register Account
                </button>
              </div>

              {/* TAB 1: SIGN IN FORM */}
              {activeTab === "login" && (
                <div style={{ padding: "2rem" }}>
                  <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", margin: "0 0 0.35rem" }}>
                      Welcome Back to Star Light Co.
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--color-text-secondary)" }}>
                      Sign in to track orders, manage addresses, and experience artisanal privileges.
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Email Address *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Mail size={16} color="var(--color-text-tertiary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="e.g. priya.sharma@example.com"
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem 0.65rem 2.4rem",
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.92rem",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Password (Optional for Demo)
                      </label>
                      <div style={{ position: "relative" }}>
                        <Lock size={16} color="var(--color-text-tertiary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          type="password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem 0.65rem 2.4rem",
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.92rem",
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        padding: "0.8rem",
                        borderRadius: "10px",
                        backgroundColor: "var(--color-terracotta)",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.96rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px var(--color-terracotta-glow)",
                        marginTop: "0.5rem",
                      }}
                    >
                      Sign In to Account
                    </button>
                  </form>

                  {/* One-click Demo Accounts */}
                  <div style={{ marginTop: "2rem", borderTop: "1px solid var(--color-border)", paddingTop: "1.25rem" }}>
                    <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", textAlign: "center", marginBottom: "0.75rem", fontWeight: 600 }}>
                      Quick One-Click Test Accounts:
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
                      <button
                        type="button"
                        onClick={() => handleQuickLogin("admin@starlight.com")}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--color-border)",
                          backgroundColor: "var(--color-cream-subtle)",
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        ⚙️ Admin (admin@starlight.com)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickLogin("priya.sharma@example.com")}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          border: "1px solid var(--color-border)",
                          backgroundColor: "var(--color-cream-subtle)",
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        👤 Customer (Priya Sharma)
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: REGISTER FORM */}
              {activeTab === "register" && (
                <div style={{ padding: "2rem" }}>
                  <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", margin: "0 0 0.35rem" }}>
                      Create Patron Account
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--color-text-secondary)" }}>
                      Join the Star Light Co. atelier for exclusive small-batch release notifications.
                    </p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Full Name *
                      </label>
                      <div style={{ position: "relative" }}>
                        <User size={16} color="var(--color-text-tertiary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Aarti Singhania"
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem 0.65rem 2.4rem",
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.92rem",
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="aarti@example.com"
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem",
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.92rem",
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="+91 98000 00000"
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem",
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.92rem",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder="House / Flat No., Street, Area"
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.85rem",
                          borderRadius: "8px",
                          border: "1px solid var(--color-border)",
                          fontSize: "0.92rem",
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          State *
                        </label>
                        <select
                          value={regState}
                          onChange={(e) => setRegState(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem",
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.92rem",
                            backgroundColor: "#ffffff",
                          }}
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          PIN Code
                        </label>
                        <input
                          type="text"
                          value={regPincode}
                          onChange={(e) => setRegPincode(e.target.value)}
                          placeholder="400001"
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem",
                            borderRadius: "8px",
                            border: "1px solid var(--color-border)",
                            fontSize: "0.92rem",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Password *
                      </label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Choose a secure password"
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.85rem",
                          borderRadius: "8px",
                          border: "1px solid var(--color-border)",
                          fontSize: "0.92rem",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        padding: "0.8rem",
                        borderRadius: "10px",
                        backgroundColor: "var(--color-terracotta)",
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "0.96rem",
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px var(--color-terracotta-glow)",
                        marginTop: "0.5rem",
                      }}
                    >
                      Complete Patron Registration
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--color-cream-bg)" }}>
          <p style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-serif)", fontSize: "1.2rem" }}>
            Star Light Co. Atelier Loading...
          </p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
