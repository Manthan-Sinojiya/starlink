import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backoffice Atelier & Store Management | Star Light Co.",
  description: "Star Light Co. Atelier Backoffice: manage products, categories, orders, shipping rates, and promotional campaigns.",
};

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
