"use client";

import { useMemo, useState } from "react";
import {
  CATALOG_PRODUCTS,
  HOME_CATEGORIES,
  searchProducts,
  type CatalogProduct,
} from "@/lib/product-catalog";
import { formatCurrency } from "@/lib/demo-orders";

interface CartRow {
  productId: string;
  quantity: number;
}

export function BlinkitHomeCatalog({
  userName,
  searchQuery = "",
  onPlaceOrder,
  loading,
  disabled,
}: {
  userName: string;
  searchQuery?: string;
  onPlaceOrder: (lineItems: CartRow[]) => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const firstName = userName.split(" ")[0];
  const [category, setCategory] = useState<string>("all");
  const [cart, setCart] = useState<Record<string, number>>({});

  const products = useMemo(
    () => searchProducts(searchQuery, category),
    [searchQuery, category]
  );
  const isSearching = searchQuery.trim().length > 0;

  const cartRows: CartRow[] = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([productId, quantity]) => ({ productId, quantity }));

  const cartTotal = cartRows.reduce((sum, row) => {
    const p = CATALOG_PRODUCTS.find((x) => x.id === row.productId);
    return sum + (p?.price ?? 0) * row.quantity;
  }, 0);

  const cartCount = cartRows.reduce((sum, r) => sum + r.quantity, 0);

  function addToCart(product: CatalogProduct) {
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] ?? 0) + 1,
    }));
  }

  function changeQty(productId: string, delta: number) {
    setCart((prev) => {
      const next = (prev[productId] ?? 0) + delta;
      if (next <= 0) {
        const { [productId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [productId]: next };
    });
  }

  return (
    <div className="blinkit-home">
      <div className="blinkit-home-hero">
        <p className="user-greeting">Hi, {firstName} 👋</p>
        <p className="blinkit-home-sub">Order groceries in minutes</p>
      </div>

      <div className="blinkit-home-banners">
        <div className="blinkit-banner blinkit-banner-yellow">
          <span>⚡</span> Delivery in 10 minutes
        </div>
        <div className="blinkit-banner blinkit-banner-green">
          <span>🛒</span> {CATALOG_PRODUCTS.length} products
        </div>
      </div>

      <div className="blinkit-category-strip blinkit-category-strip-scroll">
        {HOME_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`blinkit-cat-chip blinkit-cat-btn ${category === c.id ? "blinkit-cat-active" : ""}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {isSearching && (
        <p className="search-results-label">
          {products.length} result{products.length === 1 ? "" : "s"} for &quot;{searchQuery.trim()}&quot;
        </p>
      )}

      {products.length === 0 ? (
        <div className="card empty-state search-empty-state">
          <p>No products found.</p>
          <p style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}>
            Try &quot;milk&quot;, &quot;bread&quot;, &quot;chips&quot;, or &quot;detol&quot;
          </p>
        </div>
      ) : (
      <div className="product-grid">
        {products.map((product) => {
          const qty = cart[product.id] ?? 0;
          return (
            <article key={product.id} className="product-card">
              <div className="product-card-top">
                <span className="product-emoji">{product.emoji}</span>
                {product.badge && <span className="product-badge">{product.badge}</span>}
              </div>
              <p className="product-brand">{product.brand}</p>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-unit">{product.unit}</p>
              <div className="product-rating">★ {product.rating}</div>
              <div className="product-price-row">
                <span className="product-price">{formatCurrency(product.price)}</span>
                <span className="product-mrp">{formatCurrency(product.mrp)}</span>
              </div>
              {qty === 0 ? (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm product-add-btn"
                  onClick={() => addToCart(product)}
                  disabled={disabled}
                >
                  ADD
                </button>
              ) : (
                <div className="product-qty-control">
                  <button type="button" onClick={() => changeQty(product.id, -1)} aria-label="Decrease">
                    −
                  </button>
                  <span>{qty}</span>
                  <button type="button" onClick={() => changeQty(product.id, 1)} aria-label="Increase">
                    +
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
      )}

      {cartCount > 0 && (
        <div className="cart-bar">
          <div className="cart-bar-info">
            <span className="cart-bar-count">{cartCount} items</span>
            <span className="cart-bar-total">{formatCurrency(cartTotal)}</span>
          </div>
          <button
            type="button"
            className="btn btn-primary cart-bar-btn"
            disabled={loading || disabled}
            onClick={() => onPlaceOrder(cartRows)}
          >
            {loading ? "Placing…" : "Place order →"}
          </button>
        </div>
      )}

      <p className="home-hint">
        Order saved to database → Groq AI suggests a new category on <strong>For you</strong>
      </p>
    </div>
  );
}
