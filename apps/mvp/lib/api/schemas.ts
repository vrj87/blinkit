import { z } from "zod";

const reviewSource = z.enum([
  "app_store",
  "play_store",
  "reddit",
  "forum",
  "social",
  "product_review",
  "web_ui",
]);

export const rawReviewSchema = z.object({
  id: z.string().optional(),
  source: reviewSource,
  date: z.string().optional(),
  rating: z.number().nullable().optional(),
  text: z.string().min(1),
  author_segment_hint: z.string().nullable().optional(),
  url: z.string().optional().default(""),
  keywords: z.array(z.string()).optional().default([]),
});

export const ingestReviewsSchema = z.object({
  reviews: z.array(rawReviewSchema).min(1),
  normalize: z.boolean().optional().default(false),
});

export const placeOrderSchema = z.union([
  z.object({
    userId: z.string().min(1),
    lineItems: z
      .array(
        z.object({
          productId: z.string().min(1),
          quantity: z.number().int().min(1).max(20),
        })
      )
      .min(1),
  }),
  z.object({
    userId: z.string().min(1),
    items: z.array(z.string()).min(1),
    categories: z.array(z.string()).min(1),
    totalAmount: z.number().positive(),
  }),
]);

export const orderEventSchema = z.object({
  userId: z.string().min(1),
  items: z.array(z.string()).optional().default([]),
  categories: z.array(z.string()).optional().default([]),
  totalAmount: z.number().optional().default(0),
});

export const generateNudgeSchema = z.object({
  userId: z.string().min(1),
  forceNew: z.boolean().optional().default(false),
  triggerType: z.enum(["post_order", "batch_scan", "manual"]).optional().default("batch_scan"),
});

export const nudgeFeedbackSchema = z.object({
  status: z.enum(["accepted", "dismissed", "snoozed"]),
});
