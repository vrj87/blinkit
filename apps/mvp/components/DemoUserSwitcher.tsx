"use client";

import { useState } from "react";
import { DemoUserClient, type NudgeRow } from "@/components/DemoUserClient";
import type { OrderRow } from "@/components/OrderHistory";

export interface DemoUserData {
  id: string;
  name: string;
  orderCount: number;
  categoriesPurchased: string;
  personaLabel: string;
  addressTitle: string;
  addressSub: string;
  orders: OrderRow[];
  nudges: NudgeRow[];
}

export function DemoUserSwitcher({ users }: { users: DemoUserData[] }) {
  const [activeId, setActiveId] = useState(users[0]?.id ?? "");

  const activeUser = users.find((u) => u.id === activeId) ?? users[0];
  if (!activeUser) return null;

  return (
    <div className="demo-user-switcher">
      <div className="demo-user-pills" role="tablist" aria-label="Demo users">
        {users.map((user) => (
          <button
            key={user.id}
            type="button"
            role="tab"
            aria-selected={user.id === activeId}
            className={`demo-user-pill ${user.id === activeId ? "demo-user-pill-active" : ""}`}
            onClick={() => setActiveId(user.id)}
          >
            <span className="demo-user-pill-name">{user.name.split(" ")[0]}</span>
            <span className="demo-user-pill-meta">{user.orderCount} orders</span>
          </button>
        ))}
      </div>
      <DemoUserClient key={activeUser.id} embedded user={activeUser} />
    </div>
  );
}
