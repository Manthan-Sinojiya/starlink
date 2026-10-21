"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft, User, Mail, Lock, Phone, MapPin,
  CheckCircle2, AlertCircle, Package, LogOut,
  ShoppingBag, Edit2, Save, X, Star, Truck, Printer,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";
import { useDBStore } from "@/context/DBStoreContext";
import { INDIAN_STATES } from "@/data/soaps";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";

  const {
    currentUser, loginUser, registerUser, logoutUser,
    orders, refreshOrders,
  } = useDBStore();

  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [dashTab, setDashTab] = useState<"orders" | "profile">("orders");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regAddress, setRegAddress] = useState("");
  const [regState, setRegState] = useState("Maharashtra");
  const [regPincode, setRegPincode] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Edit profile
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editState, setEditState] = useState("");
  const [editPincode, setEditPincode] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const userOrders = currentUser
    ? orders.filter((o) => o.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
    : [];

  useEffect(() => {
    if (currentUser) refreshOrders();
  }, [currentUser, refreshOrders]);

  useEffect(() => {
    if (currentUser && isEditingProfile) {
      setEditName(currentUser.name || "");
      setEditPhone(currentUser.phone || "");
      setEditAddress(currentUser.address || "");
      setEditState(currentUser.state || "Maharashtra");
      setEditPincode(currentUser.pincode || "");
    }
  }, [currentUser, isEditingProfile]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);
    try {
      const res = await loginUser(loginEmail.trim(), loginPassword);
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(res.message);
        if (res.user?.role === "admin") {
          setTimeout(() => router.push("/backoffice"), 800);
        }
      }
    } catch {
      setErrorMessage("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage("Name, email, and password are required.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await registerUser({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        phone: regPhone.trim(),
        address: regAddress.trim(),
        state: regState,
        pincode: regPincode.trim(),
      });
      if (!res.success) {
        setErrorMessage(res.message);
      } else {
        setSuccessMessage(res.message);
      }
    } catch {
      setErrorMessage("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Delivered": return { bg: "#e8f5e9", color: "#2e7d32" };
      case "Shipped": return { bg: "#e0f2fe", color: "#0369a1" };
      case "Confirmed": return { bg: "#ede9fe", color: "#6d28d9" };
      case "Cancelled": return { bg: "#fef2f2", color: "#991b1b" };
      default: return { bg: "#fef3c7", color: "#b45309" };
    }
  };

  const payStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return { bg: "#e8f5e9", color: "#2e7d32" };
      case "Failed": return { bg: "#fef2f2", color: "#991b1b" };
      case "Refunded": return { bg: "#e0f2fe", color: "#0369a1" };
      default: return { bg: "#fef3c7", color: "#b45309" };
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--color-cream-bg)" }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: "2.5rem 1.5rem" }}>
        <div className="container" style={{ maxWidth: currentUser ? "900px" : "520px" }}>

          <div style={{ marginBottom: "1.5rem" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--color-text-secondary)", fontSize: "0.86rem", textDecoration: "none", fontWeight: 600 }}>
              <ArrowLeft size={15} /> Return to Store
            </Link>
          </div>

          {errorMessage && (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <AlertCircle size={17} /> {errorMessage}
            </div>
          )}
          {successMessage && (
            <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "0.75rem 1rem", borderRadius: "10px", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <CheckCircle2 size={17} /> {successMessage}
            </div>
          )}

          {currentUser ? (
            /* ── LOGGED IN DASHBOARD ── */
            <div>
              {/* Header */}
              <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid var(--color-border)", padding: "2rem", boxShadow: "var(--shadow-sm)", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "var(--color-cream-subtle)", border: "2px solid var(--color-terracotta)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-terracotta)", fontSize: "1.4rem", fontWeight: 700 }}>
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span style={{ backgroundColor: currentUser.role === "admin" ? "var(--color-terracotta)" : "var(--color-gold-light)", color: currentUser.role === "admin" ? "#fff" : "var(--color-gold)", fontSize: "0.7rem", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                        {currentUser.role === "admin" ? "Admin" : "Patron"}
                      </span>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", margin: "4px 0 2px" }}>{currentUser.name}</h2>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>{currentUser.email}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                    {currentUser.role === "admin" && (
                      <Link href="/backoffice" style={{ padding: "0.55rem 1.1rem", borderRadius: "8px", backgroundColor: "var(--color-terracotta)", color: "#fff", fontWeight: 600, fontSize: "0.86rem", textDecoration: "none" }}>
                        ⚙ Backoffice Dashboard
                      </Link>
                    )}
                    <button type="button" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.55rem 1.1rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "#fff", color: "var(--color-text-secondary)", fontSize: "0.86rem", cursor: "pointer", fontWeight: 600 }}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginTop: "1.5rem" }}>
                  {[
                    { label: "Orders", value: currentUser.totalOrders },
                    { label: "Total Spent", value: `₹${currentUser.totalSpent?.toLocaleString("en-IN") || 0}` },
                    { label: "Member Since", value: new Date(currentUser.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) },
                  ].map((stat) => (
                    <div key={stat.label} style={{ backgroundColor: "var(--color-cream-bg)", padding: "0.85rem 1rem", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
                      <div style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", fontWeight: 700, textTransform: "uppercase" }}>{stat.label}</div>
                      <div style={{ fontSize: "1.15rem", fontWeight: 700, marginTop: "4px", color: "var(--color-dragon-black)" }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tab navigation */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
                {(["orders", "profile"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setDashTab(t)} style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: dashTab === t ? "var(--color-terracotta)" : "#fff", color: dashTab === t ? "#fff" : "var(--color-text-secondary)", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", textTransform: "capitalize" }}>
                    {t === "orders" ? <><Package size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />Orders ({userOrders.length})</> : <><User size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />Profile</>}
                  </button>
                ))}
              </div>

              {/* Orders Tab */}
              {dashTab === "orders" && (
                <div>
                  {userOrders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem 2rem", backgroundColor: "#fff", borderRadius: "16px", border: "1px dashed var(--color-border)" }}>
                      <ShoppingBag size={36} color="var(--color-text-tertiary)" style={{ margin: "0 auto 0.75rem" }} />
                      <p style={{ color: "var(--color-text-secondary)", margin: "0 0 1.25rem", fontSize: "0.95rem" }}>You haven't placed any orders yet.</p>
                      <Link href="/#all-soaps" style={{ display: "inline-block", padding: "0.6rem 1.5rem", borderRadius: "8px", backgroundColor: "var(--color-terracotta)", color: "#fff", textDecoration: "none", fontWeight: 600 }}>
                        Explore Soaps
                      </Link>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {userOrders.map((ord) => {
                        const sc = statusColor(ord.status);
                        const pc = payStatusColor(ord.paymentStatus);
                        return (
                          <div key={ord._id || ord.id} style={{ backgroundColor: "#fff", borderRadius: "14px", border: "1px solid var(--color-border)", padding: "1.25rem", boxShadow: "var(--shadow-sm)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                              <div>
                                <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.95rem" }}>#{ord.orderNumber}</span>
                                <span style={{ fontSize: "0.78rem", color: "var(--color-text-tertiary)", marginLeft: "8px" }}>
                                  {new Date(ord.createdAt || "").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              </div>
                              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "0.74rem", padding: "3px 8px", borderRadius: "6px", fontWeight: 700, backgroundColor: sc.bg, color: sc.color }}>
                                  ● {ord.status}
                                </span>
                                <span style={{ fontSize: "0.74rem", padding: "3px 8px", borderRadius: "6px", fontWeight: 700, backgroundColor: pc.bg, color: pc.color }}>
                                  💳 {ord.paymentStatus}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "0.75rem" }}>
                              {ord.items.map((it, idx) => (
                                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.86rem" }}>
                                  <span>{it.quantity}× {it.name} {it.weight ? `(${it.weight})` : ""}</span>
                                  <span style={{ fontWeight: 600 }}>₹{(it.price * it.quantity).toLocaleString("en-IN")}</span>
                                </div>
                              ))}
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "0.65rem", fontSize: "0.83rem", color: "var(--color-text-secondary)" }}>
                              <span><Truck size={13} style={{ verticalAlign: "middle", marginRight: "4px" }} />{ord.shippingState}</span>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedInvoiceOrder(ord)}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    padding: "0.35rem 0.75rem",
                                    borderRadius: "6px",
                                    border: "1px solid var(--color-border)",
                                    backgroundColor: "var(--color-cream-subtle)",
                                    color: "var(--color-dragon-black)",
                                    fontSize: "0.76rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Printer size={13} />
                                  Print Tax Invoice
                                </button>
                                <span style={{ fontWeight: 700, color: "var(--color-dragon-black)", fontSize: "0.95rem" }}>
                                  ₹{ord.total.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Profile Tab */}
              {dashTab === "profile" && (
                <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid var(--color-border)", padding: "1.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                    <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: 0 }}>Delivery Details</h3>
                    <button type="button" onClick={() => setIsEditingProfile(!isEditingProfile)} style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.45rem 0.9rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: isEditingProfile ? "var(--color-terracotta)" : "#fff", color: isEditingProfile ? "#fff" : "var(--color-text-secondary)", fontSize: "0.84rem", cursor: "pointer", fontWeight: 600 }}>
                      {isEditingProfile ? <><X size={13} /> Cancel</> : <><Edit2 size={13} /> Edit</>}
                    </button>
                  </div>

                  {isEditingProfile ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {[
                        { label: "Full Name", value: editName, setter: setEditName, type: "text" },
                        { label: "Phone", value: editPhone, setter: setEditPhone, type: "tel" },
                        { label: "Address", value: editAddress, setter: setEditAddress, type: "text" },
                        { label: "PIN Code", value: editPincode, setter: setEditPincode, type: "text" },
                      ].map(({ label, value, setter, type }) => (
                        <div key={label}>
                          <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>{label}</label>
                          <input type={type} value={value} onChange={(e) => setter(e.target.value)} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }} />
                        </div>
                      ))}
                      <div>
                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.3rem" }}>State</label>
                        <select value={editState} onChange={(e) => setEditState(e.target.value)} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem", backgroundColor: "#fff" }}>
                          {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <button type="button" onClick={async () => {
                        try {
                          const { authApi: a } = await import("@/lib/api");
                          await a.updateMe({ name: editName, phone: editPhone, address: editAddress, state: editState, pincode: editPincode });
                          setIsEditingProfile(false);
                          setSuccessMessage("Profile updated successfully!");
                        } catch {
                          setErrorMessage("Failed to update profile.");
                        }
                      }} style={{ display: "flex", alignItems: "center", gap: "0.4rem", justifyContent: "center", padding: "0.7rem", borderRadius: "10px", backgroundColor: "var(--color-terracotta)", color: "#fff", fontWeight: 700, fontSize: "0.92rem", border: "none", cursor: "pointer" }}>
                        <Save size={16} /> Save Changes
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      {[
                        { label: "Name", value: currentUser.name },
                        { label: "Email", value: currentUser.email },
                        { label: "Phone", value: currentUser.phone || "Not added" },
                        { label: "State", value: currentUser.state || "Not set" },
                        { label: "Address", value: currentUser.address || "Not added" },
                        { label: "PIN Code", value: currentUser.pincode || "Not added" },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ backgroundColor: "var(--color-cream-bg)", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
                          <div style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
                          <div style={{ fontSize: "0.92rem", fontWeight: 600, marginTop: "4px" }}>{value}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* ── AUTH FORMS ── */
            <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid var(--color-border)", overflow: "hidden", boxShadow: "var(--shadow-md)" }}>
              {/* Tabs */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--color-border)" }}>
                {(["login", "register"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => { setActiveTab(t); setErrorMessage(null); setSuccessMessage(null); }} style={{ padding: "1.1rem", border: "none", background: activeTab === t ? "#fff" : "var(--color-cream-subtle)", fontWeight: 700, fontSize: "0.93rem", cursor: "pointer", color: activeTab === t ? "var(--color-terracotta)" : "var(--color-text-secondary)", borderBottom: `3px solid ${activeTab === t ? "var(--color-terracotta)" : "transparent"}`, transition: "all 0.2s" }}>
                    {t === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              {activeTab === "login" && (
                <div style={{ padding: "2rem" }}>
                  <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", margin: "0 0 0.35rem" }}>Welcome Back</h2>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--color-text-secondary)" }}>Sign in to your Star Light Co. account</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>Email Address *</label>
                      <div style={{ position: "relative" }}>
                        <Mail size={15} color="var(--color-text-tertiary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                        <input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%", padding: "0.65rem 0.85rem 0.65rem 2.3rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>Password *</label>
                      <div style={{ position: "relative" }}>
                        <Lock size={15} color="var(--color-text-tertiary)" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                        <input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "0.65rem 0.85rem 0.65rem 2.3rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }} />
                      </div>
                    </div>
                    <button type="submit" disabled={isLoading} style={{ padding: "0.8rem", borderRadius: "10px", backgroundColor: "var(--color-terracotta)", color: "#fff", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px var(--color-terracotta-glow)", opacity: isLoading ? 0.7 : 1 }}>
                      {isLoading ? "Signing In..." : "Sign In to Account"}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "register" && (
                <div style={{ padding: "2rem" }}>
                  <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", margin: "0 0 0.35rem" }}>Create Account</h2>
                    <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--color-text-secondary)" }}>Join Star Light Co. for exclusive access</p>
                  </div>

                  <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>Full Name *</label>
                      <input type="text" required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Aarti Singhania" style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>Email *</label>
                        <input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="aarti@example.com" style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>Phone</label>
                        <input type="tel" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="+91 98000 00000" style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>Delivery Address</label>
                      <input type="text" value={regAddress} onChange={(e) => setRegAddress(e.target.value)} placeholder="House No., Street, Area" style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>State *</label>
                        <select value={regState} onChange={(e) => setRegState(e.target.value)} style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem", backgroundColor: "#fff" }}>
                          {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>PIN Code</label>
                        <input type="text" value={regPincode} onChange={(e) => setRegPincode(e.target.value)} placeholder="400001" style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>Password *</label>
                      <input type="password" required value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Min 6 characters" style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }} />
                    </div>
                    <button type="submit" disabled={isLoading} style={{ padding: "0.8rem", borderRadius: "10px", backgroundColor: "var(--color-terracotta)", color: "#fff", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px var(--color-terracotta-glow)", opacity: isLoading ? 0.7 : 1 }}>
                      {isLoading ? "Creating Account..." : "Create My Account"}
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
      <TaxInvoiceModal
        order={selectedInvoiceOrder}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Loading...</p></div>}>
      <DashboardContent />
    </Suspense>
  );
}
