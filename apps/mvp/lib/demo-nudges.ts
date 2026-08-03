import { getSocialProof } from "./themes";

export interface DemoNudgeSeed {
  suggestedCategory: string;
  adjacentTo: string[];
  copy: string;
  rationale: string;
  riskReducers: string[];
  confidence: "high" | "medium";
  evidenceThemeIds: string[];
  status: "pending" | "accepted" | "dismissed" | "snoozed";
  triggerType: "post_order" | "batch_scan";
  createdAt?: Date;
}

export function atharvDemoNudges(): DemoNudgeSeed[] {
  const socialProof = getSocialProof("Personal Care");

  return [
    {
      suggestedCategory: "Personal Care",
      adjacentTo: ["Groceries"],
      copy: `Hi Atharv! You reorder milk & staples every week — ${socialProof.toLowerCase()}. Try our ₹99 Personal Care starter pack with bestseller shampoo & body wash.`,
      rationale:
        "Your 6 grocery-only orders show a strong weekly routine. Personal Care is the #1 adjacent category for grocery restockers in Koramangala — low risk, high repeat potential.",
      riskReducers: [
        "₹99 trial starter pack",
        "Bestseller badge",
        "Easy returns within 7 days",
        socialProof,
      ],
      confidence: "high",
      evidenceThemeIds: ["theme-trust-risk", "theme-social-wom", "theme-habit-reorder"],
      status: "snoozed",
      triggerType: "batch_scan",
      createdAt: new Date("2025-12-06T10:00:00"),
    },
    {
      suggestedCategory: "Frozen Foods",
      adjacentTo: ["Groceries"],
      copy: "Quick freezer picks for busy weeknights — paneer, parathas & ice cream delivered with your groceries.",
      rationale:
        "Frozen Foods pairs naturally with your staple grocery runs. You accepted this suggestion last month.",
      riskReducers: ["Cold-chain guarantee", "₹149 combo trial", "Top-rated in your area"],
      confidence: "medium",
      evidenceThemeIds: ["theme-incentives", "theme-trust-risk"],
      status: "accepted",
      triggerType: "post_order",
      createdAt: new Date("2025-11-12T14:30:00"),
    },
  ];
}

export function amitDemoNudges(): DemoNudgeSeed[] {
  const socialProof = getSocialProof("Pet Supplies");

  return [
    {
      suggestedCategory: "Pet Supplies",
      adjacentTo: ["Household Essentials"],
      copy: `Amit, households like yours often add pet care to quick orders. ${socialProof} — starter kit from ₹199.`,
      rationale:
        "Household Essentials buyers in your segment frequently expand to Pet Supplies. Adjacent cleaning + pet care bundle performs well.",
      riskReducers: ["₹199 starter kit", "Vet-approved brands", "Easy returns", socialProof],
      confidence: "high",
      evidenceThemeIds: ["theme-social-wom", "theme-incentives"],
      status: "snoozed",
      triggerType: "batch_scan",
      createdAt: new Date("2025-12-04T09:00:00"),
    },
  ];
}

export function rajuDemoNudges(): DemoNudgeSeed[] {
  const socialProof = getSocialProof("Health & Wellness");

  return [
    {
      suggestedCategory: "Health & Wellness",
      adjacentTo: ["Groceries"],
      copy: `Hey Raju! Your weekly rice & batter runs are on point — ${socialProof.toLowerCase()}. Add vitamins & protein bars with a ₹129 trial box.`,
      rationale:
        "South Indian grocery restockers in Indiranagar often add Health & Wellness after 5+ staple orders. Low-friction add-on at checkout.",
      riskReducers: [
        "₹129 trial box",
        "Pharmacist-verified brands",
        "Easy returns within 7 days",
        socialProof,
      ],
      confidence: "high",
      evidenceThemeIds: ["theme-trust-risk", "theme-social-wom", "theme-habit-reorder"],
      status: "snoozed",
      triggerType: "batch_scan",
      createdAt: new Date("2025-12-09T08:30:00"),
    },
    {
      suggestedCategory: "Frozen Foods",
      adjacentTo: ["Groceries"],
      copy: "Frozen parathas & paneer for busy mornings — pairs well with your idli batter orders.",
      rationale: "You snoozed this pick last month — still a strong fit for your breakfast routine.",
      riskReducers: ["Cold-chain guarantee", "₹149 combo trial", "Top-rated in Indiranagar"],
      confidence: "medium",
      evidenceThemeIds: ["theme-incentives"],
      status: "snoozed",
      triggerType: "post_order",
      createdAt: new Date("2025-11-18T10:00:00"),
    },
  ];
}

export function sandyDemoNudges(): DemoNudgeSeed[] {
  const socialProof = getSocialProof("Frozen Foods");

  return [
    {
      suggestedCategory: "Frozen Foods",
      adjacentTo: ["Groceries"],
      copy: `Sandy, love your breakfast routine! ${socialProof} — try frozen smoothie packs & parfaits from ₹149.`,
      rationale:
        "HSR breakfast buyers who order oats & yogurt weekly are 2.3× more likely to try Frozen Foods. Perfect add-on for your morning slot.",
      riskReducers: [
        "₹149 smoothie trial pack",
        "Cold-chain guarantee",
        "Bestseller badge",
        socialProof,
      ],
      confidence: "high",
      evidenceThemeIds: ["theme-social-wom", "theme-incentives", "theme-habit-reorder"],
      status: "snoozed",
      triggerType: "batch_scan",
      createdAt: new Date("2025-12-07T07:45:00"),
    },
    {
      suggestedCategory: "Personal Care",
      adjacentTo: ["Groceries"],
      copy: "Skincare minis that match your wellness grocery habit — accepted last month.",
      rationale: "Personal Care was a natural first expansion from your healthy grocery basket.",
      riskReducers: ["₹99 starter pack", "Dermatologist-tested", "Easy returns"],
      confidence: "medium",
      evidenceThemeIds: ["theme-trust-risk"],
      status: "accepted",
      triggerType: "post_order",
      createdAt: new Date("2025-11-10T08:00:00"),
    },
  ];
}

export const DEMO_NUDGE_SEEDERS: Record<string, () => DemoNudgeSeed[]> = {
  "user-atharv": atharvDemoNudges,
  "user-raju": rajuDemoNudges,
  "user-sandy": sandyDemoNudges,
  "user-amit": amitDemoNudges,
};
