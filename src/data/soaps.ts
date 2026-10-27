import { CLOUDINARY_IMAGES } from "./cloudinaryImages";

export interface Soap {
  id: string;
  slug?: string;
  name: string;
  tagline?: string;
  mainCategory?: string;
  subCategory?: string;
  category?: "all" | "detox" | "hydration" | "calming" | "glow" | "festive" | string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  weight?: string;
  weightValue?: number;
  weightUnit?: "g" | "kg" | string;
  taxType?: "inclusive" | "exclusive" | string; // Tax including vs excluding
  taxRate?: number; // percentage (e.g. 5, 12, 18)
  cureTime?: string;
  badge?: string;
  fragranceNotes?: string[];
  scentPyramid?: {
    top: string[];
    heart: string[];
    base: string[];
  };
  keyIngredients?: string[];
  fullIngredients?: string[];
  skinType?: string;
  soapBenefits?: string[];
  ritualHowToUse?: string;
  description?: string;
  image: string;
  imageAlt?: string;
  inStock?: boolean;
  isBestseller?: boolean;
  isFestive?: boolean;
  // SEO Metadata
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string | string[];
}

export interface CategoryStructure {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  parentCategory?: string | null;
  image?: string;
  bannerImage?: string;
  bannerHeadline?: string;
  bannerSubheadline?: string;
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
  productId?: string;
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
    id: "Healing Soaps",
    name: "Healing Soaps",
    slug: "healing-soaps",
    description: "Vibrational cold-process cleansing bars charged with sacred mantras and therapeutic botanicals.",
    image: CLOUDINARY_IMAGES.dragonsBlood,
    bannerImage: CLOUDINARY_IMAGES.dragonsBlood,
    bannerHeadline: "Sacred Healing Soaps",
    bannerSubheadline: "Herbal Cleansing · Pranic Infusion · Dermal Harmony",
    badge: "Aura & Skin",
    subcategories: ["Aura Cleansing Soaps", "Chakra Balancing Soaps", "Herbal Botanical Soaps", "Sacred Bath Bars"],
    order: 0,
    metaTitle: "Healing Soaps & Aura Cleansing Bath Bars | Star Light Co.",
    metaDescription: "Handcrafted cold-process healing soaps infused with sacred herbs, therapeutic essential oils, and Vedic blessings.",
  },
  {
    id: "Stained Glass Yantras",
    name: "Stained Glass Yantras",
    slug: "stained-glass-yantras",
    description: "Hand-soldered geometric stained glass sacred yantras capturing sunlight to harmonize home prana.",
    image: CLOUDINARY_IMAGES.terracottaOrange,
    bannerImage: CLOUDINARY_IMAGES.terracottaOrange,
    bannerHeadline: "Luminous Stained Glass Yantras",
    bannerSubheadline: "Sacred Geometry · Sun Catcher Energy · Vastu Alignment",
    badge: "Sacred Geometry",
    subcategories: ["Sri Yantra Stained Glass", "Navagraha Yantras", "Gayatri Yantra Glass", "Vastu Yantras"],
    order: 1,
    metaTitle: "Stained Glass Yantras & Sacred Geometry Suncatchers | Star Light Co.",
    metaDescription: "Exquisite handmade stained glass yantras for spiritual focus, cosmic vibration, and Vastu harmonization.",
  },
  {
    id: "Mandalas",
    name: "Mandalas",
    slug: "mandalas",
    description: "Intricately detailed sacred geometric mandalas radiating peace, focus, and spiritual elevation.",
    image: CLOUDINARY_IMAGES.saffronHoney,
    bannerImage: CLOUDINARY_IMAGES.saffronHoney,
    bannerHeadline: "Cosmic Mandalas & Sacred Portals",
    bannerSubheadline: "Meditation Tools · Deep Resonance · Geometric Harmony",
    badge: "Cosmic Harmony",
    subcategories: ["Sacred Geometry Mandalas", "Tibetan Healing Mandalas", "Cosmic Energy Mandalas", "Meditation Wall Mandalas"],
    order: 2,
    metaTitle: "Sacred Mandalas & Spiritual Meditation Wall Art | Star Light Co.",
    metaDescription: "Discover consecrated sacred mandalas painted and crafted to enhance mindfulness, intuition, and peace.",
  },
  {
    id: "Healing Art",
    name: "Healing Art",
    slug: "healing-art",
    description: "Vibrational canvas art and spiritual paintings channeling high-frequency pranic flow.",
    image: CLOUDINARY_IMAGES.damaskRose,
    bannerImage: CLOUDINARY_IMAGES.damaskRose,
    bannerHeadline: "Vibrational Healing Art",
    bannerSubheadline: "High Frequency Canvases · Spiritual Altar Paintings",
    badge: "Divine Energy",
    subcategories: ["Energy Vibration Canvases", "Chakra Alignment Art", "Divine Spiritual Paintings", "Therapeutic Zen Art"],
    order: 3,
    metaTitle: "Healing Art & Vibrational Spiritual Paintings | Star Light Co.",
    metaDescription: "Transform your living space with consecrated healing canvas art radiating positive prana and tranquility.",
  },
  {
    id: "Crystal Chakra Necklaces",
    name: "Crystal Chakra Necklaces",
    slug: "crystal-chakra-necklaces",
    description: "Natural energized crystal pendants and 7-chakra talisman necklaces for spiritual alignment.",
    image: CLOUDINARY_IMAGES.lavenderSilk,
    bannerImage: CLOUDINARY_IMAGES.lavenderSilk,
    bannerHeadline: "Crystal Chakra Talismans",
    bannerSubheadline: "Natural Gemstones · Biofield Balance · Energetic Protection",
    badge: "Chakra Balance",
    subcategories: ["7 Chakra Orgone Pendants", "Amethyst Intuition Necklaces", "Raw Quartz Crystals", "Lapis Lazuli Necklaces"],
    order: 4,
    metaTitle: "Crystal Chakra Necklaces & Healing Gemstone Pendants | Star Light Co.",
    metaDescription: "Handcrafted natural crystal chakra necklaces energised to balance your biofield and awaken inner vitality.",
  },
  {
    id: "Stained Glass Panels",
    name: "Stained Glass Panels",
    slug: "stained-glass-panels",
    description: "Exquisite sun-catcher stained glass window panels transforming natural light into therapeutic rays.",
    image: CLOUDINARY_IMAGES.charcoalClay,
    bannerImage: CLOUDINARY_IMAGES.charcoalClay,
    bannerHeadline: "Pranic Stained Glass Panels",
    bannerSubheadline: "Sun Catcher Panels · Sacred Window Accents",
    badge: "Light & Prana",
    subcategories: ["Sun Catcher Panels", "Sacred Window Panels", "Temple Glass Panels", "Stained Glass Lightcatchers"],
    order: 5,
    metaTitle: "Stained Glass Panels & Sacred Lightcatchers | Star Light Co.",
    metaDescription: "Hand-soldered stained glass panels designed to catch the sun and infuse sanctuaries with sacred color frequencies.",
  },
  {
    id: "Copper Yantras",
    name: "Copper Yantras",
    slug: "copper-yantras",
    description: "Consecrated pure heavy-gauge copper plates etched with ancient Vedic geometric frequencies.",
    image: CLOUDINARY_IMAGES.oudSandalwood,
    bannerImage: CLOUDINARY_IMAGES.oudSandalwood,
    bannerHeadline: "Vedic Consecrated Copper Yantras",
    bannerSubheadline: "Pure Copper · Sacred Frequencies · Pran Pratishtha",
    badge: "Pran Pratishtha",
    subcategories: ["Pure Copper Sri Yantras", "Kuber Dhan Prapti Yantras", "Maha Mrityunjaya Copper Plates", "Vastu Dosh Nivaran Yantras"],
    order: 6,
    metaTitle: "Pure Copper Yantras & Consecrated Sacred Plates | Star Light Co.",
    metaDescription: "Vedic etched heavy copper yantras consecrated for wealth, health, prosperity, and Vastu correction.",
  },
  {
    id: "Aura Cleansers",
    name: "Aura Cleansers",
    slug: "aura-cleansers",
    description: "Sacred sage mists, consecrated aura sprays, and selenite crystal wands to dissolve dense vibrations.",
    image: CLOUDINARY_IMAGES.eucalyptusMint,
    bannerImage: CLOUDINARY_IMAGES.eucalyptusMint,
    bannerHeadline: "Aura Cleansers & Space Purifiers",
    bannerSubheadline: "Smudge Mists · Selenite Wands · Energetic Shields",
    badge: "Etheric Shield",
    subcategories: ["Sacred Smudge Sprays", "Aura Protection Mists", "Crystal Infused Waters", "Selenite Aura Wands"],
    order: 7,
    metaTitle: "Aura Cleansers, Smudge Mists & Energy Shields | Star Light Co.",
    metaDescription: "Clear dense lingering energies from your aura and sanctuary with botanical smudge sprays and selenite.",
  },
  {
    id: "Healing Chits and Sheets",
    name: "Healing Chits and Sheets",
    slug: "healing-chits-and-sheets",
    description: "Radionic frequency sheets, switchword healing cards, and consecrated geometric affirmation grids.",
    image: CLOUDINARY_IMAGES.festiveBox,
    bannerImage: CLOUDINARY_IMAGES.festiveBox,
    bannerHeadline: "Radionic Healing Chits & Energy Sheets",
    bannerSubheadline: "Switchword Power · Quantum Frequency · Geometric Grids",
    badge: "Quantum Healing",
    subcategories: ["Switchword Healing Chits", "Radionic Energy Sheets", "Quantum Frequency Codes", "Affirmation Energy Grids"],
    order: 8,
    metaTitle: "Healing Chits, Switchword Cards & Radionic Sheets | Star Light Co.",
    metaDescription: "Potent energetic switchword chits and radionic frequency sheets to direct intention and manifest healing.",
  },
  {
    id: "Camphor Energisers",
    name: "Camphor Energisers",
    slug: "camphor-energisers",
    description: "Authentic pure Bhimseni camphor diffusers and brass energizing lamps to purify home vibrations.",
    image: CLOUDINARY_IMAGES.dragonsBlood,
    bannerImage: CLOUDINARY_IMAGES.dragonsBlood,
    bannerHeadline: "Pure Bhimseni Camphor Energisers",
    bannerSubheadline: "Vastu Purification · Brass Lamps · Subtle Cleanse",
    badge: "Pure Vastu",
    subcategories: ["Pure Bhimseni Diffusers", "Brass Camphor Lamps", "Electric Aromatherapy Burners", "Camphor Vastu Purifiers"],
    order: 9,
    metaTitle: "Bhimseni Camphor Energisers & Vastu Lamps | Star Light Co.",
    metaDescription: "Purify negative energies and elevate spiritual ambience with pure Bhimseni camphor diffusers and lamps.",
  },
  {
    id: "Candles",
    name: "Candles",
    slug: "candles",
    description: "Hand-poured pure soy and beeswax intention candles embedded with healing crystals and botanical herbs.",
    image: CLOUDINARY_IMAGES.saffronHoney,
    bannerImage: CLOUDINARY_IMAGES.saffronHoney,
    bannerHeadline: "Sacred Intention & Chakra Candles",
    bannerSubheadline: "Crystal Embedded · Pure Soy Wax · Herbal Botanicals",
    badge: "Sacred Flame",
    subcategories: ["Chakra Healing Soy Candles", "Aura Cleansing Herbal Candles", "Beeswax Altar Candles", "Sacred Scent Intention Candles"],
    order: 10,
    metaTitle: "Sacred Healing Candles & Crystal Intention Lights | Star Light Co.",
    metaDescription: "Hand-poured pure soy and beeswax healing candles embedded with genuine gemstones and sacred botanicals.",
  },
];

