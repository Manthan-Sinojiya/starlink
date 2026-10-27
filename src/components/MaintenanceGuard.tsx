"use client";

import React, { Suspense } from "react";
import { usePathname } from "next/navigation";
import { useDBStore } from "@/context/DBStoreContext";
import MaintenanceScreen from "@/components/MaintenanceScreen";

function GuardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { siteSettings, currentUser, isLoaded } = useDBStore();

  const isBypassedRoute =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/backoffice") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/api");

  if (isLoaded && siteSettings?.maintenanceMode && currentUser?.role !== "admin" && !isBypassedRoute) {
    return <MaintenanceScreen />;
  }

  return <>{children}</>;
}

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <GuardContent>{children}</GuardContent>
    </Suspense>
  );
}
