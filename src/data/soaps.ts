export interface Soap {
  id: string;
  slug?: string;
  name: string;
  tagline: string;
  mainCategory: string;
  subCategory: string;
  category: "all" | "detox" | "hydration" | "calming" | "glow" | "festive";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  weight: string;
  weightValue?: number;
  weightUnit?: "g" | "kg";
  taxType?: "inclusive" | "exclusive"; // Tax including vs excluding
  taxRate?: number; // percentage (e.g. 5, 12, 18)
  cureTime: string;
  badge?: string;
  fragranceNotes: string[];
  scentPyramid?: {
    top: string[];
    heart: string[];
    base: string[];
  };
  keyIngredients: string[];
  fullIngredients: string[];
  skinType: string;
  soapBenefits: string[];
  ritualHowToUse: string;
  description: string;
  image: string;
  inStock: boolean;
  isBestseller?: boolean;
  isFestive?: boolean;
  // SEO Metadata
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface CategoryStructure {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  badge?: string;
  subcategories: string[];
  order?: number;
  // SEO Metadata
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface ShippingSettings {
  shippingType: "flat" | "free_threshold" | "state_wise";
  flatRate: number;
  freeShippingThreshold: number;
  enableFreeThreshold: boolean;
  defaultStateRate: number;
  stateRates: Record<string, number>;
}

export interface OfferBarItem {
  id: string;
  name: string;
  aroma: string;
  benefit: string;
  lather: string;
  botanical: string;
  weight: string;
  image: string;
}

export interface OfferSectionConfig {
  id: string;
  isActive: boolean;
  sectionTag: string;
  title: string;
  subtitle: string;
  description: string;
  badgeText: string;
  discountText: string;
  promoCode: string;
  discountPercent: number;
  originalPrice: number;
  salePrice: number;
  countdownDate: string;
  mainImage: string;
  bars: OfferBarItem[];
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: "customer" | "admin";
  address?: string;
  state?: string;
  pincode?: string;
  createdAt: string;
  totalOrders?: number;
  totalSpent?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  weight: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingState: string;
  shippingPincode: string;
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: "UPI" | "Card" | "NetBanking" | "Cash on Delivery";
  createdAt: string;
}

export const CATEGORIES_DATA: CategoryStructure[] = [
  {
    id: "Face & Gentle Cleansing",
    name: "Face & Gentle Cleansing",
    slug: "face-gentle-cleansing",
    description: "Ultra-pure botanical clay & delicate facial bars for balanced, radiant pores",
    image: "/images/products/charcoal-clay.jpg",
    badge: "Facial Atelier",
    subcategories: ["Pore Detox Clay", "Velvet Rose Calming", "Clarifying Mint"],
    order: 0,
    metaTitle: "Artisanal Face Soaps & Gentle Cleansing Bars | Star Light Co.",
    metaDescription: "Explore hand-poured facial bars with activated bamboo charcoal, white kaolin, and damask rose.",
  },
  {
    id: "Body & Deep Hydration",
    name: "Body & Deep Hydration",
    slug: "body-deep-hydration",
    description: "Sacred resin infusions & farm milk nourishment for deep dermal renewal",
    image: "/images/products/dragons-blood.jpg",
    badge: "Signature Body",
    subcategories: ["Dragon's Blood Firming", "Imperial Saffron Milk", "Terracotta Citrus Glow"],
    order: 1,
    metaTitle: "Luxury Body Soaps & Deep Hydration Bars | Star Light Co.",
    metaDescription: "Cold-cured 8 weeks with wild dragon's blood resin, shea butter, and Kashmiri saffron.",
  },
  {
    id: "Aromatherapy & Calming",
    name: "Aromatherapy & Calming",
    slug: "aromatherapy-calming",
    description: "High-altitude French lavender & sacred smoky oud for restorative evening rituals",
    image: "/images/products/lavender-silk.jpg",
    badge: "Evening Rituals",
    subcategories: ["Provence Lavender Silk", "Sacred Agarwood Oud"],
    order: 2,
    metaTitle: "Aromatherapy & Calming Bath Bars | Star Light Co.",
    metaDescription: "Unwind with pure steam-distilled French lavender, Mysore sandalwood, and agarwood oud.",
  },
  {
    id: "Festive & Luxury Gift Sets",
    name: "Festive & Luxury Gift Sets",
    slug: "festive-gift-sets",
    description: "Handcrafted collector boxes with 24k cosmetic gold and artisan draining dishes",
    image: "/images/products/festive-box.jpg",
    badge: "Limited Release",
    subcategories: ["Dragon's Glow 4-Piece Box", "Limited Edition 24k Gold Drops"],
    order: 3,
    metaTitle: "Festive & Luxury Soap Gift Sets | Star Light Co.",
    metaDescription: "Artisanal collector sets presented in numbered keepsake boxes with gold wax seals.",
  },
];

export const SOAPS: Soap[] = [
  {
    id: "dragons-blood-amber",
    name: "Dragon's Blood & Smoked Amber",
    tagline: "Ancient resin infusion for deep dermal cellular renewal",
    mainCategory: "Body & Deep Hydration",
    subCategory: "Dragon's Blood Firming",
    category: "glow",
    price: 499,
    originalPrice: 599,
    rating: 4.9,
    reviewsCount: 148,
    weight: "125g / 4.4 oz",
    cureTime: "Cold Cured 8 Weeks",
    badge: "Signature Bestseller",
    fragranceNotes: ["Dragon's Blood Resin", "Smoked Amber", "Moroccan Cedar", "Star Anise"],
    scentPyramid: {
      top: ["Wild Star Anise", "Sweet Valencia Orange Peel"],
      heart: ["Sacred Daemonorops Resin", "Golden Honeycomb", "Cistus Labdanum"],
      base: ["Aged Moroccan Cedar", "Smoked Baltic Amber", "Raw Vanilla Bean"],
    },
    keyIngredients: [
      "Pure Dragon's Blood Botanical Resin",
      "Organic Raw Shea Butter",
      "Cold-Pressed Sweet Almond Oil",
      "Star Anise & Herbal Botanicals",
    ],
    fullIngredients: [
      "Saponified Extra Virgin Olive Oil",
      "Organic Coconut Oil",
      "Raw African Shea Butter",
      "Wild-Harvested Daemonorops Draco (Dragon's Blood) Resin",
      "Cold-Pressed Sweet Almond Oil",
      "Pure Essential Oil Blend (Amber, Cedar, Star Anise)",
      "French Red Kaolin Clay",
      "Botanical Vitamin E (Tocopherol)"
    ],
    skinType: "All Skin Types • Stressed, Dull & Mature Skin",
    soapBenefits: [
      "Stimulates natural skin elasticity and firmness",
      "Provides rich antioxidant defense against free radicals",
      "Leaves skin silky smooth without a greasy residue",
      "Long-lasting 8-week cured dense micro-lather"
    ],
    ritualHowToUse:
      "Work bar between damp palms or across a natural sisal sponge until a thick, cushiony froth forms. Gently massage across face and body in circular strokes. Let botanicals absorb for 60 seconds before rinsing thoroughly with warm water.",
    description:
      "Crafted with genuine wild-harvested Dragon's Blood (Daemonorops draco) resin, celebrated for centuries for its profound antioxidant and skin-firming properties. Cold-processed over eight weeks to preserve delicate fatty acids and enveloped in a warm, mysterious amber and spice aroma.",
    image: "/images/products/dragons-blood.jpg",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "charcoal-kaolin-detox",
    name: "Himalayan Charcoal & White Kaolin",
    tagline: "Micro-pore clarifying bar with activated minerals",
    mainCategory: "Face & Gentle Cleansing",
    subCategory: "Pore Detox Clay",
    category: "detox",
    price: 449,
    originalPrice: 499,
    rating: 4.8,
    reviewsCount: 112,
    weight: "120g / 4.2 oz",
    cureTime: "Cold Cured 6 Weeks",
    badge: "Pore Detox Icon",
    fragranceNotes: ["Organic Tea Tree", "Eucalyptus Globulus", "Wild Bergamot", "Cypress"],
    scentPyramid: {
      top: ["Crisp Australian Tea Tree", "Crushed Eucalyptus Leaf"],
      heart: ["Wild Bergamot", "Mediterranean Cypress"],
      base: ["Clean White Kaolin Mineral", "Organic Coconut Nectar"],
    },
    keyIngredients: [
      "Activated Bamboo Charcoal",
      "French White Kaolin Clay",
      "Steam-Distilled Tea Tree Oil",
      "Organic Coconut Milk",
    ],
    fullIngredients: [
      "Saponified Virgin Coconut Oil",
      "Cold-Pressed Castor Oil",
      "Unrefined Shea Butter",
      "Activated Steam-Treated Bamboo Charcoal",
      "Pharmaceutical-Grade French White Kaolin Clay",
      "Melaleuca Alternifolia (Tea Tree) Oil",
      "Eucalyptus Globulus Leaf Oil",
      "Dead Sea Salt"
    ],
    skinType: "Oily, Combination & Blemish-Prone Skin",
    soapBenefits: [
      "Magnetically draws excess sebum and airborne impurities",
      "Balances oily T-zone without over-drying the epidermis",
      "White Kaolin softens and smooths skin texture",
      "Naturally purifying herbal aromatherapy"
    ],
    ritualHowToUse:
      "Create rich lather in hands. Gently glide across congested areas (forehead, nose, chin, back). Allow kaolin minerals to purify for 45 seconds, then rinse with cool water to tighten pore appearance.",
    description:
      "A dual-action detox bar marrying activated bamboo charcoal to magnetically lift impurities with velvety white French kaolin clay to nourish without stripping natural moisture. Leaves pores refined and skin breathable with a refreshing herbal finish.",
    image: "/images/products/charcoal-clay.jpg",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "terracotta-blood-orange",
    name: "Terracotta French Clay & Blood Orange",
    tagline: "Sun-drenched citrus and mineral clay for luminous radiance",
    mainCategory: "Body & Deep Hydration",
    subCategory: "Terracotta Citrus Glow",
    category: "glow",
    price: 449,
    originalPrice: 549,
    rating: 5.0,
    reviewsCount: 136,
    weight: "125g / 4.4 oz",
    cureTime: "Cold Cured 7 Weeks",
    badge: "House Specialty",
    fragranceNotes: ["Sicilian Blood Orange", "Wild Neroli Blossom", "Sweet Calendula", "Cardamom"],
    scentPyramid: {
      top: ["Sun-ripened Sicilian Blood Orange", "Sweet Mandarin"],
      heart: ["Neroli Flower", "Orange Blossom Water", "Yellow Calendula"],
      base: ["Terracotta Earth Mineral", "Warm Cardamom Bark"],
    },
    keyIngredients: [
      "French Red Illite & Terracotta Clay",
      "Cold-Pressed Blood Orange Oil",
      "Hand-Picked Calendula Petals",
      "Olive Squalane Oil",
    ],
    fullIngredients: [
      "Saponified Extra Virgin Olive Oil",
      "Organic Coconut Oil",
      "Red Illite Clay & Terracotta Mineral Kaolin",
      "Cold-Pressed Citrus Sinensis (Blood Orange) Oil",
      "Organic Calendula Officinalis Petals",
      "Pure Olive Squalane",
      "Dried Candied Citrus Slice",
      "Rosemary Leaf Extract"
    ],
    skinType: "Dull, Dry & Uneven Skin Tone",
    soapBenefits: [
      "Restores vibrant morning luminosity and healthy tone",
      "Infuses trace minerals directly through French red clay",
      "Invigorating citrus terpenes elevate mood and awaken vitality",
      "Squalane locks in 24-hour hydration post-wash"
    ],
    ritualHowToUse:
      "Lather generously with warm water. Inhale the bright citrus aroma. Cleanse full body, massaging gently with the textured botanical topping for mild exfoliation.",
    description:
      "Infused with rich terracotta mineral clay matching our brand heritage and finished with a dried candied citrus slice and calendula petals. Bursting with cold-pressed Sicilian blood orange essence to revitalize skin tone and awaken morning senses.",
    image: "/images/products/terracotta-orange.jpg",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "kashmiri-saffron-goat-milk",
    name: "Kashmiri Saffron & Wild Blossom Honey",
    tagline: "Imperial nectar and farm goat milk for ultra-supple texture",
    mainCategory: "Body & Deep Hydration",
    subCategory: "Imperial Saffron Milk",
    category: "hydration",
    price: 699,
    originalPrice: 799,
    rating: 4.9,
    reviewsCount: 174,
    weight: "130g / 4.6 oz",
    cureTime: "Cold Cured 8 Weeks",
    badge: "Royal Reserve",
    fragranceNotes: ["Grade A Kashmiri Saffron", "Golden Blossom Honey", "Sweet Almond Milk", "Warm Vanilla"],
    scentPyramid: {
      top: ["Golden Kashmiri Saffron Threads", "Sweet Almond Blossom"],
      heart: ["Wild Forest Mountain Honey", "Creamy Farm Goat Milk"],
      base: ["Madagascar Bourbon Vanilla", "Golden Sandalwood"],
    },
    keyIngredients: [
      "Hand-Harvested Kashmiri Mongra Saffron",
      "Raw Forest Wild Honey",
      "Farm Fresh Goat Milk",
      "Golden Jojoba Cold-Pressed Oil",
    ],
    fullIngredients: [
      "Saponified Organic Virgin Olive Oil",
      "Fresh Raw Goat Milk",
      "Organic Jojoba Seed Oil",
      "Wild Himalayan Forest Honey",
      "Pure Kashmiri Mongra Saffron (Crocus Sativus)",
      "Unrefined Cocoa Butter",
      "Natural Vanilla Oleoresin",
      "Colloidal Oatmeal"
    ],
    skinType: "Dry, Parched, Sensitive & Sun-Exposed Skin",
    soapBenefits: [
      "Natural lactic acid in goat milk gently dissolves dry flaking cells",
      "Saffron crocin illuminates and unifies complexion",
      "Raw honey humectant pulls ambient moisture deep into skin layers",
      "Delivers the creamiest, most decadently rich foam in the atelier"
    ],
    ritualHowToUse:
      "Apply directly to damp skin or lather in bath sponge. Massage gently, allowing milk proteins and honey nectar to condition the skin for 1 to 2 minutes before rinsing clean.",
    description:
      "An opulent tribute to royal bathing rituals. Every bar is infused with real Kashmiri saffron threads and raw mountain wildflower honey, folded into farm-fresh creamy goat milk rich in lactic acid to gently melt dull cells and unveil baby-soft skin.",
    image: "/images/products/saffron-honey.jpg",
    inStock: true,
    isBestseller: true,
  },
  {
    id: "damask-rose-shea-butter",
    name: "Damask Rose & Velvet Shea Butter",
    tagline: "Pure rose petal distillates and restorative botanical lipids",
    mainCategory: "Face & Gentle Cleansing",
    subCategory: "Velvet Rose Calming",
    category: "calming",
    price: 479,
    originalPrice: 549,
    rating: 4.8,
    reviewsCount: 98,
    weight: "120g / 4.2 oz",
    cureTime: "Cold Cured 6 Weeks",
    badge: "Velvet Glow",
    fragranceNotes: ["Valley Damask Rose", "Pink Peppercorn", "Vanilla Orchid", "Cashmere Wood"],
    scentPyramid: {
      top: ["Fresh Crushed Rosebuds", "Pink Peppercorn Spark"],
      heart: ["Pure Damask Rose Otto", "French Rose Clay", "Vanilla Orchid"],
      base: ["Unrefined Shea Butter", "Cashmere Wood Accord"],
    },
    keyIngredients: [
      "Steam-Distilled Rose Otto",
      "Unrefined Wild African Shea Butter",
      "Rosehip Seed Extract",
      "French Rose Kaolin Clay",
    ],
    fullIngredients: [
      "Saponified Shea Butter",
      "Organic Extra Virgin Olive Oil",
      "Cold-Pressed Rosehip Seed Oil",
      "Rosa Damascena Flower Oil",
      "French Rose Pink Clay",
      "Whole Dried Rosebuds",
      "Vegetable Glycerin",
      "Almond Oil"
    ],
    skinType: "Sensitive, Delicate, Flushed & Reactive Skin",
    soapBenefits: [
      "Calms redness, irritation, and reactive skin flare-ups",
      "Ultra-gentle pH suited for delicate facial cleansing",
      "Restores depleted lipid barriers with wild shea butter",
      "Romantic, pure floral fragrance derived solely from genuine rose oil"
    ],
    ritualHowToUse:
      "Warm bar between hands with tepid water. Cleanse face and decolletage in uplifting circular motions. Pat dry with a plush towel to lock in rosehip moisture.",
    description:
      "Handmade with French pink clay, cold-pressed rosehip seed oil, and adorned with delicate dried rosebuds. Creates a dense, cushiony micro-lather that restores elasticity while enveloping you in a true botanical rose bouquet.",
    image: "/images/products/damask-rose.jpg",
    inStock: true,
  },
  {
    id: "smoky-oud-mysore-sandalwood",
    name: "Smoky Agarwood Oud & Mysore Sandalwood",
    tagline: "Deep sacred wood resins and warming grounding aromatics",
    mainCategory: "Aromatherapy & Calming",
    subCategory: "Sacred Agarwood Oud",
    category: "hydration",
    price: 649,
    originalPrice: 749,
    rating: 4.9,
    reviewsCount: 89,
    weight: "125g / 4.4 oz",
    cureTime: "Cold Cured 9 Weeks",
    badge: "Artisan Prestige",
    fragranceNotes: ["Aged Dark Agarwood (Oud)", "Mysore Sandalwood", "Crushed Star Anise", "Warm Cinnamon"],
    scentPyramid: {
      top: ["Crushed Star Anise", "Ceylon Cinnamon Bark"],
      heart: ["Aged Dark Agarwood Resin", "Mysore Sandalwood Paste"],
      base: ["Smoked Birch Wood", "Cardamom Amber", "Vetiver Root"],
    },
    keyIngredients: [
      "Wild Agarwood Resin Extract",
      "Mysore Sandalwood Powder",
      "Cold-Pressed Avocado Butter",
      "Raw Cedarwood Essence",
    ],
    fullIngredients: [
      "Saponified Extra Virgin Olive Oil",
      "Cold-Pressed Avocado Oil",
      "Virgin Coconut Oil",
      "Pure Mysore Sandalwood Powder (Santalum Album)",
      "Wild Agarwood Resin Distillate (Aquilaria)",
      "Crushed Anise Seeds & Cinnamon Bark Topping",
      "Cedarwood Bark Oil",
      "Vitamin E"
    ],
    skinType: "Normal to Dry, Rough & Weathered Skin",
    soapBenefits: [
      "Nine-week slow cure makes it our longest-lasting luxury bar",
      "Warm woody aromatics melt stress and calm an overactive mind",
      "Avocado lipids deeply penetrate rough elbows, knees, and dry hands",
      "Grounding sensory ritual ideal for twilight baths"
    ],
    ritualHowToUse:
      "Inhale deeply under hot shower water. Smooth the warm, dense lather over shoulders, arms, and torso. Let the rich woody notes envelop you before rinsing.",
    description:
      "Deeply grounding and regal. Smoky agarwood swirls merge with creamy Mysore sandalwood powder and natural spice bark toppings. Cured for a full nine weeks to create an ultra-long-lasting bar with unmatched scent longevity.",
    image: "/images/products/oud-sandalwood.jpg",
    inStock: true,
  },
  {
    id: "french-lavender-dead-sea-silk",
    name: "French Lavender Silk & Dead Sea Minerals",
    tagline: "Nighttime calming serenity with botanical fleur de sel",
    mainCategory: "Aromatherapy & Calming",
    subCategory: "Provence Lavender Silk",
    category: "calming",
    price: 449,
    originalPrice: 499,
    rating: 4.9,
    reviewsCount: 122,
    weight: "120g / 4.2 oz",
    cureTime: "Cold Cured 6 Weeks",
    badge: "Sleep Therapy",
    fragranceNotes: ["High-Altitude French Lavender", "Creamy Coconut Milk", "Sea Salt Mist", "Wild Chamomile"],
    scentPyramid: {
      top: ["Provence Fine Lavender Blossom", "Crisp Sea Breeze"],
      heart: ["Wild Blue Chamomile", "Creamy Coconut Milk Lather"],
      base: ["Dead Sea Salt Minerals", "French Violet Earth"],
    },
    keyIngredients: [
      "Organic Provence Lavender Flowers",
      "Coarse Dead Sea Salt Crystals",
      "Cold-Pressed Coconut Milk",
      "Extra Virgin Olive Oil",
    ],
    fullIngredients: [
      "Saponified Virgin Olive Oil",
      "Cold-Pressed Coconut Milk",
      "Raw Shea Butter",
      "Lavandula Angustifolia (Lavender) Essential Oil",
      "Hand-Harvested Dead Sea Salt Crystals",
      "Organic Dried Lavender Florets",
      "French Violet Clay",
      "Castor Oil"
    ],
    skinType: "Tired, Sensitive & Eczema-Prone Skin",
    soapBenefits: [
      "Dead Sea minerals replenish magnesium and trace minerals",
      "Lavender linalool naturally prepares the body for deep sleep",
      "Salt crystals provide gentle buffing when massaged over skin",
      "Coconut milk soothes parched and itchy patches"
    ],
    ritualHowToUse:
      "Best used 30 minutes before bedtime in a warm bath or shower. Breathe in the tranquil lavender steam as the creamy micro-bubbles soften tension.",
    description:
      "Formulated specifically for evening bath rituals. Concentrated Provence lavender essential oil soothes cortisol levels, while Dead Sea mineral salts replenish vital electrolytes and minerals to promote restful slumber.",
    image: "/images/products/lavender-silk.jpg",
    inStock: true,
  },
  {
    id: "matcha-spirulina-crisp-mint",
    name: "Ceremonial Matcha & Wild Eucalyptus",
    tagline: "Antioxidant superfood bar for invigorated morning energy",
    mainCategory: "Face & Gentle Cleansing",
    subCategory: "Clarifying Mint",
    category: "detox",
    price: 449,
    originalPrice: 499,
    rating: 4.8,
    reviewsCount: 84,
    weight: "120g / 4.2 oz",
    cureTime: "Cold Cured 6 Weeks",
    badge: "Awaken Bar",
    fragranceNotes: ["Crushed Spearmint", "Fresh Blue Eucalyptus", "Japanese Green Tea", "Crisp Sage"],
    scentPyramid: {
      top: ["Fresh Mentha Piperita", "Cooling Spearmint"],
      heart: ["Wild Blue Eucalyptus", "Ceremonial Uji Matcha"],
      base: ["Crisp Clary Sage", "Blue-Green Spirulina Chlorophyll"],
    },
    keyIngredients: [
      "Ceremonial Grade Uji Matcha",
      "Pacific Blue-Green Spirulina",
      "Mentha Piperita Cold-Pressed Oil",
      "Organic Raw Cocoa Butter",
    ],
    fullIngredients: [
      "Saponified Extra Virgin Olive Oil",
      "Organic Raw Cocoa Butter",
      "Pure Ceremonial Uji Matcha Powder",
      "Arthrospira Platensis (Blue-Green Spirulina)",
      "Mentha Piperita (Peppermint) Oil",
      "Eucalyptus Leaf Oil",
      "Crushed Peppermint Flakes",
      "Atlantic Coarse Sea Salt"
    ],
    skinType: "Normal, Combination, Oily & Fatigued Skin",
    soapBenefits: [
      "Delivers a crisp cooling tingle that immediately awakens senses",
      "Green tea polyphenols shield skin from environmental oxidation",
      "Spirulina delivers vital amino acids and chlorophyll detox",
      "Refreshes after vigorous workouts or hot summer mornings"
    ],
    ritualHowToUse:
      "Use as your morning shower awakening. Lather freely over skin, feeling the tingling mint sensation. Rinse with cool water for an invigorating burst.",
    description:
      "The ultimate morning wake-up call for your skin. Packed with chlorophyl-rich spirulina and Japanese Uji matcha to shield against environmental pollution, coupled with a chilling eucalyptus and peppermint tingle.",
    image: "/images/products/eucalyptus-mint.jpg",
    inStock: true,
  },
  {
    id: "festive-dragons-glow-gift-set",
    name: "Festival Edition: 'Dragon's Glow' 4-Piece Grand Gift Set",
    tagline: "Limited collector's box with 4 artisanal bars & dragon crest seal",
    mainCategory: "Festive & Luxury Gift Sets",
    subCategory: "Dragon's Glow 4-Piece Box",
    category: "festive",
    price: 1899,
    originalPrice: 2499,
    rating: 5.0,
    reviewsCount: 218,
    weight: "4 x 120g / 17 oz Total",
    cureTime: "Special Holiday Cured Batch",
    badge: "Limited Festival Drop (25% OFF)",
    fragranceNotes: ["Cinnamon Embers", "Dragon's Blood & Myrrh", "Forest Spice & Gold", "Berry & Cedarwood"],
    scentPyramid: {
      top: ["Holiday Cinnamon Embers", "Wild Winterberry"],
      heart: ["Sacred Myrrh Resin", "Forest Pine Needle", "24k Gold Flakes"],
      base: ["Dragon's Blood Resin", "Aged Smoked Cedarwood", "Warm Clove"],
    },
    keyIngredients: [
      "4 Full Size Limited Edition Bars",
      "24k Cosmetic Gold Leaf Flecks",
      "Cinnamon, Star Anise & Myrrh Resin",
      "Star Light Co. Embossed Wooden Keepsake Box",
    ],
    fullIngredients: [
      "4 Bespoke Artisan Soap Bars with Custom Cold-Process Formulas",
      "Genuine 24k Cosmetic Grade Gold Leaf Flecks",
      "Somalian Myrrh Resin & Dragon's Blood Botanical Extract",
      "Warm Cinnamon, Star Anise, and Dried Blood Orange Toppings",
      "Presented in a Hand-Assembled Collector Box with Terracotta Satin Ribbon and Dragon Wax Seal"
    ],
    skinType: "All Skin Types • Luxury Holiday Gifting",
    soapBenefits: [
      "Four distinct holiday sensory rituals in one keepsake box",
      "Adorned with genuine 24k cosmetic gold leaf flecks",
      "Arrives ready to gift with collector dragon crest medallion",
      "Limited seasonal production run — only 450 numbered sets made"
    ],
    ritualHowToUse:
      "Unbox each numbered bar as part of your weekly holiday ritual, or gift individual bars to loved ones. Store inside the keepsake box between uses to perfume your space.",
    description:
      "Our most prestigious holiday release. Housed in a dark obsidian keepsake gift box adorned with copper-terracotta silk ribbon and Star Light Co. dragon crest medallion. Contains four full-sized holiday bars hand-stamped and infused with 24k gold leaf and rare seasonal aromatics.",
    image: "/images/products/festive-box.jpg",
    inStock: true,
    isFestive: true,
  },
];

export const FESTIVAL_PROMO = {
  code: "FESTIVE25",
  discountPercent: 25,
  title: "Grand Festive Celebration Sale",
  subtitle: "Enjoy 25% Off Storewide + Free Dragon Keepsake Gift Box on Orders Over ₹1,499",
  freeShippingThreshold: 999,
};

export const formatPrice = (price: number): string =>
  "₹" + Math.round(price).toLocaleString("en-IN");

export const INDIAN_STATES: string[] = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi NCR",
  "Chandigarh",
  "Puducherry",
];

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  shippingType: "state_wise",
  flatRate: 99,
  freeShippingThreshold: 999,
  enableFreeThreshold: true,
  defaultStateRate: 99,
  stateRates: {
    Maharashtra: 49,
    Gujarat: 49,
    Goa: 59,
    "Delhi NCR": 69,
    Karnataka: 69,
    Haryana: 69,
    Telangana: 69,
    "Tamil Nadu": 79,
    Kerala: 79,
    "Uttar Pradesh": 79,
    Rajasthan: 79,
    Punjab: 79,
    "Madhya Pradesh": 79,
    "Andhra Pradesh": 79,
    "West Bengal": 89,
    Bihar: 89,
    Odisha: 89,
    Chhattisgarh: 89,
    Uttarakhand: 89,
    "Himachal Pradesh": 99,
    Assam: 119,
    "Jammu & Kashmir": 129,
    Sikkim: 129,
    "Other States": 99,
  },
};