export const SOAPS: Soap[] = [
  // ── 1. HEALING SOAPS ──
  {
    id: "crown-chakra-lavender-healing-soap",
    name: "Crown Chakra Sahasrara Lavender Healing Bar",
    tagline: "High-vibration French lavender and frankincense for higher consciousness and peace",
    mainCategory: "Healing Soaps",
    subCategory: "Chakra Balancing Soaps",
    category: "Healing Soaps",
    price: 549,
    originalPrice: 699,
    rating: 4.9,
    reviewsCount: 142,
    weight: "125g Bar",
    cureTime: "Cold Cured 8 Weeks · Mantra Charged",
    badge: "Chakra Masterpiece",
    fragranceNotes: ["High-Altitude French Lavender", "Omani Frankincense", "Wild Violet", "Sweet Myrrh"],
    keyIngredients: ["Organic Extra Virgin Olive Oil", "Omani Boswellia Sacra Frankincense", "Pure French Lavender Oil", "Raw Shea Butter"],
    soapBenefits: ["Promotes meditative calm and tranquil sleep", "Nourishes delicate biofield and skin barrier", "Dense soothing micro-lather"],
    description: "Handcrafted under auspicious celestial hours, this sacred bar combines steam-distilled French lavender and rare Omani frankincense to ground your spiritual energy and calm mental noise.",
    image: CLOUDINARY_IMAGES.dragonsBlood,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "vastu-turmeric-holy-basil-soap",
    name: "Sacred Kasturi Turmeric & Holy Basil Aura Detox Bar",
    tagline: "Vedic cleansing bar with wild forest turmeric and Krishna Tulsi",
    mainCategory: "Healing Soaps",
    subCategory: "Aura Cleansing Soaps",
    category: "Healing Soaps",
    price: 449,
    originalPrice: 549,
    rating: 4.8,
    reviewsCount: 98,
    weight: "125g Bar",
    cureTime: "Cold Cured 8 Weeks",
    badge: "Aura Purifier",
    fragranceNotes: ["Sacred Basil (Tulsi)", "Wild Kasturi Manjal", "Vetiver Root", "Bergamot"],
    keyIngredients: ["Wild Kasturi Turmeric", "Krishna Tulsi Leaf Extract", "Cold-Pressed Sweet Almond Oil", "Pure Neem Leaf"],
    soapBenefits: ["Clears stagnant etheric debris from the aura", "Provides potent herbal antiseptic protection", "Imparts a luminous natural glow"],
    description: "An ancient Ayurvedic recipe blending potent Kasturi turmeric and wild holy basil to cleanse negative physical and energetic debris accumulated throughout the day.",
    image: CLOUDINARY_IMAGES.saffronHoney,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "sacred-sandalwood-aura-cleansing-soap",
    name: "Mysore Chandan & Golden Amber Sacred Bath Bar",
    tagline: "Royal Mysore sandalwood and golden resin for spiritual elevation",
    mainCategory: "Healing Soaps",
    subCategory: "Sacred Bath Bars",
    category: "Healing Soaps",
    price: 599,
    originalPrice: 749,
    rating: 5.0,
    reviewsCount: 176,
    weight: "130g Bar",
    cureTime: "Cold Cured 10 Weeks",
    badge: "Sacred Reserve",
    fragranceNotes: ["Pure Mysore Sandalwood", "Golden Amber", "Cardamom Seed", "Virgin Cedar"],
    keyIngredients: ["Santalum Album (Sandalwood) Oil", "Wild Forest Honey", "Raw Cocoa Butter", "Himalayan Rock Salt"],
    soapBenefits: ["Deeply grounds the root chakra", "Releases sacred temple aromas in hot water", "Ultra-hydrating silken foam"],
    description: "Infused with pure, sustainably harvested Mysore sandalwood oil and warm golden amber. Used traditionally before meditation and sacred prayer to purify body and mind.",
    image: CLOUDINARY_IMAGES.oudSandalwood,
    inStock: true,
    isBestseller: true,
  },

  // ── 2. STAINED GLASS YANTRAS ──
  {
    id: "sri-yantra-stained-glass-suncatcher",
    name: "Sacred Sri Yantra Handcrafted Stained Glass Suncatcher",
    tagline: "Nine interlocking sacred triangles in rich jewel-toned Tiffany stained glass",
    mainCategory: "Stained Glass Yantras",
    subCategory: "Sri Yantra Stained Glass",
    category: "Stained Glass Yantras",
    price: 2499,
    originalPrice: 3200,
    rating: 5.0,
    reviewsCount: 84,
    weight: "480g · 12x12 inches",
    cureTime: "Hand-Soldered Tiffany Technique",
    badge: "Sacred Bestseller",
    fragranceNotes: ["Visual Cosmic Frequency", "Prismatic Sunlight Dispersion"],
    keyIngredients: ["Hand-Cut Stained Cathedral Glass", "Copper Foil", "Lead-Free Solder", "Hanging Brass Chain"],
    soapBenefits: ["Harmonizes Vastu direction (North-East / East)", "Transforms ambient daylight into rainbow healing frequencies", "Magnetizes prosperity and peace"],
    description: "Every piece of stained glass is precision-cut and assembled by hand in the traditional Tiffany copper-foil method. Features the sacred Sri Yantra geometry that channels divine cosmic abundance into your sanctuary.",
    image: CLOUDINARY_IMAGES.terracottaOrange,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "gayatri-yantra-luminous-glass",
    name: "Solar Gayatri Yantra Luminous Stained Glass Panel",
    tagline: "Radiant golden and amber art glass honoring the divine solar deity",
    mainCategory: "Stained Glass Yantras",
    subCategory: "Gayatri Yantra Glass",
    category: "Stained Glass Yantras",
    price: 2199,
    originalPrice: 2800,
    rating: 4.9,
    reviewsCount: 46,
    weight: "420g · 10x10 inches",
    cureTime: "Artisan Handcrafted",
    badge: "Solar Alignment",
    keyIngredients: ["Amber & Amber-Gold Stained Glass", "Hand-Polished Copper Foil", "Reinforced Brass Frame"],
    soapBenefits: ["Awakens intellect and inner clarity (Dhiyo Yo Nah)", "Dispels gloom and stagnant energy in study or work areas", "Brilliant light refraction"],
    description: "A breathtaking solar masterpiece capturing the sacred Gayatri geometry. When hung in an east-facing window, the morning sunlight illuminates its fiery amber and emerald facets.",
    image: CLOUDINARY_IMAGES.charcoalClay,
    inStock: true,
  },

  // ── 3. MANDALAS ──
  {
    id: "cosmic-shri-mandala-gold-leaf",
    name: "Cosmic Resonance 24k Gold-Leaf Hand-Painted Meditation Mandala",
    tagline: "Sacred geometric portal on deep midnight canvas for transcendental focus",
    mainCategory: "Mandalas",
    subCategory: "Cosmic Energy Mandalas",
    category: "Mandalas",
    price: 3499,
    originalPrice: 4500,
    rating: 5.0,
    reviewsCount: 62,
    weight: "750g · 16x16 inches",
    cureTime: "Energized with Vedic Chants",
    badge: "Master Artwork",
    keyIngredients: ["24k Genuine Gold Leaf Accents", "Archival Mineral Pigments", "Hand-Stretched Belgian Linen Canvas"],
    soapBenefits: ["Creates a centering focal point for Trataka meditation", "Stabilizes chaotic household electromagnetic vibrations", "Museum-quality archival finish"],
    description: "Hand-painted by traditional mandala artists over 40 hours of focused meditation. Each geometric line expands symmetrically from the central bindu, drawing the viewer's awareness inward toward boundless calm.",
    image: CLOUDINARY_IMAGES.saffronHoney,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "tibetan-medicine-buddha-mandala",
    name: "Tibetan Healing Blue Medicine Buddha Sacred Mandala",
    tagline: "Vibrant lapis and turquoise sacred thangka mandala for physical and emotional recovery",
    mainCategory: "Mandalas",
    subCategory: "Tibetan Healing Mandalas",
    category: "Mandalas",
    price: 2899,
    originalPrice: 3600,
    rating: 4.9,
    reviewsCount: 39,
    weight: "680g · 14x14 inches",
    cureTime: "Consecrated with Healing Mantras",
    badge: "Healing Portal",
    keyIngredients: ["Natural Mineral Gouache Pigments", "Pure Cotton Treated Canvas", "Solid Natural Teak Wood Frame"],
    soapBenefits: ["Promotes restorative cellular healing during rest", "Ideal for healing rooms, yoga studios, and bedrooms", "Protects against psychic exhaustion"],
    description: "Centered upon the deep lapis blue frequency of the Medicine Buddha, this mandala radiates serene restorative prana to encourage holistic health and emotional peace.",
    image: CLOUDINARY_IMAGES.damaskRose,
    inStock: true,
  },

  // ── 4. HEALING ART ──
  {
    id: "kundalini-seven-chakra-vibrational-canvas",
    name: "Kundalini Seven Chakra Alignment Vibrational Canvas Art",
    tagline: "Dynamic pranic ascent visual frequency canvas with textured gold leaf",
    mainCategory: "Healing Art",
    subCategory: "Chakra Alignment Art",
    category: "Healing Art",
    price: 3999,
    originalPrice: 5200,
    rating: 5.0,
    reviewsCount: 71,
    weight: "1.2 kg · 18x24 inches",
    cureTime: "Prana Charged in Sacred Ashram",
    badge: "Spiritual Centerpiece",
    keyIngredients: ["Multi-Textured Acrylic & Mineral Paste", "Genuine 24k Gold Flake Detailing", "Deep-Profile Pine Wood Stretcher"],
    soapBenefits: ["Harmonizes all seven energy vortexes in the room", "Serves as an altar background or meditation wall", "Vibrant colors that do not fade over decades"],
    description: "Illustrating the ascension of spiritual prana from Muladhara to Sahasrara, this original vibrational artwork infuses any living area or healing sanctuary with pure uplifting vitality.",
    image: CLOUDINARY_IMAGES.damaskRose,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "divine-pranic-flow-reiki-painting",
    name: "Divine Prana Reiki Infused Textured Spiritual Painting",
    tagline: "Gentle oceanic teal and celestial violet palette channeling universal life force",
    mainCategory: "Healing Art",
    subCategory: "Therapeutic Zen Art",
    category: "Healing Art",
    price: 3299,
    originalPrice: 4200,
    rating: 4.8,
    reviewsCount: 33,
    weight: "950g · 16x20 inches",
    cureTime: "Reiki Master Attuned",
    badge: "Reiki Blessed",
    keyIngredients: ["Fine Art Stretched Canvas", "Heavy Body Artist Acrylics", "Protective UV Gloss Varnish"],
    soapBenefits: ["Soothes nervous tension and rapid heart rate", "Fosters an atmosphere of unconditional safety and love", "Hand-signed by the spiritual artist"],
    description: "Attuned with Usui Reiki symbols during creation, this calming painting emanates an aura of serene light that eases anxious thoughts and transforms turbulent room energies.",
    image: CLOUDINARY_IMAGES.saffronHoney,
    inStock: true,
  },

  // ── 5. CRYSTAL CHAKRA NECKLACES ──
  {
    id: "seven-chakra-orgone-crystal-necklace",
    name: "Natural 7 Chakra Raw Crystal Orgone Healing Talisman",
    tagline: "Seven authentic gemstones encased in resin with pure copper sacred coil",
    mainCategory: "Crystal Chakra Necklaces",
    subCategory: "7 Chakra Orgone Pendants",
    category: "Crystal Chakra Necklaces",
    price: 1299,
    originalPrice: 1799,
    rating: 4.9,
    reviewsCount: 215,
    weight: "28g Pendant",
    cureTime: "Full Moon Cleansed & Energised",
    badge: "Top Rated Talisman",
    keyIngredients: ["Red Jasper", "Carnelian", "Citrine", "Green Aventurine", "Turquoise", "Lapis Lazuli", "Amethyst", "Pure Copper Spiral"],
    soapBenefits: ["Shields biofield from electromagnetic frequencies (EMF)", "Aligns all seven chakras continuously throughout the day", "Supplied on adjustable natural leather cord with keepsake pouch"],
    description: "An authentic orgone energy matrix combining 7 natural semi-precious crystals with a conductive copper spiral to balance bodily meridians and repel negative energetic attachments.",
    image: CLOUDINARY_IMAGES.lavenderSilk,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "amethyst-third-eye-ajna-pendant",
    name: "Raw Brazilian Amethyst Ajna Chakra Wire-Wrapped Pendant",
    tagline: "Deep royal purple untreated crystal point wrapped in antique copper wire",
    mainCategory: "Crystal Chakra Necklaces",
    subCategory: "Amethyst Intuition Necklaces",
    category: "Crystal Chakra Necklaces",
    price: 999,
    originalPrice: 1499,
    rating: 4.9,
    reviewsCount: 128,
    weight: "22g Pendant",
    cureTime: "Sound Bathed with Tibetan Singing Bowls",
    badge: "Intuition Booster",
    keyIngredients: ["Untreated Natural Brazilian Amethyst", "Tarnish-Resistant Copper Wire", "Braided Wax Cord"],
    soapBenefits: ["Enhances intuitive dreams and third eye perception", "Dispels mental fog and emotional mood swings", "Direct contact with skin for maximum gemstone resonance"],
    description: "Every amethyst point is unique, hand-selected for deep purple translucence and wire-wrapped with intention to enhance mental clarity, discernment, and spiritual insight.",
    image: CLOUDINARY_IMAGES.lavenderSilk,
    inStock: true,
  },

  // ── 6. STAINED GLASS PANELS ──
  {
    id: "divine-lotus-stained-glass-panel",
    name: "Divine Sacred Lotus Hand-Crafted Stained Glass Panel",
    tagline: "Vibrant iridescent pink, emerald, and aquatic blue art glass window panel",
    mainCategory: "Stained Glass Panels",
    subCategory: "Sun Catcher Panels",
    category: "Stained Glass Panels",
    price: 3199,
    originalPrice: 4200,
    rating: 5.0,
    reviewsCount: 54,
    weight: "850g · 14x10 inches",
    cureTime: "Master Artisan Assembly",
    badge: "Window Jewel",
    keyIngredients: ["Hand-Rolled Spectrum Art Glass", "Zinc Came Reinforcement", "Polished Black Patina Solder"],
    soapBenefits: ["Symbolizes spiritual emergence above worldly trials", "Casts breathtaking colored reflections across floors and walls", "Includes heavy-duty brass hanging chain and suction hooks"],
    description: "An evocative representation of the sacred padma (lotus) rising untainted from muddy waters into divine light. Handcrafted with authentic art glass that captures every ray of sunshine.",
    image: CLOUDINARY_IMAGES.charcoalClay,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "cosmic-tree-of-life-glass-panel",
    name: "Cosmic Tree of Life Hand-Soldered Glass Suncatcher",
    tagline: "Intertwined sacred roots and lush green canopy in hand-blown cathedral glass",
    mainCategory: "Stained Glass Panels",
    subCategory: "Sacred Window Panels",
    category: "Stained Glass Panels",
    price: 2799,
    originalPrice: 3600,
    rating: 4.8,
    reviewsCount: 41,
    weight: "720g · 12x12 inches round",
    cureTime: "Handcrafted Tiffany Method",
    badge: "Grounded Harmony",
    keyIngredients: ["Opalescent Green & Amber Glass", "Copper Ribbon", "Black Patina Finished Joints"],
    soapBenefits: ["Grounds family harmony and connects heaven and earth", "Filters harsh afternoon sunlight into calming restorative hues", "High visual heirloom appeal"],
    description: "Featuring the ancient motif of the Kalpavriksha (World Tree), this circular glass panel connects earthly stability with heavenly aspirations, bringing balance to family living rooms.",
    image: CLOUDINARY_IMAGES.terracottaOrange,
    inStock: true,
  },

  // ── 7. COPPER YANTRAS ──
  {
    id: "consecrated-heavy-copper-sri-yantra",
    name: "Pran Pratishtha Pure Heavy Copper Sri Yantra Plate",
    tagline: "Deeply precision-etched 24-gauge pure copper plate consecrated with Vedic rites",
    mainCategory: "Copper Yantras",
    subCategory: "Pure Copper Sri Yantras",
    category: "Copper Yantras",
    price: 1599,
    originalPrice: 2100,
    rating: 5.0,
    reviewsCount: 189,
    weight: "320g · 6x6 inches",
    cureTime: "Pran Pratishtha Consecrated",
    badge: "Authentic Vedic",
    keyIngredients: ["100% Pure Elemental Copper (Tambra)", "Precision Sacred Geometry Engraving", "Protective Natural Wax Seal"],
    soapBenefits: ["Powerful Vastu antidote for financial and career blockages", "Conducts cosmic solar prana directly into the altar space", "Does not tarnish easily when cared for properly"],
    description: "Consecrated during auspicious muhurta timings with traditional Sanskrit recitations. Copper is the most conductive metal for divine frequencies, making this Sri Yantra an indispensable tool for prosperity.",
    image: CLOUDINARY_IMAGES.oudSandalwood,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "shree-kuber-dhan-prapti-copper-yantra",
    name: "Vedic Shree Kuber Wealth Attraction Heavy Copper Yantra",
    tagline: "Sacred numerical grid and divine symbols of Lord Kuber for sustained abundance",
    mainCategory: "Copper Yantras",
    subCategory: "Kuber Dhan Prapti Yantras",
    category: "Copper Yantras",
    price: 1199,
    originalPrice: 1650,
    rating: 4.9,
    reviewsCount: 104,
    weight: "260g · 5x5 inches",
    cureTime: "Lakshmi-Kuber Homa Blessed",
    badge: "Wealth Magnet",
    keyIngredients: ["Heavy Gauge Pure Copper", "Laser Deep Etch", "Sacred Ash (Bhasma) Blessed"],
    soapBenefits: ["Attracts steady financial stability and clears business hurdles", "Best placed in the North direction or home cash safe", "Permanent sacred geometric engraving that never fades"],
    description: "Designed strictly according to ancient Tantric Agamas, this pure copper Kuber Yantra focuses intention upon wealth preservation, lawful abundance, and freedom from financial worry.",
    image: CLOUDINARY_IMAGES.oudSandalwood,
    inStock: true,
  },

  // ── 8. AURA CLEANSERS ──
  {
    id: "white-sage-frankincense-aura-mist",
    name: "Sacred White Sage & Frankincense Energy Clearing Aura Mist",
    tagline: "Smokeless botanical aura protection spray with energized quartz crystal chips",
    mainCategory: "Aura Cleansers",
    subCategory: "Sacred Smudge Sprays",
    category: "Aura Cleansers",
    price: 699,
    originalPrice: 899,
    rating: 4.9,
    reviewsCount: 167,
    weight: "100ml Glass Atomizer",
    cureTime: "Sun & Moonlight Charged",
    badge: "Daily Essential",
    fragranceNotes: ["Californian White Sage", "Omani Frankincense", "Himalayan Cedar", "Lavender Water"],
    keyIngredients: ["Steam-Distilled Salvia Apiana Water", "Boswellia Carterii Resin Extract", "Clear Quartz Crystal Chips", "Pure Witch Hazel"],
    soapBenefits: ["Instantly resets heavy, dense room and aura vibrations", "100% smokeless alternative to traditional smudge burning", "Safe for home, office, cars, and around pets"],
    description: "Formulated for modern seekers who need instant energetic clearing without smoke. Shake well to activate the submerged quartz crystals and mist above your head or across any room to restore light.",
    image: CLOUDINARY_IMAGES.eucalyptusMint,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "moroccan-selenite-energy-clearing-wand",
    name: "Natural Moroccan Selenite Crystal Energy Clearing Wand",
    tagline: "High-frequency raw satin spar crystal wand for combing the etheric biofield",
    mainCategory: "Aura Cleansers",
    subCategory: "Selenite Aura Wands",
    category: "Aura Cleansers",
    price: 799,
    originalPrice: 1100,
    rating: 5.0,
    reviewsCount: 138,
    weight: "220g · 7-8 inches long",
    cureTime: "Self-Cleansing Mineral Matrix",
    badge: "Etheric Comb",
    keyIngredients: ["100% Genuine Natural Moroccan Selenite (Gypsum Satin Spar)"],
    soapBenefits: ["Never needs cleansing — constantly purifies other crystals", "Gently combs psychic cords and emotional heaviness from the aura", "Directs white angelic light frequency into blocked meridians"],
    description: "Selenite has one of the highest vibrational frequencies in the mineral kingdom. Sweep this natural wand 4 inches away from your physical body from head to toe to dissolve sluggish energetic static.",
    image: CLOUDINARY_IMAGES.eucalyptusMint,
    inStock: true,
    isBestseller: true,
  },

  // ── 9. HEALING CHITS AND SHEETS ──
  {
    id: "radionic-switchword-healing-sheet-set",
    name: "Quantum Radionic Switchword Energy Healing Grid Sheets",
    tagline: "Set of 7 consecrated geometric intention sheets embedded with scalar frequencies",
    mainCategory: "Healing Chits and Sheets",
    subCategory: "Radionic Energy Sheets",
    category: "Healing Chits and Sheets",
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviewsCount: 88,
    weight: "Set of 7 Laminated Sheets · A5 Size",
    cureTime: "Scalar Wave Charged",
    badge: "Quantum Tool",
    keyIngredients: ["300 GSM Heavy Archival Stock", "Matte Waterproof Lamination", "Radionic Geometry Inks"],
    soapBenefits: ["Can be placed under water bottles to structure and energize drinking water", "Hold photographs or written intentions at the central power point", "Includes full instruction guide with switchwords for health, wealth, and peace"],
    description: "Engineered using sacred radionic proportions and powerful switchword combinations. Place your drinking glass, medicine, or goal notes upon the grid to amplify manifestation velocity.",
    image: CLOUDINARY_IMAGES.festiveBox,
    inStock: true,
    isBestseller: true,
  },

  // ── 10. CAMPHOR ENERGISERS ──
  {
    id: "bhimseni-camphor-brass-diffuser",
    name: "Handcrafted Antique Brass Bhimseni Camphor Lamp & Energiser",
    tagline: "Solid brass heavy ritual burner with tea-light slot for slow, pure vapourization",
    mainCategory: "Camphor Energisers",
    subCategory: "Brass Camphor Lamps",
    category: "Camphor Energisers",
    price: 1499,
    originalPrice: 1999,
    rating: 5.0,
    reviewsCount: 162,
    weight: "380g Solid Heavy Brass",
    cureTime: "Hand-Cast by Heritage Coppersmiths",
    badge: "Vastu Master",
    fragranceNotes: ["Bhimseni Camphor Vapours", "Pure Brass Warmth"],
    keyIngredients: ["100% Virgin Cast Brass", "Included 50g Authentic Bhimseni Camphor Flakes", "Tealight Base Holder"],
    soapBenefits: ["Neutralizes airborne bacteria and lingering stagnant vibrations", "Essential Vastu remedy for correcting indoor energy doshas", "Slow release mechanism ensures long-lasting soothing aroma without soot"],
    description: "Pure Bhimseni camphor has been burned in Vedic temples for thousands of years to drive out negative unseen forces and invite prosperity. This heavy solid brass lamp releases a continuous, gentle therapeutic mist.",
    image: CLOUDINARY_IMAGES.dragonsBlood,
    inStock: true,
    isBestseller: true,
  },

  // ── 11. CANDLES ──
  {
    id: "seven-chakra-gemstone-intention-soy-candle",
    name: "Seven Chakra Healing Soy Candle with Embedded Real Gemstones",
    tagline: "100% natural soy wax candle topped with seven crystals and dried therapeutic botanicals",
    mainCategory: "Candles",
    subCategory: "Chakra Healing Soy Candles",
    category: "Candles",
    price: 899,
    originalPrice: 1199,
    rating: 4.9,
    reviewsCount: 147,
    weight: "280g · 55hr Burn Time",
    cureTime: "Hand-Poured in Small Moon Batches",
    badge: "Crystal Candle",
    fragranceNotes: ["White Sage", "Lavender Bud", "Sandalwood Bark", "Sweet Bergamot"],
    keyIngredients: ["100% Pure Non-GMO Soy Wax", "Real Tumbled Crystals (Amethyst, Rose Quartz, Citrine)", "Lead-Free Cotton Wick", "Organic Essential Oils"],
    soapBenefits: ["Crystals can be collected and kept as personal pocket stones once wax melts", "Clean soot-free 55-hour slow therapeutic burn", "Creates an instant sacred sanctuary in any room"],
    description: "Each candle is individually hand-poured in a dark amber glass jar and crowned with 7 genuine crystals and dried botanical herbs. Light during meditation or prayer to invite calm, grounded serenity.",
    image: CLOUDINARY_IMAGES.saffronHoney,
    inStock: true,
    isBestseller: true,
  },
  {
    id: "sacred-palo-santo-white-sage-candle",
    name: "Palo Santo & White Sage Negative Energy Cleansing Intention Candle",
    tagline: "Sacred wood and holy herb infused beeswax and soy blend for aura restoration",
    mainCategory: "Candles",
    subCategory: "Aura Cleansing Herbal Candles",
    category: "Candles",
    price: 749,
    originalPrice: 999,
    rating: 4.9,
    reviewsCount: 92,
    weight: "240g · 45hr Burn Time",
    cureTime: "Handcrafted Artisan Batch",
    badge: "Aura Light",
    fragranceNotes: ["Ecuadorian Palo Santo Wood", "Californian White Sage", "Smoked Copal", "Cedar"],
    keyIngredients: ["Sustainably Harvested Palo Santo Oil", "Crushed White Sage Leaves", "Pure Golden Beeswax & Soy Blend", "Crackling Wooden Wick"],
    soapBenefits: ["Features an authentic crackling wooden wick reminiscent of sacred bonfires", "Dispels heavy emotional fatigue and lingering sadness", "Zero synthetic phthalates or artificial paraffin"],
    description: "Crafted with holy wood from naturally fallen branches in Ecuador and wild-harvested sage, this candle cleanses your sacred space while filling the air with a warm, comforting woody scent.",
    image: CLOUDINARY_IMAGES.dragonsBlood,
    inStock: true,
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
  "Andaman & Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra & Nagar Haveli and Daman & Diu",
  "Delhi NCR",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
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
  mainImage: CLOUDINARY_IMAGES.festiveBox,
  bars: [
    {
      id: "cinnamon-embers",
      name: "Cinnamon Embers",
      aroma: "Star Anise, Ceylon Cinnamon & Dried Clove",
      benefit: "Warming circulation stimulation for dry winter skin",
      lather: "Dense Velvet Warm Foam",
      botanical: "Cinnamon Bark & Star Anise Resin",
      weight: "120g Bar",
      image: CLOUDINARY_IMAGES.terracottaOrange,
    },
    {
      id: "dragons-blood",
      name: "Dragon's Blood & Myrrh",
      aroma: "Wild Daemonorops Resin & Somalian Myrrh",
      benefit: "Profound cellular renewal & firming micro-lather",
      lather: "Silky Cashmere Micro-lather",
      botanical: "Sacred Dragon's Blood & Organic Shea",
      weight: "120g Bar",
      image: CLOUDINARY_IMAGES.dragonsBlood,
    },
    {
      id: "forest-gold",
      name: "Forest Spice & 24k Gold",
      aroma: "Balsam Fir, Pine Needle & 24k Gold Leaf",
      benefit: "Pure radiance infused with real cosmetic gold flakes",
      lather: "Golden Froth with Shimmer",
      botanical: "24K Cosmetic Gold & Balsam Fir Needle",
      weight: "120g Bar",
      image: CLOUDINARY_IMAGES.saffronHoney,
    },
    {
      id: "wild-berry",
      name: "Wild Berry & Cedarwood",
      aroma: "Himalayan Cedar & Sweet Winterberry",
      benefit: "Deep calming relaxation for evening bath rituals",
      lather: "Ultra-Hydrating Cream Lather",
      botanical: "Himalayan Cedarwood & Wild Winterberry",
      weight: "120g Bar",
      image: CLOUDINARY_IMAGES.oudSandalwood,
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
  mainImage: CLOUDINARY_IMAGES.saffronHoney,
  bars: [
    {
      id: "kashmiri-saffron",
      name: "Kashmiri Saffron & Goat Milk",
      aroma: "Pure Mongra Saffron, Cardamom & Sweet Milk",
      benefit: "Imparts golden radiance & softens texture",
      lather: "Creamy Custard Lather",
      botanical: "Grade A Kashmiri Saffron & Fresh Farm Milk",
      weight: "125g Bar",
      image: CLOUDINARY_IMAGES.saffronHoney,
    },
    {
      id: "wild-turmeric",
      name: "Wild Turmeric & Vetiver",
      aroma: "Kasturi Manjal, Earthy Vetiver Roots",
      benefit: "Clarifies tone and relieves environmental fatigue",
      lather: "Earthy Cushion Foam",
      botanical: "Wild Forest Turmeric & Khus Vetiver",
      weight: "125g Bar",
      image: CLOUDINARY_IMAGES.terracottaOrange,
    },
    {
      id: "golden-honey",
      name: "Raw Damask Rose & Oats",
      aroma: "Wildflower Honeycomb & Damask Rose Petals",
      benefit: "Ultra-gentle soothing hydration for sensitive skin",
      lather: "Silky Velvet Micro-foam",
      botanical: "Unfiltered Forest Honey & French Pink Clay",
      weight: "125g Bar",
      image: CLOUDINARY_IMAGES.damaskRose,
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
    orderNumber: "SLC-2026-8941",
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
        image: CLOUDINARY_IMAGES.festiveBox,
        price: 1799,
        weight: "480g Box",
        quantity: 1,
      },
      {
        productId: "dragons-blood-amber",
        name: "Dragon's Blood & Red Amber",
        image: CLOUDINARY_IMAGES.dragonsBlood,
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
    orderNumber: "SLC-2026-8941",
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
        image: CLOUDINARY_IMAGES.charcoalClay,
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
    orderNumber: "SLC-2026-8943",
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
        image: CLOUDINARY_IMAGES.lavenderSilk,
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

