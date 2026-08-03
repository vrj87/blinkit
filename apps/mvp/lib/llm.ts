import { z } from "zod";
import OpenAI from "openai";
import {
  getSocialProof,
  getThemesForRAG,
} from "./themes";
import type { LlmGenerationMeta } from "./generation-meta";
export type { LlmGenerationMeta } from "./generation-meta";

export const NudgeOutputSchema = z.object({
  suggestedCategory: z.string(),
  adjacentTo: z.array(z.string()),
  rationale: z.string(),
  copy: z.string(),
  riskReducers: z.array(z.string()),
  confidence: z.enum(["high", "medium"]),
  evidenceThemeIds: z.array(z.string()),
});

export type NudgeOutput = z.infer<typeof NudgeOutputSchema>;

export interface GenerateNudgeInput {
  userName: string;
  categoriesPurchased: string[];
  recentItems: string[];
  orderCount: number;
}

export interface GenerateNudgeResult {
  output: NudgeOutput;
  meta: LlmGenerationMeta;
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

export function getLlmStatus(): Omit<LlmGenerationMeta, "source" | "latencyMs"> & {
  ready: boolean;
} {
  const groqKey = Boolean(process.env.GROQ_API_KEY);
  const openaiKey = Boolean(process.env.OPENAI_API_KEY);
  if (groqKey) {
    return {
      ready: true,
      configured: true,
      provider: "groq",
      model: "llama-3.3-70b-versatile",
    };
  }
  if (openaiKey) {
    return {
      ready: true,
      configured: true,
      provider: "openai",
      model: "gpt-4o-mini",
    };
  }
  return { ready: false, configured: false, provider: "none", model: null };
}

function createLlmClient(): { client: OpenAI; provider: "groq" | "openai"; model: string } | null {
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (groqKey) {
    return {
      client: new OpenAI({ apiKey: groqKey, baseURL: "https://api.groq.com/openai/v1" }),
      provider: "groq",
      model: "llama-3.3-70b-versatile",
    };
  }
  if (openaiKey) {
    return {
      client: new OpenAI({ apiKey: openaiKey }),
      provider: "openai",
      model: "gpt-4o-mini",
    };
  }
  return null;
}

function ruleBasedNudge(input: GenerateNudgeInput): NudgeOutput {
  const expansionPool = CATALOGUE.filter((c) => c !== "Groceries");
  const suggested =
    expansionPool[Math.floor(Math.random() * expansionPool.length)] ?? "Personal Care";
  const socialProof = getSocialProof(suggested);
  const firstName = input.userName.split(" ")[0];
  const adjacent =
    input.categoriesPurchased.length > 0 ? input.categoriesPurchased : ["Groceries"];

  return {
    suggestedCategory: suggested,
    adjacentTo: adjacent,
    rationale: `${suggested} is a popular expansion category on Blinkit — great for discovering new essentials beyond your usual basket.`,
    copy: `Hi ${firstName}! ${socialProof}. Try our ₹99 ${suggested} starter pack — easy returns if it's not for you.`,
    riskReducers: [
      "₹99 trial starter pack",
      "Bestseller badge",
      "Easy returns within 7 days",
      socialProof,
    ],
    confidence: "high",
    evidenceThemeIds: ["theme-trust-risk", "theme-social-wom", "theme-incentives"],
  };
}

function buildSystemPrompt(input: GenerateNudgeInput, themesContext: string): string {
  const recentSample = input.recentItems.slice(0, 8).join(", ") || "weekly staples";
  return `You are the Smart Category Explorer AI for Blinkit quick-commerce.

DISCOVERY RESEARCH (use for evidenceThemeIds and rationale):
${themesContext}

USER CONTEXT (optional — do not use to block categories):
- Name: ${input.userName}
- Orders on platform: ${input.orderCount}
- Categories in history: ${input.categoriesPurchased.join(", ") || "none yet"}
- Recent items: ${recentSample}

TASK: Recommend ONE category from the Blinkit catalogue. Order history is optional context only — you may suggest ANY valid category. Prefer an expansion category that feels fresh and different when possible.

RULES:
- suggestedCategory MUST be exactly one of: ${CATALOGUE.join(", ")}
- adjacentTo: array of user's current categories this recommendation builds on
- copy: max 2 sentences, warm, Indian English, mention ₹99 trial if relevant
- rationale: 1-2 sentences for ops dashboard — cite behaviour + research
- riskReducers: 3-4 short strings (trial pack, returns, bestseller, social proof)
- confidence: "high" or "medium"
- evidenceThemeIds: 2-4 theme IDs from discovery research above
- No medical claims, no guaranteed delivery times

Return valid JSON only:
{ "suggestedCategory", "adjacentTo", "rationale", "copy", "riskReducers", "confidence", "evidenceThemeIds" }`;
}

export async function generateNudge(input: GenerateNudgeInput): Promise<GenerateNudgeResult> {
  const start = Date.now();
  const fallback = ruleBasedNudge(input);
  const llm = createLlmClient();

  if (!llm) {
    return {
      output: fallback,
      meta: {
        source: "rules",
        provider: "none",
        model: null,
        latencyMs: Date.now() - start,
        configured: false,
      },
    };
  }

  const themesContext = getThemesForRAG([
    "theme-trust-risk",
    "theme-social-wom",
    "theme-incentives",
    "theme-habit-reorder",
    "theme-speed-transactional",
    "theme-bad-first-experience",
  ]);

  try {
    const response = await llm.client.chat.completions.create({
      model: llm.model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(input, themesContext) },
        { role: "user", content: JSON.stringify(input) },
      ],
      temperature: 0.65,
      max_tokens: 600,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("Empty LLM response");

    const parsed = NudgeOutputSchema.safeParse(JSON.parse(content));
    if (!parsed.success) throw new Error("Invalid LLM JSON shape");

    const cat = parsed.data.suggestedCategory;
    if (!CATALOGUE.includes(cat as (typeof CATALOGUE)[number])) throw new Error("Invalid category");

    return {
      output: parsed.data,
      meta: {
        source: "llm",
        provider: llm.provider,
        model: llm.model,
        latencyMs: Date.now() - start,
        configured: true,
      },
    };
  } catch {
    return {
      output: fallback,
      meta: {
        source: "rules",
        provider: llm.provider,
        model: llm.model,
        latencyMs: Date.now() - start,
        configured: true,
      },
    };
  }
}
