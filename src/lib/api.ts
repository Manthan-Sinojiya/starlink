/**
 * API client for all backend calls.
 * Automatically attaches the JWT token from localStorage.
 */

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("starlight_jwt");
}

function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("starlight_jwt", token);
  }
}

function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("starlight_jwt");
  }
}

async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(path, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data as T;
}

// FormData upload (no Content-Type so browser sets multipart boundary)
async function apiUpload(
  path: string,
  formData: FormData
): Promise<{ success: boolean; url: string; publicId: string; alt: string }> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(path, { method: "POST", body: formData, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data;
}

// ───────────────────────── AUTH ─────────────────────────
export const authApi = {
  async login(email: string, password: string) {
    const data = await apiFetch<{
      success: boolean; message: string; token: string;
      user: UserData;
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (data.token) saveToken(data.token);
    return data;
  },

  async register(userData: {
    name: string; email: string; password: string;
    phone?: string; address?: string; state?: string; pincode?: string;
  }) {
    const data = await apiFetch<{
      success: boolean; message: string; token: string;
      user: UserData;
    }>("/api/auth/register", { method: "POST", body: JSON.stringify(userData) });
    if (data.token) saveToken(data.token);
    return data;
  },

  async me() {
    return apiFetch<{ success: boolean; user: UserData }>("/api/auth/me");
  },

  async updateMe(data: Partial<UserData>) {
    return apiFetch<{ success: boolean; user: UserData }>("/api/auth/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async logout() {
    clearToken();
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  },

  getToken,
  saveToken,
  clearToken,
};

// ───────────────────────── PRODUCTS ─────────────────────────
export const productsApi = {
  async getAll(filters?: { category?: string; search?: string; bestseller?: boolean; festive?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.category) params.set("category", filters.category);
    if (filters?.search) params.set("search", filters.search);
    if (filters?.bestseller) params.set("bestseller", "true");
    if (filters?.festive) params.set("festive", "true");
    return apiFetch<{ success: boolean; products: ProductData[] }>(
      `/api/products?${params.toString()}`
    );
  },

  async getOne(id: string) {
    return apiFetch<{ success: boolean; product: ProductData }>(`/api/products/${id}`);
  },

  async create(data: Partial<ProductData>) {
    return apiFetch<{ success: boolean; product: ProductData }>("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<ProductData>) {
    return apiFetch<{ success: boolean; product: ProductData }>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return apiFetch<{ success: boolean; message: string }>(`/api/products/${id}`, {
      method: "DELETE",
    });
  },
};

// ───────────────────────── CATEGORIES ─────────────────────────
export const categoriesApi = {
  async getAll() {
    return apiFetch<{ success: boolean; categories: CategoryData[] }>("/api/categories");
  },

  async create(data: Partial<CategoryData>) {
    return apiFetch<{ success: boolean; category: CategoryData }>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<CategoryData>) {
    return apiFetch<{ success: boolean; category: CategoryData }>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async delete(id: string) {
    return apiFetch<{ success: boolean; message: string }>(`/api/categories/${id}`, {
      method: "DELETE",
    });
  },
};

// ───────────────────────── ORDERS ─────────────────────────
export const ordersApi = {
  async getAll() {
    return apiFetch<{ success: boolean; orders: OrderData[] }>("/api/orders");
  },

  async getOne(id: string) {
    return apiFetch<{ success: boolean; order: OrderData }>(`/api/orders/${id}`);
  },

  async create(data: Partial<OrderData>) {
    return apiFetch<{ success: boolean; order: OrderData }>("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async updateStatus(id: string, status: string) {
    return apiFetch<{ success: boolean; order: OrderData }>(`/api/orders/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  },
};

// ───────────────────────── PAYMENTS ─────────────────────────
export const paymentApi = {
  async createOrder(amount: number, receipt?: string) {
    return apiFetch<{
      success: boolean; orderId: string; amount: number; currency: string; keyId: string;
    }>("/api/payment/create-order", {
      method: "POST",
      body: JSON.stringify({ amount, receipt }),
    });
  },

  async verifyPayment(data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    orderId: string;
  }) {
    return apiFetch<{ success: boolean; message: string; order: OrderData }>(
      "/api/payment/verify",
      { method: "POST", body: JSON.stringify(data) }
    );
  },
};

// ───────────────────────── HERO ─────────────────────────
export const heroApi = {
  async get() {
    return apiFetch<{ success: boolean; slides: HeroSlide[] }>("/api/hero");
  },

  async update(slides: HeroSlide[]) {
    return apiFetch<{ success: boolean; hero: unknown }>("/api/hero", {
      method: "PUT",
      body: JSON.stringify({ slides }),
    });
  },
};

// ───────────────────────── UPLOAD ─────────────────────────
export const uploadApi = {
  async uploadImage(file: File, folder = "starlight/products", alt = "") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("alt", alt);
    return apiUpload("/api/upload", formData);
  },
};

// ───────────────────────── SHIPPING ─────────────────────────
export const shippingApi = {
  async get() {
    return apiFetch<{ success: boolean; settings: ShippingSettingsData }>("/api/shipping");
  },

  async update(data: Partial<ShippingSettingsData>) {
    return apiFetch<{ success: boolean; settings: ShippingSettingsData }>("/api/shipping", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ───────────────────────── ADMIN ─────────────────────────
export const adminApi = {
  async getUsers() {
    return apiFetch<{ success: boolean; users: UserData[] }>("/api/admin/users");
  },

  async seedDatabase() {
    return apiFetch<{ success: boolean; message: string }>("/api/admin/seed");
  },
};

// ───────────────────────── TYPE DEFINITIONS ─────────────────────────
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  phone?: string;
  address?: string;
  state?: string;
  pincode?: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

export interface ProductData {
  _id?: string;
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  mainCategory: string;
  subCategory?: string;
  category?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  weight?: string;
  weightValue?: number;
  weightUnit?: string;
  taxType?: string;
  taxRate?: number;
  cureTime?: string;
  badge?: string;
  fragranceNotes?: string[];
  scentPyramid?: { top: string[]; heart: string[]; base: string[] };
  keyIngredients?: string[];
  fullIngredients?: string[];
  skinType?: string;
  soapBenefits?: string[];
  ritualHowToUse?: string;
  description: string;
  image: string;
  imagePublicId?: string;
  imageAlt?: string;
  gallery?: Array<{ url: string; publicId?: string; alt?: string }>;
  inStock: boolean;
  isBestseller: boolean;
  isFestive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[] | string;
  createdAt?: string;
}

export interface CategoryData {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string | null;
  image: string;
  imagePublicId?: string;
  imageAlt?: string;
  bannerImage?: string;
  bannerImagePublicId?: string;
  bannerHeadline?: string;
  bannerSubheadline?: string;
  badge?: string;
  subcategories: string[];
  order: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  imageAlt?: string;
  price: number;
  quantity: number;
  weight?: string;
}

export interface OrderData {
  _id?: string;
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  shippingCost?: number;
  taxAmount?: number;
  total: number;
  shippingState?: string;
  shippingAddress?: string;
  shippingPincode?: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled" | "Processing";
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded";
  paymentMethod: "razorpay" | "cod" | string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt?: string;
}

export interface HeroSlide {
  id: string;
  headline: string;
  subheadline?: string;
  description?: string;
  image: string;
  imagePublicId?: string;
  imageAlt: string;
  ctaText?: string;
  ctaLink?: string;
  badge?: string;
  isActive: boolean;
  order: number;
}

export interface ShippingSettingsData {
  shippingType: "flat" | "free_threshold" | "state_wise";
  flatRate: number;
  freeShippingThreshold: number;
  enableFreeThreshold: boolean;
  defaultStateRate: number;
  stateRates: Record<string, number>;
}
