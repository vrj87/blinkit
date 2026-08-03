export interface LlmGenerationMeta {
  source: "llm" | "rules";
  provider: "groq" | "openai" | "none";
  model: string | null;
  latencyMs: number;
  configured: boolean;
}

export function parseGenerationMeta(json: string | null | undefined): LlmGenerationMeta | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as LlmGenerationMeta;
  } catch {
    return null;
  }
}
