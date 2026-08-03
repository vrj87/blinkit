import type { DemoBasket } from "./demo-orders";

export interface DemoOrderSeed {
  items: string[];
  categories: string[];
  totalAmount: number;
  createdAt: Date;
}

export interface DemoUserProfile {
  id: string;
  name: string;
  email: string;
  personaLabel: string;
  addressTitle: string;
  addressSub: string;
  segmentTags: string[];
  categoriesPurchased: string[];
  orders: DemoOrderSeed[];
  baskets: DemoBasket[];
}

const ATHARV_ORDERS: DemoOrderSeed[] = [
  {
    items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
    categories: ["Groceries"],
    totalAmount: 487,
    createdAt: new Date("2025-10-15T18:30:00"),
  },
  {
    items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
    categories: ["Groceries"],
    totalAmount: 492,
    createdAt: new Date("2025-10-22T19:15:00"),
  },
  {
    items: ["Toor Dal 1kg", "Milk 1L", "Curd 400g", "Bread", "Bananas 6pc"],
    categories: ["Groceries"],
    totalAmount: 312,
    createdAt: new Date("2025-11-05T17:45:00"),
  },
  {
    items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
    categories: ["Groceries"],
    totalAmount: 478,
    createdAt: new Date("2025-11-19T18:00:00"),
  },
  {
    items: ["Milk 1L", "Eggs 12pc", "Atta 5kg", "Potatoes 1kg", "Cooking Oil 1L"],
    categories: ["Groceries"],
    totalAmount: 528,
    createdAt: new Date("2025-11-28T19:30:00"),
  },
  {
    items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
    categories: ["Groceries"],
    totalAmount: 485,
    createdAt: new Date("2025-12-05T18:20:00"),
  },
];

const RAJU_ORDERS: DemoOrderSeed[] = [
  {
    items: ["Idli Dosa Batter 1kg", "Coconut Oil 500ml", "Sambar Powder", "Curd 400g", "Bananas 6pc"],
    categories: ["Groceries"],
    totalAmount: 398,
    createdAt: new Date("2025-10-18T08:15:00"),
  },
  {
    items: ["Sona Masoori Rice 5kg", "Toor Dal 1kg", "Onions 1kg", "Tomatoes 500g", "Green Chillies"],
    categories: ["Groceries"],
    totalAmount: 612,
    createdAt: new Date("2025-10-25T09:00:00"),
  },
  {
    items: ["Idli Dosa Batter 1kg", "Milk 1L", "Bread", "Eggs 12pc", "Filter Coffee 200g"],
    categories: ["Groceries"],
    totalAmount: 445,
    createdAt: new Date("2025-11-08T08:45:00"),
  },
  {
    items: ["Sona Masoori Rice 5kg", "Coconut Oil 500ml", "Sambar Powder", "Curd 400g", "Bananas 6pc"],
    categories: ["Groceries"],
    totalAmount: 589,
    createdAt: new Date("2025-11-22T09:30:00"),
  },
  {
    items: ["Idli Dosa Batter 1kg", "Milk 1L", "Bread", "Potatoes 1kg", "Coriander Bunch"],
    categories: ["Groceries"],
    totalAmount: 367,
    createdAt: new Date("2025-12-01T08:20:00"),
  },
  {
    items: ["Sona Masoori Rice 5kg", "Toor Dal 1kg", "Onions 1kg", "Tomatoes 500g", "Filter Coffee 200g"],
    categories: ["Groceries"],
    totalAmount: 601,
    createdAt: new Date("2025-12-08T09:10:00"),
  },
];

const SANDY_ORDERS: DemoOrderSeed[] = [
  {
    items: ["Quaker Oats 1kg", "Amul Butter 100g", "Brown Bread", "Bananas 6pc", "Honey 500g"],
    categories: ["Groceries"],
    totalAmount: 524,
    createdAt: new Date("2025-10-20T07:30:00"),
  },
  {
    items: ["Greek Yogurt 400g", "Granola 500g", "Blueberries 125g", "Almond Milk 1L", "Peanut Butter"],
    categories: ["Groceries"],
    totalAmount: 698,
    createdAt: new Date("2025-11-02T07:45:00"),
  },
  {
    items: ["Quaker Oats 1kg", "Eggs 12pc", "Avocado 2pc", "Spinach 250g", "Whole Wheat Bread"],
    categories: ["Groceries"],
    totalAmount: 556,
    createdAt: new Date("2025-11-16T08:00:00"),
  },
  {
    items: ["Greek Yogurt 400g", "Granola 500g", "Bananas 6pc", "Honey 500g", "Almond Milk 1L"],
    categories: ["Groceries"],
    totalAmount: 672,
    createdAt: new Date("2025-11-29T07:20:00"),
  },
  {
    items: ["Quaker Oats 1kg", "Amul Butter 100g", "Brown Bread", "Blueberries 125g", "Peanut Butter"],
    categories: ["Groceries"],
    totalAmount: 589,
    createdAt: new Date("2025-12-06T07:50:00"),
  },
];

