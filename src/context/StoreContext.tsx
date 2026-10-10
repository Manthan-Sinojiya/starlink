"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  SOAPS,
  CATEGORIES_DATA,
  Soap,
  CategoryStructure,
  ShippingSettings,
  DEFAULT_SHIPPING_SETTINGS,
  OfferSectionConfig,
  DEFAULT_PRIMARY_OFFER,
  DEFAULT_SECONDARY_OFFER,
  UserAccount,
  SEED_USERS,
  Order,
  SEED_ORDERS,
} from "@/data/soaps";

interface StoreContextType {
  products: Soap[];
  categories: CategoryStructure[];
  shippingSettings: ShippingSettings;
  primaryOffer: OfferSectionConfig;
  secondaryOffer: OfferSectionConfig;
  users: UserAccount[];
  currentUser: UserAccount | null;
  orders: Order[];
  isLoaded: boolean;

  // Product Actions
  addProduct: (newSoap: Partial<Soap>) => Soap;
  updateProduct: (id: string, updated: Partial<Soap>) => void;
  deleteProduct: (id: string) => void;

  // Category Actions
  addCategory: (newCat: Partial<CategoryStructure>) => CategoryStructure;
  updateCategory: (id: string, updated: Partial<CategoryStructure>) => void;
  deleteCategory: (id: string) => void;
  reorderCategory: (id: string, direction: "up" | "down") => void;
  reorderCategories: (newOrderedList: CategoryStructure[]) => void;

  // Shipping Actions
  updateShippingSettings: (updated: Partial<ShippingSettings>) => void;
  calculateShipping: (subtotal: number, selectedState?: string) => number;

  // Offer Actions
  updatePrimaryOffer: (updated: Partial<OfferSectionConfig>) => void;
  updateSecondaryOffer: (updated: Partial<OfferSectionConfig>) => void;

  // User & Auth Actions
  registerUser: (userData: Omit<UserAccount, "id" | "createdAt">) => { success: boolean; message: string; user?: UserAccount };
  loginUser: (email: string, password?: string) => { success: boolean; message: string; user?: UserAccount };
  logoutUser: () => void;
  updateUser: (id: string, updated: Partial<UserAccount>) => void;

