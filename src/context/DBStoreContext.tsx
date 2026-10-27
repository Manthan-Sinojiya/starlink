"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  authApi,
  productsApi,
  categoriesApi,
  ordersApi,
  shippingApi,
  heroApi,
  adminApi,
  settingsApi,
  UserData,
  ProductData,
  CategoryData,
  OrderData,
  ShippingSettingsData,
  HeroSlide,
  SiteSettingsData,
} from "@/lib/api";
import {
  DEFAULT_PRIMARY_OFFER,
  DEFAULT_SECONDARY_OFFER,
  OfferSectionConfig,
  INDIAN_STATES,
} from "@/data/soaps";

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  maintenanceMode: false,
  maintenanceMessage:
    "We are currently curating new artisanal cold-process batches. The Star Light atelier will reopen shortly.",
  whatsappNumber: "919876543210",
  contactPhone: "+91 98765 43210",
  contactEmail: "care@starlightsoaps.com",
  seo: {
    metaTitle: "STAR LIGHT CO. | Luxury Handcrafted Cold-Process Artisanal Soaps",
    metaDescription:
      "Discover Star Light Co. artisanal cold-processed luxury soaps. Hand-poured with sacred Dragon's Blood resin, organic botanical extracts, and nourishing plant lipids.",
    metaKeywords:
      "artisan soap, cold process soap, dragon's blood soap, luxury soap bar, organic handmade soap, ayurvedic soap",
    organizationName: "Star Light Co.",
    brandTagline: "Luxury Cold-Process Soaps & Botanical Skincare",
    storeTelephone: "+91 98765 43210",
    storeEmail: "orders@starlight.co.in",
    priceRange: "₹299 - ₹2499",
    enableCustomSchema: false,
    customSchemaJson: "",
  },
  ritualSection: {
    tag: "The Star Light Standard",
    title: "The Art of True Cold-Process Saponification",
    subtitle:
      "Most shelf soaps are synthetic detergents masquerading as soap. Here is why our cold-cured bars transform your daily bathing into a transformative skincare ritual.",
    pillars: [
      {
        id: "p1",
        iconName: "Flame",
        title: "Ancient Dragon's Blood",
        desc: "Wild-harvested sacred resin used for centuries to tone, fortify skin elasticity, and guard against cellular stressors.",
      },
      {
        id: "p2",
        iconName: "Droplet",
        title: "Glycerin Retention",
        desc: "Commercial soap factories strip natural glycerin for lotion profits. Our cold-process method seals every drop inside the bar.",
      },
      {
        id: "p3",
        iconName: "Leaf",
        title: "Unrefined Botanical Lipids",
        desc: "Formulated with raw Ghanaian shea butter, organic virgin coconut oil, and cold-pressed sweet almond nectar.",
      },
      {
        id: "p4",
        iconName: "PackageCheck",
        title: "Zero Plastic Guarantee",
        desc: "Every bar arrives swaddled in recyclable terracotta parchment paper and compostable unbleached plant fibers.",
      },
    ],
  },
  reviewsSection: {
    tag: "Tested & Loved",
    title: "Skin Stories from Our Community",
    subtitle:
      "Over 14,000 satisfied customers have swapped commercial harsh cleansers for our gentle botanical cold-process soaps.",
    reviews: [
      {
        id: "r1",
        name: "Seraphina Vance",
        location: "San Francisco, CA",
        verified: true,
        soapPurchased: "Dragon's Blood & Smoked Amber",
        rating: 5,
        review:
          "“I threw away all liquid body washes after one shower with Star Light Co. The lather is creamy like dense whipped velvet, and the scent of warm amber and star anise lingers subtly all day without being overpowering. My skin has never felt this hydrated.”",
        initials: "SV",
      },
      {
        id: "r2",
        name: "Julian Thorne",
        location: "London, UK",
        verified: true,
        soapPurchased: "Festival Dragon's Glow Gift Set",
        rating: 5,
        review:
          "“The packaging alone is worth an art exhibit. The dark collector box with the terracotta ribbon and dragon seal blew my partner away. The soaps with the gold leaf look and smell like imperial apothecary treasures. Will be buying these as gifts every season!”",
        initials: "JT",
      },
      {
        id: "r3",
        name: "Aria Montgomery",
        location: "Austin, TX",
        verified: true,
        soapPurchased: "Kashmiri Saffron & Raw Honey",
        rating: 5,
        review:
          "“The saffron threads and goat milk formula completely healed my winter dryness in less than a week. You can feel the real cold-process glycerin difference immediately. Plus, knowing it comes in plastic-free terracotta packaging makes it even better.”",
        initials: "AM",
      },
    ],
  },
};