export const DEFAULT_PRIMARY_OFFER: OfferSectionConfig = {
  id: "festive-dragons-glow-gift-set",
  isActive: true,
  sectionTag: "2026 Limited Holiday Collector Vault",
  title: "The Grand Festival Gift Collection",
  subtitle: "An opulent holiday centerpiece handcrafted with 24k cosmetic gold",
  description:
    "An opulent holiday centerpiece. Four full-sized 120g artisanal cold-process bars infused with 24k cosmetic gold leaf, presented in a rigid dragon-embossed keepsake box with copper satin ribbon and complimentary teak dish.",
  badgeText: "Only 450 Numbered Boxes Made",
  discountText: "SAVE ₹600 • 25% OFF",
  promoCode: "FESTIVE25",
  discountPercent: 25,
  originalPrice: 2399,
  salePrice: 1799,
  countdownDate: "2026-11-15T23:59:59",
  mainImage: "/images/products/festive-box.jpg",
  bars: [
    {
      id: "cinnamon-embers",
      name: "Cinnamon Embers",
      aroma: "Star Anise, Ceylon Cinnamon & Dried Clove",
      benefit: "Warming circulation stimulation for dry winter skin",
      lather: "Dense Velvet Warm Foam",
      botanical: "Cinnamon Bark & Star Anise Resin",
      weight: "120g Bar",
      image: "/images/products/terracotta-orange.jpg",
    },
    {
      id: "dragons-blood",
      name: "Dragon's Blood & Myrrh",
      aroma: "Wild Daemonorops Resin & Somalian Myrrh",
      benefit: "Profound cellular renewal & firming micro-lather",
      lather: "Silky Cashmere Micro-lather",
      botanical: "Sacred Dragon's Blood & Organic Shea",
      weight: "120g Bar",
      image: "/images/products/dragons-blood.jpg",
    },
    {
      id: "forest-gold",
      name: "Forest Spice & 24k Gold",
      aroma: "Balsam Fir, Pine Needle & 24k Gold Leaf",
      benefit: "Pure radiance infused with real cosmetic gold flakes",
      lather: "Golden Froth with Shimmer",
      botanical: "24K Cosmetic Gold & Balsam Fir Needle",
      weight: "120g Bar",
      image: "/images/products/saffron-honey.jpg",
    },
    {
      id: "wild-berry",
      name: "Wild Berry & Cedarwood",
      aroma: "Himalayan Cedar & Sweet Winterberry",
      benefit: "Deep calming relaxation for evening bath rituals",
      lather: "Ultra-Hydrating Cream Lather",
      botanical: "Himalayan Cedarwood & Wild Winterberry",
      weight: "120g Bar",
      image: "/images/products/oud-sandalwood.jpg",
    },
  ],
};

