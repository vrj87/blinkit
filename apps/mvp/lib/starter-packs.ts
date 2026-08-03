export interface StarterProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  emoji: string;
}

export interface StarterPack {
  category: string;
  trialPrice: number;
  tagline: string;
  products: StarterProduct[];
}

export const STARTER_PACKS: Record<string, StarterPack> = {
  "Personal Care": {
    category: "Personal Care",
    trialPrice: 99,
    tagline: "Curated bestsellers — try before you browse 200+ SKUs",
    products: [
      {
        id: "pc-1",
        name: "Onion Hair Oil 100ml",
        brand: "Parachute",
        price: 99,
        mrp: 145,
        rating: 4.5,
        reviewCount: 2847,
        badge: "Bestseller",
        emoji: "🧴",
      },
      {
        id: "pc-2",
        name: "Body Wash 250ml",
        brand: "Dove",
        price: 129,
        mrp: 175,
        rating: 4.4,
        reviewCount: 1923,
        emoji: "🧼",
      },
      {
        id: "pc-3",
        name: "Face Wash 100g",
        brand: "Himalaya",
        price: 89,
        mrp: 120,
        rating: 4.3,
        reviewCount: 3102,
        badge: "Top rated",
        emoji: "✨",
      },
    ],
  },
  "Health & Wellness": {
    category: "Health & Wellness",
    trialPrice: 149,
    tagline: "Daily wellness picks for busy professionals",
    products: [
      {
        id: "hw-1",
        name: "Multivitamin Tablets",
        brand: "Himalaya",
        price: 149,
        mrp: 199,
        rating: 4.4,
        reviewCount: 1560,
        badge: "Bestseller",
        emoji: "💊",
      },
      {
        id: "hw-2",
        name: "Protein Bar Pack (6)",
        brand: "Yoga Bar",
        price: 249,
        mrp: 299,
        rating: 4.2,
        reviewCount: 890,
        emoji: "🍫",
      },
      {
        id: "hw-3",
        name: "Electrolyte Drink Mix",
        brand: "Fast&Up",
        price: 99,
        mrp: 130,
        rating: 4.5,
        reviewCount: 2100,
        emoji: "⚡",
      },
    ],
  },
  "Frozen Foods": {
    category: "Frozen Foods",
    trialPrice: 149,
    tagline: "Freezer favourites for quick weeknight meals",
    products: [
      {
        id: "fr-1",
        name: "Malabar Paratha 5pc",
        brand: "iD",
        price: 89,
        mrp: 110,
        rating: 4.6,
        reviewCount: 4200,
        badge: "Bestseller",
        emoji: "🫓",
      },
      {
        id: "fr-2",
        name: "Paneer 200g",
        brand: "Amul",
        price: 95,
        mrp: 110,
        rating: 4.5,
        reviewCount: 3800,
        emoji: "🧀",
      },
      {
        id: "fr-3",
        name: "Mixed Veg Pizza",
        brand: "Wefreeze",
        price: 149,
        mrp: 199,
        rating: 4.1,
        reviewCount: 670,
        emoji: "🍕",
      },
    ],
  },
  "Pet Supplies": {
    category: "Pet Supplies",
    trialPrice: 199,
    tagline: "Vet-approved starter kit for first-time pet parents",
    products: [
      {
        id: "pet-1",
        name: "Dog Treats 500g",
        brand: "Pedigree",
        price: 199,
        mrp: 249,
        rating: 4.5,
        reviewCount: 1240,
        badge: "Bestseller",
        emoji: "🦴",
      },
      {
        id: "pet-2",
        name: "Cat Food 1.2kg",
        brand: "Whiskas",
        price: 349,
        mrp: 399,
        rating: 4.4,
        reviewCount: 980,
        emoji: "🐱",
      },
    ],
  },
  "Baby Products": {
    category: "Baby Products",
    trialPrice: 99,
    tagline: "Gentle, trusted brands for new parents",
    products: [
      {
        id: "bb-1",
        name: "Baby Wipes 72pc",
        brand: "Himalaya",
        price: 99,
        mrp: 135,
        rating: 4.6,
        reviewCount: 2890,
        badge: "Top rated",
        emoji: "👶",
      },
      {
        id: "bb-2",
        name: "Diapers S (22pc)",
        brand: "Pampers",
        price: 299,
        mrp: 349,
        rating: 4.5,
        reviewCount: 4100,
        emoji: "🧷",
      },
    ],
  },
  "Snacks & Beverages": {
    category: "Snacks & Beverages",
    trialPrice: 99,
    tagline: "Trending snacks your neighbours are trying",
    products: [
      {
        id: "sn-1",
        name: "Protein Chips",
        brand: "Yoga Bar",
        price: 49,
        mrp: 60,
        rating: 4.2,
        reviewCount: 890,
        emoji: "🍿",
      },
      {
        id: "sn-2",
        name: "Cold Coffee 280ml",
        brand: "Bru",
        price: 45,
        mrp: 55,
        rating: 4.4,
        reviewCount: 2100,
        badge: "Bestseller",
        emoji: "☕",
      },
    ],
  },
};

export function getStarterPack(category: string): StarterPack {
  return (
    STARTER_PACKS[category] ?? {
      category,
      trialPrice: 99,
      tagline: "Curated starter picks for your first order",
      products: [
        {
          id: "gen-1",
          name: `${category} Trial Pack`,
          brand: "Blinkit",
          price: 99,
          mrp: 149,
          rating: 4.3,
          reviewCount: 500,
          badge: "New",
          emoji: "✨",
        },
      ],
    }
  );
}