export interface UserLocationInfo {
  state: string;
  city: string;
  pincode?: string;
  source?: "gps" | "ip" | "manual";
}

interface DBStoreContextType {
  // Data
  products: ProductData[];
  categories: CategoryData[];
  orders: OrderData[];
  shippingSettings: ShippingSettingsData | null;
  siteSettings: SiteSettingsData;
  heroSlides: HeroSlide[];
  currentUser: UserData | null;
  adminUsers: UserData[];
  primaryOffer: OfferSectionConfig;
  secondaryOffer: OfferSectionConfig;
  isLoaded: boolean;
  isLoadingProducts: boolean;

  // Location
  userLocation: UserLocationInfo;
  isDetectingLocation: boolean;
  detectUserLocation: () => Promise<{ success: boolean; state?: string; city?: string; error?: string }>;
  setUserLocation: (state: string, city?: string) => void;

  // Auth
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: UserData }>;
  registerUser: (data: {
    name: string; email: string; password: string;
    phone?: string; address?: string; state?: string; pincode?: string;
  }) => Promise<{ success: boolean; message: string; user?: UserData }>;
  logoutUser: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  refreshAdminUsers: () => Promise<void>;

  // Products
  refreshProducts: (filters?: { category?: string; search?: string }) => Promise<void>;
  addProduct: (data: Partial<ProductData>) => Promise<ProductData>;
  updateProduct: (id: string, data: Partial<ProductData>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Categories
  refreshCategories: () => Promise<void>;
  addCategory: (data: Partial<CategoryData>) => Promise<CategoryData>;
  updateCategory: (id: string, data: Partial<CategoryData>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategory: (id: string, direction: "up" | "down") => Promise<void>;

  // Orders
  refreshOrders: () => Promise<void>;
  createOrder: (data: Partial<OrderData> & { customerPassword?: string; password?: string }) => Promise<OrderData>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;

  // Shipping
  updateShippingSettings: (data: Partial<ShippingSettingsData>) => Promise<void>;
  calculateShipping: (subtotal: number, selectedState?: string) => number;

  // Settings & CMS
  refreshSettings: () => Promise<void>;
  updateSiteSettings: (data: Partial<SiteSettingsData>) => Promise<void>;

  // Hero
  refreshHero: () => Promise<void>;
  updateHeroSlides: (slides: HeroSlide[]) => Promise<void>;

  // Offers
  updatePrimaryOffer: (data: Partial<OfferSectionConfig>) => void;
  updateSecondaryOffer: (data: Partial<OfferSectionConfig>) => void;
}

const DBStoreContext = createContext<DBStoreContextType | undefined>(undefined);

const DEFAULT_SHIPPING: ShippingSettingsData = {
  shippingType: "flat",
  flatRate: 99,
  freeShippingThreshold: 999,
  enableFreeThreshold: true,
  defaultStateRate: 99,
  stateRates: {},
};

export function matchIndianState(rawState: string): string | null {
  if (!rawState) return null;
  const lower = rawState.toLowerCase().trim();
  if (lower.includes("delhi")) return "Delhi NCR";
  if (lower.includes("jammu") || lower.includes("kashmir")) return "Jammu & Kashmir";
  if (lower.includes("maharashtra") || lower.includes("mumbai") || lower.includes("pune")) return "Maharashtra";
  if (lower.includes("gujarat") || lower.includes("ahmedabad") || lower.includes("surat")) return "Gujarat";
  if (lower.includes("karnataka") || lower.includes("bangalore") || lower.includes("bengaluru")) return "Karnataka";
  if (lower.includes("tamil") || lower.includes("chennai")) return "Tamil Nadu";
  if (lower.includes("uttar pradesh") || lower.includes("lucknow") || lower.includes("noida")) return "Uttar Pradesh";
  if (lower.includes("west bengal") || lower.includes("kolkata")) return "West Bengal";
  if (lower.includes("rajasthan") || lower.includes("jaipur")) return "Rajasthan";
  if (lower.includes("telangana") || lower.includes("hyderabad")) return "Telangana";
  if (lower.includes("kerala") || lower.includes("kochi")) return "Kerala";
  if (lower.includes("punjab") || lower.includes("amritsar")) return "Punjab";
  if (lower.includes("haryana") || lower.includes("gurgaon") || lower.includes("gurugram")) return "Haryana";
  if (lower.includes("madhya pradesh") || lower.includes("bhopal") || lower.includes("indore")) return "Madhya Pradesh";
  if (lower.includes("bihar") || lower.includes("patna")) return "Bihar";
  if (lower.includes("odisha") || lower.includes("orissa") || lower.includes("bhubaneswar")) return "Odisha";
  if (lower.includes("andhra") || lower.includes("visakhapatnam")) return "Andhra Pradesh";
  if (lower.includes("assam") || lower.includes("guwahati")) return "Assam";
  if (lower.includes("goa") || lower.includes("panaji")) return "Goa";
  if (lower.includes("chandigarh")) return "Chandigarh";
  if (lower.includes("chhattisgarh") || lower.includes("raipur")) return "Chhattisgarh";
  if (lower.includes("jharkhand") || lower.includes("ranchi")) return "Jharkhand";
  if (lower.includes("uttarakhand") || lower.includes("dehradun")) return "Uttarakhand";
  if (lower.includes("himachal") || lower.includes("shimla")) return "Himachal Pradesh";
  if (lower.includes("tripura")) return "Tripura";
  if (lower.includes("meghalaya")) return "Meghalaya";
  if (lower.includes("manipur")) return "Manipur";
  if (lower.includes("nagaland")) return "Nagaland";
  if (lower.includes("arunachal")) return "Arunachal Pradesh";
  if (lower.includes("mizoram")) return "Mizoram";
  if (lower.includes("sikkim")) return "Sikkim";
  if (lower.includes("puducherry") || lower.includes("pondicherry")) return "Puducherry";
  if (lower.includes("ladakh")) return "Ladakh";
  if (lower.includes("andaman")) return "Andaman & Nicobar Islands";

  const exact = INDIAN_STATES.find(
    (s) => s.toLowerCase() === lower || lower.includes(s.toLowerCase()) || s.toLowerCase().includes(lower)
  );
  return exact || null;
}

export function DBStoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettingsData | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettingsData>(DEFAULT_SITE_SETTINGS);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [adminUsers, setAdminUsers] = useState<UserData[]>([]);
  const [primaryOffer, setPrimaryOffer] = useState<OfferSectionConfig>(DEFAULT_PRIMARY_OFFER);
  const [secondaryOffer, setSecondaryOffer] = useState<OfferSectionConfig>(DEFAULT_SECONDARY_OFFER);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // User Live Location State
  const [userLocation, setUserLocationState] = useState<UserLocationInfo>({
    state: "Maharashtra",
    city: "Mumbai",
    source: "manual",
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Load initial data exclusively from database
  useEffect(() => {
    async function init() {
      try {
        // Try to restore saved location from localStorage
        try {
          const savedLoc = localStorage.getItem("starlight_user_location");
          if (savedLoc) {
            const parsed = JSON.parse(savedLoc);
            if (parsed.state) setUserLocationState(parsed);
          }
        } catch { /* ignore */ }

        // Restore saved offers
        try {
          const savedP = localStorage.getItem("starlight_primary_offer");
          if (savedP) {
            const parsed = JSON.parse(savedP);
            setPrimaryOffer((prev) => ({
              ...prev,
              ...parsed,
              bars: Array.isArray(parsed.bars) ? parsed.bars : prev.bars || DEFAULT_PRIMARY_OFFER.bars,
            }));
          }
          const savedS = localStorage.getItem("starlight_secondary_offer");
          if (savedS) {
            const parsed = JSON.parse(savedS);
            setSecondaryOffer((prev) => ({
              ...prev,
              ...parsed,
              bars: Array.isArray(parsed.bars) ? parsed.bars : prev.bars || DEFAULT_SECONDARY_OFFER.bars,
            }));
          }
        } catch { /* ignore */ }

        // Try to restore session
        const token = authApi.getToken();
        if (token) {
          try {
            const meRes = await authApi.me();
            if (meRes.success) {
              setCurrentUser(meRes.user);
              if (meRes.user.role === "admin") {
                try {
                  const [uRes, oRes] = await Promise.allSettled([adminApi.getUsers(), ordersApi.getAll()]);
                  if (uRes.status === "fulfilled" && uRes.value.success) setAdminUsers(uRes.value.users);
                  if (oRes.status === "fulfilled" && oRes.value.success) {
                    setOrders(oRes.value.orders.map((o) => ({ ...o, id: o.id || o._id || o.orderNumber })));
                  }
                } catch { /* ignore */ }
              }
            }
          } catch {
            authApi.clearToken();
          }
        }

        // Load products, categories, shipping, hero slides, & settings from DB
        let currentProds: ProductData[] = [];
        let currentCats: CategoryData[] = [];

        const [prodRes, catRes, shipRes, heroRes, setRes] = await Promise.allSettled([
          productsApi.getAll(),
          categoriesApi.getAll(),
          shippingApi.get(),
          heroApi.get(),
          settingsApi.get(),
        ]);

        if (prodRes.status === "fulfilled" && prodRes.value.success) {
          currentProds = prodRes.value.products.map((p) => ({
            ...p,
            id: String(p.id || p._id || p.slug),
            slug: String(p.slug || p.id || ""),
          }));
        }

        if (catRes.status === "fulfilled" && catRes.value.success) {
          currentCats = catRes.value.categories.map((c) => ({
            ...c,
            id: String(c.id || c._id || c.slug),
            slug: String(c.slug || c.id || ""),
          }));
        }

        // If the database is completely empty, automatically seed the database and fetch from it
        if (currentProds.length === 0 || currentCats.length === 0) {
          try {
            await fetch("/api/admin/seed");
            const [seedP, seedC] = await Promise.allSettled([
              productsApi.getAll(),
              categoriesApi.getAll(),
            ]);
            if (seedP.status === "fulfilled" && seedP.value.success) {
              currentProds = seedP.value.products.map((p) => ({
                ...p,
                id: String(p.id || p._id || p.slug),
                slug: String(p.slug || p.id || ""),
              }));
            }
            if (seedC.status === "fulfilled" && seedC.value.success) {
              currentCats = seedC.value.categories.map((c) => ({
                ...c,
                id: String(c.id || c._id || c.slug),
                slug: String(c.slug || c.id || ""),
              }));
            }
          } catch (seedErr) {
            console.error("Auto-seed error:", seedErr);
          }
        }

        setProducts(currentProds);
        setCategories(currentCats);

        if (shipRes.status === "fulfilled" && shipRes.value.success) {
          setShippingSettings(shipRes.value.settings);
        }
        if (heroRes.status === "fulfilled" && heroRes.value.success) {
          setHeroSlides(heroRes.value.slides);
        }
        if (setRes.status === "fulfilled" && setRes.value.success && setRes.value.settings) {
          setSiteSettings(setRes.value.settings);
        }
      } catch (e) {
        console.error("Store init error:", e);
      } finally {
        setIsLoaded(true);
        setIsLoadingProducts(false);
      }
    }
    init();
  }, []);

  // Live Location Auto-Detection Method with Permission Check & High Accuracy
  const detectUserLocation = useCallback(async (): Promise<{ success: boolean; state?: string; city?: string; error?: string }> => {
    setIsDetectingLocation(true);
    try {
      if (typeof window === "undefined" || !navigator.geolocation) {
        return { success: false, error: "not_supported" };
      }

      let permissionDenied = false;

      // 1. Request Browser Location Permission & high-accuracy coordinates
      const coords = await new Promise<{ lat: number; lon: number } | null>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          (err) => {
            if (err.code === 1) {
              permissionDenied = true;
            }
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      });

      if (permissionDenied) {
        return { success: false, error: "permission_denied" };
      }

      if (coords) {
        try {
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json`,
            { headers: { Accept: "application/json" } }
          );
          if (revRes.ok) {
            const data = await revRes.json();
            const addr = data.address || {};
            const rawState = addr.state || addr.province || addr.region || "";
            const rawCity = addr.city || addr.town || addr.district || addr.county || "Local Area";
            const matchedState = matchIndianState(rawState) || "Maharashtra";

            const newLoc: UserLocationInfo = {
              state: matchedState,
              city: rawCity,
              pincode: addr.postcode || "",
              source: "gps",
            };
            setUserLocationState(newLoc);
            try {
              localStorage.setItem("starlight_user_location", JSON.stringify(newLoc));
              localStorage.setItem("starlight_selected_state", matchedState);
            } catch { /* ignore */ }
            return { success: true, state: matchedState, city: rawCity };
          }
        } catch (geoErr) {
          console.warn("Nominatim reverse geocode error:", geoErr);
        }
      }

      // 2. Fallback to IP-based Geolocation if GPS unavailable (and not denied)
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          const matchedState = matchIndianState(ipData.region || ipData.city || "") || "Maharashtra";
          const city = ipData.city || "Mumbai";

          const newLoc: UserLocationInfo = {
            state: matchedState,
            city,
            pincode: ipData.postal || "",
            source: "ip",
          };
          setUserLocationState(newLoc);
          try {
            localStorage.setItem("starlight_user_location", JSON.stringify(newLoc));
            localStorage.setItem("starlight_selected_state", matchedState);
          } catch { /* ignore */ }
          return { success: true, state: matchedState, city };
        }
      } catch (ipErr) {
        console.warn("IP Geolocation error:", ipErr);
      }

      return { success: false, error: "could_not_resolve" };
    } catch (err) {
      console.error("Location detection failed:", err);
      return { success: false, error: "failed" };
    } finally {
      setIsDetectingLocation(false);
    }
  }, []);

  // Auto-detect on first visit if not saved yet
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLoc = localStorage.getItem("starlight_user_location");
      if (!savedLoc) {
        // Trigger subtle auto-detect
        detectUserLocation().catch(() => {});
      }
    }
  }, [detectUserLocation]);

  const setUserLocation = useCallback((state: string, city: string = "") => {
    const validState = matchIndianState(state) || state;
    const newLoc: UserLocationInfo = {
      state: validState,
      city: city || (validState === "Delhi NCR" ? "New Delhi" : validState),
      source: "manual",
    };
    setUserLocationState(newLoc);
    try {
      localStorage.setItem("starlight_user_location", JSON.stringify(newLoc));
      localStorage.setItem("starlight_selected_state", validState);
    } catch { /* ignore */ }
  }, []);

  // ── AUTH ──
  const loginUser = useCallback(async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      if (res.success) {
        setCurrentUser(res.user);
        try {
          if (res.user.role === "admin") {
            const [uRes, oRes] = await Promise.allSettled([adminApi.getUsers(), ordersApi.getAll()]);
            if (uRes.status === "fulfilled" && uRes.value.success) setAdminUsers(uRes.value.users);
            if (oRes.status === "fulfilled" && oRes.value.success) {
              setOrders(oRes.value.orders.map((o) => ({ ...o, id: o.id || o._id || o.orderNumber })));
            }
          } else {
            const ordRes = await ordersApi.getAll();
            if (ordRes.success) {
              setOrders(ordRes.orders.map((o) => ({ ...o, id: o.id || o._id || o.orderNumber })));
            }
          }
        } catch { /* ignore */ }
      }
      return { success: res.success, message: res.message, user: res.user };
    } catch (e: unknown) {
      return { success: false, message: e instanceof Error ? e.message : "Login failed" };
    }
  }, []);

  const registerUser = useCallback(async (data: {
    name: string; email: string; password: string;
    phone?: string; address?: string; state?: string; pincode?: string;
  }) => {
    try {
      const res = await authApi.register(data);
      if (res.success) setCurrentUser(res.user);
      return { success: res.success, message: res.message, user: res.user };
    } catch (e: unknown) {
      return { success: false, message: e instanceof Error ? e.message : "Registration failed" };
    }
  }, []);

  const logoutUser = useCallback(async () => {
    await authApi.logout();
    setCurrentUser(null);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const res = await authApi.me();
      if (res.success) setCurrentUser(res.user);
    } catch {
      setCurrentUser(null);
    }
  }, []);

  const refreshAdminUsers = useCallback(async () => {
    try {
      const res = await adminApi.getUsers();
      if (res.success) setAdminUsers(res.users);
    } catch (e) {
      console.error("Refresh admin users error:", e);
    }
  }, []);

  // ── PRODUCTS ──
  const refreshProducts = useCallback(async (filters?: { category?: string; search?: string }) => {
    try {
      setIsLoadingProducts(true);
      const res = await productsApi.getAll(filters);
      if (res.success) {
        setProducts(
          res.products.map((p) => ({
            ...p,
            id: String(p.id || p._id || p.slug),
            slug: String(p.slug || p.id || ""),
          }))
        );
      }
    } catch (e) {
      console.error("Refresh products error:", e);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const addProduct = useCallback(async (data: Partial<ProductData>): Promise<ProductData> => {
    const res = await productsApi.create(data);
    const normalized: ProductData = {
      ...res.product,
      id: String(res.product.id || res.product._id || res.product.slug),
      slug: String(res.product.slug || res.product.id || ""),
    };
    setProducts((prev) => [normalized, ...prev]);
    return normalized;
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<ProductData>) => {
    const res = await productsApi.update(id, data);
    const normalized: ProductData = {
      ...res.product,
      id: String(res.product.id || res.product._id || res.product.slug),
      slug: String(res.product.slug || res.product.id || ""),
    };
    setProducts((prev) =>
      prev.map((p) => (p.id === id || p.slug === id || p._id === id ? normalized : p))
    );
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await productsApi.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id && p.slug !== id && p._id !== id));
  }, []);

  // ── CATEGORIES ──
  const refreshCategories = useCallback(async () => {
    try {
      const res = await categoriesApi.getAll();
      if (res.success) {
        setCategories(
          res.categories.map((c) => ({
            ...c,
            id: String(c.id || c._id || c.slug),
            slug: String(c.slug || c.id || ""),
          }))
        );
      }
    } catch (e) {
      console.error("Refresh categories error:", e);
    }
  }, []);

  const addCategory = useCallback(async (data: Partial<CategoryData>): Promise<CategoryData> => {
    const res = await categoriesApi.create(data);
    const normalized: CategoryData = {
      ...res.category,
      id: String(res.category.id || res.category._id || res.category.slug),
      slug: String(res.category.slug || res.category.id || ""),
    };
    setCategories((prev) => [...prev, normalized]);
    return normalized;
  }, []);

  const updateCategory = useCallback(async (id: string, data: Partial<CategoryData>) => {
    const res = await categoriesApi.update(id, data);
    const normalized: CategoryData = {
      ...res.category,
      id: String(res.category.id || res.category._id || res.category.slug),
      slug: String(res.category.slug || res.category.id || ""),
    };
    setCategories((prev) =>
      prev.map((c) => (c.id === id || c.slug === id || c._id === id ? normalized : c))
    );
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await categoriesApi.delete(id);
    setCategories((prev) => prev.filter((c) => c.id !== id && c.slug !== id && c._id !== id));
  }, []);

  const reorderCategory = useCallback(async (id: string, direction: "up" | "down") => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === id || c._id === id || c.slug === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;
      return updated.map((c, i) => ({ ...c, order: i }));
    });
  }, []);


  // ── ORDERS ──
  const refreshOrders = useCallback(async () => {
    try {
      const res = await ordersApi.getAll();
      if (res.success) setOrders(res.orders);
    } catch (e) {
      console.error("Refresh orders error:", e);
    }
  }, []);

  const createOrder = useCallback(
    async (data: Partial<OrderData> & { customerPassword?: string; password?: string }): Promise<OrderData> => {
      const res = await ordersApi.create(data);
      setOrders((prev) => [res.order, ...prev]);
      if (res.user) {
        setCurrentUser(res.user);
      } else if (currentUser) {
        setCurrentUser((prev) =>
          prev ? { ...prev, totalOrders: prev.totalOrders + 1, totalSpent: prev.totalSpent + (data.total || 0) } : prev
        );
      }
      return res.order;
    },
    [currentUser]
  );

  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    const res = await ordersApi.updateStatus(id, status);
    setOrders((prev) =>
      prev.map((o) => (o._id === id || o.id === id ? res.order : o))
    );
  }, []);

  // ── SHIPPING ──
  const updateShippingSettings = useCallback(async (data: Partial<ShippingSettingsData>) => {
    const res = await shippingApi.update(data);
    if (res.success) setShippingSettings(res.settings);
  }, []);

  const calculateShipping = useCallback(
    (subtotal: number, selectedState?: string): number => {
      const s = shippingSettings || DEFAULT_SHIPPING;
      if (s.enableFreeThreshold && subtotal >= s.freeShippingThreshold) return 0;
      if (s.shippingType === "flat") return s.flatRate;
      if (s.shippingType === "free_threshold") {
        return subtotal >= s.freeShippingThreshold ? 0 : s.flatRate;
      }
      if (s.shippingType === "state_wise") {
        const stateToCheck = selectedState || userLocation.state;
        if (!stateToCheck) return s.defaultStateRate;
        return s.stateRates[stateToCheck] !== undefined ? s.stateRates[stateToCheck] : s.defaultStateRate;
      }
      return 99;
    },
    [shippingSettings, userLocation.state]
  );

  // ── SETTINGS & CMS ──
  const refreshSettings = useCallback(async () => {
    try {
      const res = await settingsApi.get();
      if (res.success && res.settings) {
        setSiteSettings(res.settings);
      }
    } catch (e) {
      console.error("Refresh settings error:", e);
    }
  }, []);

  const updateSiteSettings = useCallback(async (data: Partial<SiteSettingsData>) => {
    const res = await settingsApi.update(data);
    if (res.success && res.settings) {
      setSiteSettings(res.settings);
    }
  }, []);

  // ── HERO ──
  const refreshHero = useCallback(async () => {
    try {
      const res = await heroApi.get();
      if (res.success) setHeroSlides(res.slides);
    } catch (e) {
      console.error("Refresh hero error:", e);
    }
  }, []);

  const updateHeroSlides = useCallback(async (slides: HeroSlide[]) => {
    await heroApi.update(slides);
    setHeroSlides(slides);
  }, []);

  // ── OFFERS ──
  const updatePrimaryOffer = useCallback((data: Partial<OfferSectionConfig>) => {
    setPrimaryOffer((prev) => {
      const next = { ...prev, ...data };
      try {
        localStorage.setItem("starlight_primary_offer", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const updateSecondaryOffer = useCallback((data: Partial<OfferSectionConfig>) => {
    setSecondaryOffer((prev) => {
      const next = { ...prev, ...data };
      try {
        localStorage.setItem("starlight_secondary_offer", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Listen for storage events across tabs to synchronize active offers immediately
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "starlight_primary_offer" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setPrimaryOffer((prev) => ({ ...prev, ...parsed }));
        } catch {}
      } else if (e.key === "starlight_secondary_offer" && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setSecondaryOffer((prev) => ({ ...prev, ...parsed }));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <DBStoreContext.Provider
      value={{
        products,
        categories,
        orders,
        shippingSettings,
        siteSettings,
        heroSlides,
        currentUser,
        adminUsers,
        primaryOffer,
        secondaryOffer,
        isLoaded,
        isLoadingProducts,
        userLocation,
        isDetectingLocation,
        detectUserLocation,
        setUserLocation,
        loginUser,
        registerUser,
        logoutUser,
        refreshCurrentUser,
        refreshAdminUsers,
        refreshProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategory,
        refreshOrders,
        createOrder,
        updateOrderStatus,
        updateShippingSettings,
        calculateShipping,
        refreshSettings,
        updateSiteSettings,
        refreshHero,
        updateHeroSlides,
        updatePrimaryOffer,
        updateSecondaryOffer,
      }}
    >
      {children}
    </DBStoreContext.Provider>
  );
}

export function useDBStore() {
  const ctx = useContext(DBStoreContext);
  if (!ctx) throw new Error("useDBStore must be used within a DBStoreProvider");
  return ctx;
}