export const DEFAULT_SECONDARY_OFFER: OfferSectionConfig = {
  id: "secondary-seasonal-offer",
  isActive: true,
  sectionTag: "Artisanal Royal Reserve",
  title: "Royal Ayurvedic Wellness Curation",
  subtitle: "Handcrafted trio infused with Kashmiri saffron and wild raw forest honey",
  description:
    "An exclusive curation of our most revered cold-process soaps. Each bar is enriched with whole farm goat milk, cold-pressed sweet almond oil, and ancient herbal extracts for deeply nourished and luminous skin.",
  badgeText: "Limited Seasonal Batch",
  discountText: "SAVE ₹350 • 20% OFF",
  promoCode: "AYUR20",
  discountPercent: 20,
  originalPrice: 1799,
  salePrice: 1449,
  countdownDate: "2026-11-30T23:59:59",
  mainImage: "/images/products/saffron-honey.jpg",
  bars: [
    {
      id: "kashmiri-saffron",
      name: "Kashmiri Saffron & Goat Milk",
      aroma: "Pure Mongra Saffron, Cardamom & Sweet Milk",
      benefit: "Imparts golden radiance & softens texture",
      lather: "Creamy Custard Lather",
      botanical: "Grade A Kashmiri Saffron & Fresh Farm Milk",
      weight: "125g Bar",
      image: "/images/products/saffron-honey.jpg",
    },
    {
      id: "wild-turmeric",
      name: "Wild Turmeric & Vetiver",
      aroma: "Kasturi Manjal, Earthy Vetiver Roots",
      benefit: "Clarifies tone and relieves environmental fatigue",
      lather: "Earthy Cushion Foam",
      botanical: "Wild Forest Turmeric & Khus Vetiver",
      weight: "125g Bar",
      image: "/images/products/terracotta-orange.jpg",
    },
    {
      id: "golden-honey",
      name: "Raw Damask Rose & Oats",
      aroma: "Wildflower Honeycomb & Damask Rose Petals",
      benefit: "Ultra-gentle soothing hydration for sensitive skin",
      lather: "Silky Velvet Micro-foam",
      botanical: "Unfiltered Forest Honey & French Pink Clay",
      weight: "125g Bar",
      image: "/images/products/damask-rose.jpg",
    },
  ],
};

