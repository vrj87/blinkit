import { readFileSync } from "fs";
import { themesPath } from "@blinkit/discovery-core";

export interface ThemeQuote {
  reviewId: string;
  text: string;
  source: string;
  url: string;
}

export interface DiscoveryTheme {
  id: string;
  label: string;
  summary: string;
  researchQuestion: string;
  sentiment: string;
  frequency: number;
  confidence: string;
  quotes: ThemeQuote[];
  actionableInsight: string;
  segmentHints: string[];
}

export interface ThemesFile {
  generatedAt: string;
  reviewCount: number;
  themes: DiscoveryTheme[];
  hypotheses: string[];
}

const CATALOGUE = [
  "Groceries",
  "Household Essentials",
  "Snacks & Beverages",
  "Personal Care",
  "Pet Supplies",
  "Baby Products",
  "Frozen Foods",
  "Health & Wellness",
] as const;

const ADJACENCY: Record<string, string[]> = {
  Groceries: ["Personal Care", "Frozen Foods", "Health & Wellness"],
  "Household Essentials": ["Personal Care", "Pet Supplies", "Baby Products"],
  "Snacks & Beverages": ["Personal Care", "Frozen Foods", "Health & Wellness"],
};

export function getCatalogue(): readonly string[] {
  return CATALOGUE;
}

export function loadThemes(): ThemesFile {
  try {
    return JSON.parse(readFileSync(themesPath(), "utf-8")) as ThemesFile;
  } catch {
    return {
      generatedAt: new Date().toISOString(),
      reviewCount: 0,
      themes: [],
      hypotheses: [],
    };
  }
}

export function getThemesForRAG(themeIds?: string[]): string {
  const data = loadThemes();
  const themes = themeIds?.length
    ? data.themes.filter((t) => themeIds.includes(t.id))
    : data.themes.slice(0, 5);

  return themes
    .map(
      (t) =>
        `[${t.id}] ${t.label}: ${t.summary}. Action: ${t.actionableInsight}. Quote: "${t.quotes[0]?.text ?? ""}"`
    )
    .join("\n");
}

export function suggestAdjacentCategory(
  currentCategories: string[],
  exclude: string[] = []
): string | null {
  const owned = new Set([...currentCategories, ...exclude]);
  const candidates = new Set<string>();

  for (const cat of currentCategories) {
    for (const adj of ADJACENCY[cat] ?? []) {
      if (!owned.has(adj)) candidates.add(adj);
    }
  }

  if (candidates.size === 0) {
    for (const cat of CATALOGUE) {
      if (!owned.has(cat)) candidates.add(cat);
    }
  }

  const priority = [
    "Personal Care",
    "Frozen Foods",
    "Health & Wellness",
    "Pet Supplies",
    "Baby Products",
    "Snacks & Beverages",
    "Household Essentials",
  ];
  for (const p of priority) {
    if (candidates.has(p)) return p;
  }

  return candidates.values().next().value ?? null;
}

export function getSocialProof(category: string): string {
  const counts: Record<string, number> = {
    "Personal Care": 847,
    "Pet Supplies": 412,
    "Baby Products": 289,
    "Frozen Foods": 623,
    "Health & Wellness": 534,
  };
  const n = counts[category] ?? 500;
  return `${n} users in your area tried ${category} this month`;
}
