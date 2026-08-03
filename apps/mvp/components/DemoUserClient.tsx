"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { type DemoBasket } from "@/lib/demo-orders";
import { OrderHistory, type OrderRow } from "@/components/OrderHistory";
import { BlinkitPhoneShell, type BlinkitTab } from "@/components/BlinkitPhoneShell";
import { DeliveryTracker } from "@/components/DeliveryTracker";
import { SmartCategoryNudge } from "@/components/SmartCategoryNudge";
import { BlinkitHomeCatalog } from "@/components/BlinkitHomeCatalog";
import { ForYouHighlight } from "@/components/ForYouHighlight";
import { AiGeneratingPanel } from "@/components/LlmBadge";

export interface NudgeRow {
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

function normalizeNudgeRow(n: unknown): NudgeRow {
  const row = (typeof n === "object" && n !== null ? n : {}) as Record<string, unknown>;
  return {
    id: String(row.id),
    suggestedCategory: String(row.suggestedCategory),
    adjacentTo:
      typeof row.adjacentTo === "string" ? row.adjacentTo : JSON.stringify(row.adjacentTo ?? []),
    copy: String(row.copy ?? ""),
    rationale: String(row.rationale ?? ""),
    riskReducers:
      typeof row.riskReducers === "string"
        ? row.riskReducers
        : JSON.stringify(row.riskReducers ?? []),
    confidence: String(row.confidence ?? "medium"),
    evidenceThemeIds:
      typeof row.evidenceThemeIds === "string"
        ? row.evidenceThemeIds
        : JSON.stringify(row.evidenceThemeIds ?? []),
    generationMeta: (row.generationMeta as string | null) ?? null,
    status: String(row.status ?? "pending"),
  };
}

interface DemoUserPageProps {
  embedded?: boolean;
  user: {
    id: string;
    name: string;
    orderCount: number;
    categoriesPurchased: string;
    personaLabel?: string;
    addressTitle?: string;
    addressSub?: string;
    orders: OrderRow[];
    nudges: NudgeRow[];
  };
}

export function DemoUserClient({ user, embedded = false }: DemoUserPageProps) {
  const hasPendingOnLoad = user.nudges.some((n) => n.status === "pending");

  const [orders, setOrders] = useState<OrderRow[]>(user.orders);
  const [orderCount, setOrderCount] = useState(user.orderCount);
  const [nudges, setNudges] = useState<NudgeRow[]>(user.nudges);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiStep, setAiStep] = useState("");
  const [message, setMessage] = useState("");
  const [highlightOrderId, setHighlightOrderId] = useState<string | null>(null);
  const [appTab, setAppTab] = useState<BlinkitTab>(hasPendingOnLoad ? "foryou" : "home");
  const [activeDelivery, setActiveDelivery] = useState<{
    orderId: string;
    totalAmount: number;
    itemCount: number;
  } | null>(null);
  const [queuedNudge, setQueuedNudge] = useState<NudgeRow | null>(null);
  const [pushBanner, setPushBanner] = useState<string | null>(null);
  const [acceptToast, setAcceptToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const pendingNudge = nudges.find((n) => n.status === "pending");
  const activeNudge = pendingNudge ?? queuedNudge;
  const pastNudges = nudges.filter(
    (n) => n.status !== "pending" && n.id !== queuedNudge?.id
  );
  const firstName = user.name.split(" ")[0];

  useEffect(() => {
    if (appTab !== "foryou" || activeNudge) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/nudges?userId=${user.id}&limit=10`);
        const data = await res.json();
        if (cancelled || !data.nudges?.length) return;
        setNudges((prev) => {
          const byId = new Map(prev.map((n) => [n.id, n]));
          for (const n of data.nudges) {
            byId.set(n.id, normalizeNudgeRow(n));
          }
          return Array.from(byId.values());
        });
      } catch {
        /* ignore sync errors */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [appTab, activeNudge, user.id]);

  const handleDelivered = useCallback(() => {
    if (queuedNudge) {
      setNudges((prev) => {
        if (prev.some((n) => n.id === queuedNudge.id && n.status === "pending")) {
          return prev;
        }
        return [queuedNudge, ...prev.filter((n) => n.id !== queuedNudge.id)];
      });
      setQueuedNudge(null);
      setPushBanner(`Hi ${firstName}! Based on your order, we found a new category for you`);
      setTimeout(() => setAppTab("foryou"), 800);
    }
    setMessage("Order delivered in 10 minutes ⚡");
  }, [queuedNudge, firstName]);

  function upsertNudge(nudge: NudgeRow) {
    setNudges((prev) => {
      const withoutDup = prev.filter((n) => n.id !== nudge.id);
      const snoozedOld = withoutDup.map((n) =>
        n.status === "pending" ? { ...n, status: "snoozed" } : n
      );
      return [{ ...nudge, status: "pending" }, ...snoozedOld];
    });
  }

  function handleOrderPlaced(
    data: {
      order?: {
        id: string;
        items: string;
        categories: string;
        lineItems?: string | null;
        totalAmount: number;
        createdAt?: string;
      };
      nudge?: NudgeRow | null;
      message?: string;
      ai?: { source?: string; provider?: string; latencyMs?: number } | null;
    },
    meta: { itemCount: number; totalAmount: number }
  ) {
    if (!data.order) return;

    const newOrder: OrderRow = {
      id: data.order.id,
      items: data.order.items,
      categories: data.order.categories,
      lineItems: data.order.lineItems ?? null,
      totalAmount: data.order.totalAmount,
      createdAt: data.order.createdAt ?? new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    setOrderCount((c) => c + 1);
    setHighlightOrderId(newOrder.id);
    setAppTab("orders");
    setActiveDelivery({
      orderId: newOrder.id,
      totalAmount: meta.totalAmount,
      itemCount: meta.itemCount,
    });
    if (data.nudge) {
      const nudge = normalizeNudgeRow(data.nudge);
      upsertNudge(nudge);
      setQueuedNudge(nudge);
    } else if (data.message) {
      setMessage(data.message);
    }
    if (data.ai?.source === "llm") {
      setPushBanner(`Groq AI picked your next category (${data.ai.latencyMs}ms)`);
    }
  }

  async function placeOrder(basket: DemoBasket) {
    setLoading(true);
    setMessage("");
    setPushBanner(null);
    setAcceptToast(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: basket.items,
          categories: basket.categories,
          totalAmount: basket.totalAmount,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setMessage(data.error ?? `Order failed (${res.status})`);
        return;
      }
      handleOrderPlaced(data, {
        itemCount: basket.items.length,
        totalAmount: basket.totalAmount,
      });
    } catch {
      setMessage("Failed to place order. Is the dev server running?");
    } finally {
      setLoading(false);
    }
  }

  async function placeOrderFromCart(lineItems: { productId: string; quantity: number }[]) {
    setLoading(true);
    setMessage("");
    setPushBanner(null);
    setAcceptToast(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, lineItems }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setMessage(data.error ?? `Order failed (${res.status})`);
        return;
      }
      const itemCount = lineItems.reduce((sum, row) => sum + row.quantity, 0);
      handleOrderPlaced(data, {
        itemCount,
        totalAmount: data.order?.totalAmount ?? 0,
      });
    } catch {
      setMessage("Failed to place order. Is the dev server running?");
    } finally {
      setLoading(false);
    }
  }

  async function generateRecommendation() {
    setGenerating(true);
    setMessage("");
    setAiStep("Loading discovery research themes…");
    try {
      const stepTimer = setTimeout(
        () => setAiStep("Groq LLM scoring adjacent categories…"),
        600
      );
      const stepTimer2 = setTimeout(
        () => setAiStep("Writing personalised copy & risk reducers…"),
        1400
      );

      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, forceNew: true, triggerType: "manual" }),
      });
      clearTimeout(stepTimer);
      clearTimeout(stepTimer2);

      const data = await res.json();
      if (data.nudge) {
        upsertNudge(normalizeNudgeRow(data.nudge));
        setAppTab("foryou");
        const aiLabel =
          data.ai?.source === "llm"
            ? `AI pick ready (${data.ai.provider}, ${data.ai.latencyMs}ms)`
            : "Recommendation ready";
        setPushBanner(aiLabel);
      } else if (data.message) {
        const reasons = data.segment?.reasons?.join(" · ");
        setMessage(reasons ? `${data.message} (${reasons})` : data.message);
      } else if (data.error) {
        setMessage(data.error);
      }
    } catch {
      setMessage("Could not generate recommendation.");
    } finally {
      setGenerating(false);
      setAiStep("");
    }
  }

  async function handleFeedback(id: string, status: string) {
    const res = await fetch(`/api/nudges/${id}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      setMessage(data.error ?? "Could not update recommendation.");
      return;
    }

    setNudges((prev) => prev.map((n) => (n.id === id ? { ...n, status } : n)));

    if (status === "accepted" && data.order) {
      const n = nudges.find((x) => x.id === id);
      const itemCount = data.itemCount ?? JSON.parse(data.order.items as string).length;
      handleOrderPlaced(
        { order: data.order },
        { itemCount, totalAmount: data.order.totalAmount }
      );
      setQueuedNudge(null);
      setAcceptToast(
        `Starter pack ordered! Your ${n?.suggestedCategory ?? "category"} picks arrive in ~10 min`
      );
      setPushBanner(null);
    } else if (status === "accepted") {
      setAcceptToast("Starter pack added!");
      setPushBanner(null);
    }
  }

  function handleSearchChange(query: string) {
    setSearchQuery(query);
    if (appTab !== "home") {
      setAppTab("home");
    }
  }

  function handleSearchFocus() {
    if (appTab !== "home") {
      setAppTab("home");
    }
  }

  const addressTitle = user.addressTitle ?? "Home · Koramangala, Bengaluru";
  const addressSub = user.addressSub ?? "Delivery in 10 minutes";

  const phone = (
    <BlinkitPhoneShell
      activeTab={appTab}
      onTabChange={setAppTab}
      forYouDot={Boolean(activeNudge)}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      onSearchFocus={handleSearchFocus}
    >
      {pushBanner && (
        <button
          type="button"
          className="push-notification"
          onClick={() => {
            setAppTab("foryou");
            setPushBanner(null);
          }}
        >
          <span className="push-notification-icon">🔔</span>
          <span className="push-notification-text">{pushBanner}</span>
          <span className="push-notification-cta">View →</span>
        </button>
      )}

      <div className="delivery-bar">
        <span className="delivery-bar-icon">📍</span>
        <div>
          <p className="delivery-bar-title">{addressTitle}</p>
          <p className="delivery-bar-sub">{addressSub}</p>
        </div>
      </div>

      {appTab === "home" && (
        <>
          <ForYouHighlight
            nudge={activeNudge}
            onView={() => setAppTab("foryou")}
            onGenerate={generateRecommendation}
            generating={generating}
          />
          <BlinkitHomeCatalog
            userName={user.name}
            searchQuery={searchQuery}
            onPlaceOrder={placeOrderFromCart}
            loading={loading}
            disabled={Boolean(activeDelivery)}
          />
        </>
      )}

      {appTab === "orders" && (
        <>
          {activeDelivery && (
            <DeliveryTracker
              key={activeDelivery.orderId}
              orderId={activeDelivery.orderId}
              totalAmount={activeDelivery.totalAmount}
              itemCount={activeDelivery.itemCount}
              onDelivered={() => {
                setActiveDelivery(null);
                handleDelivered();
              }}
            />
          )}
          <OrderHistory
            orders={orders}
            onReorder={placeOrder}
            reordering={loading}
            highlightOrderId={highlightOrderId}
          />
        </>
      )}

      {appTab === "foryou" && (
        <>
          <div className="explore-header">
            <div>
              <p className="explore-eyebrow">Smart Category Explorer</p>
              <p className="explore-lead">
                AI picks an adjacent category based on your orders & user research
              </p>
            </div>
          </div>

          {generating && aiStep ? (
            <AiGeneratingPanel step={aiStep} />
          ) : activeNudge ? (
            <SmartCategoryNudge nudge={activeNudge} onFeedback={handleFeedback} featured />
          ) : (
            <div className="card empty-state">
              <p>No active recommendation.</p>
              <p style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}>
                {message ||
                  "Place a grocery order or run the daily AI scan"}
              </p>
              <button
                type="button"
                className="btn btn-primary"
                style={{ marginTop: "0.75rem" }}
                onClick={generateRecommendation}
                disabled={generating}
              >
                {generating ? "Groq AI thinking…" : "Generate with Groq AI"}
              </button>
            </div>
          )}

          {pastNudges.length > 0 && (
            <>
              <h4 className="section-heading">Previous picks</h4>
              {pastNudges.map((nudge) => (
                <SmartCategoryNudge key={nudge.id} nudge={nudge} onFeedback={handleFeedback} />
              ))}
            </>
          )}

          <button
            type="button"
            className="btn btn-secondary btn-sm btn-block"
            style={{ marginTop: "1rem" }}
            onClick={generateRecommendation}
            disabled={generating}
          >
            {generating ? "Generating…" : "↻ Refresh with Groq AI"}
          </button>
        </>
      )}

      {(message || acceptToast) && (
        <p className="toast-message">{acceptToast ?? message}</p>
      )}
    </BlinkitPhoneShell>
  );

  if (embedded) {
    return <div className="blinkit-app-embed blinkit-app-embed-fit">{phone}</div>;
  }

  return (
    <main className="container">
      <p className="back-link">
        <Link href="/mvp">← Smart Category Explorer</Link>
      </p>
      {phone}
    </main>
  );
}

// Re-export for switcher compatibility
export { SmartCategoryNudge as NudgeCard };