export const SEED_USERS: UserAccount[] = [
  {
    id: "usr-admin-1",
    name: "Master Soapmaker",
    email: "admin@starlight.com",
    phone: "+91 98765 43210",
    role: "admin",
    address: "Atelier Studio, Colaba Causeway",
    state: "Maharashtra",
    pincode: "400005",
    createdAt: "2026-08-15T10:00:00Z",
    totalOrders: 0,
    totalSpent: 0,
  },
  {
    id: "usr-cust-1",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98201 12345",
    role: "customer",
    address: "Flat 402, Sea Crest Towers, Bandra West",
    state: "Maharashtra",
    pincode: "400050",
    createdAt: "2026-09-02T14:22:00Z",
    totalOrders: 3,
    totalSpent: 4890,
  },
  {
    id: "usr-cust-2",
    name: "Rohit Verma",
    email: "rohit.verma@example.com",
    phone: "+91 97412 87654",
    role: "customer",
    address: "12, 4th Main, Indiranagar",
    state: "Karnataka",
    pincode: "560038",
    createdAt: "2026-09-18T11:45:00Z",
    totalOrders: 2,
    totalSpent: 2650,
  },
  {
    id: "usr-cust-3",
    name: "Ananya Sen",
    email: "ananya.sen@example.com",
    phone: "+91 98310 99887",
    role: "customer",
    address: "88 Southern Avenue, Lake Market",
    state: "West Bengal",
    pincode: "700029",
    createdAt: "2026-10-01T09:15:00Z",
    totalOrders: 1,
    totalSpent: 1799,
  },
];

