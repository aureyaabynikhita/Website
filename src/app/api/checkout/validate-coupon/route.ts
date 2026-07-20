import { NextResponse } from "next/server";
import { validateCoupon } from "@/services/coupons";

export async function POST(request: Request) {
  const { code, subtotal } = await request.json();
  if (!code || typeof subtotal !== "number") {
    return NextResponse.json({ error: "Missing code or subtotal" }, { status: 400 });
  }
  const result = await validateCoupon(code, subtotal);
  return NextResponse.json(result);
}
