import { adminDb } from "@/firebase/admin";
import { COLLECTIONS, type CouponDoc } from "@/types/firestore";

export interface CouponValidationResult {
  valid: boolean;
  reason?: string;
  discount: number;
  coupon?: CouponDoc;
}

export async function getCouponByCode(code: string): Promise<CouponDoc | null> {
  const snap = await adminDb
    .collection(COLLECTIONS.coupons)
    .where("code", "==", code.toUpperCase())
    .limit(1)
    .get();
  return snap.empty ? null : (snap.docs[0]!.data() as CouponDoc);
}

export function calculateDiscount(coupon: CouponDoc, subtotal: number): number {
  const raw = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
  return Math.min(raw, coupon.maxDiscount ?? raw, subtotal);
}

export async function validateCoupon(code: string, subtotal: number): Promise<CouponValidationResult> {
  const coupon = await getCouponByCode(code);
  if (!coupon) return { valid: false, reason: "Coupon not found", discount: 0 };
  if (!coupon.isActive) return { valid: false, reason: "This coupon is no longer active", discount: 0 };

  const now = Date.now();
  if (coupon.validFrom.toMillis() > now) {
    return { valid: false, reason: "This coupon isn't active yet", discount: 0 };
  }
  if (coupon.validTill.toMillis() < now) {
    return { valid: false, reason: "This coupon has expired", discount: 0 };
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, reason: "This coupon has reached its usage limit", discount: 0 };
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      reason: `Minimum order value is ₹${coupon.minOrderValue}`,
      discount: 0,
    };
  }

  return { valid: true, discount: calculateDiscount(coupon, subtotal), coupon };
}
