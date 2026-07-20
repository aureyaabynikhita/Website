import { NextResponse } from "next/server";
import { getProductsByIds } from "@/services/products";

export async function POST(request: Request) {
  const { productIds } = await request.json();
  if (!Array.isArray(productIds)) {
    return NextResponse.json({ error: "productIds must be an array" }, { status: 400 });
  }
  const products = await getProductsByIds(productIds);
  return NextResponse.json({ products });
}
