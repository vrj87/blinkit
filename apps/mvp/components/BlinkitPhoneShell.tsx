"use client";

import type { ReactNode } from "react";

export type BlinkitTab = "home" | "orders" | "foryou";

export function BlinkitPhoneShell({
  children,
  activeTab,
  onTabChange,
  forYouDot = false,
  searchQuery = "",
  onSearchChange,
  onSearchFocus,
  onRefresh,
  refreshing = false,
}: {
  children: ReactNode;
  activeTab: BlinkitTab;
  onTabChange: (tab: BlinkitTab) => void;
  forYouDot?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onSearchFocus?: () => void;
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  return (
    <div className="blinkit-phone">
      <div className="blinkit-phone-status">
        <span>9:41</span>
        <span className="blinkit-phone-signal">●●● ▮▮▮</span>
      </div>

      <div className="blinkit-phone-search blinkit-phone-search-input-wrap">
        <span className="blinkit-phone-search-icon" aria-hidden>
          🔍
        </span>
        <input
          type="search"
          className="blinkit-phone-search-input"
          placeholder='Search "milk", "atta", "snacks"…'
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          onFocus={() => onSearchFocus?.()}
          aria-label="Search products"
        />
        {searchQuery && (
          <button
            type="button"
            className="blinkit-phone-search-clear"
            onClick={() => onSearchChange?.("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
        {onRefresh && (
          <button
            type="button"
            className="blinkit-phone-refresh"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Refresh orders and recommendations"
            title="Refresh"
          >
            {refreshing ? "…" : "↻"}
          </button>
        )}
      </div>

      <div className="blinkit-phone-content">{children}</div>

      <nav className="blinkit-bottom-nav" aria-label="App navigation">
        <button
          type="button"
          className={`blinkit-nav-item blinkit-nav-featured ${activeTab === "foryou" ? "blinkit-nav-active" : ""}`}
          onClick={() => onTabChange("foryou")}
        >
          <span className="blinkit-nav-icon">
            ✨
            {forYouDot && <span className="blinkit-nav-dot" />}
          </span>
          <span>For you</span>
        </button>
        <button
          type="button"
          className={`blinkit-nav-item ${activeTab === "home" ? "blinkit-nav-active" : ""}`}
          onClick={() => onTabChange("home")}
        >
          <span className="blinkit-nav-icon">🏠</span>
          <span>Home</span>
        </button>
        <button
          type="button"
          className={`blinkit-nav-item ${activeTab === "orders" ? "blinkit-nav-active" : ""}`}
          onClick={() => onTabChange("orders")}
        >
          <span className="blinkit-nav-icon">📦</span>
          <span>Orders</span>
        </button>
      </nav>
    </div>
  );
}
