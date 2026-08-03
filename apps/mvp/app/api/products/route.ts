import { NextRequest, NextResponse } from "next/server";
import { searchProducts, HOME_CATEGORIES, CATALOG_PRODUCTS } from "@/lib/product-catalog";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category") ?? "all";
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const products = searchProducts(q, category);

  return NextResponse.json({
    categories: HOME_CATEGORIES,
    count: products.length,
    products,
    totalCatalog: CATALOG_PRODUCTS.length,
  });
}
