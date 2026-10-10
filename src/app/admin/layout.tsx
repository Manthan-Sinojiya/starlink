import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Atelier & Product Management | Star Light Co.",
  description: "Manage artisanal soap formulations, categories, sequence order, and GST tax rules.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
