"use client";

import type { LlmGenerationMeta } from "@/lib/generation-meta";
import { parseGenerationMeta } from "@/lib/generation-meta";

export function LlmBadge({
  meta,
  compact = false,
}: {
  meta: LlmGenerationMeta | string | null | undefined;
  compact?: boolean;
}) {
  const parsed = typeof meta === "string" ? parseGenerationMeta(meta) : meta;
  if (!parsed) {
    return (
      <span className="llm-badge llm-badge-demo">
        {compact ? "Demo" : "Pre-seeded demo pick"}
      </span>
    );
  }

  if (parsed.source === "rules") {
    return (
      <span className="llm-badge llm-badge-rules" title="LLM unavailable — rule-based fallback">
        {compact ? "Rules" : "Rule-based fallback"}
      </span>
    );
  }

  const label =
    parsed.provider === "groq"
      ? `Groq · ${parsed.model}`
      : `${parsed.provider} · ${parsed.model}`;

  return (
    <span className="llm-badge llm-badge-live" title={`Generated in ${parsed.latencyMs}ms`}>
      {compact ? "AI" : `✨ ${label}`}
      {!compact && parsed.latencyMs > 0 && (
        <span className="llm-badge-latency"> · {parsed.latencyMs}ms</span>
      )}
    </span>
  );
}

export function AiGeneratingPanel({ step }: { step: string }) {
  return (
    <div className="ai-generating card">
      <div className="ai-generating-spinner" aria-hidden />
      <div>
        <p className="ai-generating-title">Groq AI is personalizing your pick</p>
        <p className="ai-generating-step">{step}</p>
      </div>
    </div>
  );
}
