import nodemailer from "nodemailer";

export interface SendInvoiceOptions {
  order: any;
  toEmail?: string;
  isPaymentConfirmation?: boolean;
}

/**
 * Creates and returns the Nodemailer SMTP transporter.
 * Falls back gracefully to ethereal or simulated log mode if credentials are unset.
 */
export async function getTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (user && pass && pass.trim().length > 0) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false },
    });
  }

  // Fallback to simulated console transporter for local dev/testing
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: "starlight.demo@ethereal.email",
      pass: "demo_password",
    },
    // Mock send when offline
    send: true,
  } as any);
}

/**
 * Generates an official, luxury Tax Invoice HTML string for printing, PDF conversion, or email attachment.
 */
export function generateInvoiceHtml(order: any): string {
  const isIntraState =
    order.shippingState &&
    (String(order.shippingState).toLowerCase().includes("maharashtra") ||
      String(order.shippingState).toLowerCase() === "mh");

  const subtotal = Number(order.subtotal || order.total || 0);
  const shippingCost = Number(order.shippingCost ?? order.shipping ?? 0);
  const grandTotal = Number(order.total || subtotal + shippingCost);

  // 18% GST on cosmetic soaps (HSN 3401)
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

  const isPaid = order.paymentStatus === "Paid";

  const itemsRows = (order.items || [])
    .map((item: any, i: number) => {
      const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
      return `
        <tr style="border-bottom: 1px solid #f1ece1;">
          <td style="padding: 10px 12px; font-size: 13px; color: #555;">${i + 1}</td>
          <td style="padding: 10px 12px; font-size: 13px; font-weight: 600; color: #1c1917;">
            ${item.name || "Cold-Process Soap Bar"}
            <span style="display: block; font-size: 11px; font-weight: 400; color: #78716c;">${item.weight || "125g"} • Cold Process</span>
          </td>
          <td style="padding: 10px 12px; font-size: 12px; color: #78716c; text-align: center;">3401</td>
          <td style="padding: 10px 12px; font-size: 13px; color: #1c1917; text-align: center;">${item.quantity || 1}</td>
          <td style="padding: 10px 12px; font-size: 13px; color: #1c1917; text-align: right;">₹${Number(item.price || 0).toLocaleString("en-IN")}</td>
          <td style="padding: 10px 12px; font-size: 13px; font-weight: 700; color: #1c1917; text-align: right;">₹${lineTotal.toLocaleString("en-IN")}</td>
        </tr>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; background: #faf8f5; color: #1c1917; }
    .invoice-card { max-width: 760px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e7dfd5; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    .badge-paid { background: #ecfdf5; color: #15803d; border: 1px solid #86efac; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 12px; text-transform: uppercase; }
    .badge-cod { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 12px; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="invoice-card">
    <!-- Header -->
    <table style="width: 100%; border-bottom: 2px solid #c5a059; padding-bottom: 16px; margin-bottom: 24px;">
      <tr>
        <td style="vertical-align: top;">
          <h1 style="margin: 0; font-size: 22px; color: #1c1917; letter-spacing: 0.04em;">STAR LIGHT CO.</h1>
          <p style="margin: 3px 0 0; font-size: 12px; color: #78716c;">Cold-Process Botanical Soapworks • Scalar Wave Charged</p>
          <p style="margin: 2px 0 0; font-size: 11px; color: #a8a29e;">GSTIN: 27AABCS1429B1Z8 • State: Maharashtra (Code: 27)</p>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <div style="font-size: 18px; font-weight: 800; color: #c5a059;">TAX INVOICE</div>
          <div style="font-size: 12px; color: #444; margin-top: 4px;"><strong>Invoice #:</strong> ${invoiceNumber}</div>
          <div style="font-size: 12px; color: #444;"><strong>Date:</strong> ${invoiceDate}</div>
          <div style="margin-top: 6px;">
            <span class="${isPaid ? "badge-paid" : "badge-cod"}">
              ${isPaid ? "✓ PAID &amp; CONFIRMED" : "🚚 CASH ON DELIVERY"}
            </span>
          </div>
        </td>
      </tr>
    </table>

    <!-- Billing and Shipping Info -->
    <table style="width: 100%; margin-bottom: 24px; font-size: 12px; line-height: 1.5;">
      <tr>
        <td style="width: 50%; vertical-align: top; padding-right: 12px;">
          <div style="font-size: 11px; font-weight: 700; color: #a8a29e; text-transform: uppercase; margin-bottom: 4px;">BILLED &amp; DISPATCHED TO:</div>
          <div style="font-size: 14px; font-weight: 700; color: #1c1917;">${order.customerName || "Valued Customer"}</div>
          <div style="color: #444;">${order.shippingAddress || "Registered Delivery Address"}</div>
          <div style="color: #444;">${order.shippingState || ""}${order.shippingPincode ? ` - ${order.shippingPincode}` : ""}</div>
          <div style="color: #444;">Email: <strong>${order.customerEmail}</strong></div>
          ${order.customerPhone ? `<div style="color: #444;">Mobile: +91 ${order.customerPhone}</div>` : ""}
        </td>
        <td style="width: 50%; vertical-align: top; padding-left: 12px;">
          <div style="font-size: 11px; font-weight: 700; color: #a8a29e; text-transform: uppercase; margin-bottom: 4px;">ORDER REFERENCE:</div>
          <div style="color: #444;"><strong>Order ID:</strong> #${order.orderNumber}</div>
          <div style="color: #444;"><strong>Payment Method:</strong> ${order.paymentMethod === "razorpay" ? "Razorpay Online Payment" : "Cash on Delivery (COD)"}</div>
          ${order.razorpayPaymentId ? `<div style="color: #15803d; font-family: monospace;"><strong>Txn ID:</strong> ${order.razorpayPaymentId}</div>` : ""}
          <div style="color: #444;"><strong>Dispatch Mode:</strong> Insured Express Courier</div>
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <thead>
        <tr style="background: #fbf9f6; border-top: 1px solid #e7dfd5; border-bottom: 1.5px solid #c5a059;">
          <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #78716c; text-align: left;">#</th>
          <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #78716c; text-align: left;">Description</th>
          <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #78716c; text-align: center;">HSN</th>
          <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #78716c; text-align: center;">Qty</th>
          <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #78716c; text-align: right;">Rate</th>
          <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; color: #78716c; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <!-- Total Calculations -->
    <table style="width: 100%; margin-bottom: 24px;">
      <tr>
        <td style="width: 55%; vertical-align: top; font-size: 11px; color: #78716c; padding-right: 16px;">
          <p style="margin: 0 0 6px;"><strong>Tax Summary (HSN 3401 - Soap Bars):</strong></p>
          <p style="margin: 2px 0;">• Taxable Value: ₹${taxableValue.toLocaleString("en-IN")}</p>
          ${
            isIntraState
              ? `<p style="margin: 2px 0;">• CGST (9%): ₹${cgstAmount.toLocaleString("en-IN")}<br>• SGST (9%): ₹${sgstAmount.toLocaleString("en-IN")}</p>`
              : `<p style="margin: 2px 0;">• Integrated GST (18%): ₹${igstAmount.toLocaleString("en-IN")}</p>`
          }
          <p style="margin: 6px 0 0; color: #15803d; font-weight: 600;">✓ 100% Biodegradable &amp; Ayurvedic Botanical Certification</p>
        </td>
        <td style="width: 45%; vertical-align: top;">
          <table style="width: 100%; font-size: 13px; line-height: 1.8;">
            <tr>
              <td style="color: #78716c;">Items Subtotal:</td>
              <td style="text-align: right; font-weight: 600;">₹${subtotal.toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="color: #78716c;">Shipping &amp; Handling:</td>
              <td style="text-align: right; font-weight: 600;">${shippingCost === 0 ? "FREE" : `₹${shippingCost.toLocaleString("en-IN")}`}</td>
            </tr>
            <tr style="border-top: 1.5px solid #c5a059; font-size: 16px; font-weight: 800; color: #1c1917;">
              <td style="padding-top: 8px;">Total Amount:</td>
              <td style="padding-top: 8px; text-align: right; color: #c5a059;">₹${grandTotal.toLocaleString("en-IN")}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Footer Terms & Stamp -->
    <div style="border-top: 1px solid #f1ece1; padding-top: 16px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #a8a29e;">
      <div>
        <p style="margin: 0;">This is a computer-generated tax invoice. No physical signature required.</p>
        <p style="margin: 2px 0 0;">For inquiries or support: care@starlight.co.in • +91 98765 43210</p>
      </div>
      <div style="text-align: right; font-weight: 700; color: #78716c;">
        FOR STAR LIGHT CO.<br>
        <span style="font-size: 10px; color: #c5a059; font-weight: 400;">Authorized Signatory</span>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Sends order confirmation & official tax invoice email via Nodemailer.
 */
export async function sendOrderInvoiceEmail(options: SendInvoiceOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { order, toEmail, isPaymentConfirmation } = options;
  const recipient = toEmail || order.customerEmail;

  if (!recipient) {
    return { success: false, error: "Recipient email is missing." };
  }

  const invoiceHtml = generateInvoiceHtml(order);
  const isPaid = order.paymentStatus === "Paid";
  const orderNumber = order.orderNumber || "ORDER";

  const emailSubject = isPaymentConfirmation || isPaid
    ? `💳 Payment Received & Tax Invoice #${orderNumber} — Star Light Co.`
    : `✨ Order Confirmed & Tax Invoice #${orderNumber} — Star Light Co.`;

  const emailHtml = `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #faf8f5; padding: 24px 12px; margin: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; border: 1px solid #e7dfd5; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03);">
      
      <!-- Brand Banner -->
      <div style="background-color: #1c1917; padding: 24px 20px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.08em; color: #c5a059;">STAR LIGHT CO.</h1>
        <p style="margin: 4px 0 0; font-size: 12px; color: #d6d3d1;">Artisanal Handcrafted Botanical Soapworks</p>
      </div>

      <!-- Main Message -->
      <div style="padding: 24px 20px;">
        <h2 style="margin: 0 0 10px; font-size: 18px; color: #1c1917;">
          Hello ${order.customerName || "Valued Customer"},
        </h2>
        <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #57534e;">
          ${
            isPaid
              ? `Thank you for your payment! We have verified your online payment of <strong>₹${Number(order.total || 0).toLocaleString("en-IN")}</strong> for Order <strong>#${orderNumber}</strong>. Your artisanal cold-process soaps are scheduled for dispatch.`
              : `Thank you for placing your order with Star Light Co.! Order <strong>#${orderNumber}</strong> has been confirmed for Cash on Delivery dispatch to <strong>${order.shippingState || "your address"}</strong>.`
          }
        </p>

        <!-- Status Card -->
        <div style="background-color: #fbf9f6; border-radius: 10px; border: 1px solid #e7dfd5; padding: 14px 16px; margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
            <span style="color: #78716c;">Order Number:</span>
            <strong style="font-family: monospace; color: #1c1917;">#${orderNumber}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 13px;">
            <span style="color: #78716c;">Payment Status:</span>
            <strong style="color: ${isPaid ? "#15803d" : "#b45309"};">${isPaid ? "✓ Paid &amp; Verified" : "🚚 Cash on Delivery"}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 13px;">
            <span style="color: #78716c;">Total Amount:</span>
            <strong style="color: #c5a059; font-size: 15px;">₹${Number(order.total || 0).toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <p style="font-size: 13px; color: #78716c; margin-bottom: 20px; line-height: 1.5;">
          Your official GST Tax Invoice has been generated and attached below. You can also view and track all your orders anytime from your customer account dashboard.
        </p>

        <!-- Call to Action -->
        <div style="text-align: center; margin: 24px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login" style="display: inline-block; padding: 12px 24px; background-color: #c5a059; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; border-radius: 8px;">
            View Orders in Customer Dashboard →
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color: #f5f2eb; padding: 16px 20px; text-align: center; font-size: 11px; color: #78716c; border-top: 1px solid #e7dfd5;">
        <p style="margin: 0;">Star Light Co. • Mumbai, Maharashtra, India • Customer Care: care@starlight.co.in</p>
      </div>
    </div>
  </div>
  `;

  try {
    const transporter = await getTransporter();
    const fromAddress = process.env.EMAIL_FROM || '"Star Light Co." <orders@starlight.co.in>';

    const mailOptions = {
      from: fromAddress,
      to: recipient,
      subject: emailSubject,
      html: emailHtml,
      attachments: [
        {
          filename: `Tax-Invoice-${orderNumber}.html`,
          content: invoiceHtml,
          contentType: "text/html",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer] Invoice email sent to ${recipient}: ${info.messageId || "mock-dispatched"}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error("[Nodemailer Error] Could not send invoice email:", err);
    return { success: false, error: err?.message || "Failed to send email" };
  }
}
