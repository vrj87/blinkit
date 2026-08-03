export interface SegmentMatch {
  eligible: boolean;
  reasons: string[];
}

export interface UserSegmentInput {
  orderCount: number;
  categoriesPurchased: string[];
  optedOut: boolean;
  segmentTags: string[];
}

/** Demo MVP: all users get AI recommendations — no order-history gates. */
export function matchesTargetSegment(user: UserSegmentInput): SegmentMatch {
  if (user.optedOut) {
    return { eligible: false, reasons: ["User opted out of nudges"] };
  }

  return {
    eligible: true,
    reasons: ["All users eligible for AI category recommendations"],
  };
}

export function parseJsonArray<T = string>(json: string): T[] {
  try {
    return JSON.parse(json) as T[];
  } catch {
    return [];
  }
}
