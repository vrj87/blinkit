"use client";

import {
  formatCurrency,
  formatOrderDate,
  shortOrderId,
  type DemoBasket,
} from "@/lib/demo-orders";
import { parseOrderField, type OrderLineItemRow } from "@/lib/order-row";

export interface OrderRow {
  id: string;
  items: string;
  categories: string;
  totalAmount: number;
  createdAt: string;
  lineItems?: string | null;
}

export type { OrderLineItemRow } from "@/lib/order-row";

export function OrderHistory({
  orders,
  onReorder,
  reordering,
  highlightOrderId,
}: {
  orders: OrderRow[];
  onReorder?: (basket: DemoBasket) => void;
  reordering?: boolean;
  highlightOrderId?: string | null;
}) {
  if (orders.length === 0) {
    return (
      <div className="card empty-state">
        <p>No orders yet. Place your first grocery refill to get started.</p>
      </div>
    );
  }

  return (
    <div className="order-history-list">
      {orders.map((order, index) => {
        const lineItems = order.lineItems
          ? parseOrderField<OrderLineItemRow[]>(order.lineItems)
          : null;
        const items = parseOrderField<string[]>(order.items);
        const categories = parseOrderField<string[]>(order.categories);
        const displayItems = lineItems
          ? lineItems.map((l) => `${l.name} ×${l.quantity}`)
          : items;
        const isLatest = index === 0;
        const isHighlighted = order.id === highlightOrderId;
        const deliveryMins = 8 + (index % 4) * 2;

        return (
          <article
            key={order.id}
            id={`order-${order.id}`}
            className={`order-history-card ${isHighlighted ? "order-history-card-new" : ""}`}
          >
            <div className="order-history-top">
              <div>
                <p className="order-history-date">{formatOrderDate(order.createdAt)}</p>
                <p className="order-history-id">Order #{shortOrderId(order.id)}</p>
              </div>
              <span className={`order-status ${isLatest && isHighlighted ? "order-status-new" : ""}`}>
                {isLatest && isHighlighted ? "Just placed" : "Delivered"}
              </span>
            </div>

            <div className="order-history-meta">
              <span>{displayItems.length} items</span>
              <span>·</span>
              <span>{categories.join(", ")}</span>
              {!isHighlighted && <span>·</span>}
              {!isHighlighted && <span>in {deliveryMins} min</span>}
            </div>

            <ul className="order-history-items">
              {displayItems.slice(0, 4).map((item) => (
                <li key={item}>{item}</li>
              ))}
              {displayItems.length > 4 && (
                <li className="order-history-more">+{displayItems.length - 4} more items</li>
              )}
            </ul>

            <div className="order-history-footer">
              <span className="order-history-total">{formatCurrency(order.totalAmount)}</span>
              {onReorder && index === 0 && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  disabled={reordering}
                  onClick={() =>
                    onReorder({
                      label: "Reorder",
                      items,
                      categories,
                      totalAmount: order.totalAmount,
                    })
                  }
                >
                  {reordering ? "Ordering…" : "Buy again"}
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
