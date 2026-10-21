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
  UserData,
  ProductData,
  CategoryData,
  OrderData,
  ShippingSettingsData,
  HeroSlide,
} from "@/lib/api";
import {
  DEFAULT_PRIMARY_OFFER,
  DEFAULT_SECONDARY_OFFER,
  OfferSectionConfig,
} from "@/data/soaps";

interface DBStoreContextType {
  // Data
  products: ProductData[];
  categories: CategoryData[];
  orders: OrderData[];
  shippingSettings: ShippingSettingsData | null;
  heroSlides: HeroSlide[];
  currentUser: UserData | null;
  adminUsers: UserData[];
  primaryOffer: OfferSectionConfig;
  secondaryOffer: OfferSectionConfig;
  isLoaded: boolean;
  isLoadingProducts: boolean;

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
  createOrder: (data: Partial<OrderData>) => Promise<OrderData>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;

  // Shipping
  updateShippingSettings: (data: Partial<ShippingSettingsData>) => Promise<void>;
  calculateShipping: (subtotal: number, selectedState?: string) => number;

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

export function DBStoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettingsData | null>(null);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [adminUsers, setAdminUsers] = useState<UserData[]>([]);
  const [primaryOffer, setPrimaryOffer] = useState<OfferSectionConfig>(DEFAULT_PRIMARY_OFFER);
  const [secondaryOffer, setSecondaryOffer] = useState<OfferSectionConfig>(DEFAULT_SECONDARY_OFFER);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Load initial data exclusively from database
  useEffect(() => {
    async function init() {
      try {
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

        // Load products, categories, shipping & hero slides from DB
        let currentProds: ProductData[] = [];
        let currentCats: CategoryData[] = [];

        const [prodRes, catRes, shipRes, heroRes] = await Promise.allSettled([
          productsApi.getAll(),
          categoriesApi.getAll(),
          shippingApi.get(),
          heroApi.get(),
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
      } catch (e) {
        console.error("Store init error:", e);
      } finally {
        setIsLoaded(true);
        setIsLoadingProducts(false);
      }
    }
    init();
  }, []);

  // ── AUTH ──
  const loginUser = useCallback(async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      if (res.success) {
        setCurrentUser(res.user);
        // Load orders and admin users if admin
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
    setOrders([]);
    setAdminUsers([]);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    try {
      const res = await authApi.me();
      if (res.success) setCurrentUser(res.user);
    } catch { /* ignore */ }
  }, []);

  // ── PRODUCTS ──
  const refreshProducts = useCallback(async (filters?: { category?: string; search?: string }) => {
    setIsLoadingProducts(true);
    try {
      const res = await productsApi.getAll(filters);
      if (res.success) {
        setProducts(res.products.map((p) => ({ ...p, id: p.id || p._id || p.slug })));
      }
    } catch (e) {
      console.error("Refresh products error:", e);
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  const addProduct = useCallback(async (data: Partial<ProductData>): Promise<ProductData> => {
    const res = await productsApi.create(data);
    const p = { ...res.product, id: res.product.id || res.product._id || res.product.slug };
    setProducts((prev) => [p, ...prev]);
    return p;
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<ProductData>) => {
    const res = await productsApi.update(id, data);
    const updated = { ...res.product, id: res.product.id || res.product._id || res.product.slug };
    setProducts((prev) =>
      prev.map((p) => (p._id === id || p.id === id ? updated : p))
    );
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    await productsApi.delete(id);
    setProducts((prev) => prev.filter((p) => p._id !== id && p.id !== id));
  }, []);

  // ── CATEGORIES ──
  const refreshCategories = useCallback(async () => {
    try {
      const res = await categoriesApi.getAll();
      if (res.success) {
        setCategories(res.categories.map((c) => ({ ...c, id: c.id || c._id || c.slug })));
      }
    } catch (e) {
      console.error("Refresh categories error:", e);
    }
  }, []);

  const addCategory = useCallback(async (data: Partial<CategoryData>): Promise<CategoryData> => {
    const res = await categoriesApi.create(data);
    const c = { ...res.category, id: res.category.id || res.category._id || res.category.slug };
    setCategories((prev) => [...prev, c]);
    return c;
  }, []);

  const updateCategory = useCallback(async (id: string, data: Partial<CategoryData>) => {
    const res = await categoriesApi.update(id, data);
    setCategories((prev) =>
      prev.map((c) => (c._id === id || c.id === id ? res.category : c))
    );
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    await categoriesApi.delete(id);
    setCategories((prev) => prev.filter((c) => c._id !== id && c.id !== id));
  }, []);

  const reorderCategory = useCallback(async (id: string, direction: "up" | "down") => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c._id === id || c.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      next.forEach((cat, index) => {
        const catId = cat._id || cat.id;
        if (catId) categoriesApi.update(catId, { order: index }).catch(() => {});
      });
      return next;
    });
  }, []);

  // ── ADMIN USERS ──
  const refreshAdminUsers = useCallback(async () => {
    try {
      const res = await adminApi.getUsers();
      if (res.success) setAdminUsers(res.users);
    } catch (e) {
      console.error("Refresh admin users error:", e);
    }
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

  const createOrder = useCallback(async (data: Partial<OrderData>): Promise<OrderData> => {
    const res = await ordersApi.create(data);
    setOrders((prev) => [res.order, ...prev]);
    if (currentUser) {
      setCurrentUser((prev) =>
        prev ? { ...prev, totalOrders: prev.totalOrders + 1, totalSpent: prev.totalSpent + (data.total || 0) } : prev
      );
    }
    return res.order;
  }, [currentUser]);

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
        if (!selectedState) return s.defaultStateRate;
        return s.stateRates[selectedState] !== undefined ? s.stateRates[selectedState] : s.defaultStateRate;
      }
      return 99;
    },
    [shippingSettings]
  );

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
    setPrimaryOffer((prev) => ({ ...prev, ...data }));
  }, []);

  const updateSecondaryOffer = useCallback((data: Partial<OfferSectionConfig>) => {
    setSecondaryOffer((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <DBStoreContext.Provider
      value={{
        products,
        categories,
        orders,
        shippingSettings,
        heroSlides,
        currentUser,
        adminUsers,
        primaryOffer,
        secondaryOffer,
        isLoaded,
        isLoadingProducts,
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
