export function openWhatsAppDirect(
  soap?: { id?: string; name: string; price?: number } | null,
  customMsg?: string,
  overridePhone?: string
) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://starlightsoaps.com";
  let message = "";
  if (customMsg) {
    message = customMsg;
  } else if (soap) {
    const productUrl = soap.id ? `${origin}/products/${soap.id}` : origin;
    const priceText = soap.price !== undefined ? ` (₹${soap.price.toLocaleString("en-IN")})` : "";
    message = `Hello Star Light Co.! I would like to enquire about ordering "${soap.name}"${priceText}.\nProduct Link: ${productUrl}\nPlease share availability and order details.`;
  } else {
    message = "Hello Star Light Co.! I would like to enquire about your luxury artisanal soaps.";
  }

  let phone = overridePhone;
  if (!phone && typeof window !== "undefined") {
    phone = localStorage.getItem("starlight_whatsapp_number") || "919876543210";
  }
  const cleanPhone = (phone || "919876543210").replace(/\D/g, "");
  const text = encodeURIComponent(message);
  window.open(`https://wa.me/${cleanPhone}?text=${text}`, "_blank");
}
