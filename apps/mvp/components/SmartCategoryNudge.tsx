"use client";

import { getStarterPack } from "@/lib/starter-packs";
import { getInsightsForThemes } from "@/lib/theme-insights";
import { formatCurrency } from "@/lib/demo-orders";
import { LlmBadge } from "@/components/LlmBadge";

function parseJsonField<T>(value: string | T[] | undefined | null): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value) as T[];
  } catch {
    return [];
  }
}

export interface NudgeData {
  id: string;
  suggestedCategory: string;
  adjacentTo: string;
  copy: string;
  rationale: string;
  riskReducers: string;
  confidence: string;
  evidenceThemeIds?: string;
  generationMeta?: string | null;
  status: string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  "Personal Care": "🧴",
  "Frozen Foods": "🧊",
  "Health & Wellness": "💊",
  "Pet Supplies": "🐾",
  "Baby Products": "👶",
  "Snacks & Beverages": "🍿",
  "Household Essentials": "🧹",
  Groceries: "🛒",
};

export function SmartCategoryNudge({
  nudge,
  onFeedback,
  featured = false,
}: {
  nudge: NudgeData;
  onFeedback: (id: string, status: string) => void;
  featured?: boolean;
}) {
  const reducers = parseJsonField<string>(nudge.riskReducers);
  const adjacent = parseJsonField<string>(nudge.adjacentTo);
  const themeIds = parseJsonField<string>(nudge.evidenceThemeIds);
  const insights = getInsightsForThemes(themeIds);
  const pack = getStarterPack(nudge.suggestedCategory);
  const emoji = CATEGORY_EMOJI[nudge.suggestedCategory] ?? "✨";

  if (nudge.status !== "pending") {
    return (
      <div className="card nudge-card nudge-card-done">
        <div className="nudge-done-top">
          <span className={`badge badge-${nudge.status}`}>{nudge.status}</span>
          <span className="nudge-done-category">
            {emoji} {nudge.suggestedCategory}
          </span>
        </div>
        <p className="nudge-done-copy">{nudge.copy}</p>
      </div>
    );
  }

  return (
    <div className={`smart-nudge card ${featured ? "nudge-card-featured" : ""}`}>
      <div className="smart-nudge-ai-bar">
        <LlmBadge meta={nudge.generationMeta} />
        <span className={`nudge-confidence nudge-confidence-${nudge.confidence}`}>
          {nudge.confidence} fit
        </span>
      </div>

      <h3 className="smart-nudge-title">
        {emoji} Try {nudge.suggestedCategory}
      </h3>
      <p className="nudge-adjacent">
        Because you buy <strong>{adjacent.join(" & ")}</strong> regularly
      </p>
      <p className="nudge-copy">{nudge.copy}</p>

      {insights.length > 0 && (
        <div className="smart-nudge-insight">
          <p className="smart-nudge-insight-label">Why we think you&apos;ll like this</p>
          <ul>
            {insights.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="starter-pack">
        <div className="starter-pack-header">
          <p className="starter-pack-title">₹{pack.trialPrice} starter pack</p>
          <p className="starter-pack-tagline">{pack.tagline}</p>
        </div>
        <div className="starter-pack-grid">
          {pack.products.map((p) => (
            <div key={p.id} className="starter-product">
              <span className="starter-product-emoji">{p.emoji}</span>
              <div className="starter-product-info">
                <p className="starter-product-brand">{p.brand}</p>
                <p className="starter-product-name">{p.name}</p>
                <div className="starter-product-meta">
                  <span className="starter-product-rating">★ {p.rating}</span>
                  <span className="starter-product-reviews">({p.reviewCount.toLocaleString()})</span>
                  {p.badge && <span className="starter-product-badge">{p.badge}</span>}
                </div>
                <p className="starter-product-price">
                  {formatCurrency(p.price)}{" "}
                  <span className="starter-product-mrp">{formatCurrency(p.mrp)}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="nudge-rationale">{nudge.rationale}</p>

      <div className="nudge-tags">
        {reducers.map((r) => (
          <span key={r} className="risk-tag">
            {r}
          </span>
        ))}
      </div>

      <div className="nudge-actions">
        <button className="btn btn-primary btn-block" onClick={() => onFeedback(nudge.id, "accepted")}>
          Add starter pack · ₹{pack.trialPrice}
        </button>
        <div className="nudge-actions-row">
          <button className="btn btn-secondary" onClick={() => onFeedback(nudge.id, "snoozed")}>
            Remind later
          </button>
          <button className="btn btn-ghost" onClick={() => onFeedback(nudge.id, "dismissed")}>
            Not interested
          </button>
        </div>
      </div>
    </div>
  );
}
