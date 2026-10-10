export function openWhatsAppDirect(
  soap?: { id?: string; name: string; price?: number } | null,
  customMsg?: string
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
  const text = encodeURIComponent(message);
  window.open(`https://wa.me/919876543210?text=${text}`, "_blank");
}
