"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Package,
  Receipt,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Search,
  RefreshCw,
  X,
  Upload,
  Globe,
  Truck,
  Users,
  ShoppingBag,
  DollarSign,
  Gift,
  Menu,
  TrendingUp,
  LayoutGrid,
  List,
  Check,
  Printer,
} from "lucide-react";
import { useDBStore } from "@/context/DBStoreContext";
import ImageUpload from "@/components/ImageUpload";
import TaxInvoiceModal from "@/components/TaxInvoiceModal";
import { adminApi, HeroSlide } from "@/lib/api";
import { Soap, CategoryStructure, INDIAN_STATES, Order } from "@/data/soaps";

const PRESET_IMAGES = [
  { name: "Dragon's Blood Bar", url: "/images/products/dragons-blood.jpg" },
  { name: "Charcoal & Kaolin Clay", url: "/images/products/charcoal-clay.jpg" },
  { name: "Lavender & French Clay", url: "/images/products/lavender-silk.jpg" },
  { name: "Kashmiri Saffron & Honey", url: "/images/products/saffron-honey.jpg" },
  { name: "Damask Rose & French Pink Clay", url: "/images/products/damask-rose.jpg" },
  { name: "Terracotta Citrus Orange", url: "/images/products/terracotta-orange.jpg" },
  { name: "Eucalyptus Mint Therapy", url: "/images/products/eucalyptus-mint.jpg" },
  { name: "Sacred Oud & Sandalwood", url: "/images/products/oud-sandalwood.jpg" },
  { name: "Festive Collector Box", url: "/images/products/festive-box.jpg" },
];