export const SEED_ORDERS: Order[] = [
  {
    id: "ord-1001",
    orderNumber: "STL-2026-8941",
    customerName: "Priya Sharma",
    customerEmail: "priya.sharma@example.com",
    customerPhone: "+91 98201 12345",
    shippingAddress: "Flat 402, Sea Crest Towers, Bandra West, Mumbai",
    shippingState: "Maharashtra",
    shippingPincode: "400050",
    items: [
      {
        productId: "festive-dragons-glow-gift-set",
        name: "Dragon's Glow Grand Festival Keepsake Box",
        image: "/images/products/festive-box.jpg",
        price: 1799,
        weight: "480g Box",
        quantity: 1,
      },
      {
        productId: "dragons-blood-amber",
        name: "Dragon's Blood & Red Amber",
        image: "/images/products/dragons-blood.jpg",
        price: 649,
        weight: "125g",
        quantity: 1,
      },
    ],
    subtotal: 2448,
    taxAmount: 117,
    shippingCost: 0,
    discountAmount: 612,
    total: 1953,
    status: "Delivered",
    paymentMethod: "UPI",
    createdAt: "2026-10-04T12:30:00Z",
  },
  {
    id: "ord-1002",
    orderNumber: "STL-2026-8942",
    customerName: "Rohit Verma",
    customerEmail: "rohit.verma@example.com",
    customerPhone: "+91 97412 87654",
    shippingAddress: "12, 4th Main, Indiranagar, Bengaluru",
    shippingState: "Karnataka",
    shippingPincode: "560038",
    items: [
      {
        productId: "charcoal-kaolin-detox",
        name: "Activated Charcoal & White Kaolin Detox",
        image: "/images/products/charcoal-clay.jpg",
        price: 549,
        weight: "125g",
        quantity: 2,
      },
    ],
    subtotal: 1098,
    taxAmount: 0,
    shippingCost: 69,
    discountAmount: 0,
    total: 1167,
    status: "Shipped",
    paymentMethod: "Card",
    createdAt: "2026-10-07T16:15:00Z",
  },
  {
    id: "ord-1003",
    orderNumber: "STL-2026-8943",
    customerName: "Ananya Sen",
    customerEmail: "ananya.sen@example.com",
    customerPhone: "+91 98310 99887",
    shippingAddress: "88 Southern Avenue, Lake Market, Kolkata",
    shippingState: "West Bengal",
    shippingPincode: "700029",
    items: [
      {
        productId: "lavender-silk-calm",
        name: "High-Altitude French Lavender Silk",
        image: "/images/products/lavender-silk.jpg",
        price: 599,
        weight: "125g",
        quantity: 1,
      },
    ],
    subtotal: 599,
    taxAmount: 0,
    shippingCost: 89,
    discountAmount: 0,
    total: 688,
    status: "Processing",
    paymentMethod: "UPI",
    createdAt: "2026-10-09T08:45:00Z",
  },
];

