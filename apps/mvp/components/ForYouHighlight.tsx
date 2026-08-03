"use client";

import type { NudgeRow } from "@/components/DemoUserClient";
import { LlmBadge } from "@/components/LlmBadge";

export function ForYouHighlight({
  nudge,
  onView,
  onGenerate,
  generating,
}: {
  nudge: NudgeRow | null | undefined;
  onView: () => void;
  onGenerate: () => void;
  generating?: boolean;
}) {
  return (
    <div className="foryou-home-highlight">
      <button type="button" className="foryou-home-highlight-body" onClick={onView}>
        <div className="foryou-home-highlight-top">
          <span className="foryou-home-highlight-eyebrow">✨ For you · AI powered</span>
          {nudge ? (
            <LlmBadge meta={nudge.generationMeta} compact />
          ) : (
            <span className="foryou-home-highlight-pill">Groq LLM</span>
          )}
        </div>
        {nudge ? (
          <>
            <p className="foryou-home-highlight-title">Try {nudge.suggestedCategory}</p>
            <p className="foryou-home-highlight-copy">{nudge.copy}</p>
            <span className="foryou-home-highlight-cta">View starter pack →</span>
          </>
        ) : (
          <>
            <p className="foryou-home-highlight-title">Discover your next category</p>
            <p className="foryou-home-highlight-copy">
              Groq AI picks an adjacent category based on your orders &amp; user research
            </p>
            <span className="foryou-home-highlight-cta">Open For you tab →</span>
          </>
        )}
      </button>
      {!nudge && (
        <button
          type="button"
          className="btn btn-primary btn-sm btn-block foryou-home-highlight-gen"
          onClick={onGenerate}
          disabled={generating}
        >
          {generating ? "Groq AI thinking…" : "Generate AI pick"}
        </button>
      )}
    </div>
  );
}
