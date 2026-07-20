import { NextResponse } from "next/server";
import { Timestamp } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { requireAdmin } from "@/lib/session";
import { createCoupon } from "@/services/admin/customers-coupons";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { code, type, value, minOrderValue, maxDiscount, usageLimit, validFrom, validTill } = body;

  if (!code || !type || !value || !validFrom || !validTill) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await createCoupon({
    id: `coupon-${nanoid(8)}`,
    code: code.toUpperCase(),
    type,
    value: Number(value),
    minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
    maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
    usageLimit: usageLimit ? Number(usageLimit) : 0,
    validFrom: Timestamp.fromDate(new Date(validFrom)),
    validTill: Timestamp.fromDate(new Date(validTill)),
    isActive: true,
  });

  return NextResponse.json({ ok: true });
}