export const DEMO_USER_PROFILES: DemoUserProfile[] = [
  {
    id: "user-atharv",
    name: "Atharv Sharma",
    email: "atharv@example.com",
    personaLabel: "P1 Restocker",
    addressTitle: "Home · Koramangala, Bengaluru",
    addressSub: "Delivery in 10 minutes",
    segmentTags: ["weekly_essentials_buyer", "p1_routine_restocker"],
    categoriesPurchased: ["Groceries"],
    orders: ATHARV_ORDERS,
    baskets: [
      {
        label: "Weekly staples",
        items: ["Amul Taaza Milk 1L", "Britannia Bread", "Tomatoes 500g", "Onions 1kg", "Basmati Rice 5kg"],
        categories: ["Groceries"],
        totalAmount: 487,
      },
      {
        label: "Dal & dairy refill",
        items: ["Toor Dal 1kg", "Milk 1L", "Curd 400g", "Bread", "Bananas 6pc"],
        categories: ["Groceries"],
        totalAmount: 312,
      },
    ],
  },
  {
    id: "user-raju",
    name: "Raju Kumar",
    email: "raju@example.com",
    personaLabel: "P1 Restocker",
    addressTitle: "Home · Indiranagar, Bengaluru",
    addressSub: "Delivery in 11 minutes",
    segmentTags: ["weekly_essentials_buyer", "p1_routine_restocker"],
    categoriesPurchased: ["Groceries"],
    orders: RAJU_ORDERS,
    baskets: [
      {
        label: "South Indian breakfast",
        items: ["Idli Dosa Batter 1kg", "Coconut Oil 500ml", "Sambar Powder", "Curd 400g", "Filter Coffee 200g"],
        categories: ["Groceries"],
        totalAmount: 445,
      },
      {
        label: "Rice & dal refill",
        items: ["Sona Masoori Rice 5kg", "Toor Dal 1kg", "Onions 1kg", "Tomatoes 500g", "Bananas 6pc"],
        categories: ["Groceries"],
        totalAmount: 612,
      },
    ],
  },
  {
    id: "user-sandy",
    name: "Sandy Nair",
    email: "sandy@example.com",
    personaLabel: "P1 Restocker",
    addressTitle: "Home · HSR Layout, Bengaluru",
    addressSub: "Delivery in 9 minutes",
    segmentTags: ["weekly_essentials_buyer", "p1_routine_restocker"],
    categoriesPurchased: ["Groceries"],
    orders: SANDY_ORDERS,
    baskets: [
      {
        label: "Breakfast bowl kit",
        items: ["Quaker Oats 1kg", "Greek Yogurt 400g", "Granola 500g", "Honey 500g", "Almond Milk 1L"],
        categories: ["Groceries"],
        totalAmount: 672,
      },
      {
        label: "Morning essentials",
        items: ["Brown Bread", "Amul Butter 100g", "Eggs 12pc", "Bananas 6pc", "Blueberries 125g"],
        categories: ["Groceries"],
        totalAmount: 556,
      },
    ],
  },
];

export const PRIMARY_DEMO_USER_IDS = DEMO_USER_PROFILES.map((u) => u.id);

export function getDemoProfile(userId: string): DemoUserProfile | undefined {
  return DEMO_USER_PROFILES.find((u) => u.id === userId);
}

export function nextUserBasket(userId: string, orderIndex: number): DemoBasket {
  const profile = getDemoProfile(userId);
  const baskets = profile?.baskets ?? [];
  if (baskets.length === 0) {
    return {
      label: "Weekly groceries",
      items: ["Milk 1L", "Bread", "Eggs 12pc"],
      categories: ["Groceries"],
      totalAmount: 299,
    };
  }
  return baskets[orderIndex % baskets.length];
}