  // Orders Actions
  createOrder: (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">) => Order;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;

  // Master Reset
  resetToDefaults: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = "starlight_admin_products";
const CATEGORIES_STORAGE_KEY = "starlight_admin_categories";
const SHIPPING_STORAGE_KEY = "starlight_shipping_settings";
const PRIMARY_OFFER_STORAGE_KEY = "starlight_primary_offer";
const SECONDARY_OFFER_STORAGE_KEY = "starlight_secondary_offer";
const USERS_STORAGE_KEY = "starlight_users";
const CURRENT_USER_STORAGE_KEY = "starlight_current_user";
const ORDERS_STORAGE_KEY = "starlight_orders";
const STORE_UPDATED_EVENT = "starlight_store_updated";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Soap[]>(SOAPS);
  const [categories, setCategories] = useState<CategoryStructure[]>(() => {
    return CATEGORIES_DATA.map((cat, idx) => ({
      ...cat,
      order: cat.order ?? idx,
    }));
  });
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(DEFAULT_SHIPPING_SETTINGS);
  const [primaryOffer, setPrimaryOffer] = useState<OfferSectionConfig>(DEFAULT_PRIMARY_OFFER);
  const [secondaryOffer, setSecondaryOffer] = useState<OfferSectionConfig>(DEFAULT_SECONDARY_OFFER);
  const [users, setUsers] = useState<UserAccount[]>(SEED_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  const loadFromStorage = useCallback(() => {
    try {
      // Products
      const savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (savedProducts) {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) setProducts(parsed);
      }

      // Categories
      const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      if (savedCategories) {
        const parsedCats = JSON.parse(savedCategories);
        if (Array.isArray(parsedCats) && parsedCats.length > 0) {
          const sanitizedCats = parsedCats.map((cat, idx) => {
            const defaultMatch = CATEGORIES_DATA.find((c) => c.id === cat.id || c.name === cat.name);
            return {
              ...cat,
              image: cat.image || defaultMatch?.image || "/images/products/dragons-blood.jpg",
              badge: cat.badge || defaultMatch?.badge || "Signature",
              description: cat.description || defaultMatch?.description || "",
              slug: cat.slug || defaultMatch?.slug || cat.id,
              order: typeof cat.order === "number" ? cat.order : idx,
            };
          });
          const sorted = [...sanitizedCats].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setCategories(sorted);
        }
      }

      // Shipping Settings
      const savedShipping = localStorage.getItem(SHIPPING_STORAGE_KEY);
      if (savedShipping) {
        const parsedShipping = JSON.parse(savedShipping);
        setShippingSettings(parsedShipping);
      }

      // Offers
      const savedPrimaryOffer = localStorage.getItem(PRIMARY_OFFER_STORAGE_KEY);
      if (savedPrimaryOffer) setPrimaryOffer(JSON.parse(savedPrimaryOffer));

      const savedSecondaryOffer = localStorage.getItem(SECONDARY_OFFER_STORAGE_KEY);
      if (savedSecondaryOffer) {
        const parsedSecondary = JSON.parse(savedSecondaryOffer);
        if (parsedSecondary && Array.isArray(parsedSecondary.bars)) {
          // Repair broken/nonexistent images from older seeds
          parsedSecondary.bars = parsedSecondary.bars.map((bar: any, bIdx: number) => {
            if (bar.image?.includes("turmeric-glow.jpg")) {
              return { ...bar, image: "/images/products/terracotta-orange.jpg" };
            }
            if (bar.image?.includes("golden-honey.jpg")) {
              return { ...bar, image: "/images/products/damask-rose.jpg" };
            }
            return bar;
          });
        }
        setSecondaryOffer(parsedSecondary);
      }

      // Users
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) setUsers(parsedUsers);
      }

      // Current User
      const savedCurrentUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (savedCurrentUser) setCurrentUser(JSON.parse(savedCurrentUser));

      // Orders
      const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders);
        if (Array.isArray(parsedOrders) && parsedOrders.length > 0) setOrders(parsedOrders);
      }
    } catch (e) {
      console.error("Failed to load store from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFromStorage();

    const handleStorageChange = () => {
      loadFromStorage();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(STORE_UPDATED_EVENT, handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(STORE_UPDATED_EVENT, handleStorageChange);
    };
  }, [loadFromStorage]);

  const notifyStoreUpdated = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(STORE_UPDATED_EVENT));
    }
  };

  // ==========================================
  // PRODUCTS CRUD
  // ==========================================
  const addProduct = (productData: Partial<Soap>): Soap => {
    const rawName = (productData.name || "Handcrafted Botanical Bar").trim();
    const rawSlug = (productData.slug || rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();
    const uniqueId = rawSlug || `soap-${Date.now()}`;

    let weightDisplay = productData.weight || "125g / 4.4 oz";
    if (productData.weightValue && productData.weightUnit) {
      if (productData.weightUnit === "kg") {
        weightDisplay = `${productData.weightValue} kg (${(productData.weightValue * 1000).toFixed(0)}g)`;
      } else {
        weightDisplay = `${productData.weightValue}g / ${(productData.weightValue * 0.035274).toFixed(1)} oz`;
      }
    }

    const newProduct: Soap = {
      id: uniqueId,
      slug: rawSlug,
      name: rawName,
      tagline: productData.tagline || "Artisanal small-batch cold process soap",
      mainCategory: productData.mainCategory || (categories[1]?.id || "Face & Gentle Cleansing"),
      subCategory: productData.subCategory || "Artisanal Specialty",
      category: productData.category || "glow",
      price: Number(productData.price) || 499,
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 1,
      weight: weightDisplay,
      weightValue: productData.weightValue ? Number(productData.weightValue) : undefined,
      weightUnit: productData.weightUnit || "g",
      taxType: productData.taxType || "inclusive",
      taxRate: productData.taxRate !== undefined ? Number(productData.taxRate) : 18,
      cureTime: productData.cureTime || "Cold Cured 6 Weeks",
      badge: productData.badge,
      fragranceNotes: productData.fragranceNotes || ["Damask Rose", "Mysore Sandalwood"],
      scentPyramid: productData.scentPyramid || {
        top: ["Citrus Blossom"],
        heart: ["Velvet Rose"],
        base: ["Sandalwood"],
      },
      keyIngredients: productData.keyIngredients || ["Olive Oil", "Shea Butter"],
      fullIngredients: productData.fullIngredients || ["Saponified Olive Oil, Shea Butter, Pure Botanical Essential Oils"],
      skinType: productData.skinType || "All Skin Types",
      soapBenefits: productData.soapBenefits || ["Gently cleanses", "Preserves moisture barrier", "Rich velvet lather"],
      ritualHowToUse: productData.ritualHowToUse || "Lather between warm hands, massage gently over damp skin, and rinse thoroughly.",
      description: productData.description || "Crafted using classical cold process saponification methods.",
      image: productData.image || "/images/products/dragons-blood.jpg",
      inStock: productData.inStock !== false,
      isBestseller: !!productData.isBestseller,
      isFestive: !!productData.isFestive,
      metaTitle: productData.metaTitle,
      metaDescription: productData.metaDescription,
      metaKeywords: productData.metaKeywords,
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)];
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    notifyStoreUpdated();
    return newProduct;
  };

  const updateProduct = (id: string, updated: Partial<Soap>) => {
    setProducts((prev) => {
      const updatedList = prev.map((p) => {
        if (p.id === id) {
          let weightDisplay = updated.weight || p.weight;
          if (updated.weightValue && updated.weightUnit) {
            if (updated.weightUnit === "kg") {
              weightDisplay = `${updated.weightValue} kg (${(updated.weightValue * 1000).toFixed(0)}g)`;
            } else {
              weightDisplay = `${updated.weightValue}g / ${(updated.weightValue * 0.035274).toFixed(1)} oz`;
            }
          }
          return {
            ...p,
            ...updated,
            weight: weightDisplay,
          };
        }
        return p;
      });
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    });

    notifyStoreUpdated();
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const list = prev.filter((p) => p.id !== id);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(list));
      return list;
    });

    notifyStoreUpdated();
  };

  // ==========================================
  // CATEGORIES CRUD & ORDER SEQUENCING
  // ==========================================
  const addCategory = (categoryData: Partial<CategoryStructure>): CategoryStructure => {
    const rawName = (categoryData.name || "Specialty Collection").trim();
    const rawId = (categoryData.id || rawName.toLowerCase().replace(/[^a-z0-9]+/g, "-")).trim();

    const newCategory: CategoryStructure = {
      id: rawId,
      name: rawName,
      slug: categoryData.slug || rawId,
      description: categoryData.description || "",
      image: categoryData.image || "/images/products/dragons-blood.jpg",
      badge: categoryData.badge || "Signature",
      subcategories: categoryData.subcategories && categoryData.subcategories.length > 0
        ? categoryData.subcategories
        : [],
      order: typeof categoryData.order === "number" ? categoryData.order : categories.length,
      metaTitle: categoryData.metaTitle,
      metaDescription: categoryData.metaDescription,
      metaKeywords: categoryData.metaKeywords,
    };

    setCategories((prev) => {
      const updated = [...prev, newCategory];
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    notifyStoreUpdated();
    return newCategory;
  };

  const updateCategory = (id: string, updated: Partial<CategoryStructure>) => {
    setCategories((prev) => {
      const updatedList = prev.map((c) => {
        if (c.id === id) {
          return { ...c, ...updated };
        }
        return c;
      });
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    });

    notifyStoreUpdated();
  };

  const deleteCategory = (id: string) => {
    if (id === "all") return;
    setCategories((prev) => {
      const list = prev.filter((c) => c.id !== id);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(list));
      return list;
    });

    notifyStoreUpdated();
  };

  const reorderCategory = (id: string, direction: "up" | "down") => {
    if (id === "all") return;

    setCategories((prev) => {
      const nonAll = prev.filter((c) => c.id !== "all");
      const allCategory = prev.find((c) => c.id === "all");
      const index = nonAll.findIndex((c) => c.id === id);

      if (index === -1) return prev;
      if (direction === "up" && index === 0) return prev;
      if (direction === "down" && index === nonAll.length - 1) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      const reordered = [...nonAll];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(targetIndex, 0, moved);

      const finalCategories = [
        ...(allCategory ? [{ ...allCategory, order: 0 }] : []),
        ...reordered.map((cat, idx) => ({
          ...cat,
          order: idx + 1,
        })),
      ];

      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(finalCategories));
      return finalCategories;
    });

    notifyStoreUpdated();
  };

  const reorderCategories = (newOrderedList: CategoryStructure[]) => {
    const updated = newOrderedList.map((cat, idx) => ({
      ...cat,
      order: idx,
    }));
    setCategories(updated);
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updated));
    notifyStoreUpdated();
  };

  // ==========================================
  // SHIPPING CONFIGURATION & STATE-WISE LOGIC
  // ==========================================
  const updateShippingSettings = (updated: Partial<ShippingSettings>) => {
    setShippingSettings((prev) => {
      const merged = { ...prev, ...updated };
      localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
    notifyStoreUpdated();
  };

  const calculateShipping = (subtotal: number, selectedState?: string): number => {
    // If free shipping threshold is active and subtotal qualifies
    if (shippingSettings.enableFreeThreshold && subtotal >= shippingSettings.freeShippingThreshold) {
      return 0;
    }

    if (shippingSettings.shippingType === "flat") {
      return shippingSettings.flatRate;
    }

    if (shippingSettings.shippingType === "free_threshold") {
      return subtotal >= shippingSettings.freeShippingThreshold ? 0 : shippingSettings.flatRate;
    }

    // State-wise calculation
    if (shippingSettings.shippingType === "state_wise") {
      if (!selectedState) return shippingSettings.defaultStateRate;
      return shippingSettings.stateRates[selectedState] !== undefined
        ? shippingSettings.stateRates[selectedState]
        : shippingSettings.defaultStateRate;
    }

    return 99;
  };

  // ==========================================
  // OFFERS & PROMOTIONS MANAGEMENT
  // ==========================================
  const updatePrimaryOffer = (updated: Partial<OfferSectionConfig>) => {
    setPrimaryOffer((prev) => {
      const merged = { ...prev, ...updated };
      localStorage.setItem(PRIMARY_OFFER_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
    notifyStoreUpdated();
  };

  const updateSecondaryOffer = (updated: Partial<OfferSectionConfig>) => {
    setSecondaryOffer((prev) => {
      const merged = { ...prev, ...updated };
      localStorage.setItem(SECONDARY_OFFER_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    });
    notifyStoreUpdated();
  };

  // ==========================================
  // USER REGISTRATION & AUTH
  // ==========================================
  const registerUser = (userData: Omit<UserAccount, "id" | "createdAt">): { success: boolean; message: string; user?: UserAccount } => {
    const existing = users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      return { success: false, message: "An account with this email already exists. Please sign in." };
    }

    const newUser: UserAccount = {
      ...userData,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
    };

    setUsers((prev) => {
      const updated = [newUser, ...prev];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    setCurrentUser(newUser);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));
    notifyStoreUpdated();

    return { success: true, message: "Account created successfully! Welcome to Star Light Co.", user: newUser };
  };

  const loginUser = (email: string, password?: string): { success: boolean; message: string; user?: UserAccount } => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: "No account found with this email address. Please register." };
    }

    setCurrentUser(found);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(found));
    notifyStoreUpdated();

    return { success: true, message: `Welcome back, ${found.name}!`, user: found };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    notifyStoreUpdated();
  };

  const updateUser = (id: string, updated: Partial<UserAccount>) => {
    setUsers((prev) => {
      const list = prev.map((u) => (u.id === id ? { ...u, ...updated } : u));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
      return list;
    });
    if (currentUser?.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updated } : null));
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify({ ...currentUser, ...updated }));
    }
    notifyStoreUpdated();
  };

  // ==========================================
  // ORDERS MANAGEMENT
  // ==========================================
  const createOrder = (orderData: Omit<Order, "id" | "orderNumber" | "createdAt">): Order => {
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: `STL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    // Update user stats if registered
    if (orderData.customerEmail) {
      setUsers((prev) => {
        const updatedUsers = prev.map((u) => {
          if (u.email.toLowerCase() === orderData.customerEmail.toLowerCase()) {
            return {
              ...u,
              totalOrders: (u.totalOrders || 0) + 1,
              totalSpent: (u.totalSpent || 0) + orderData.total,
            };
          }
          return u;
        });
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
        return updatedUsers;
      });
    }

    notifyStoreUpdated();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    notifyStoreUpdated();
  };

  // ==========================================
  // MASTER RESET
  // ==========================================
  const resetToDefaults = () => {
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    localStorage.removeItem(CATEGORIES_STORAGE_KEY);
    localStorage.removeItem(SHIPPING_STORAGE_KEY);
    localStorage.removeItem(PRIMARY_OFFER_STORAGE_KEY);
    localStorage.removeItem(SECONDARY_OFFER_STORAGE_KEY);
    localStorage.removeItem(USERS_STORAGE_KEY);
    localStorage.removeItem(ORDERS_STORAGE_KEY);

    setProducts(SOAPS);
    setCategories(
      CATEGORIES_DATA.map((cat, idx) => ({
        ...cat,
        order: idx,
      }))
    );
    setShippingSettings(DEFAULT_SHIPPING_SETTINGS);
    setPrimaryOffer(DEFAULT_PRIMARY_OFFER);
    setSecondaryOffer(DEFAULT_SECONDARY_OFFER);
    setUsers(SEED_USERS);
    setOrders(SEED_ORDERS);

    notifyStoreUpdated();
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        shippingSettings,
        primaryOffer,
        secondaryOffer,
        users,
        currentUser,
        orders,
        isLoaded,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategory,
        reorderCategories,
        updateShippingSettings,
        calculateShipping,
        updatePrimaryOffer,
        updateSecondaryOffer,
        registerUser,
        loginUser,
        logoutUser,
        updateUser,
        createOrder,
        updateOrderStatus,
        resetToDefaults,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
