export interface Soap {
  id: string;
  name: string;
  tagline: string;
  mainCategory: "Face & Gentle Cleansing" | "Body & Deep Hydration" | "Aromatherapy & Calming" | "Festive & Luxury Gift Sets";
  subCategory: string;
  category: "all" | "detox" | "hydration" | "calming" | "glow" | "festive";
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  weight: string;
  cureTime: string;
  badge?: string;
  fragranceNotes: string[];
  scentPyramid: {
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
}

export interface CategoryStructure {
  id: string;
  name: string;
  subcategories: string[];
}

export const CATEGORIES_DATA: CategoryStructure[] = [
  {
    id: "all",
    name: "All Artisanal Soaps",
    subcategories: ["All Formulas", "Best Sellers", "Award Winners"],
  },
  {
    id: "Face & Gentle Cleansing",
    name: "Face & Gentle Cleansing",
    subcategories: ["Pore Detox Clay", "Velvet Rose Calming", "Clarifying Mint"],
  },
  {
    id: "Body & Deep Hydration",
    name: "Body & Deep Hydration",
    subcategories: ["Dragon's Blood Firming", "Imperial Saffron Milk", "Terracotta Citrus Glow"],
  },
  {
    id: "Aromatherapy & Calming",
    name: "Aromatherapy & Calming",
    subcategories: ["Provence Lavender Silk", "Sacred Agarwood Oud"],
  },
  {
    id: "Festive & Luxury Gift Sets",
    name: "Festive & Luxury Gift Sets",
    subcategories: ["Dragon's Glow 4-Piece Box", "Limited Edition 24k Gold Drops"],
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
    price: 18.0,
    originalPrice: 22.0,
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
    price: 16.0,
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
    price: 17.0,
    originalPrice: 20.0,
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
    price: 22.0,
    originalPrice: 26.0,
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
    price: 17.0,
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
    price: 24.0,
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
    price: 16.0,
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
    price: 16.0,
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
    price: 58.0,
    originalPrice: 78.0,
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
  subtitle: "Enjoy 25% Off Storewide + Free Dragon Keepsake Gift Box on Orders Over $50",
  freeShippingThreshold: 50,
};
