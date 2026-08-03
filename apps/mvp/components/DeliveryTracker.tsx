"use client";

import { useEffect, useRef, useState } from "react";
import { formatCurrency } from "@/lib/demo-orders";

export type DeliveryStage = "preparing" | "picked" | "otw" | "delivered";

const STAGES: { key: DeliveryStage; label: string; icon: string }[] = [
  { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
  { key: "picked", label: "Picked up", icon: "📦" },
  { key: "otw", label: "On the way", icon: "🛵" },
  { key: "delivered", label: "Delivered", icon: "✅" },
];

export function DeliveryTracker({
  orderId,
  totalAmount,
  itemCount,
  onDelivered,
}: {
  orderId: string;
  totalAmount: number;
  itemCount: number;
  onDelivered: () => void;
}) {
  const [stage, setStage] = useState<DeliveryStage>("preparing");
  const stageIndex = STAGES.findIndex((s) => s.key === stage);

  const onDeliveredRef = useRef(onDelivered);
  onDeliveredRef.current = onDelivered;

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage("picked"), 1200),
      setTimeout(() => setStage("otw"), 2400),
      setTimeout(() => {
        setStage("delivered");
        onDeliveredRef.current();
      }, 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [orderId]);

  return (
    <div className="delivery-tracker card">
      <div className="delivery-tracker-header">
        <div>
          <p className="delivery-tracker-title">
            {stage === "delivered" ? "Order delivered!" : "Order on the way"}
          </p>
          <p className="delivery-tracker-sub">
            {itemCount} items · {formatCurrency(totalAmount)} · #{orderId.slice(-6).toUpperCase()}
          </p>
        </div>
        <span className="delivery-eta">
          {stage === "delivered" ? "Done" : "~10 min"}
        </span>
      </div>

      <div className="delivery-progress">
        {STAGES.map((s, i) => (
          <div
            key={s.key}
            className={`delivery-step ${i <= stageIndex ? "delivery-step-done" : ""} ${
              i === stageIndex ? "delivery-step-active" : ""
            }`}
          >
            <span className="delivery-step-icon">{s.icon}</span>
            <span className="delivery-step-label">{s.label}</span>
          </div>
        ))}
      </div>

      {stage === "otw" && (
        <p className="delivery-rider-note">
          🛵 Rajesh is riding to your address — your groceries are on the way
        </p>
      )}
    </div>
  );
}
