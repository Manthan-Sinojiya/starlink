"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Printer, Download, X, CheckCircle, ShieldCheck } from "lucide-react";

interface TaxInvoiceModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaxInvoiceModal({ order, isOpen, onClose }: TaxInvoiceModalProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const isIntraState =
    order.shippingState &&
    (order.shippingState.toLowerCase().includes("maharashtra") ||
      order.shippingState.toLowerCase() === "mh");

  const subtotal = order.subtotal || order.total || 0;
  const shippingCost = order.shippingCost ?? order.shipping ?? 0;
  const grandTotal = order.total || subtotal + shippingCost;

  // 18% GST standard on cosmetic soaps (HSN 3401)
  const taxableValue = Math.round((subtotal / 1.18) * 100) / 100;
  const totalGstAmount = Math.round((subtotal - taxableValue) * 100) / 100;

  const cgstAmount = isIntraState ? Math.round((totalGstAmount / 2) * 100) / 100 : 0;
  const sgstAmount = isIntraState ? Math.round((totalGstAmount / 2) * 100) / 100 : 0;
  const igstAmount = !isIntraState ? totalGstAmount : 0;

  const invoiceNumber = `INV-2026-${order.orderNumber}`;
  const invoiceDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="invoice-modal-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(6px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <div
        className="invoice-modal-card"
        style={{
          backgroundColor: "#ffffff",
          width: "100%",
          maxWidth: "850px",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Modal Toolbar (Hidden during print) */}
        <div
          className="no-print"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.85rem 1.5rem",
            backgroundColor: "#1c1917",
            color: "#ffffff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.05em" }}>
              TAX INVOICE PREVIEW — {invoiceNumber}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 0.95rem",
                borderRadius: "8px",
                backgroundColor: "#e17159",
                color: "#ffffff",
                border: "none",
                fontSize: "0.82rem",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Printer size={15} />
              Print / Save PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#ffffff",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
              }}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Container */}
        <div
          ref={invoiceRef}
          id="printable-tax-invoice"
          style={{
            padding: "2rem 2.5rem",
            overflowY: "auto",
            backgroundColor: "#ffffff",
            color: "#1c1917",
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            fontSize: "0.82rem",
            lineHeight: "1.45",
          }}
        >
          {/* Header with Brand Logo & GST Title */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "2px solid #1c1917",
              paddingBottom: "1.25rem",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "1.45rem",
                  fontWeight: 900,
                  letterSpacing: "0.08em",
                  margin: 0,
                  color: "#1c1917",
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  textTransform: "uppercase",
                }}
              >
                STAR LIGHT CO.
              </h1>
              <div style={{ fontSize: "0.78rem", color: "#e17159", fontWeight: 700, letterSpacing: "0.06em" }}>
                ARTISANAL BOTANICAL SOAPS &amp; SKINCARE
              </div>
              <div style={{ fontSize: "0.74rem", color: "#57534e", marginTop: "4px" }}>
                104, Lotus Flora Estate, Linking Road, Bandra West, Mumbai, MH - 400050
              </div>
              <div style={{ fontSize: "0.74rem", color: "#57534e" }}>
                <strong>GSTIN:</strong> 27AABCS1429B1Z8 &nbsp;|&nbsp; <strong>State Code:</strong> 27 (Maharashtra)
              </div>
              <div style={{ fontSize: "0.74rem", color: "#57534e" }}>
                Email: care@starlightco.in &nbsp;|&nbsp; Web: www.starlightco.in
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  display: "inline-block",
                  border: "1.5px solid #1c1917",
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  backgroundColor: "#fafaf9",
                  marginBottom: "0.5rem",
                }}
              >
                TAX INVOICE
              </div>
              <div style={{ fontSize: "0.72rem", color: "#78716c", fontStyle: "italic" }}>
                Original for Recipient
              </div>
              <div style={{ fontSize: "0.8rem", fontWeight: 800, marginTop: "4px" }}>
                Invoice No: <span style={{ fontFamily: "monospace" }}>{invoiceNumber}</span>
              </div>
              <div style={{ fontSize: "0.75rem", color: "#44403c" }}>
                Date: <strong>{invoiceDate}</strong>
              </div>
            </div>
          </div>

          {/* Details Row: Billed To / Shipped To / Payment Info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "1.5rem",
              backgroundColor: "#fafaf9",
              padding: "1rem 1.25rem",
              borderRadius: "8px",
              border: "1px solid #e7e5e4",
              marginBottom: "1.25rem",
            }}
          >
            {/* Customer Details */}
            <div>
              <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                BILLED &amp; SHIPPED TO:
              </div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1c1917" }}>
                {order.customerName}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#44403c" }}>
                {order.customerEmail} {order.customerPhone ? `• ${order.customerPhone}` : ""}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#44403c", marginTop: "4px" }}>
                {order.shippingAddress}
              </div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#1c1917" }}>
                State: {order.shippingState || "India"} — Pincode: {order.shippingPincode || "400001"}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#e17159", fontWeight: 700, marginTop: "3px" }}>
                Place of Supply: {order.shippingState || "Maharashtra"} ({isIntraState ? "Intra-State: CGST + SGST" : "Inter-State: IGST"})
              </div>
            </div>

            {/* Payment & Order Reference */}
            <div style={{ borderLeft: "1px dashed #d6d3d1", paddingLeft: "1.25rem" }}>
              <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#78716c", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                TRANSACTION REFERENCE:
              </div>
              <div style={{ fontSize: "0.78rem", marginBottom: "2px" }}>
                <strong>Order ID:</strong> #{order.orderNumber}
              </div>
              <div style={{ fontSize: "0.78rem", marginBottom: "2px" }}>
                <strong>Payment Method:</strong>{" "}
                {order.paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Razorpay Online Gateway"}
              </div>
              <div style={{ fontSize: "0.78rem", marginBottom: "2px" }}>
                <strong>Payment Status:</strong>{" "}
                <span style={{ fontWeight: 800, color: order.paymentStatus === "Paid" ? "#15803d" : "#b45309" }}>
                  {order.paymentStatus || (order.paymentMethod === "cod" ? "Pending (Cash On Delivery)" : "Paid")}
                </span>
              </div>
              {order.razorpayPaymentId && (
                <div style={{ fontSize: "0.74rem", fontFamily: "monospace", color: "#57534e" }}>
                  <strong>Payment Ref:</strong> {order.razorpayPaymentId}
                </div>
              )}
            </div>
          </div>

          {/* Tax Itemized Table */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "1.25rem",
              fontSize: "0.78rem",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#1c1917", color: "#ffffff", textAlign: "left" }}>
                <th style={{ padding: "0.6rem 0.75rem", width: "40px" }}>#</th>
                <th style={{ padding: "0.6rem 0.75rem" }}>Item Description</th>
                <th style={{ padding: "0.6rem 0.75rem", width: "70px" }}>HSN</th>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "center", width: "50px" }}>Qty</th>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "right", width: "80px" }}>Rate (₹)</th>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "right", width: "90px" }}>Taxable (₹)</th>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "right", width: "65px" }}>GST%</th>
                <th style={{ padding: "0.6rem 0.75rem", textAlign: "right", width: "90px" }}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item: any, idx: number) => {
                const itemTotal = (item.price || 0) * (item.quantity || 1);
                const itemTaxable = Math.round((itemTotal / 1.18) * 100) / 100;
                return (
                  <tr key={idx} style={{ borderBottom: "1px solid #e7e5e4" }}>
                    <td style={{ padding: "0.65rem 0.75rem", color: "#78716c" }}>{idx + 1}</td>
                    <td style={{ padding: "0.65rem 0.75rem" }}>
                      <div style={{ fontWeight: 700, color: "#1c1917" }}>{item.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "#78716c" }}>
                        Cold-Process Artisanal Soap Bar • {item.weight || "125g"}
                      </div>
                    </td>
                    <td style={{ padding: "0.65rem 0.75rem", fontFamily: "monospace", color: "#57534e" }}>
                      3401
                    </td>
                    <td style={{ padding: "0.65rem 0.75rem", textAlign: "center", fontWeight: 700 }}>
                      {item.quantity}
                    </td>
                    <td style={{ padding: "0.65rem 0.75rem", textAlign: "right" }}>
                      {Math.round((item.price / 1.18) * 100) / 100}
                    </td>
                    <td style={{ padding: "0.65rem 0.75rem", textAlign: "right", fontWeight: 600 }}>
                      {itemTaxable}
                    </td>
                    <td style={{ padding: "0.65rem 0.75rem", textAlign: "right" }}>18%</td>
                    <td style={{ padding: "0.65rem 0.75rem", textAlign: "right", fontWeight: 800 }}>
                      ₹{itemTotal.toLocaleString("en-IN")}
                    </td>
                  </tr>
                );
              })}

              {/* Shipping Row */}
              <tr style={{ borderBottom: "1px solid #e7e5e4", backgroundColor: "#fafaf9" }}>
                <td style={{ padding: "0.55rem 0.75rem", color: "#78716c" }}>
                  {(order.items || []).length + 1}
                </td>
                <td style={{ padding: "0.55rem 0.75rem" }}>
                  <div style={{ fontWeight: 700 }}>Courier Express Shipping &amp; Transit Handling</div>
                  <div style={{ fontSize: "0.7rem", color: "#78716c" }}>
                    Delivery Destination: {order.shippingState || "India"}
                  </div>
                </td>
                <td style={{ padding: "0.55rem 0.75rem", fontFamily: "monospace", color: "#57534e" }}>
                  9968
                </td>
                <td style={{ padding: "0.55rem 0.75rem", textAlign: "center" }}>1</td>
                <td style={{ padding: "0.55rem 0.75rem", textAlign: "right" }}>₹{shippingCost}</td>
                <td style={{ padding: "0.55rem 0.75rem", textAlign: "right" }}>₹{shippingCost}</td>
                <td style={{ padding: "0.55rem 0.75rem", textAlign: "right" }}>0%</td>
                <td style={{ padding: "0.55rem 0.75rem", textAlign: "right", fontWeight: 800 }}>
                  ₹{shippingCost}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Tax Summary & Breakdown */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            {/* Tax Computation breakdown */}
            <div
              style={{
                border: "1px solid #e7e5e4",
                borderRadius: "8px",
                padding: "0.85rem 1rem",
                backgroundColor: "#fafaf9",
                fontSize: "0.75rem",
              }}
            >
              <div style={{ fontWeight: 800, textTransform: "uppercase", color: "#78716c", marginBottom: "6px" }}>
                GST Tax Distribution Breakdown:
              </div>
              {isIntraState ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span>CGST (Central Tax @ 9%):</span>
                    <strong>₹{cgstAmount.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span>SGST (State Tax Maharashtra @ 9%):</span>
                    <strong>₹{sgstAmount.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#78716c" }}>
                    <span>IGST (Integrated Tax @ 0%):</span>
                    <span>₹0.00</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span>IGST (Integrated Interstate Tax @ 18%):</span>
                    <strong>₹{igstAmount.toFixed(2)}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#78716c" }}>
                    <span>CGST (Central Tax @ 0%):</span>
                    <span>₹0.00</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#78716c" }}>
                    <span>SGST (State Tax @ 0%):</span>
                    <span>₹0.00</span>
                  </div>
                </>
              )}
              <div
                style={{
                  borderTop: "1px dashed #d6d3d1",
                  marginTop: "6px",
                  paddingTop: "4px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                }}
              >
                <span>Total Tax Assessed:</span>
                <span style={{ color: "#e17159" }}>₹{totalGstAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Final Financial Totals */}
            <div
              style={{
                border: "1px solid #1c1917",
                borderRadius: "8px",
                padding: "0.85rem 1rem",
                backgroundColor: "#ffffff",
                fontSize: "0.8rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#57534e" }}>Taxable Merchandise Value:</span>
                <strong>₹{taxableValue.toFixed(2)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ color: "#57534e" }}>Goods &amp; Service Tax (18%):</span>
                <strong>₹{totalGstAmount.toFixed(2)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ color: "#57534e" }}>Courier Shipping Fee:</span>
                <strong>₹{shippingCost}</strong>
              </div>

              <div
                style={{
                  borderTop: "2px solid #1c1917",
                  paddingTop: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "1.05rem",
                  fontWeight: 900,
                  color: "#1c1917",
                }}
              >
                <span>INVOICE TOTAL:</span>
                <span style={{ color: "#e17159" }}>₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
              </div>
              <div style={{ fontSize: "0.7rem", color: "#78716c", marginTop: "2px", textAlign: "right" }}>
                (Inclusive of all central and state GST taxes)
              </div>
            </div>
          </div>

          {/* Terms & Signature Footer */}
          <div
            style={{
              borderTop: "1px solid #e7e5e4",
              paddingTop: "1rem",
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr",
              gap: "1.5rem",
              alignItems: "flex-end",
            }}
          >
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#1c1917", marginBottom: "3px" }}>
                TERMS &amp; ARTISANAL SOAP CARE:
              </div>
              <ul style={{ margin: 0, paddingLeft: "1.1rem", fontSize: "0.7rem", color: "#57534e" }}>
                <li>Handcrafted cold-process soap bars cure for 4–6 weeks using plant oils and natural clays.</li>
                <li>Keep dry between uses in a draining soap dish to extend bar longevity.</li>
                <li>Goods once delivered may be replaced if damaged during courier transit.</li>
              </ul>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.72rem", color: "#78716c", marginBottom: "1.5rem" }}>
                For <strong>STAR LIGHT CO. ATELIER</strong>
              </div>
              <div
                style={{
                  borderTop: "1px solid #1c1917",
                  display: "inline-block",
                  paddingTop: "4px",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: "#1c1917",
                }}
              >
                Authorized Signatory / Computer Generated
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Print Media Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .no-print {
            display: none !important;
          }
          .invoice-modal-overlay {
            position: absolute !important;
            inset: 0 !important;
            background: #ffffff !important;
            padding: 0 !important;
            backdrop-filter: none !important;
            overflow: visible !important;
          }
          .invoice-modal-card {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-height: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          #printable-tax-invoice,
          #printable-tax-invoice * {
            visibility: visible !important;
          }
          #printable-tax-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 15mm 15mm !important;
          }
        }
      `}</style>
    </div>
  );
}