export default function AdminPage() {
  const {
    products,
    categories,
    shippingSettings,
    primaryOffer,
    secondaryOffer,
    adminUsers,
    orders,
    heroSlides,
    currentUser,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategory,
    updateShippingSettings,
    updateHeroSlides,
    updatePrimaryOffer,
    updateSecondaryOffer,
    updateOrderStatus,
    refreshProducts,
    refreshCategories,
    refreshHero,
    refreshOrders,
    refreshAdminUsers,
    loginUser,
  } = useDBStore();

  const users = adminUsers || [];

  const resetToDefaults = async () => {
    try {
      await adminApi.seedDatabase();
      await Promise.allSettled([
        refreshProducts(),
        refreshCategories(),
        refreshHero(),
        refreshOrders(),
        refreshAdminUsers(),
      ]);
      showNotification("Store reset to factory default data.");
    } catch {
      showNotification("Failed to reset store", "error");
    }
  };

  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "categories" | "hero" | "shipping" | "offers" | "orders" | "users"
  >("overview");

  // Mobile sidebar drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Notification Toast (strictly no alert popups)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const showNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Confirmation Modal state (strictly no browser confirm popups)
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  // Fix: Prevent mouse wheel from auto-changing number input values
  useEffect(() => {
    const handleWheel = () => {
      if (document.activeElement instanceof HTMLInputElement && document.activeElement.type === "number") {
        document.activeElement.blur();
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Product View Mode & Filters
  const [productViewMode, setProductViewMode] = useState<"table" | "cards">("cards");
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [taxFilter, setTaxFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");

  // FULL-PAGE PRODUCT FORM STATE (No popup modal)
  const [isProductEditing, setIsProductEditing] = useState(false);
  const [productFormMode, setProductFormMode] = useState<"add" | "edit">("add");
  const [productStep, setProductStep] = useState<1 | 2 | 3 | 4>(1);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Product Form Fields
  const [prodName, setProdName] = useState("");
  const [prodSlug, setProdSlug] = useState("");
  const [prodTagline, setProdTagline] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodSubCategory, setProdSubCategory] = useState("");
  const [prodPrice, setProdPrice] = useState<number>(499);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number | undefined>(699);
  const [prodWeightValue, setProdWeightValue] = useState<number>(125);
  const [prodWeightUnit, setProdWeightUnit] = useState<"g" | "kg">("g");
  const [prodTaxType, setProdTaxType] = useState<"inclusive" | "exclusive">("inclusive");
  const [prodTaxRate, setProdTaxRate] = useState<number>(18);
  const [prodDescription, setProdDescription] = useState("");
  const [prodCureTime, setProdCureTime] = useState("Cold Cured 6 Weeks");
  const [prodSkinType, setProdSkinType] = useState("All Skin Types • Gentle");
  const [prodTopNotes, setProdTopNotes] = useState("");
  const [prodHeartNotes, setProdHeartNotes] = useState("");
  const [prodBaseNotes, setProdBaseNotes] = useState("");
  const [prodBenefits, setProdBenefits] = useState("");
  const [prodIngredients, setProdIngredients] = useState("");
  const [prodRitual, setProdRitual] = useState("");
  const [prodImage, setProdImage] = useState("/images/products/dragons-blood.jpg");
  const [prodBadge, setProdBadge] = useState("");
  const [prodInStock, setProdInStock] = useState(true);
  const [prodIsBestseller, setProdIsBestseller] = useState(false);
  const [prodIsFestive, setProdIsFestive] = useState(false);

  // Product SEO Fields
  const [prodMetaTitle, setProdMetaTitle] = useState("");
  const [prodMetaDescription, setProdMetaDescription] = useState("");
  const [prodMetaKeywords, setProdMetaKeywords] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // FULL-PAGE CATEGORY FORM STATE (No popup modal)
  const [isCategoryEditing, setIsCategoryEditing] = useState(false);
  const [categoryFormMode, setCategoryFormMode] = useState<"add" | "edit">("add");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catParentCategory, setCatParentCategory] = useState("");
  const [catImage, setCatImage] = useState("/images/products/dragons-blood.jpg");
  const [catBannerImage, setCatBannerImage] = useState("/images/products/dragons-blood.jpg");
  const [catBannerHeadline, setCatBannerHeadline] = useState("");
  const [catBannerSubheadline, setCatBannerSubheadline] = useState("");
  const [catBadge, setCatBadge] = useState("");
  const [catSubcategories, setCatSubcategories] = useState("");
  const [catMetaTitle, setCatMetaTitle] = useState("");
  const [catMetaDescription, setCatMetaDescription] = useState("");
  const [catMetaKeywords, setCatMetaKeywords] = useState("");
  const catFileInputRef = useRef<HTMLInputElement>(null);
  const catBannerFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  // Shipping Tab State
  const [shippingTypeInput, setShippingTypeInput] = useState(shippingSettings?.shippingType ?? "flat");
  // Shipping Tab Form State
  const [flatRateInput, setFlatRateInput] = useState(shippingSettings?.flatRate ?? 99);
  const [freeThresholdInput, setFreeThresholdInput] = useState(shippingSettings?.freeShippingThreshold ?? 999);
  const [enableFreeThresholdInput, setEnableFreeThresholdInput] = useState(shippingSettings?.enableFreeThreshold ?? true);
  const [defaultStateRateInput, setDefaultStateRateInput] = useState(shippingSettings?.defaultStateRate ?? 99);
  const [stateRatesInput, setStateRatesInput] = useState<Record<string, number>>(shippingSettings?.stateRates ?? {});
  const [stateSearchFilter, setStateSearchFilter] = useState("");

  useEffect(() => {
    if (shippingSettings) {
      setShippingTypeInput(shippingSettings.shippingType || "flat");
      setFlatRateInput(shippingSettings.flatRate);
      setFreeThresholdInput(shippingSettings.freeShippingThreshold);
      setEnableFreeThresholdInput(shippingSettings.enableFreeThreshold);
      setDefaultStateRateInput(shippingSettings.defaultStateRate);
      setStateRatesInput(shippingSettings.stateRates || {});
    }
  }, [shippingSettings]);

  // Hero Slide Form State
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlide | null>(null);
  const [heroFormHeadline, setHeroFormHeadline] = useState("");
  const [heroFormSubheadline, setHeroFormSubheadline] = useState("");
  const [heroFormDescription, setHeroFormDescription] = useState("");
  const [heroFormImage, setHeroFormImage] = useState("/images/products/dragons-blood.jpg");
  const [heroFormImageAlt, setHeroFormImageAlt] = useState("");
  const [heroFormBadge, setHeroFormBadge] = useState("Best Seller");
  const [heroFormCtaText, setHeroFormCtaText] = useState("Claim Your Bar");
  const [heroFormCtaLink, setHeroFormCtaLink] = useState("/#all-soaps");
  const [heroFormIsActive, setHeroFormIsActive] = useState(true);
  const [heroFormOrder, setHeroFormOrder] = useState(0);

  const handleOpenAddHero = () => {
    setEditingHeroSlide(null);
    setHeroFormHeadline("");
    setHeroFormSubheadline("");
    setHeroFormDescription("");
    setHeroFormImage(PRESET_IMAGES[0]?.url || "/images/products/dragons-blood.jpg");
    setHeroFormImageAlt("");
    setHeroFormBadge("Signature");
    setHeroFormCtaText("Claim Your Bar");
    setHeroFormCtaLink("/#all-soaps");
    setHeroFormIsActive(true);
    setHeroFormOrder(heroSlides?.length || 0);
    setIsHeroModalOpen(true);
  };

  const handleOpenEditHero = (slide: HeroSlide) => {
    setEditingHeroSlide(slide);
    setHeroFormHeadline(slide.headline || "");
    setHeroFormSubheadline(slide.subheadline || "");
    setHeroFormDescription(slide.description || "");
    setHeroFormImage(slide.image || PRESET_IMAGES[0]?.url || "");
    setHeroFormImageAlt(slide.imageAlt || "");
    setHeroFormBadge(slide.badge || "Signature");
    setHeroFormCtaText(slide.ctaText || "Claim Your Bar");
    setHeroFormCtaLink(slide.ctaLink || "/#all-soaps");
    setHeroFormIsActive(slide.isActive !== false);
    setHeroFormOrder(slide.order ?? 0);
    setIsHeroModalOpen(true);
  };

  const handleSaveHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroFormHeadline.trim()) {
      showNotification("Please provide a headline for the hero slide", "error");
      return;
    }
    if (!heroFormImage.trim()) {
      showNotification("Please select or upload an image", "error");
      return;
    }

    const slideData: HeroSlide = {
      id: editingHeroSlide ? editingHeroSlide.id : `slide-${Date.now()}`,
      headline: heroFormHeadline.trim(),
      subheadline: heroFormSubheadline.trim(),
      description: heroFormDescription.trim(),
      image: heroFormImage.trim(),
      imageAlt: heroFormImageAlt.trim() || heroFormHeadline.trim(),
      badge: heroFormBadge.trim() || "Signature",
      ctaText: heroFormCtaText.trim() || "Claim Your Bar",
      ctaLink: heroFormCtaLink.trim() || "/#all-soaps",
      isActive: heroFormIsActive,
      order: heroFormOrder,
    };

    let updatedSlides: HeroSlide[];
    if (editingHeroSlide) {
      updatedSlides = (heroSlides || []).map((s) => (s.id === editingHeroSlide.id ? slideData : s));
    } else {
      updatedSlides = [...(heroSlides || []), slideData];
    }

    try {
      await updateHeroSlides(updatedSlides);
      showNotification(editingHeroSlide ? "Hero slide updated successfully" : "New hero slide published to homepage");
      setIsHeroModalOpen(false);
    } catch {
      showNotification("Failed to save hero slide", "error");
    }
  };

  const handleDeleteHeroSlide = (id: string) => {
    setConfirmModal({
      title: "Delete Hero Slide",
      message: "Are you sure you want to remove this slide from the homepage rotation?",
      confirmLabel: "Delete Slide",
      onConfirm: async () => {
        const updated = (heroSlides || []).filter((s) => s.id !== id);
        try {
          await updateHeroSlides(updated);
          showNotification("Hero slide deleted successfully");
        } catch {
          showNotification("Failed to delete slide", "error");
        }
      },
    });
  };

  const handleToggleHeroSlideActive = async (slide: HeroSlide) => {
    const updated = (heroSlides || []).map((s) => (s.id === slide.id ? { ...s, isActive: !s.isActive } : s));
    try {
      await updateHeroSlides(updated);
      showNotification(`Hero slide is now ${!slide.isActive ? "active" : "hidden"}`);
    } catch {
      showNotification("Failed to update slide status", "error");
    }
  };

  const handleMoveHeroSlide = async (index: number, direction: "up" | "down") => {
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= (heroSlides || []).length) return;
    const copy = [...(heroSlides || [])];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    const reordered = copy.map((s, idx) => ({ ...s, order: idx }));
    try {
      await updateHeroSlides(reordered);
      showNotification("Hero slides reordered");
    } catch {
      showNotification("Failed to reorder slides", "error");
    }
  };

  // Orders Tab State
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<any | null>(null);

  // Customers Filter
  const [userSearchQuery, setUserSearchQuery] = useState("");

  // Helper slugify
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Image Upload Handler (FileReader base64 Data URL)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file (PNG, JPG, WebP).", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setProdImage(dataUrl);
        showNotification("Image uploaded and loaded into preview! ✨");
      }
    };
    reader.readAsDataURL(file);
  };

  // Category Image Upload Handler (FileReader base64 Data URL)
  const handleCatImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file (PNG, JPG, WebP).", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCatImage(dataUrl);
        showNotification("Category image uploaded successfully! ✨");
      }
    };
    reader.readAsDataURL(file);
  };

  // Category Banner Image Upload Handler
  const handleCatBannerImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file (PNG, JPG, WebP).", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCatBannerImage(dataUrl);
        showNotification("Category banner image uploaded successfully! ✨");
      }
    };
    reader.readAsDataURL(file);
  };

  // Hero Slide Image Upload Handler (FileReader base64 Data URL)
  const handleHeroImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showNotification("Please select a valid image file (PNG, JPG, WebP).", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setHeroFormImage(dataUrl);
        showNotification("Hero banner image uploaded successfully! ✨");
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Full-Page Form for Add Product
  const handleOpenAddProduct = () => {
    setProductFormMode("add");
    setEditingProductId(null);
    setProductStep(1);
    setProdName("");
    setProdSlug("");
    setProdTagline("");
    setProdCategory(categories[0]?.name || "Face & Gentle Cleansing");
    setProdSubCategory("");
    setProdPrice(499);
    setProdOriginalPrice(undefined);
    setProdWeightValue(125);
    setProdWeightUnit("g");
    setProdTaxType("inclusive");
    setProdTaxRate(18);
    setProdDescription("");
    setProdCureTime("");
    setProdSkinType("");
    setProdTopNotes("");
    setProdHeartNotes("");
    setProdBaseNotes("");
    setProdBenefits("");
    setProdIngredients("");
    setProdRitual("");
    setProdImage(PRESET_IMAGES[0].url);
    setProdBadge("");
    setProdInStock(true);
    setProdIsBestseller(false);
    setProdIsFestive(false);
    setProdMetaTitle("");
    setProdMetaDescription("");
    setProdMetaKeywords("");
    setIsProductEditing(true);
    setActiveTab("products");
  };

  // Open Full-Page Form for Edit Product
  const handleOpenEditProduct = (soap: any) => {
    setProductFormMode("edit");
    setEditingProductId(soap.id || soap._id);
    setProductStep(1);
    setProdName(soap.name);
    setProdSlug(soap.slug || soap.id || soap._id);
    setProdTagline(soap.tagline || "");
    setProdCategory(soap.mainCategory);
    setProdSubCategory(soap.subCategory);
    setProdPrice(soap.price);
    setProdOriginalPrice(soap.originalPrice);
    setProdWeightValue(soap.weightValue || 125);
    setProdWeightUnit(soap.weightUnit || "g");
    setProdTaxType(soap.taxType || "inclusive");
    setProdTaxRate(soap.taxRate !== undefined ? soap.taxRate : 18);
    setProdDescription(soap.description);
    setProdCureTime(soap.cureTime || "Cold Cured 6 Weeks");
    setProdSkinType(soap.skinType || "All Skin Types");
    setProdTopNotes(soap.scentPyramid?.top?.join(", ") || "");
    setProdHeartNotes(soap.scentPyramid?.heart?.join(", ") || "");
    setProdBaseNotes(soap.scentPyramid?.base?.join(", ") || "");
    setProdBenefits(soap.soapBenefits?.join("\n") || "");
    setProdIngredients(soap.fullIngredients?.join(", ") || "");
    setProdRitual(soap.ritualHowToUse || "");
    setProdImage(soap.image);
    setProdBadge(soap.badge || "");
    setProdInStock(soap.inStock !== false);
    setProdIsBestseller(!!soap.isBestseller);
    setProdIsFestive(!!soap.isFestive);
    setProdMetaTitle(soap.metaTitle || "");
    setProdMetaDescription(soap.metaDescription || "");
    setProdMetaKeywords(soap.metaKeywords || "");
    setIsProductEditing(true);
    setActiveTab("products");
  };

  // Save Product
  const handleSaveProduct = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!prodName.trim()) {
      showNotification("Please provide a product name.", "error");
      setProductStep(1);
      return;
    }

    const calculatedWeightText =
      prodWeightUnit === "kg"
        ? `${prodWeightValue} kg (${prodWeightValue * 1000}g)`
        : `${prodWeightValue}g / ${(prodWeightValue * 0.035274).toFixed(1)} oz`;

    const productPayload: Partial<Soap> = {
      name: prodName.trim(),
      slug: (prodSlug || slugify(prodName)).trim(),
      tagline: prodTagline.trim(),
      mainCategory: prodCategory,
      subCategory: prodSubCategory.trim(),
      price: Number(prodPrice),
      originalPrice: prodOriginalPrice ? Number(prodOriginalPrice) : undefined,
      weight: calculatedWeightText,
      weightValue: Number(prodWeightValue),
      weightUnit: prodWeightUnit,
      taxType: prodTaxType,
      taxRate: Number(prodTaxRate),
      description: prodDescription.trim(),
      cureTime: prodCureTime.trim(),
      skinType: prodSkinType.trim(),
      scentPyramid: editingProductId
        ? products.find((p) => (p.id || (p as any)._id) === editingProductId)?.scentPyramid
        : undefined,
      soapBenefits: prodBenefits.split("\n").map((s) => s.trim()).filter(Boolean),
      fullIngredients: prodIngredients.split(",").map((s) => s.trim()).filter(Boolean),
      ritualHowToUse: prodRitual.trim(),
      image: prodImage,
      badge: prodBadge.trim() || undefined,
      inStock: prodInStock,
      isBestseller: prodIsBestseller,
      isFestive: prodIsFestive,
      metaTitle: prodMetaTitle.trim() || undefined,
      metaDescription: prodMetaDescription.trim() || undefined,
      metaKeywords: prodMetaKeywords.trim() || undefined,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload as any);
      showNotification(`"${prodName}" updated successfully!`);
    } else {
      addProduct(productPayload as any);
      showNotification(`"${prodName}" added to catalog!`);
    }

    setIsProductEditing(false);
  };

  // Open Full-Page Category Form for Add
  const handleOpenAddCategory = () => {
    setCategoryFormMode("add");
    setEditingCategoryId(null);
    setCatName("");
    setCatSlug("");
    setCatDescription("");
    setCatParentCategory("");
    setCatBadge("Artisanal");
    setCatSubcategories("");
    setCatImage(PRESET_IMAGES[0].url);
    setCatBannerImage(PRESET_IMAGES[0].url);
    setCatBannerHeadline("");
    setCatBannerSubheadline("");
    setCatMetaTitle("");
    setCatMetaDescription("");
    setCatMetaKeywords("");
    setIsCategoryEditing(true);
    setActiveTab("categories");
  };

  // Open Full-Page Category Form for Edit
  const handleOpenEditCategory = (cat: any) => {
    setCategoryFormMode("edit");
    setEditingCategoryId(cat.id || cat._id);
    setCatName(cat.name);
    setCatSlug(cat.slug || cat.id || cat._id);
    setCatDescription(cat.description || "");
    setCatParentCategory(cat.parentCategory || "");
    setCatBadge(cat.badge || "");
    setCatSubcategories((cat.subcategories || []).join(", "));
    setCatImage(cat.image || "/images/products/dragons-blood.jpg");
    setCatBannerImage(cat.bannerImage || cat.image || PRESET_IMAGES[0].url);
    setCatBannerHeadline(cat.bannerHeadline || cat.name || "");
    setCatBannerSubheadline(cat.bannerSubheadline || cat.description || "");
    setCatMetaTitle(cat.metaTitle || "");
    setCatMetaDescription(cat.metaDescription || "");
    setCatMetaKeywords(Array.isArray(cat.metaKeywords) ? cat.metaKeywords.join(", ") : (cat.metaKeywords || ""));
    setIsCategoryEditing(true);
    setActiveTab("categories");
  };

  // Save Category
  const handleSaveCategory = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!catName.trim()) {
      showNotification("Please enter a category name.", "error");
      return;
    }

    const subCats = catSubcategories
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const slug = (catSlug || slugify(catName)).trim();
    const keywordsArray = catMetaKeywords.trim()
      ? catMetaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined;

    const payload = {
      name: catName.trim(),
      slug,
      description: catDescription.trim() || undefined,
      parentCategory: catParentCategory.trim() || null,
      image: catImage,
      bannerImage: catBannerImage || catImage,
      bannerHeadline: catBannerHeadline.trim() || undefined,
      bannerSubheadline: catBannerSubheadline.trim() || undefined,
      badge: catBadge.trim() || undefined,
      subcategories: subCats,
      metaTitle: catMetaTitle.trim() || undefined,
      metaDescription: catMetaDescription.trim() || undefined,
      metaKeywords: keywordsArray,
    };

    if (editingCategoryId) {
      updateCategory(editingCategoryId, payload);
      showNotification(`Category "${catName}" updated.`);
    } else {
      addCategory({
        id: slug,
        ...payload,
      });
      showNotification(`Category "${catName}" created.`);
    }

    setIsCategoryEditing(false);
  };

  // Save Shipping Settings
  const handleSaveShippingSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShippingSettings({
      shippingType: shippingTypeInput,
      flatRate: Number(flatRateInput),
      freeShippingThreshold: Number(freeThresholdInput),
      enableFreeThreshold: enableFreeThresholdInput,
      defaultStateRate: Number(defaultStateRateInput),
      stateRates: stateRatesInput,
    });
    showNotification("Shipping rules and state rates saved successfully! 🚚");
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        productSearch.trim() === "" ||
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        (p.tagline ? p.tagline.toLowerCase().includes(productSearch.toLowerCase()) : false) ||
        (p.mainCategory ? p.mainCategory.toLowerCase().includes(productSearch.toLowerCase()) : false) ||
        (p.subCategory ? p.subCategory.toLowerCase().includes(productSearch.toLowerCase()) : false);

      const matchesCategory =
        categoryFilter === "all" ||
        p.mainCategory.toLowerCase() === categoryFilter.toLowerCase();

      const matchesTax =
        taxFilter === "all" ||
        (taxFilter === "0" && p.taxRate === 0) ||
        (taxFilter === "5" && p.taxRate === 5) ||
        (taxFilter === "12" && p.taxRate === 12) ||
        (taxFilter === "18" && p.taxRate === 18) ||
        (taxFilter === "28" && p.taxRate === 28);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "instock" && p.inStock !== false) ||
        (stockFilter === "outofstock" && p.inStock === false);

      return matchesSearch && matchesCategory && matchesTax && matchesStock;
    });
  }, [products, productSearch, categoryFilter, taxFilter, stockFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return (orders || []).filter((o) => {
      const matchesStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
      const matchesPayment =
        orderPaymentFilter === "all" ||
        (orderPaymentFilter === "Paid" && (o.paymentStatus === "Paid" || (!o.paymentStatus && o.paymentMethod !== "cod"))) ||
        (orderPaymentFilter === "Pending" && (o.paymentStatus === "Pending" || o.paymentMethod === "cod")) ||
        (orderPaymentFilter === "cod" && o.paymentMethod === "cod") ||
        (orderPaymentFilter === "razorpay" && o.paymentMethod === "razorpay");

      const q = orderSearchQuery.toLowerCase();
      const matchesSearch =
        orderSearchQuery.trim() === "" ||
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
        (o.customerName && o.customerName.toLowerCase().includes(q)) ||
        (o.customerPhone && o.customerPhone.toLowerCase().includes(q)) ||
        (o.shippingState && o.shippingState.toLowerCase().includes(q)) ||
        (o.razorpayOrderId && o.razorpayOrderId.toLowerCase().includes(q)) ||
        (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(q)) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(q));
      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderPaymentFilter, orderSearchQuery]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return (users || []).filter((u) => {
      const q = userSearchQuery.toLowerCase();
      return (
        userSearchQuery.trim() === "" ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.state && u.state.toLowerCase().includes(q))
      );
    });
  }, [users, userSearchQuery]);

  // Analytics totals
  const totalRevenue = (orders || []).reduce((acc, o) => acc + (o.total || 0), 0);
  const pendingOrdersCount = (orders || []).filter((o) => o.status === "Processing" || o.status === "Pending").length;
  const shippedOrdersCount = (orders || []).filter((o) => o.status === "Shipped").length;
  const deliveredOrdersCount = (orders || []).filter((o) => o.status === "Delivered").length;
  const inStockProductsCount = (products || []).filter((p) => p.inStock !== false).length;

  // Live tax preview calculation in product form
  const previewTaxAmt =
    prodTaxType === "exclusive" ? Math.round((prodPrice * (prodTaxRate || 0)) / 100) : 0;
  const previewCustomerTotal = prodPrice + previewTaxAmt;

  // Clear, standard e-commerce navigation items
  const NAV_ITEMS = [
    { id: "overview", label: "Dashboard", icon: Sparkles, badge: null },
    { id: "products", label: "Products", icon: Package, badge: (products || []).length },
    { id: "categories", label: "Categories", icon: Layers, badge: (categories || []).length },
    { id: "hero", label: "Hero Showcase", icon: Sparkles, badge: (heroSlides || []).length },
    { id: "shipping", label: "Shipping Rates", icon: Truck, badge: null },
    { id: "offers", label: "Discounts & Offers", icon: Gift, badge: 2 },
    { id: "orders", label: "Orders", icon: ShoppingBag, badge: (orders || []).length },
    { id: "users", label: "Customers", icon: Users, badge: (users || []).length },
  ];

  return (
    <div className="admin-dashboard-layout">
      {/* Toast Notification (Replaces all alerts) */}
      {toast && (
        <div
          className="toast-pill"
          style={{
            backgroundColor: toast.type === "error" ? "#991b1b" : "var(--color-dragon-black)",
            borderColor: toast.type === "error" ? "#f87171" : "var(--color-terracotta)",
          }}
        >
          {toast.type === "error" ? (
            <AlertCircle size={18} color="#fca5a5" />
          ) : (
            <CheckCircle2 size={18} color="var(--color-terracotta)" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Custom Confirmation Modal (Replaces all browser confirm popups) */}
      {confirmModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(17, 17, 19, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              maxWidth: "420px",
              width: "100%",
              padding: "1.5rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div style={{ padding: "8px", borderRadius: "50%", backgroundColor: "#fee2e2", color: "#dc2626" }}>
                <AlertCircle size={22} />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>{confirmModal.title}</h3>
            </div>
            <p style={{ margin: "0 0 1.25rem", fontSize: "0.88rem", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              {confirmModal.message}
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                style={{
                  padding: "0.55rem 1rem",
                  borderRadius: "8px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                style={{
                  padding: "0.55rem 1.25rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#dc2626",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {confirmModal.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Backdrop */}
      <div
        className={`admin-sidebar-backdrop ${isSidebarOpen ? "open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ============================================================ */}
      {/* SIDEBAR NAVIGATION */}
      {/* ============================================================ */}
      <aside className={`admin-sidebar ${isSidebarOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div
          style={{
            padding: "1.25rem 1.4rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                backgroundColor: "var(--color-terracotta)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px var(--color-terracotta-glow)",
              }}
            >
              <Sparkles size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-serif)", fontWeight: 800, fontSize: "1.05rem", color: "#ffffff", letterSpacing: "0.02em" }}>
                STAR LIGHT CO.
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--color-terracotta)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Store Backoffice
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            style={{
              display: "inline-flex",
              color: "#a1a1aa",
              padding: "4px",
              borderRadius: "6px",
              background: "rgba(255,255,255,0.06)",
            }}
            className="mobile-only-close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Storefront Link */}
        <div style={{ padding: "0.75rem 1.4rem", borderBottom: "1px solid rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.74rem", color: "#a1a1aa", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
            Storefront Online
          </span>
          <Link
            href="/"
            target="_blank"
            style={{ fontSize: "0.72rem", color: "var(--color-terracotta)", display: "flex", alignItems: "center", gap: "3px", textDecoration: "none", fontWeight: 600 }}
          >
            View Store <ExternalLink size={11} />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: "1rem 0.75rem", flexGrow: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id && !isProductEditing && !isCategoryEditing;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsProductEditing(false);
                  setIsCategoryEditing(false);
                  setIsSidebarOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "0.7rem 0.95rem",
                  borderRadius: "10px",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isActive ? "rgba(225, 113, 89, 0.15)" : "transparent",
                  color: isActive ? "#ffffff" : "#a1a1aa",
                  borderLeft: isActive ? "3px solid var(--color-terracotta)" : "3px solid transparent",
                  transition: "all 0.15s ease",
                  textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Icon size={17} color={isActive ? "var(--color-terracotta)" : "#8e8e93"} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "2px 7px",
                      borderRadius: "9999px",
                      backgroundColor: isActive ? "var(--color-terracotta)" : "rgba(255, 255, 255, 0.08)",
                      color: "#ffffff",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: "1.1rem 1rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(0,0,0,0.2)" }}>
          <button
            type="button"
            onClick={() => {
              setConfirmModal({
                title: "Reset Store to Factory Defaults",
                message: "Are you sure you want to reset all products, categories, shipping rates, and orders to seed data?",
                confirmLabel: "Reset Store",
                onConfirm: () => {
                  resetToDefaults();
                  showNotification("Store reset to factory default data.");
                },
              });
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              width: "100%",
              padding: "0.55rem 0.85rem",
              borderRadius: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "#a1a1aa",
              fontSize: "0.78rem",
              fontWeight: 600,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              cursor: "pointer",
              marginBottom: "0.85rem",
            }}
          >
            <RefreshCw size={13} /> Reset Factory Seed
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", padding: "0.4rem 0.2rem" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "var(--color-terracotta)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.85rem",
              }}
            >
              A
            </div>
            <div>
              <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#ffffff" }}>Store Admin</div>
              <div style={{ fontSize: "0.7rem", color: "#8e8e93" }}>Manager Profile</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MAIN CONTENT AREA */}
      {/* ============================================================ */}
      <div className="admin-main-area">
        {/* Top App Header */}
        <header className="admin-appbar">
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              style={{
                padding: "6px 8px",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-cream-bg)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Open Admin Menu"
            >
              <Menu size={20} color="var(--color-dragon-black)" />
            </button>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>
                  Admin Dashboard
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>/</span>
                <span style={{ fontSize: "0.72rem", color: "var(--color-terracotta)", fontWeight: 700 }}>
                  {isProductEditing
                    ? productFormMode === "add"
                      ? "Add New Product"
                      : "Edit Product"
                    : isCategoryEditing
                    ? categoryFormMode === "add"
                      ? "Add Category"
                      : "Edit Category"
                    : NAV_ITEMS.find((n) => n.id === activeTab)?.label}
                </span>
              </div>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--color-dragon-black)" }}>
                {isProductEditing
                  ? productFormMode === "add"
                    ? "Add New Product"
                    : `Edit: ${prodName || "Product"}`
                  : isCategoryEditing
                  ? categoryFormMode === "add"
                    ? "Add New Category"
                    : `Edit: ${catName || "Category"}`
                  : activeTab === "overview"
                  ? "Store Dashboard Overview"
                  : activeTab === "products"
                  ? `Products Catalog (${(products || []).length})`
                  : activeTab === "categories"
                  ? `Product Categories (${(categories || []).length})`
                  : activeTab === "hero"
                  ? `Homepage Hero Showcase (${(heroSlides || []).length} Slides)`
                  : activeTab === "shipping"
                  ? "Shipping Rates & Delivery Rules"
                  : activeTab === "offers"
                  ? "Discounts & Promotional Offers"
                  : activeTab === "orders"
                  ? `Customer Orders (${(orders || []).length})`
                  : `Customer Directory (${(users || []).length})`}
              </h1>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            {activeTab === "hero" && (
              <button
                type="button"
                onClick={handleOpenAddHero}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.55rem 0.95rem",
                  borderRadius: "8px",
                  backgroundColor: "var(--color-terracotta)",
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px var(--color-terracotta-glow)",
                }}
              >
                <Plus size={15} />
                <span>Add Hero Slide</span>
              </button>
            )}

            {!isProductEditing && activeTab !== "hero" && (
              <button
                type="button"
                onClick={handleOpenAddProduct}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.55rem 0.95rem",
                  borderRadius: "8px",
                  backgroundColor: "var(--color-terracotta)",
                  color: "#ffffff",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px var(--color-terracotta-glow)",
                }}
              >
                <Plus size={15} />
                <span className="hide-on-very-small">Add Product</span>
              </button>
            )}

            <Link
              href="/"
              target="_blank"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.55rem 0.85rem",
                borderRadius: "8px",
                border: "1px solid var(--color-border)",
                backgroundColor: "#ffffff",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--color-text-secondary)",
                textDecoration: "none",
              }}
            >
              <ExternalLink size={14} />
              <span className="hide-on-mobile">Storefront</span>
            </Link>
          </div>
        </header>

        {/* Mobile Quick Tabs Bar */}
        {!isProductEditing && !isCategoryEditing && (
          <div className="admin-mobile-tab-scroller">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as any)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "9999px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    border: isActive ? "1px solid var(--color-terracotta)" : "1px solid var(--color-border)",
                    backgroundColor: isActive ? "var(--color-terracotta-light)" : "#ffffff",
                    color: isActive ? "var(--color-terracotta-dark)" : "var(--color-text-secondary)",
                  }}
                >
                  <Icon size={13} />
                  <span>{item.label}</span>
                  {item.badge !== null && <span>({item.badge})</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Body */}
        <main style={{ padding: "clamp(1rem, 2.5vw, 2rem)", flexGrow: 1 }}>
          {/* ================================================================ */}
          {/* VIEW: FULL-PAGE PRODUCT FORM (NO POPUP MODAL) */}
          {/* ================================================================ */}
          {isProductEditing ? (
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              {/* Back Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <button
                  type="button"
                  onClick={() => setIsProductEditing(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.55rem 0.95rem",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeft size={16} /> Back to Products
                </button>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setIsProductEditing(false)}
                    style={{
                      padding: "0.55rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#ffffff",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveProduct()}
                    style={{
                      padding: "0.55rem 1.4rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "var(--color-terracotta)",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 10px var(--color-terracotta-glow)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Check size={16} /> Save Product
                  </button>
                </div>
              </div>

              {/* Step Wizard Bar with 4 Steps */}
              <div className="step-wizard-bar" style={{ marginBottom: "1.5rem" }}>
                {[
                  { step: 1, label: "Basic Information" },
                  { step: 2, label: "Pricing, GST & Weight" },
                  { step: 3, label: "Product Images" },
                  { step: 4, label: "SEO Metadata Suite" },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setProductStep(s.step as any)}
                    className={`step-wizard-pill ${productStep === s.step ? "active" : productStep > s.step ? "completed" : ""}`}
                  >
                    <span className="step-number">{productStep > s.step ? "✓" : s.step}</span>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Form Content Card */}
              <div className="admin-card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
                {/* STEP 1: BASIC INFORMATION */}
                {productStep === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: "0 0 0.25rem" }}>
                        Step 1: Basic Product Information
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                        Enter the public product title, URL slug, category, and descriptive details.
                      </p>
                    </div>

                    <div className="admin-form-row-2">
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={prodName}
                          onChange={(e) => {
                            setProdName(e.target.value);
                            if (!editingProductId) setProdSlug(slugify(e.target.value));
                          }}
                          placeholder="e.g. Kashmiri Saffron & Blossom Honey Soap"
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          URL Slug (/products/[slug]) *
                        </label>
                        <input
                          type="text"
                          required
                          value={prodSlug}
                          onChange={(e) => setProdSlug(slugify(e.target.value))}
                          placeholder="e.g. kashmiri-saffron-blossom-honey"
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem", fontFamily: "monospace" }}
                        />
                      </div>
                    </div>

                    <div className="admin-form-row-2">
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Short Tagline
                        </label>
                        <input
                          type="text"
                          value={prodTagline}
                          onChange={(e) => setProdTagline(e.target.value)}
                          placeholder="e.g. Radiance-enhancing herbal cleanser with Kashmiri saffron"
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Corner Badge Label
                        </label>
                        <input
                          type="text"
                          value={prodBadge}
                          onChange={(e) => setProdBadge(e.target.value)}
                          placeholder="e.g. Bestseller, Limited Drop, 25% Off"
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                        />
                      </div>
                    </div>

                    <div className="admin-form-row-2">
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Main Category *
                        </label>
                        <select
                          value={prodCategory}
                          onChange={(e) => setProdCategory(e.target.value)}
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "#ffffff", fontSize: "0.92rem" }}
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Subcategory *
                        </label>
                        <input
                          type="text"
                          value={prodSubCategory}
                          onChange={(e) => setProdSubCategory(e.target.value)}
                          placeholder="e.g. Saffron Lather Bar"
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Detailed Product Description
                      </label>
                      <textarea
                        rows={4}
                        value={prodDescription}
                        onChange={(e) => setProdDescription(e.target.value)}
                        placeholder="Comprehensive details on ingredients, benefits, aroma profile, and skin ritual..."
                        style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }}
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: PRICING, GST TAX & PHYSICAL SPECIFICATIONS */}
                {productStep === 2 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: "0 0 0.25rem" }}>
                        Step 2: Pricing, GST Tax &amp; Physical Specifications
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                        Set selling price, strikethrough original price, GST rate, bar weight, curing period, and skin suitability.
                      </p>
                    </div>

                    <div className="admin-form-row-2">
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Selling Price (INR ₹) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={prodPrice}
                          onWheel={(e) => (e.target as HTMLElement).blur()}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "1.1rem", fontWeight: 700 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Original Price (INR ₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={prodOriginalPrice || ""}
                          onWheel={(e) => (e.target as HTMLElement).blur()}
                          onChange={(e) => setProdOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                          placeholder="Optional for discount display"
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "1.1rem" }}
                        />
                      </div>
                    </div>

                    {/* GST Section */}
                    <div style={{ backgroundColor: "var(--color-cream-subtle)", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
                      <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.95rem", fontWeight: 700 }}>
                        Choose GST / Tax Rate (%)
                      </h4>

                      <div className="admin-form-row-2">
                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                            GST Tax Calculation *
                          </label>
                          <select
                            value={prodTaxType}
                            onChange={(e) => setProdTaxType(e.target.value as any)}
                            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "#ffffff" }}
                          >
                            <option value="inclusive">Price Includes GST (Standard)</option>
                            <option value="exclusive">Price Excludes GST (Add at Checkout)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                            Choose GST / Tax Rate (%) *
                          </label>
                          <select
                            value={prodTaxRate}
                            onChange={(e) => setProdTaxRate(Number(e.target.value))}
                            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "#ffffff", fontWeight: 700 }}
                          >
                            <option value={0}>0% GST (Tax Exempt / Nil Rated)</option>
                            <option value={5}>5% GST (Essentials)</option>
                            <option value={12}>12% GST (Herbal Preparations)</option>
                            <option value={18}>18% GST (Standard Luxury Soaps)</option>
                            <option value={28}>28% GST (Premium Sets)</option>
                          </select>
                        </div>
                      </div>

                      {/* Live Calculation Preview */}
                      <div style={{ marginTop: "1rem", padding: "0.85rem", borderRadius: "8px", backgroundColor: "#ffffff", border: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                          Customer Pays at Checkout:
                        </span>
                        <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--color-terracotta)" }}>
                          ₹{previewCustomerTotal.toLocaleString("en-IN")}{" "}
                          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-tertiary)" }}>
                            ({prodTaxRate === 0 ? "0% GST Exempt" : `${prodTaxRate}% ${prodTaxType}`})
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Weight & Measurement Unit */}
                    <div style={{ backgroundColor: "var(--color-cream-subtle)", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
                      <h4 style={{ margin: "0 0 0.75rem", fontSize: "0.95rem", fontWeight: 700 }}>
                        Weight &amp; Measurement Unit
                      </h4>
                      <div className="admin-form-row-2">
                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                            Weight Value *
                          </label>
                          <input
                            type="number"
                            min="1"
                            required
                            value={prodWeightValue}
                            onWheel={(e) => (e.target as HTMLElement).blur()}
                            onChange={(e) => setProdWeightValue(Number(e.target.value))}
                            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "1.1rem", fontWeight: 700 }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                            Unit of Measurement *
                          </label>
                          <select
                            value={prodWeightUnit}
                            onChange={(e) => setProdWeightUnit(e.target.value as any)}
                            style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "#ffffff", fontWeight: 700 }}
                          >
                            <option value="g">Grams (g) — Individual Bars</option>
                            <option value="kg">Kilograms (kg) — Loaves &amp; Bulk Sets</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="admin-form-row-2">
                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Cure Time
                        </label>
                        <input
                          type="text"
                          value={prodCureTime}
                          onChange={(e) => setProdCureTime(e.target.value)}
                          placeholder="e.g. Cold Cured 6 Weeks"
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                          Recommended Skin Type
                        </label>
                        <input
                          type="text"
                          value={prodSkinType}
                          onChange={(e) => setProdSkinType(e.target.value)}
                          placeholder="e.g. Sensitive &amp; Dry Skin"
                          style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: PRODUCT IMAGES */}
                {productStep === 3 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: "0 0 0.25rem" }}>
                        Step 3: Product Images &amp; Media
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                        Upload a photo from your computer, upload to Cloudinary, or enter a direct image URL.
                      </p>
                    </div>

                    {/* Local File Upload */}
                    <div style={{ backgroundColor: "var(--color-cream-subtle)", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                        <Upload size={18} color="var(--color-terracotta)" />
                        <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>Upload Image from Device</h4>
                      </div>
                      <p style={{ margin: "0 0 1rem", fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                        Select any PNG, JPG, or WebP photo from your computer or phone.
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        style={{ display: "block", fontSize: "0.88rem" }}
                      />
                    </div>

                    {/* Image URL Input */}
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Or Paste Image URL Directly
                      </label>
                      <input
                        type="text"
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        placeholder="https://... or /images/products/..."
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }}
                      />
                    </div>

                    {/* Cloudinary Image Upload */}
                    <div style={{ marginTop: "0.5rem" }}>
                      <ImageUpload
                        currentImage={prodImage}
                        folder="starlight/products"
                        label="Upload High-Resolution Product Image (Cloudinary)"
                        onUpload={(url) => {
                          setProdImage(url);
                          showNotification("Image uploaded to Cloudinary successfully!");
                        }}
                      />
                    </div>

                    {/* Live Preview Card */}
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", borderRadius: "10px", border: "1px solid var(--color-border)", backgroundColor: "#ffffff" }}>
                      <div style={{ position: "relative", width: "65px", height: "65px", borderRadius: "10px", overflow: "hidden", backgroundColor: "var(--color-cream-subtle)", flexShrink: 0 }}>
                        <Image src={prodImage} alt="Preview" fill sizes="65px" style={{ objectFit: "cover" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700 }}>Active Image Assigned</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)", wordBreak: "break-all" }}>{prodImage}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: SEO METADATA SUITE */}
                {productStep === 4 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    <div>
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: "0 0 0.25rem" }}>
                        Step 4: Search Engine Optimization (SEO)
                      </h3>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                        Customize meta title, meta description, and keywords to rank on Google search results.
                      </p>
                    </div>

                    <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "1rem", borderRadius: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, fontSize: "0.88rem", color: "#166534" }}>
                        <Globe size={16} /> Google Search Engine Preview
                      </div>
                      <div style={{ marginTop: "8px", padding: "0.75rem", backgroundColor: "#ffffff", borderRadius: "8px", border: "1px solid #dcfce7" }}>
                        <div style={{ fontSize: "0.95rem", color: "#1a0dab", fontWeight: 600 }}>
                          {prodMetaTitle || `${prodName || "Artisanal Soap Bar"} | Star Light Co.`}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#006621" }}>
                          https://starlight.co/products/{prodSlug || "product-name"}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#545454", marginTop: "3px" }}>
                          {prodMetaDescription || prodDescription || "Handcrafted small-batch cold process soap bar curing for weeks to preserve natural glycerin."}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        SEO Meta Title
                      </label>
                      <input
                        type="text"
                        value={prodMetaTitle}
                        onChange={(e) => setProdMetaTitle(e.target.value)}
                        placeholder="e.g. Kashmiri Saffron Herbal Soap Bar | Star Light Co."
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        SEO Meta Description
                      </label>
                      <textarea
                        rows={3}
                        value={prodMetaDescription}
                        onChange={(e) => setProdMetaDescription(e.target.value)}
                        placeholder="Handcrafted cold-process botanical soap infused with saffron and wild mountain honey..."
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        SEO Meta Keywords (Comma-Separated)
                      </label>
                      <input
                        type="text"
                        value={prodMetaKeywords}
                        onChange={(e) => setProdMetaKeywords(e.target.value)}
                        placeholder="saffron soap, cold process soap, herbal skincare, luxury bathing"
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Wizard Navigation Buttons (Previous & Next) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  padding: "1rem 0",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                <div>
                  {productStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setProductStep((prev) => Math.max(1, prev - 1) as any)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        padding: "0.65rem 1.25rem",
                        borderRadius: "8px",
                        border: "1px solid var(--color-border)",
                        backgroundColor: "#ffffff",
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      <ArrowLeft size={16} /> Previous Step
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", fontWeight: 600 }}>
                    Step {productStep} of 4
                  </span>

                  {productStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => setProductStep((prev) => Math.min(4, prev + 1) as any)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        padding: "0.65rem 1.4rem",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "var(--color-dragon-black)",
                        color: "#ffffff",
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Next Step <ArrowRight size={16} />
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => handleSaveProduct()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.65rem 1.75rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "var(--color-terracotta)",
                      color: "#ffffff",
                      fontSize: "0.88rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 10px var(--color-terracotta-glow)",
                    }}
                  >
                    <Check size={16} /> Save Product
                  </button>
                </div>
              </div>
            </div>
          ) : isCategoryEditing ? (
            /* ================================================================ */
            /* VIEW: FULL-PAGE CATEGORY FORM (NO POPUP MODAL) */
            /* ================================================================ */
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <button
                  type="button"
                  onClick={() => setIsCategoryEditing(false)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.55rem 0.95rem",
                    borderRadius: "8px",
                    border: "1px solid var(--color-border)",
                    backgroundColor: "#ffffff",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <ArrowLeft size={16} /> Back to Categories
                </button>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryEditing(false)}
                    style={{
                      padding: "0.55rem 1rem",
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#ffffff",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveCategory()}
                    style={{
                      padding: "0.55rem 1.4rem",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "var(--color-terracotta)",
                      color: "#ffffff",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 10px var(--color-terracotta-glow)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Check size={16} /> Save Category
                  </button>
                </div>
              </div>

              <div className="admin-card" style={{ padding: "1.75rem" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", margin: "0 0 0.25rem" }}>
                  {categoryFormMode === "add" ? "Create New Product Category" : `Edit Category: ${catName}`}
                </h3>
                <p style={{ margin: "0 0 1.25rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                  Configure category details, hero image, badge, subcategories, and SEO tags.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {/* Category Image Selector & Preview */}
                  <div style={{ backgroundColor: "var(--color-cream-subtle)", padding: "1.25rem", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                      <Upload size={18} color="var(--color-terracotta)" />
                      <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>Category Display Image *</h4>
                    </div>
                    <p style={{ margin: "0 0 1rem", fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>
                      Upload an image file from your computer or enter a direct image URL.
                    </p>

                    <div style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "1rem" }}>
                      {/* Live Image Preview */}
                      <div style={{ width: "110px", height: "110px", borderRadius: "10px", overflow: "hidden", border: "2px solid var(--color-terracotta)", flexShrink: 0, backgroundColor: "#ffffff" }}>
                        <Image
                          src={catImage || "/images/products/dragons-blood.jpg"}
                          alt="Category preview"
                          width={110}
                          height={110}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>

                      <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                        <input
                          type="file"
                          ref={catFileInputRef}
                          accept="image/*"
                          onChange={handleCatImageFileUpload}
                          style={{ display: "none" }}
                        />

                        <button
                          type="button"
                          onClick={() => catFileInputRef.current?.click()}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.45rem",
                            padding: "0.55rem 1rem",
                            borderRadius: "8px",
                            backgroundColor: "var(--color-dragon-black)",
                            color: "#ffffff",
                            fontSize: "0.85rem",
                            fontWeight: 700,
                            border: "none",
                            cursor: "pointer",
                            width: "fit-content",
                          }}
                        >
                          <Upload size={15} /> Upload Photo from Computer
                        </button>

                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "0.2rem" }}>
                            Or Direct Image URL:
                          </label>
                          <input
                            type="text"
                            value={catImage}
                            onChange={(e) => setCatImage(e.target.value)}
                            placeholder="https://... or /images/products/..."
                            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Category Page Banner Customizer */}
                  <div style={{ backgroundColor: "#18181b", color: "#ffffff", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(225, 113, 89, 0.3)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.6rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Sparkles size={17} color="var(--color-terracotta)" />
                        <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#ffffff" }}>
                          Storefront Category Banner &amp; Header Showcase
                        </h4>
                      </div>
                      <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "4px", backgroundColor: "rgba(225, 113, 89, 0.25)", color: "#ffaa96", fontWeight: 700 }}>
                        Page URL: /category/{catSlug || slugify(catName) || "slug"}
                      </span>
                    </div>
                    <p style={{ margin: "0 0 1rem", fontSize: "0.8rem", color: "#a1a1aa" }}>
                      Shown as the high-impact editorial hero banner when customers visit this category&apos;s page.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem", color: "#e4e4e7" }}>
                          Banner Headline
                        </label>
                        <input
                          type="text"
                          value={catBannerHeadline}
                          onChange={(e) => setCatBannerHeadline(e.target.value)}
                          placeholder={catName || "e.g. Pure Artisan Facial Bars"}
                          style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #3f3f46", backgroundColor: "#27272a", color: "#ffffff", fontSize: "0.85rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem", color: "#e4e4e7" }}>
                          Banner Subheadline / Narrative
                        </label>
                        <input
                          type="text"
                          value={catBannerSubheadline}
                          onChange={(e) => setCatBannerSubheadline(e.target.value)}
                          placeholder="e.g. Cold-poured with sacred clays and pure botanical extracts."
                          style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #3f3f46", backgroundColor: "#27272a", color: "#ffffff", fontSize: "0.85rem" }}
                        />
                      </div>
                    </div>

                    {/* Banner Image Selection */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                        <div style={{ width: "120px", height: "64px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-terracotta)", position: "relative" }}>
                          <Image
                            src={catBannerImage || catImage || PRESET_IMAGES[0].url}
                            alt="Banner preview"
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>

                        <div style={{ flex: "1 1 200px" }}>
                          <input
                            type="file"
                            ref={catBannerFileInputRef}
                            accept="image/*"
                            onChange={handleCatBannerImageFileUpload}
                            style={{ display: "none" }}
                          />
                          <button
                            type="button"
                            onClick={() => catBannerFileInputRef.current?.click()}
                            style={{
                              padding: "0.45rem 0.85rem",
                              borderRadius: "6px",
                              backgroundColor: "var(--color-terracotta)",
                              color: "#ffffff",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              border: "none",
                              cursor: "pointer",
                              marginBottom: "0.35rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Upload size={13} /> Upload Custom Banner
                          </button>
                          <input
                            type="text"
                            value={catBannerImage}
                            onChange={(e) => setCatBannerImage(e.target.value)}
                            placeholder="Banner image URL..."
                            style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #3f3f46", backgroundColor: "#27272a", color: "#ffffff", fontSize: "0.78rem" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="admin-form-row-2">
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Category Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={catName}
                        onChange={(e) => {
                          setCatName(e.target.value);
                          if (!editingCategoryId) setCatSlug(slugify(e.target.value));
                        }}
                        placeholder="e.g. Exfoliating &amp; Clay Soaps"
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Category Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={catSlug}
                        onChange={(e) => setCatSlug(slugify(e.target.value))}
                        placeholder="e.g. exfoliating-clay-soaps"
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem", fontFamily: "monospace" }}
                      />
                    </div>
                  </div>

                  {/* Main Category vs Subcategory Hierarchy Selector */}
                  <div style={{ backgroundColor: "var(--color-cream-subtle)", padding: "1.1rem 1.25rem", borderRadius: "10px", border: "1.5px solid var(--color-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.35rem" }}>
                      <Layers size={16} color="var(--color-terracotta)" />
                      <label style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--color-dragon-black)", margin: 0 }}>
                        Category Type &amp; Hierarchy *
                      </label>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)", margin: "0 0 0.75rem" }}>
                      Select whether this is a primary top-level department or a nested subcategory.
                    </p>

                    <select
                      value={catParentCategory}
                      onChange={(e) => setCatParentCategory(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        borderRadius: "8px",
                        border: "2px solid",
                        borderColor: catParentCategory ? "var(--color-terracotta)" : "var(--color-border)",
                        fontSize: "0.9rem",
                        backgroundColor: "#ffffff",
                        fontWeight: 700,
                        color: "var(--color-dragon-black)",
                        cursor: "pointer",
                      }}
                    >
                      <option value="">📁 None — This is a Top-Level Main Category</option>
                      {categories
                        .filter(
                          (c) =>
                            !c.parentCategory &&
                            c.id !== editingCategoryId &&
                            c.name !== catName &&
                            c.id !== "all"
                        )
                        .map((c) => (
                          <option key={c.id} value={c.name}>
                            ↳ Subcategory under: {c.name}
                          </option>
                        ))}
                    </select>

                    <div style={{ marginTop: "0.5rem", fontSize: "0.76rem", fontWeight: 600, color: catParentCategory ? "var(--color-terracotta)" : "#16a34a" }}>
                      {catParentCategory ? (
                        <>✓ Nested as a subcategory of: <strong>{catParentCategory}</strong></>
                      ) : (
                        <>✓ Top-Level Main Category (Displays directly on store navigation &amp; main showcases)</>
                      )}
                    </div>
                  </div>

                  <div className="admin-form-row-2">
                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Card Badge Label
                      </label>
                      <input
                        type="text"
                        value={catBadge}
                        onChange={(e) => setCatBadge(e.target.value)}
                        placeholder="e.g. Facial Atelier or Signature Body"
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                        Filter Tags / Secondary Subcategories (Optional)
                      </label>
                      <input
                        type="text"
                        value={catSubcategories}
                        onChange={(e) => setCatSubcategories(e.target.value)}
                        placeholder="e.g. Rhassoul Scrub, French Clay, Dead Sea Salt"
                        style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.92rem" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                      Category Description
                    </label>
                    <textarea
                      rows={2}
                      value={catDescription}
                      onChange={(e) => setCatDescription(e.target.value)}
                      placeholder="Brief summary of formulations under this botanical category..."
                      style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.9rem" }}
                    />
                  </div>

                  {/* SEO METADATA & GOOGLE SERP PREVIEW */}
                  <div style={{ backgroundColor: "#f8fafc", padding: "1.25rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Globe size={16} color="var(--color-terracotta)" />
                        <h4 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800 }}>Search Engine Optimization (SEO)</h4>
                      </div>
                      <span style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>
                        Google SERP Formatter
                      </span>
                    </div>

                    {/* Live Google Search Preview Card */}
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        padding: "1rem 1.25rem",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                        marginBottom: "1rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      }}
                    >
                      <div style={{ fontSize: "0.75rem", color: "#202124", display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
                        <span>starlightsoaps.com</span>
                        <span>›</span>
                        <span>category</span>
                        <span>›</span>
                        <span>{catSlug || slugify(catName) || "slug"}</span>
                      </div>
                      <div style={{ fontSize: "1.05rem", color: "#1a0dab", fontWeight: 600, lineHeight: 1.3, marginBottom: "3px" }}>
                        {catMetaTitle.trim() || `${catName || "Category Name"} | Star Light Co. Artisanal Soaps`}
                      </div>
                      <div style={{ fontSize: "0.82rem", color: "#4d5156", lineHeight: 1.4 }}>
                        {catMetaDescription.trim() || catDescription.trim() || "Discover our cold-process botanical artisanal soaps, slow cured for up to 9 weeks with sacred resins and natural glycerin."}
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>SEO Meta Title</label>
                          <span style={{ fontSize: "0.72rem", color: catMetaTitle.length > 60 ? "#d97706" : "var(--color-text-tertiary)" }}>
                            {catMetaTitle.length}/60 chars
                          </span>
                        </div>
                        <input
                          type="text"
                          value={catMetaTitle}
                          onChange={(e) => setCatMetaTitle(e.target.value)}
                          placeholder={`${catName || "Collection"} | Star Light Co. Artisanal Soaps`}
                          style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}
                        />
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                          <label style={{ fontSize: "0.78rem", fontWeight: 700 }}>SEO Meta Description</label>
                          <span style={{ fontSize: "0.72rem", color: catMetaDescription.length > 160 ? "#d97706" : "var(--color-text-tertiary)" }}>
                            {catMetaDescription.length}/160 chars
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          value={catMetaDescription}
                          onChange={(e) => setCatMetaDescription(e.target.value)}
                          placeholder="Compelling SERP summary for search engine results..."
                          style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}
                        />
                      </div>

                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                          SEO Target Keywords
                        </label>
                        <input
                          type="text"
                          value={catMetaKeywords}
                          onChange={(e) => setCatMetaKeywords(e.target.value)}
                          placeholder="cold-process soap, facial clay bar, ayurvedic botanical soap"
                          style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ================================================================ */
            /* STANDARD TAB VIEWS */
            /* ================================================================ */
            <>
              {/* TAB 0: DASHBOARD OVERVIEW */}
              {activeTab === "overview" && (
                <div>
                  {/* Dashboard Header Banner */}
                  <div
                    style={{
                      background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
                      color: "#ffffff",
                      borderRadius: "18px",
                      padding: "1.5rem 1.75rem",
                      marginBottom: "1.75rem",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(225, 113, 89, 0.25)", color: "#ffaa96", padding: "3px 10px", borderRadius: "9999px", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
                        <Sparkles size={12} /> Store Operations Live
                      </div>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.25rem, 2.5vw, 1.65rem)", margin: "0 0 0.35rem", fontWeight: 800 }}>
                        Welcome to Store Admin
                      </h2>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: "#a1a1aa", maxWidth: "600px" }}>
                        Monitor sales, review customer orders, update product formulations, and manage state courier delivery fees.
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        type="button"
                        onClick={handleOpenAddProduct}
                        style={{
                          padding: "0.7rem 1.15rem",
                          borderRadius: "10px",
                          backgroundColor: "var(--color-terracotta)",
                          color: "#ffffff",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 4px 14px var(--color-terracotta-glow)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                        }}
                      >
                        <Plus size={16} /> Add Product
                      </button>
                    </div>
                  </div>

                  {/* Top Metric KPI Cards */}
                  <div className="admin-kpi-grid">
                    <div className="admin-card">
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        <span>Total Revenue</span>
                        <DollarSign size={17} color="var(--color-terracotta)" />
                      </div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--color-dragon-black)" }}>
                        ₹{totalRevenue.toLocaleString("en-IN")}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.76rem", color: "#16a34a", marginTop: "4px", fontWeight: 600 }}>
                        <TrendingUp size={13} /> Across {orders.length} customer orders
                      </div>
                    </div>

                    <div className="admin-card">
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        <span>Total Orders</span>
                        <ShoppingBag size={17} color="var(--color-gold)" />
                      </div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--color-dragon-black)" }}>
                        {orders.length}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                        <strong>{pendingOrdersCount}</strong> processing • <strong>{deliveredOrdersCount}</strong> delivered
                      </div>
                    </div>

                    <div className="admin-card">
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        <span>Average Order Value</span>
                        <Receipt size={17} color="#0284c7" />
                      </div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--color-dragon-black)" }}>
                        ₹{Math.round(totalRevenue / (orders.length || 1)).toLocaleString("en-IN")}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                        Free shipping threshold: <strong>₹{shippingSettings?.freeShippingThreshold ?? 999}</strong>
                      </div>
                    </div>

                    <div className="admin-card">
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        <span>Total Products</span>
                        <Package size={17} color="var(--color-terracotta)" />
                      </div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--color-dragon-black)" }}>
                        {products.length}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                        <strong>{inStockProductsCount}</strong> in stock • <strong>{categories.length}</strong> categories
                      </div>
                    </div>

                    <div className="admin-card">
                      <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-text-secondary)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        <span>Total Customers</span>
                        <Users size={17} color="#7c3aed" />
                      </div>
                      <div style={{ fontSize: "1.75rem", fontWeight: 800, marginTop: "0.5rem", color: "var(--color-dragon-black)" }}>
                        {users.length}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "var(--color-text-secondary)", marginTop: "4px" }}>
                        <strong>{users.filter((u) => u.role === "customer").length}</strong> registered buyers
                      </div>
                    </div>
                  </div>

                  {/* Performance Breakdown */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
                    {/* Order Status Breakdown */}
                    <div className="admin-card">
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", margin: "0 0 0.5rem" }}>
                        Order Status Breakdown
                      </h3>
                      <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                        Current fulfillment stages across all customer purchases.
                      </p>

                      <div style={{ height: "12px", width: "100%", borderRadius: "9999px", backgroundColor: "#f3f4f6", display: "flex", overflow: "hidden", marginBottom: "1rem" }}>
                        <div
                          style={{ width: `${(pendingOrdersCount / (orders.length || 1)) * 100}%`, backgroundColor: "#f59e0b" }}
                          title={`Processing: ${pendingOrdersCount}`}
                        />
                        <div
                          style={{ width: `${(shippedOrdersCount / (orders.length || 1)) * 100}%`, backgroundColor: "#0284c7" }}
                          title={`Shipped: ${shippedOrdersCount}`}
                        />
                        <div
                          style={{ width: `${(deliveredOrdersCount / (orders.length || 1)) * 100}%`, backgroundColor: "#16a34a" }}
                          title={`Delivered: ${deliveredOrdersCount}`}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", textAlign: "center" }}>
                        <div style={{ padding: "0.6rem", borderRadius: "10px", backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}>
                          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#b45309" }}>{pendingOrdersCount}</div>
                          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#92400e" }}>Processing</div>
                        </div>
                        <div style={{ padding: "0.6rem", borderRadius: "10px", backgroundColor: "#f0f9ff", border: "1px solid #bae6fd" }}>
                          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0369a1" }}>{shippedOrdersCount}</div>
                          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#075985" }}>Shipped</div>
                        </div>
                        <div style={{ padding: "0.6rem", borderRadius: "10px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#15803d" }}>{deliveredOrdersCount}</div>
                          <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "#166534" }}>Delivered</div>
                        </div>
                      </div>
                    </div>

                    {/* Top Shipping States */}
                    <div className="admin-card">
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", margin: "0 0 0.5rem" }}>
                        Top Shipping States
                      </h3>
                      <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                        Most frequent Indian delivery destinations.
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                        {Object.entries(
                          orders.reduce((acc, ord) => {
                            const state = ord.shippingState || "Other";
                            acc[state] = (acc[state] || 0) + 1;
                            return acc;
                          }, {} as Record<string, number>)
                        )
                          .slice(0, 4)
                          .map(([stateName, count]) => (
                            <div key={stateName}>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 600, marginBottom: "3px" }}>
                                <span>{stateName}</span>
                                <span style={{ color: "var(--color-terracotta)" }}>{count} orders</span>
                              </div>
                              <div style={{ height: "6px", width: "100%", borderRadius: "9999px", backgroundColor: "var(--color-cream-subtle)", overflow: "hidden" }}>
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${(count / orders.length) * 100}%`,
                                    backgroundColor: "var(--color-terracotta)",
                                    borderRadius: "9999px",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Orders Live Table */}
                  <div className="admin-table-card">
                    <div style={{ padding: "1.15rem 1.4rem", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", margin: 0 }}>
                          Recent Orders
                        </h3>
                        <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                          Latest confirmed customer transactions.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("orders")}
                        style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-terracotta)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
                      >
                        View All Orders <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="admin-table-scroll">
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ backgroundColor: "var(--color-cream-subtle)", borderBottom: "1px solid var(--color-border)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
                            <th style={{ padding: "0.85rem 1rem" }}>Order Number</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Customer</th>
                            <th style={{ padding: "0.85rem 1rem" }}>State</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Total</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Status</th>
                            <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Inspect</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 5).map((ord) => (
                            <tr key={ord.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                              <td style={{ padding: "0.95rem 1rem", fontFamily: "monospace", fontWeight: 700 }}>
                                #{ord.orderNumber}
                              </td>
                              <td style={{ padding: "0.95rem 1rem" }}>
                                <div style={{ fontWeight: 600 }}>{ord.customerName}</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>{ord.customerEmail}</div>
                              </td>
                              <td style={{ padding: "0.95rem 1rem" }}>
                                <span style={{ fontWeight: 600, color: "var(--color-terracotta)", fontSize: "0.82rem" }}>{ord.shippingState}</span>
                              </td>
                              <td style={{ padding: "0.95rem 1rem", fontWeight: 700 }}>
                                ₹{ord.total.toLocaleString("en-IN")}
                              </td>
                              <td style={{ padding: "0.95rem 1rem" }}>
                                <span
                                  style={{
                                    fontSize: "0.74rem",
                                    padding: "2px 8px",
                                    borderRadius: "6px",
                                    fontWeight: 700,
                                    backgroundColor:
                                      ord.status === "Delivered" ? "#e8f5e9" : ord.status === "Shipped" ? "#e0f2fe" : "#fef3c7",
                                    color:
                                      ord.status === "Delivered" ? "#2e7d32" : ord.status === "Shipped" ? "#0369a1" : "#b45309",
                                  }}
                                >
                                  {ord.status}
                                </span>
                              </td>
                              <td style={{ padding: "0.95rem 1rem", textAlign: "right" }}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedOrderDetails(ord)}
                                  style={{
                                    padding: "4px 9px",
                                    borderRadius: "6px",
                                    border: "1px solid var(--color-border)",
                                    backgroundColor: "#ffffff",
                                    fontSize: "0.78rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: PRODUCTS LIST */}
              {activeTab === "products" && (
                <div>
                  {/* Toolbar & Filters */}
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "1rem 1.25rem",
                      borderRadius: "16px",
                      border: "1px solid var(--color-border)",
                      marginBottom: "1.25rem",
                      boxShadow: "var(--shadow-sm)",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ position: "relative", flex: "1 1 240px", maxWidth: "340px" }}>
                      <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Search products by name..."
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.75rem 0.55rem 2.1rem",
                          borderRadius: "8px",
                          border: "1px solid var(--color-border)",
                          fontSize: "0.85rem",
                        }}
                      />
                    </div>

                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.82rem", backgroundColor: "#ffffff" }}
                      >
                        <option value="all">All Categories</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>

                      <select
                        value={taxFilter}
                        onChange={(e) => setTaxFilter(e.target.value)}
                        style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.82rem", backgroundColor: "#ffffff" }}
                      >
                        <option value="all">All Tax Rates</option>
                        <option value="0">0% GST (Tax Exempt)</option>
                        <option value="5">5% GST</option>
                        <option value="12">12% GST</option>
                        <option value="18">18% GST (Standard)</option>
                        <option value="28">28% GST</option>
                      </select>

                      <select
                        value={stockFilter}
                        onChange={(e) => setStockFilter(e.target.value)}
                        style={{ padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.82rem", backgroundColor: "#ffffff" }}
                      >
                        <option value="all">All Stock Status</option>
                        <option value="instock">In Stock Only</option>
                        <option value="outofstock">Out of Stock</option>
                      </select>

                      <div style={{ display: "inline-flex", borderRadius: "8px", border: "1px solid var(--color-border)", overflow: "hidden" }}>
                        <button
                          type="button"
                          onClick={() => setProductViewMode("cards")}
                          style={{
                            padding: "0.45rem 0.65rem",
                            backgroundColor: productViewMode === "cards" ? "var(--color-cream-subtle)" : "#ffffff",
                            color: productViewMode === "cards" ? "var(--color-terracotta)" : "var(--color-text-secondary)",
                            cursor: "pointer",
                          }}
                          title="Card Grid View"
                        >
                          <LayoutGrid size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductViewMode("table")}
                          style={{
                            padding: "0.45rem 0.65rem",
                            backgroundColor: productViewMode === "table" ? "var(--color-cream-subtle)" : "#ffffff",
                            color: productViewMode === "table" ? "var(--color-terracotta)" : "var(--color-text-secondary)",
                            cursor: "pointer",
                          }}
                          title="Table View"
                        >
                          <List size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleOpenAddProduct}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          padding: "0.5rem 1rem",
                          borderRadius: "8px",
                          backgroundColor: "var(--color-terracotta)",
                          color: "#ffffff",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <Plus size={15} /> Add Product
                      </button>
                    </div>
                  </div>

                  {/* CARDS VIEW */}
                  {productViewMode === "cards" ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                      {filteredProducts.map((soap) => (
                        <div
                          key={soap.id}
                          style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            border: "1px solid var(--color-border)",
                            overflow: "hidden",
                            boxShadow: "var(--shadow-sm)",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div style={{ position: "relative", height: "180px", backgroundColor: "var(--color-cream-subtle)" }}>
                            <Image
                              src={soap.image}
                              alt={soap.name}
                              fill
                              sizes="(max-width: 600px) 100vw, 320px"
                              style={{ objectFit: "cover" }}
                            />
                            <div style={{ position: "absolute", top: "10px", left: "10px", display: "flex", gap: "5px" }}>
                              <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", backgroundColor: soap.inStock !== false ? "#16a34a" : "#dc2626", color: "#ffffff" }}>
                                {soap.inStock !== false ? "In Stock" : "Sold Out"}
                              </span>
                              {soap.taxRate === 0 ? (
                                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", backgroundColor: "#2563eb", color: "#ffffff" }}>
                                  0% GST Exempt
                                </span>
                              ) : (
                                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px", borderRadius: "9999px", backgroundColor: "rgba(0,0,0,0.65)", color: "#ffffff" }}>
                                  {soap.taxRate}% GST ({soap.taxType || "incl"})
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ padding: "1.15rem", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                            <div style={{ fontSize: "0.75rem", color: "var(--color-terracotta)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                              {soap.mainCategory}
                            </div>
                            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", margin: "0 0 0.35rem", fontWeight: 700, color: "var(--color-dragon-black)" }}>
                              {soap.name}
                            </h3>
                            <p style={{ margin: "0 0 0.85rem", fontSize: "0.78rem", color: "var(--color-text-secondary)", lineHeight: 1.4, flexGrow: 1 }}>
                              {soap.tagline}
                            </p>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderTop: "1px dashed var(--color-border)", paddingTop: "0.75rem", marginBottom: "0.85rem" }}>
                              <div>
                                <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-dragon-black)" }}>
                                  ₹{soap.price.toLocaleString("en-IN")}
                                </span>
                                {soap.originalPrice && (
                                  <span style={{ fontSize: "0.8rem", color: "var(--color-text-tertiary)", textDecoration: "line-through", marginLeft: "6px" }}>
                                    ₹{soap.originalPrice}
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: "0.76rem", color: "var(--color-text-secondary)", fontWeight: 600 }}>
                                {soap.weight}
                              </span>
                            </div>

                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(soap)}
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "4px",
                                  padding: "0.55rem",
                                  borderRadius: "8px",
                                  border: "1px solid var(--color-border)",
                                  backgroundColor: "#ffffff",
                                  fontSize: "0.82rem",
                                  fontWeight: 600,
                                  cursor: "pointer",
                                }}
                              >
                                <Pencil size={13} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setConfirmModal({
                                    title: "Delete Product",
                                    message: `Are you sure you want to delete "${soap.name}" from your catalog?`,
                                    confirmLabel: "Delete",
                                    onConfirm: () => {
                                      deleteProduct(soap.id);
                                      showNotification(`"${soap.name}" deleted.`);
                                    },
                                  });
                                }}
                                style={{
                                  padding: "0.55rem 0.75rem",
                                  borderRadius: "8px",
                                  border: "1px solid #fee2e2",
                                  backgroundColor: "#fff5f5",
                                  color: "#dc2626",
                                  cursor: "pointer",
                                }}
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* TABLE VIEW */
                    <div className="admin-table-card">
                      <div className="admin-table-scroll">
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                          <thead>
                            <tr style={{ backgroundColor: "var(--color-cream-subtle)", borderBottom: "1px solid var(--color-border)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
                              <th style={{ padding: "0.85rem 1rem" }}>Product</th>
                              <th style={{ padding: "0.85rem 1rem" }}>Category</th>
                              <th style={{ padding: "0.85rem 1rem" }}>Weight</th>
                              <th style={{ padding: "0.85rem 1rem" }}>Price (INR)</th>
                              <th style={{ padding: "0.85rem 1rem" }}>GST Tax Rate</th>
                              <th style={{ padding: "0.85rem 1rem" }}>Stock Status</th>
                              <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredProducts.map((soap) => (
                              <tr key={soap.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ position: "relative", width: "42px", height: "42px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, backgroundColor: "var(--color-cream-subtle)" }}>
                                      <Image src={soap.image} alt={soap.name} fill sizes="42px" style={{ objectFit: "cover" }} />
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{soap.name}</div>
                                      <div style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>/{soap.slug || soap.id}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem", fontSize: "0.85rem" }}>
                                  {soap.mainCategory}
                                </td>
                                <td style={{ padding: "0.85rem 1rem", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                                  {soap.weight}
                                </td>
                                <td style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>
                                  ₹{soap.price.toLocaleString("en-IN")}
                                </td>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <span
                                    style={{
                                      fontSize: "0.74rem",
                                      padding: "2px 7px",
                                      borderRadius: "6px",
                                      fontWeight: 700,
                                      backgroundColor: soap.taxRate === 0 ? "#e0f2fe" : "var(--color-cream-subtle)",
                                      color: soap.taxRate === 0 ? "#0369a1" : "var(--color-dragon-black)",
                                    }}
                                  >
                                    {soap.taxRate}% GST ({soap.taxType || "incl"})
                                  </span>
                                </td>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateProduct(soap.id, { inStock: soap.inStock === false });
                                      showNotification(`Stock status updated for "${soap.name}".`);
                                    }}
                                    style={{
                                      padding: "3px 8px",
                                      borderRadius: "6px",
                                      fontSize: "0.72rem",
                                      fontWeight: 700,
                                      border: "none",
                                      cursor: "pointer",
                                      backgroundColor: soap.inStock !== false ? "#dcfce7" : "#fee2e2",
                                      color: soap.inStock !== false ? "#15803d" : "#b91c1c",
                                    }}
                                  >
                                    {soap.inStock !== false ? "● In Stock" : "○ Sold Out"}
                                  </button>
                                </td>
                                <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                                  <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditProduct(soap)}
                                      style={{ padding: "5px", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "#ffffff", cursor: "pointer" }}
                                      title="Edit Product"
                                    >
                                      <Pencil size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setConfirmModal({
                                          title: "Delete Product",
                                          message: `Are you sure you want to delete "${soap.name}"?`,
                                          confirmLabel: "Delete",
                                          onConfirm: () => {
                                            deleteProduct(soap.id);
                                            showNotification(`"${soap.name}" deleted.`);
                                          },
                                        });
                                      }}
                                      style={{ padding: "5px", borderRadius: "6px", border: "1px solid #fee2e2", backgroundColor: "#fff5f5", color: "#dc2626", cursor: "pointer" }}
                                      title="Delete Product"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CATEGORIES LIST */}
              {activeTab === "categories" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    <div>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", margin: 0 }}>
                        Product Categories
                      </h2>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                        Organize store navigation and reorder display sequence on storefront.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddCategory}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem",
                        padding: "0.6rem 1.1rem",
                        borderRadius: "8px",
                        backgroundColor: "var(--color-terracotta)",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      <Plus size={16} /> Add Category
                    </button>
                  </div>

                  <div className="admin-table-card">
                    <div className="admin-table-scroll">
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ backgroundColor: "var(--color-cream-subtle)", borderBottom: "1px solid var(--color-border)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
                            <th style={{ padding: "0.85rem 1rem", width: "80px" }}>Order</th>
                            <th style={{ padding: "0.85rem 1rem", width: "70px" }}>Image</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Category Name</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Subcategories</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Products</th>
                            <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((cat, idx) => {
                            const countInCat = products.filter(
                              (p) => p.mainCategory.toLowerCase() === cat.name.toLowerCase()
                            ).length;
                            return (
                              <tr key={cat.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                                    <span style={{ fontWeight: 800, fontSize: "0.95rem", minWidth: "18px" }}>#{idx + 1}</span>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                      <button
                                        type="button"
                                        disabled={idx === 0}
                                        onClick={() => {
                                          reorderCategory(cat.id, "up");
                                          showNotification("Category moved up ▲");
                                        }}
                                        style={{
                                          padding: "2px 4px",
                                          borderRadius: "4px",
                                          backgroundColor: idx === 0 ? "#f3f4f6" : "var(--color-cream-subtle)",
                                          cursor: idx === 0 ? "not-allowed" : "pointer",
                                        }}
                                      >
                                        <ArrowUp size={11} />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={idx === categories.length - 1}
                                        onClick={() => {
                                          reorderCategory(cat.id, "down");
                                          showNotification("Category moved down ▼");
                                        }}
                                        style={{
                                          padding: "2px 4px",
                                          borderRadius: "4px",
                                          backgroundColor: idx === categories.length - 1 ? "#f3f4f6" : "var(--color-cream-subtle)",
                                          cursor: idx === categories.length - 1 ? "not-allowed" : "pointer",
                                        }}
                                      >
                                        <ArrowDown size={11} />
                                      </button>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <div style={{ width: "44px", height: "44px", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-border)", backgroundColor: "var(--color-cream-subtle)" }}>
                                    <Image
                                      src={cat.image || "/images/products/dragons-blood.jpg"}
                                      alt={cat.name}
                                      width={44}
                                      height={44}
                                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                  </div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem", fontWeight: 700 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                    <span>{cat.name}</span>
                                    {cat.parentCategory ? (
                                      <span style={{ fontSize: "0.68rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--color-cream-subtle)", color: "var(--color-terracotta)", fontWeight: 700 }}>
                                        ↳ Subcategory of {cat.parentCategory}
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: "0.68rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: "rgba(34, 197, 94, 0.12)", color: "#16a34a", fontWeight: 700 }}>
                                        ★ Main Category
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
                                    <span>/{cat.slug || cat.id}</span>
                                    <span>•</span>
                                    <Link href={`/category/${cat.slug || cat.id}`} target="_blank" style={{ color: "var(--color-terracotta)", display: "inline-flex", alignItems: "center", gap: "2px", textDecoration: "none", fontWeight: 600 }}>
                                      View Page <ExternalLink size={10} />
                                    </Link>
                                  </div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem" }}>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                    {cat.subcategories.map((sub, i) => (
                                      <span key={i} style={{ fontSize: "0.72rem", padding: "2px 6px", borderRadius: "4px", backgroundColor: "var(--color-cream-subtle)", color: "var(--color-text-secondary)" }}>
                                        {sub}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>
                                  {countInCat} products
                                </td>
                                <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                                  <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditCategory(cat)}
                                      style={{ padding: "5px", borderRadius: "6px", border: "1px solid var(--color-border)", backgroundColor: "#ffffff", cursor: "pointer" }}
                                      title="Edit Category & SEO"
                                    >
                                      <Pencil size={13} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setConfirmModal({
                                          title: "Delete Category",
                                          message: `Are you sure you want to delete category "${cat.name}"? Products will remain in store.`,
                                          confirmLabel: "Delete",
                                          onConfirm: () => {
                                            deleteCategory(cat.id);
                                            showNotification(`Category "${cat.name}" deleted.`);
                                          },
                                        });
                                      }}
                                      style={{ padding: "5px", borderRadius: "6px", border: "1px solid #fee2e2", backgroundColor: "#fff5f5", color: "#dc2626", cursor: "pointer" }}
                                      title="Delete Category"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: HERO SHOWCASE (ROTATING HOMEPAGE BANNERS) */}
              {activeTab === "hero" && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", margin: "0 0 0.35rem", color: "var(--color-dragon-black)" }}>
                        Homepage Hero Showcase &amp; Rotating Slides
                      </h2>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                        Curate and schedule the luxury rotating hero banners displayed on the storefront. Add custom images, headlines, and calls-to-action.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenAddHero}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        padding: "0.6rem 1.15rem",
                        borderRadius: "8px",
                        backgroundColor: "var(--color-terracotta)",
                        color: "#ffffff",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px var(--color-terracotta-glow)",
                      }}
                    >
                      <Plus size={16} /> Add Hero Slide
                    </button>
                  </div>

                  {(!heroSlides || heroSlides.length === 0) ? (
                    <div className="admin-card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                      <Sparkles size={36} color="var(--color-terracotta)" style={{ margin: "0 auto 1rem" }} />
                      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.2rem", margin: "0 0 0.5rem" }}>No Hero Slides Configured</h3>
                      <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", maxWidth: "420px", margin: "0 auto 1.5rem" }}>
                        Click below to create your first artisanal hero slide or reset to factory defaults to load initial slides.
                      </p>
                      <button
                        type="button"
                        onClick={handleOpenAddHero}
                        style={{
                          padding: "0.65rem 1.25rem",
                          borderRadius: "8px",
                          backgroundColor: "var(--color-terracotta)",
                          color: "#ffffff",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Create First Hero Slide
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                      {heroSlides.map((slide, index) => (
                        <div
                          key={slide.id || index}
                          className="admin-card"
                          style={{
                            padding: "1.25rem",
                            border: slide.isActive ? "1px solid var(--color-border)" : "1px dashed #d1d5db",
                            opacity: slide.isActive ? 1 : 0.7,
                            backgroundColor: slide.isActive ? "#ffffff" : "#fbfbfc",
                          }}
                        >
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", alignItems: "center" }}>
                            {/* Slide Preview Banner */}
                            <div
                              style={{
                                position: "relative",
                                width: "100%",
                                height: "170px",
                                borderRadius: "12px",
                                overflow: "hidden",
                                backgroundColor: "var(--color-dragon-black)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                padding: "1rem",
                              }}
                            >
                              <Image
                                src={slide.image || PRESET_IMAGES[0].url}
                                alt={slide.imageAlt || slide.headline}
                                fill
                                sizes="400px"
                                style={{ objectFit: "cover", opacity: 0.65 }}
                              />
                              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(17,17,17,0.95) 0%, rgba(17,17,17,0.3) 60%, transparent 100%)" }} />

                              <div style={{ position: "relative", zIndex: 2 }}>
                                {slide.badge && (
                                  <span
                                    style={{
                                      display: "inline-block",
                                      fontSize: "0.68rem",
                                      fontWeight: 800,
                                      textTransform: "uppercase",
                                      letterSpacing: "0.08em",
                                      padding: "0.2rem 0.55rem",
                                      borderRadius: "9999px",
                                      backgroundColor: "var(--color-terracotta)",
                                      color: "#ffffff",
                                      marginBottom: "0.35rem",
                                    }}
                                  >
                                    {slide.badge}
                                  </span>
                                )}
                                <h4 style={{ fontFamily: "var(--font-serif)", fontSize: "1.05rem", color: "#ffffff", margin: "0 0 0.2rem", fontWeight: 700, whiteSpace: "pre-line" }}>
                                  {slide.headline}
                                </h4>
                                {slide.subheadline && (
                                  <p style={{ margin: 0, fontSize: "0.74rem", color: "#e4e4e7", opacity: 0.9 }}>
                                    {slide.subheadline}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Slide Details */}
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.6rem" }}>
                                <span
                                  style={{
                                    fontSize: "0.72rem",
                                    fontWeight: 700,
                                    padding: "0.2rem 0.6rem",
                                    borderRadius: "9999px",
                                    backgroundColor: slide.isActive ? "rgba(46, 125, 50, 0.12)" : "rgba(100, 116, 139, 0.12)",
                                    color: slide.isActive ? "#2e7d32" : "#64748b",
                                  }}
                                >
                                  {slide.isActive ? "● Active on Homepage" : "○ Hidden from Rotation"}
                                </span>
                                <span style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)", fontWeight: 600 }}>
                                  Slide Position #{index + 1}
                                </span>
                              </div>

                              <div style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)", marginBottom: "0.8rem", lineHeight: 1.5 }}>
                                {slide.description || "No description provided."}
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.75rem", color: "var(--color-text-tertiary)", flexWrap: "wrap" }}>
                                <span><strong>Button CTA:</strong> {slide.ctaText || "Claim Your Bar"}</span>
                                <span><strong>Links To:</strong> <code>{slide.ctaLink || "/#all-soaps"}</code></span>
                              </div>
                            </div>

                            {/* Actions Toolbar */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", justifyContent: "center" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <button
                                  type="button"
                                  onClick={() => handleMoveHeroSlide(index, "up")}
                                  disabled={index === 0}
                                  style={{
                                    flex: 1,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.25rem",
                                    padding: "0.45rem",
                                    borderRadius: "6px",
                                    border: "1px solid var(--color-border)",
                                    backgroundColor: index === 0 ? "#f4f4f5" : "#ffffff",
                                    color: index === 0 ? "#a1a1aa" : "var(--color-dragon-black)",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: index === 0 ? "not-allowed" : "pointer",
                                  }}
                                  title="Move Earlier in Carousel"
                                >
                                  <ArrowUp size={13} /> Up
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveHeroSlide(index, "down")}
                                  disabled={index === heroSlides.length - 1}
                                  style={{
                                    flex: 1,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.25rem",
                                    padding: "0.45rem",
                                    borderRadius: "6px",
                                    border: "1px solid var(--color-border)",
                                    backgroundColor: index === heroSlides.length - 1 ? "#f4f4f5" : "#ffffff",
                                    color: index === heroSlides.length - 1 ? "#a1a1aa" : "var(--color-dragon-black)",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: index === heroSlides.length - 1 ? "not-allowed" : "pointer",
                                  }}
                                  title="Move Later in Carousel"
                                >
                                  <ArrowDown size={13} /> Down
                                </button>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                <button
                                  type="button"
                                  onClick={() => handleToggleHeroSlideActive(slide)}
                                  style={{
                                    flex: 1,
                                    padding: "0.45rem 0.6rem",
                                    borderRadius: "6px",
                                    border: "1px solid var(--color-border)",
                                    backgroundColor: slide.isActive ? "#f0fdf4" : "#ffffff",
                                    color: slide.isActive ? "#166534" : "var(--color-text-secondary)",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  {slide.isActive ? "Hide" : "Show"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenEditHero(slide)}
                                  style={{
                                    flex: 1,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "0.25rem",
                                    padding: "0.45rem 0.6rem",
                                    borderRadius: "6px",
                                    border: "1px solid var(--color-border)",
                                    backgroundColor: "#ffffff",
                                    color: "var(--color-dragon-black)",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                  }}
                                >
                                  <Pencil size={13} /> Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteHeroSlide(slide.id)}
                                  style={{
                                    padding: "0.45rem 0.6rem",
                                    borderRadius: "6px",
                                    border: "1px solid #fee2e2",
                                    backgroundColor: "#fff5f5",
                                    color: "#dc2626",
                                    cursor: "pointer",
                                  }}
                                  title="Delete Hero Slide"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* HERO SLIDE MODAL EDITOR */}
                  {isHeroModalOpen && (
                    <div
                      style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        backdropFilter: "blur(4px)",
                        zIndex: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "1rem",
                      }}
                      onClick={() => setIsHeroModalOpen(false)}
                    >
                      <div
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: "16px",
                          width: "100%",
                          maxWidth: "620px",
                          maxHeight: "90vh",
                          overflowY: "auto",
                          padding: "1.75rem",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem" }}>
                          <div>
                            <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", margin: "0 0 0.2rem", color: "var(--color-dragon-black)" }}>
                              {editingHeroSlide ? "Edit Hero Slide" : "Create New Hero Slide"}
                            </h3>
                            <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                              Slide will immediately update MongoDB and sync with the homepage showcase.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsHeroModalOpen(false)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}
                          >
                            <X size={20} />
                          </button>
                        </div>

                        <form onSubmit={handleSaveHeroSlide} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                              Headline <span style={{ color: "var(--color-terracotta)" }}>*</span> (Use Enter for 2-line styling)
                            </label>
                            <textarea
                              rows={2}
                              value={heroFormHeadline}
                              onChange={(e) => setHeroFormHeadline(e.target.value)}
                              placeholder="e.g. Dragon's Blood&#10;Artisanal Soap"
                              required
                              style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem", fontFamily: "inherit" }}
                            />
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                                Subheadline / Botanical Accent
                              </label>
                              <input
                                type="text"
                                value={heroFormSubheadline}
                                onChange={(e) => setHeroFormSubheadline(e.target.value)}
                                placeholder="e.g. Sacred Dragon's Blood Resin · Himalayan Pink Salt"
                                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}
                              />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                                Badge Label
                              </label>
                              <input
                                type="text"
                                value={heroFormBadge}
                                onChange={(e) => setHeroFormBadge(e.target.value)}
                                placeholder="e.g. Best Seller, New Arrival, Signature"
                                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}
                              />
                            </div>
                          </div>

                          <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                              Story &amp; Benefits Description
                            </label>
                            <textarea
                              rows={3}
                              value={heroFormDescription}
                              onChange={(e) => setHeroFormDescription(e.target.value)}
                              placeholder="Hand-poured with sacred wild Dragon's Blood resin and cold-pressed lipids..."
                              style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.85rem", fontFamily: "inherit" }}
                            />
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                                Call-to-Action Text
                              </label>
                              <input
                                type="text"
                                value={heroFormCtaText}
                                onChange={(e) => setHeroFormCtaText(e.target.value)}
                                placeholder="Claim Your Bar"
                                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}
                              />
                            </div>
                            <div>
                              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                                Destination Link
                              </label>
                              <input
                                type="text"
                                value={heroFormCtaLink}
                                onChange={(e) => setHeroFormCtaLink(e.target.value)}
                                placeholder="/#all-soaps"
                                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}
                              />
                            </div>
                          </div>

                          {/* Hero Banner Image: Upload or Direct URL */}
                          <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                              Hero Background Banner Image <span style={{ color: "var(--color-terracotta)" }}>*</span>
                            </label>

                            {/* Live Preview & Local Upload */}
                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap", marginBottom: "0.75rem", backgroundColor: "var(--color-cream-subtle)", padding: "0.85rem", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
                              <div style={{ width: "130px", height: "72px", borderRadius: "8px", overflow: "hidden", border: "1.5px solid var(--color-terracotta)", position: "relative", flexShrink: 0, backgroundColor: "#ffffff" }}>
                                {heroFormImage ? (
                                  <Image
                                    src={heroFormImage}
                                    alt="Hero banner preview"
                                    fill
                                    sizes="130px"
                                    style={{ objectFit: "cover" }}
                                  />
                                ) : (
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>
                                    No Image
                                  </div>
                                )}
                              </div>

                              <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <input
                                  type="file"
                                  ref={heroFileInputRef}
                                  accept="image/*"
                                  onChange={handleHeroImageFileUpload}
                                  style={{ display: "none" }}
                                />
                                <button
                                  type="button"
                                  onClick={() => heroFileInputRef.current?.click()}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.45rem",
                                    padding: "0.5rem 0.95rem",
                                    borderRadius: "8px",
                                    backgroundColor: "var(--color-dragon-black)",
                                    color: "#ffffff",
                                    fontSize: "0.82rem",
                                    fontWeight: 700,
                                    border: "none",
                                    cursor: "pointer",
                                    width: "fit-content",
                                  }}
                                >
                                  <Upload size={14} /> Upload Banner from Computer
                                </button>

                                <div>
                                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "0.2rem" }}>
                                    Or Direct Banner URL:
                                  </label>
                                  <input
                                    type="text"
                                    value={heroFormImage}
                                    onChange={(e) => setHeroFormImage(e.target.value)}
                                    placeholder="https://... or /images/..."
                                    required
                                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.82rem" }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Direct Cloudinary Upload for Hero */}
                            <ImageUpload
                              currentImage={heroFormImage}
                              folder="starlight/hero"
                              label="Or Upload to Cloudinary Cloud Storage"
                              onUpload={(url, publicId, alt) => {
                                setHeroFormImage(url);
                                if (alt) setHeroFormImageAlt(alt);
                                showNotification("Hero image uploaded to Cloudinary!");
                              }}
                            />
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
                            <div>
                              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                                Image SEO Alt Text
                              </label>
                              <input
                                type="text"
                                value={heroFormImageAlt}
                                onChange={(e) => setHeroFormImageAlt(e.target.value)}
                                placeholder="Description for search engines"
                                style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.85rem" }}
                              />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", paddingTop: "1.4rem" }}>
                              <input
                                type="checkbox"
                                id="heroActiveCheckbox"
                                checked={heroFormIsActive}
                                onChange={(e) => setHeroFormIsActive(e.target.checked)}
                                style={{ width: "18px", height: "18px", accentColor: "var(--color-terracotta)" }}
                              />
                              <label htmlFor="heroActiveCheckbox" style={{ fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                                Active in Homepage Rotation
                              </label>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem", borderTop: "1px solid var(--color-border)", paddingTop: "1rem" }}>
                            <button
                              type="button"
                              onClick={() => setIsHeroModalOpen(false)}
                              style={{
                                padding: "0.65rem 1.15rem",
                                borderRadius: "8px",
                                border: "1px solid var(--color-border)",
                                backgroundColor: "#ffffff",
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              style={{
                                padding: "0.65rem 1.35rem",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "var(--color-terracotta)",
                                color: "#ffffff",
                                fontSize: "0.85rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                boxShadow: "0 2px 8px var(--color-terracotta-glow)",
                              }}
                            >
                              {editingHeroSlide ? "Save Changes" : "Create Slide"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SHIPPING RATES */}
              {activeTab === "shipping" && (
                <div>
                  <div style={{ marginBottom: "1.25rem" }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", margin: "0 0 0.35rem" }}>
                      Shipping Rates &amp; State Delivery Matrix
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                      Configure standard flat rates, free shipping threshold, and state-wise Indian rates.
                    </p>
                  </div>

                  <form onSubmit={handleSaveShippingSettings} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                      {/* Flat Rate Card */}
                      <div className="admin-card">
                        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", margin: "0 0 0.4rem" }}>
                          Standard Flat Shipping
                        </h3>
                        <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                          Base dispatch fee when order value is below free shipping threshold.
                        </p>
                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                            Flat Shipping Fee (INR ₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={flatRateInput}
                            onWheel={(e) => (e.target as HTMLElement).blur()}
                            onChange={(e) => setFlatRateInput(Number(e.target.value))}
                            style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.95rem", fontWeight: 700 }}
                          />
                        </div>
                      </div>

                      {/* Free Shipping Threshold Card */}
                      <div className="admin-card">
                        <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.1rem", margin: "0 0 0.4rem" }}>
                          Free Shipping Threshold
                        </h3>
                        <p style={{ margin: "0 0 1rem", fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                          Orders equal to or exceeding this order amount receive ₹0 complimentary shipping.
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                          <input
                            type="checkbox"
                            id="enableFreeThreshold"
                            checked={enableFreeThresholdInput}
                            onChange={(e) => setEnableFreeThresholdInput(e.target.checked)}
                            style={{ width: "16px", height: "16px", cursor: "pointer" }}
                          />
                          <label htmlFor="enableFreeThreshold" style={{ fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
                            Enable Free Shipping Threshold
                          </label>
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                            Threshold Amount (INR ₹)
                          </label>
                          <input
                            type="number"
                            min="0"
                            disabled={!enableFreeThresholdInput}
                            value={freeThresholdInput}
                            onWheel={(e) => (e.target as HTMLElement).blur()}
                            onChange={(e) => setFreeThresholdInput(Number(e.target.value))}
                            style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.95rem", fontWeight: 700 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* State-Wise Shipping Rates Table */}
                    <div className="admin-table-card">
                      <div style={{ padding: "1.15rem 1.4rem", borderBottom: "1px solid var(--color-border)", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                        <div>
                          <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.15rem", margin: 0 }}>
                            State-Wise Shipping Rates ({Object.keys(stateRatesInput).length} States)
                          </h3>
                          <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                            Customers are charged based on their delivery state chosen in the cart drawer.
                          </p>
                        </div>

                        <div style={{ position: "relative", width: "220px" }}>
                          <Search size={14} style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                          <input
                            type="text"
                            value={stateSearchFilter}
                            onChange={(e) => setStateSearchFilter(e.target.value)}
                            placeholder="Filter state name..."
                            style={{ width: "100%", padding: "0.45rem 0.65rem 0.45rem 1.9rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.8rem" }}
                          />
                        </div>
                      </div>

                      <div className="admin-table-scroll" style={{ maxHeight: "380px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                          <thead>
                            <tr style={{ backgroundColor: "var(--color-cream-subtle)", borderBottom: "1px solid var(--color-border)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
                              <th style={{ padding: "0.75rem 1rem" }}>State / Region</th>
                              <th style={{ padding: "0.75rem 1rem" }}>Courier Rate (INR ₹)</th>
                              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(stateRatesInput)
                              .filter(([st]) => stateSearchFilter.trim() === "" || st.toLowerCase().includes(stateSearchFilter.toLowerCase()))
                              .map(([st, rate]) => (
                                <tr key={st} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                  <td style={{ padding: "0.7rem 1rem", fontWeight: 600, fontSize: "0.88rem" }}>
                                    {st}
                                  </td>
                                  <td style={{ padding: "0.7rem 1rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                      <span>₹</span>
                                      <input
                                        type="number"
                                        min="0"
                                        value={rate}
                                        onWheel={(e) => (e.target as HTMLElement).blur()}
                                        onChange={(e) => {
                                          const val = Number(e.target.value);
                                          setStateRatesInput((prev) => ({ ...prev, [st]: val }));
                                        }}
                                        style={{ width: "90px", padding: "0.35rem 0.55rem", borderRadius: "6px", border: "1px solid var(--color-border)", fontSize: "0.85rem", fontWeight: 700 }}
                                      />
                                    </div>
                                  </td>
                                  <td style={{ padding: "0.7rem 1rem", textAlign: "right" }}>
                                    <span style={{ fontSize: "0.72rem", color: "var(--color-terracotta)", fontWeight: 700 }}>
                                      Configured
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                      <button
                        type="submit"
                        style={{
                          padding: "0.75rem 1.75rem",
                          borderRadius: "10px",
                          backgroundColor: "var(--color-terracotta)",
                          color: "#ffffff",
                          fontSize: "0.92rem",
                          fontWeight: 700,
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 4px 14px var(--color-terracotta-glow)",
                        }}
                      >
                        Save Shipping Rates &amp; Delivery Rules
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 4: OFFERS & DISCOUNTS */}
              {activeTab === "offers" && (
                <div>
                  <div style={{ marginBottom: "1.25rem" }}>
                    <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", margin: "0 0 0.35rem" }}>
                      Promotional Offers &amp; Banners
                    </h2>
                    <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                      Update homepage festival collector box and secondary wellness showcase banners.
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.5rem" }}>
                    {/* Primary Festival Offer */}
                    <div className="admin-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <span style={{ fontSize: "0.74rem", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", backgroundColor: "var(--color-terracotta-light)", color: "var(--color-terracotta-dark)", textTransform: "uppercase" }}>
                          Primary Festival Offer
                        </span>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={primaryOffer.isActive}
                            onChange={(e) => updatePrimaryOffer({ isActive: e.target.checked })}
                          />
                          Active
                        </label>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Offer Title</label>
                          <input
                            type="text"
                            value={primaryOffer.title}
                            onChange={(e) => updatePrimaryOffer({ title: e.target.value })}
                            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Subtitle</label>
                          <input
                            type="text"
                            value={primaryOffer.subtitle}
                            onChange={(e) => updatePrimaryOffer({ subtitle: e.target.value })}
                            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}
                          />
                        </div>

                        <div className="admin-form-row-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Promo Code</label>
                            <input
                              type="text"
                              value={primaryOffer.promoCode}
                              onChange={(e) => updatePrimaryOffer({ promoCode: e.target.value.toUpperCase() })}
                              style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem", fontWeight: 700 }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Discount (%)</label>
                            <input
                              type="number"
                              value={primaryOffer.discountPercent}
                              onWheel={(e) => (e.target as HTMLElement).blur()}
                              onChange={(e) => updatePrimaryOffer({ discountPercent: Number(e.target.value) })}
                              style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}
                            />
                          </div>
                        </div>

                        <div className="admin-form-row-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Sale Price (₹)</label>
                            <input
                              type="number"
                              value={primaryOffer.salePrice}
                              onWheel={(e) => (e.target as HTMLElement).blur()}
                              onChange={(e) => updatePrimaryOffer({ salePrice: Number(e.target.value) })}
                              style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem", fontWeight: 700 }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Original Price (₹)</label>
                            <input
                              type="number"
                              value={primaryOffer.originalPrice}
                              onWheel={(e) => (e.target as HTMLElement).blur()}
                              onChange={(e) => updatePrimaryOffer({ originalPrice: Number(e.target.value) })}
                              style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => showNotification("Primary festival offer saved successfully!")}
                          style={{ marginTop: "0.5rem", padding: "0.65rem", borderRadius: "8px", backgroundColor: "var(--color-terracotta)", color: "#ffffff", fontWeight: 700, border: "none", cursor: "pointer" }}
                        >
                          Save Primary Offer
                        </button>
                      </div>
                    </div>

                    {/* Secondary Offer */}
                    <div className="admin-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                        <span style={{ fontSize: "0.74rem", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", backgroundColor: "#fef3c7", color: "#b45309", textTransform: "uppercase" }}>
                          Secondary Promotional Offer
                        </span>
                        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                          <input
                            type="checkbox"
                            checked={secondaryOffer.isActive}
                            onChange={(e) => updateSecondaryOffer({ isActive: e.target.checked })}
                          />
                          Active
                        </label>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Offer Title</label>
                          <input
                            type="text"
                            value={secondaryOffer.title}
                            onChange={(e) => updateSecondaryOffer({ title: e.target.value })}
                            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Subtitle</label>
                          <input
                            type="text"
                            value={secondaryOffer.subtitle}
                            onChange={(e) => updateSecondaryOffer({ subtitle: e.target.value })}
                            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}
                          />
                        </div>

                        <div className="admin-form-row-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Promo Code</label>
                            <input
                              type="text"
                              value={secondaryOffer.promoCode}
                              onChange={(e) => updateSecondaryOffer({ promoCode: e.target.value.toUpperCase() })}
                              style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem", fontWeight: 700 }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Discount (%)</label>
                            <input
                              type="number"
                              value={secondaryOffer.discountPercent}
                              onWheel={(e) => (e.target as HTMLElement).blur()}
                              onChange={(e) => updateSecondaryOffer({ discountPercent: Number(e.target.value) })}
                              style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}
                            />
                          </div>
                        </div>

                        <div className="admin-form-row-2">
                          <div>
                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Sale Price (₹)</label>
                            <input
                              type="number"
                              value={secondaryOffer.salePrice}
                              onWheel={(e) => (e.target as HTMLElement).blur()}
                              onChange={(e) => updateSecondaryOffer({ salePrice: Number(e.target.value) })}
                              style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem", fontWeight: 700 }}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.25rem" }}>Original Price (₹)</label>
                            <input
                              type="number"
                              value={secondaryOffer.originalPrice}
                              onWheel={(e) => (e.target as HTMLElement).blur()}
                              onChange={(e) => updateSecondaryOffer({ originalPrice: Number(e.target.value) })}
                              style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.88rem" }}
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => showNotification("Secondary offer saved successfully!")}
                          style={{ marginTop: "0.5rem", padding: "0.65rem", borderRadius: "8px", backgroundColor: "var(--color-dragon-black)", color: "#ffffff", fontWeight: 700, border: "none", cursor: "pointer" }}
                        >
                          Save Secondary Offer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ORDERS */}
              {activeTab === "orders" && (
                <div>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "1rem 1.25rem",
                      borderRadius: "16px",
                      border: "1px solid var(--color-border)",
                      marginBottom: "1.25rem",
                      boxShadow: "var(--shadow-sm)",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ position: "relative", flex: "1 1 240px", maxWidth: "340px" }}>
                      <Search size={15} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                      <input
                        type="text"
                        value={orderSearchQuery}
                        onChange={(e) => setOrderSearchQuery(e.target.value)}
                        placeholder="Search by order #, name, phone, state..."
                        style={{
                          width: "100%",
                          padding: "0.55rem 0.75rem 0.55rem 2.1rem",
                          borderRadius: "8px",
                          border: "1px solid var(--color-border)",
                          fontSize: "0.85rem",
                        }}
                      />
                    </div>

                    {/* Status & Payment Filters */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "0.3rem", backgroundColor: "var(--color-cream-subtle)", padding: "3px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                        {["all", "Processing", "Shipped", "Delivered"].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => setOrderStatusFilter(st)}
                            style={{
                              padding: "0.35rem 0.65rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              border: "none",
                              backgroundColor: orderStatusFilter === st ? "var(--color-dragon-black)" : "transparent",
                              color: orderStatusFilter === st ? "#ffffff" : "var(--color-text-secondary)",
                              cursor: "pointer",
                            }}
                          >
                            {st === "all" ? `All (${orders.length})` : st}
                          </button>
                        ))}
                      </div>

                      <div style={{ display: "flex", gap: "0.3rem", backgroundColor: "var(--color-cream-subtle)", padding: "3px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                        {[
                          { id: "all", label: "All Pay" },
                          { id: "Paid", label: "Paid" },
                          { id: "Pending", label: "Pending/COD" },
                        ].map((pm) => (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() => setOrderPaymentFilter(pm.id)}
                            style={{
                              padding: "0.35rem 0.65rem",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              border: "none",
                              backgroundColor: orderPaymentFilter === pm.id ? "var(--color-terracotta)" : "transparent",
                              color: orderPaymentFilter === pm.id ? "#ffffff" : "var(--color-text-secondary)",
                              cursor: "pointer",
                            }}
                          >
                            {pm.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="admin-table-card">
                    <div className="admin-table-scroll">
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ backgroundColor: "var(--color-cream-subtle)", borderBottom: "1px solid var(--color-border)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
                            <th style={{ padding: "0.85rem 1rem" }}>Order &amp; Date</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Customer &amp; Phone</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Destination</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Items</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Payment &amp; Gateway</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Total (INR)</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Fulfillment</th>
                            <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Inspect</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredOrders.length === 0 ? (
                            <tr>
                              <td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
                                No customer orders matching your search &amp; filter criteria.
                              </td>
                            </tr>
                          ) : (
                            filteredOrders.map((ord) => (
                              <tr key={ord.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                <td style={{ padding: "0.95rem 1rem", fontFamily: "monospace", fontWeight: 700 }}>
                                  #{ord.orderNumber}
                                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>
                                    {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent"}
                                  </div>
                                </td>
                                <td style={{ padding: "0.95rem 1rem" }}>
                                  <div style={{ fontWeight: 700 }}>{ord.customerName}</div>
                                  <div style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>{ord.customerEmail}</div>
                                  {ord.customerPhone && (
                                    <div style={{ fontSize: "0.73rem", color: "var(--color-terracotta)", fontWeight: 600, marginTop: "2px" }}>
                                      📞 {ord.customerPhone}
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: "0.95rem 1rem" }}>
                                  <div style={{ fontWeight: 600, color: "var(--color-terracotta)", fontSize: "0.85rem" }}>{ord.shippingState || "India"}</div>
                                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>Shipping: ₹{ord.shippingCost ?? ord.shipping ?? 0}</div>
                                </td>
                                <td style={{ padding: "0.95rem 1rem", fontSize: "0.84rem" }}>
                                  {ord.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                                </td>
                                <td style={{ padding: "0.95rem 1rem" }}>
                                  <div
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "5px",
                                      padding: "3px 8px",
                                      borderRadius: "6px",
                                      fontSize: "0.74rem",
                                      fontWeight: 700,
                                      backgroundColor: ord.paymentStatus === "Paid" ? "#dcfce7" : ord.paymentStatus === "Failed" ? "#fee2e2" : "#fef3c7",
                                      color: ord.paymentStatus === "Paid" ? "#15803d" : ord.paymentStatus === "Failed" ? "#b91c1c" : "#b45309",
                                    }}
                                  >
                                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "currentColor" }} />
                                    {ord.paymentStatus || (ord.paymentMethod === "cod" ? "Pending (COD)" : "Paid")}
                                  </div>
                                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-secondary)", marginTop: "3px", fontWeight: 600 }}>
                                    {ord.paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Razorpay Gateway"}
                                  </div>
                                  {ord.razorpayPaymentId && (
                                    <div style={{ fontSize: "0.68rem", color: "var(--color-text-tertiary)", fontFamily: "monospace" }}>
                                      ID: {ord.razorpayPaymentId.slice(0, 14)}...
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: "0.95rem 1rem", fontWeight: 800 }}>
                                  ₹{ord.total.toLocaleString("en-IN")}
                                  {(ord.taxAmount || 0) > 0 && (
                                    <div style={{ fontSize: "0.7rem", color: "var(--color-text-tertiary)" }}>
                                      (incl. ₹{ord.taxAmount} GST)
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: "0.95rem 1rem" }}>
                                  <select
                                    value={ord.status}
                                    onChange={(e) => {
                                      updateOrderStatus(ord.id, e.target.value as any);
                                      showNotification(`Order #${ord.orderNumber} status changed to ${e.target.value}.`);
                                    }}
                                    style={{
                                      padding: "4px 8px",
                                      borderRadius: "6px",
                                      fontSize: "0.78rem",
                                      fontWeight: 700,
                                      border: "1px solid var(--color-border)",
                                      backgroundColor:
                                        ord.status === "Delivered" ? "#dcfce7" : ord.status === "Shipped" ? "#e0f2fe" : "#fef3c7",
                                      color:
                                        ord.status === "Delivered" ? "#15803d" : ord.status === "Shipped" ? "#0369a1" : "#b45309",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                </td>
                                <td style={{ padding: "0.95rem 1rem", textAlign: "right", whiteSpace: "nowrap" }}>
                                  <div style={{ display: "inline-flex", gap: "0.4rem" }}>
                                    <button
                                      type="button"
                                      onClick={() => setInvoiceModalOrder(ord)}
                                      title="Print Tax Invoice"
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "4px",
                                        padding: "5px 9px",
                                        borderRadius: "6px",
                                        border: "1px solid var(--color-border)",
                                        backgroundColor: "var(--color-cream-subtle)",
                                        color: "var(--color-dragon-black)",
                                        fontSize: "0.76rem",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                      }}
                                    >
                                      <Printer size={13} />
                                      Invoice
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedOrderDetails(ord)}
                                      style={{
                                        padding: "5px 10px",
                                        borderRadius: "6px",
                                        border: "1px solid var(--color-border)",
                                        backgroundColor: "#ffffff",
                                        fontSize: "0.78rem",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                      }}
                                    >
                                      Details
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: CUSTOMERS */}
              {activeTab === "users" && (
                <div>
                  <div
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "1rem 1.25rem",
                      borderRadius: "16px",
                      border: "1px solid var(--color-border)",
                      marginBottom: "1.25rem",
                      boxShadow: "var(--shadow-sm)",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "0.75rem",
                    }}
                  >
                    <div>
                      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.35rem", margin: 0 }}>
                        Customer Directory ({users.length})
                      </h2>
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                        Registered customer accounts, contact numbers, and lifetime order histories.
                      </p>
                    </div>

                    <div style={{ position: "relative", width: "240px" }}>
                      <Search size={14} style={{ position: "absolute", left: "9px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
                      <input
                        type="text"
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        placeholder="Search customers..."
                        style={{ width: "100%", padding: "0.45rem 0.65rem 0.45rem 1.9rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontSize: "0.8rem" }}
                      />
                    </div>
                  </div>

                  <div className="admin-table-card">
                    <div className="admin-table-scroll">
                      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                          <tr style={{ backgroundColor: "var(--color-cream-subtle)", borderBottom: "1px solid var(--color-border)", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-secondary)" }}>
                            <th style={{ padding: "0.85rem 1rem" }}>Customer Name</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Contact Details</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Registered State</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Role</th>
                            <th style={{ padding: "0.85rem 1rem" }}>Total Orders</th>
                            <th style={{ padding: "0.85rem 1rem", textAlign: "right" }}>Lifetime Spend</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map((u) => (
                            <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                              <td style={{ padding: "0.95rem 1rem", fontWeight: 700 }}>
                                {u.name}
                              </td>
                              <td style={{ padding: "0.95rem 1rem" }}>
                                <div style={{ fontSize: "0.85rem" }}>{u.email}</div>
                                <div style={{ fontSize: "0.74rem", color: "var(--color-text-tertiary)" }}>{u.phone || "—"}</div>
                              </td>
                              <td style={{ padding: "0.95rem 1rem" }}>
                                <span style={{ fontWeight: 600, color: "var(--color-terracotta)", fontSize: "0.85rem" }}>
                                  {u.state || "Maharashtra"}
                                </span>
                              </td>
                              <td style={{ padding: "0.95rem 1rem" }}>
                                <span
                                  style={{
                                    fontSize: "0.72rem",
                                    padding: "2px 7px",
                                    borderRadius: "4px",
                                    fontWeight: 700,
                                    backgroundColor: u.role === "admin" ? "var(--color-terracotta)" : "var(--color-cream-subtle)",
                                    color: u.role === "admin" ? "#ffffff" : "var(--color-dragon-black)",
                                  }}
                                >
                                  {u.role.toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: "0.95rem 1rem", fontWeight: 600 }}>
                                {u.totalOrders || 0}
                              </td>
                              <td style={{ padding: "0.95rem 1rem", textAlign: "right", fontWeight: 800, color: "var(--color-terracotta)" }}>
                                ₹{(u.totalSpent || 0).toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ================================================================ */}
      {/* ORDER DETAILS INSPECTION MODAL */}
      {/* ================================================================ */}
      {selectedOrderDetails && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(17, 17, 19, 0.7)",
            backdropFilter: "blur(5px)",
            zIndex: 1500,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedOrderDetails(null);
          }}
        >
          <div className="admin-modal-card" style={{ maxWidth: "640px" }}>
            <div
              style={{
                padding: "1.15rem 1.5rem",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "var(--color-cream-subtle)",
              }}
            >
              <div>
                <h3 style={{ fontFamily: "monospace", fontSize: "1.2rem", margin: 0, fontWeight: 800 }}>
                  Order #{selectedOrderDetails.orderNumber}
                </h3>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-tertiary)" }}>
                  Confirmed on {new Date(selectedOrderDetails.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Customer Contact & Address */}
              <div style={{ backgroundColor: "var(--color-cream-subtle)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "1rem" }}>{selectedOrderDetails.customerName}</div>
                    <div style={{ fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                      {selectedOrderDetails.customerEmail} • {selectedOrderDetails.customerPhone || "No phone provided"}
                    </div>
                  </div>
                  {selectedOrderDetails.customerPhone && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <a
                        href={`https://wa.me/${selectedOrderDetails.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${selectedOrderDetails.customerName}, this is Star Light Co. regarding your Order #${selectedOrderDetails.orderNumber}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          padding: "0.35rem 0.65rem",
                          borderRadius: "6px",
                          backgroundColor: "#dcfce7",
                          color: "#15803d",
                          textDecoration: "none",
                        }}
                      >
                        💬 WhatsApp
                      </a>
                      <a
                        href={`tel:${selectedOrderDetails.customerPhone}`}
                        style={{
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          padding: "0.35rem 0.65rem",
                          borderRadius: "6px",
                          backgroundColor: "#fef3c7",
                          color: "#b45309",
                          textDecoration: "none",
                        }}
                      >
                        📞 Call
                      </a>
                    </div>
                  )}
                </div>
                <div style={{ fontSize: "0.82rem", marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed var(--color-border)" }}>
                  <strong>Shipping Address:</strong> {selectedOrderDetails.shippingAddress}, <strong>{selectedOrderDetails.shippingState}</strong> - {selectedOrderDetails.shippingPincode}
                </div>
              </div>

              {/* Payment & Gateway Booking Details */}
              <div style={{ backgroundColor: "#ffffff", padding: "1rem", borderRadius: "10px", border: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--color-text-secondary)" }}>Payment Status:</span>
                  <span
                    style={{
                      padding: "3px 10px",
                      borderRadius: "6px",
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      backgroundColor: selectedOrderDetails.paymentStatus === "Paid" ? "#dcfce7" : selectedOrderDetails.paymentStatus === "Failed" ? "#fee2e2" : "#fef3c7",
                      color: selectedOrderDetails.paymentStatus === "Paid" ? "#15803d" : selectedOrderDetails.paymentStatus === "Failed" ? "#b91c1c" : "#b45309",
                    }}
                  >
                    {selectedOrderDetails.paymentStatus || (selectedOrderDetails.paymentMethod === "cod" ? "Pending (COD)" : "Paid")}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Payment Method:</span>
                  <span style={{ fontWeight: 700 }}>
                    {selectedOrderDetails.paymentMethod === "cod" ? "💵 Cash on Delivery (COD)" : "💳 Razorpay Online Gateway"}
                  </span>
                </div>
                {selectedOrderDetails.razorpayOrderId && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.78rem" }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Razorpay Order ID:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{selectedOrderDetails.razorpayOrderId}</span>
                  </div>
                )}
                {selectedOrderDetails.razorpayPaymentId && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.78rem" }}>
                    <span style={{ color: "var(--color-text-secondary)" }}>Razorpay Payment ID:</span>
                    <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--color-terracotta)" }}>{selectedOrderDetails.razorpayPaymentId}</span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "0.78rem" }}>
                  <span style={{ color: "var(--color-text-secondary)" }}>Order Placed At:</span>
                  <span style={{ fontWeight: 600 }}>
                    {selectedOrderDetails.createdAt ? new Date(selectedOrderDetails.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "Recent"}
                  </span>
                </div>
              </div>

              <div>
                <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.88rem", fontWeight: 700 }}>Items Ordered</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {(selectedOrderDetails.items || []).map((it: any, idx: number) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.65rem", borderRadius: "8px", border: "1px solid var(--color-border)", backgroundColor: "#ffffff" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", backgroundColor: "var(--color-cream-subtle)" }}>
                          <Image src={it.image} alt={it.name} fill sizes="40px" style={{ objectFit: "cover" }} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{it.name}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--color-text-tertiary)" }}>Qty: {it.quantity} • {it.weight}</div>
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                        ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: "1px dashed var(--color-border)", paddingTop: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                  <span>Subtotal:</span>
                  <span>₹{selectedOrderDetails.subtotal?.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                  <span>State Courier Shipping ({selectedOrderDetails.shippingState || "India"}):</span>
                  <span>₹{selectedOrderDetails.shippingCost ?? selectedOrderDetails.shipping ?? 0}</span>
                </div>
                {(selectedOrderDetails.taxAmount || 0) > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "var(--color-text-secondary)", marginBottom: "4px" }}>
                    <span>GST Tax:</span>
                    <span>₹{selectedOrderDetails.taxAmount}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", fontWeight: 800, marginTop: "6px", paddingTop: "6px", borderTop: "1px solid var(--color-border)" }}>
                  <span>Grand Total:</span>
                  <span style={{ color: "var(--color-terracotta)" }}>₹{selectedOrderDetails.total?.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setInvoiceModalOrder(selectedOrderDetails)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.55rem 1rem",
                    borderRadius: "8px",
                    backgroundColor: "var(--color-dragon-black)",
                    color: "#ffffff",
                    border: "none",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <Printer size={15} />
                  Print GST Tax Invoice
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Dispatch Status:</span>
                  <select
                    value={selectedOrderDetails.status}
                    onChange={(e) => {
                      const nextSt = e.target.value as any;
                      updateOrderStatus(selectedOrderDetails.id, nextSt);
                      setSelectedOrderDetails((prev: any) => prev ? { ...prev, status: nextSt } : null);
                      showNotification(`Status updated to ${nextSt}.`);
                    }}
                    style={{ padding: "0.5rem 0.85rem", borderRadius: "8px", border: "1px solid var(--color-border)", fontWeight: 700 }}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Tax Invoice Modal */}
      <TaxInvoiceModal
        order={invoiceModalOrder}
        isOpen={Boolean(invoiceModalOrder)}
        onClose={() => setInvoiceModalOrder(null)}
      />
    </div>
  );
}
