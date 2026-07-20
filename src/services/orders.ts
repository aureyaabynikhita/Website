import { adminDb } from "@/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { nanoid } from "nanoid";
import { COLLECTIONS, type OrderDoc, type OrderItem, type Address } from "@/types/firestore";
import { validateCoupon, getCouponByCode } from "@/services/coupons";
import { checkPincodeServiceability } from "@/services/shipping";

export interface CreateOrderInput {
  userId: string | null;
  guestEmail?: string;
  items: OrderItem[];
  shippingAddress: Address;
  couponCode?: string;
  giftNote?: string;
  isGiftWrapped: boolean;
  paymentMethod: OrderDoc["paymentMethod"];
}

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
  total: number;
}

const TAX_RATE = 0.05; // 5% GST placeholder — confirm actual applicable rate before launch

/**
 * Server-authoritative order creation: re-checks stock, re-validates the
 * coupon, and re-computes totals from Firestore rather than trusting
 * whatever the client sent — the client payload is only used for item
 * selection (productId/variantId/quantity) and address/gift-note text.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  // 1. Verify current stock + price for every item (guards against stale cart data).
  const verifiedItems: OrderItem[] = [];
  for (const item of input.items) {
    const productSnap = await adminDb.collection(COLLECTIONS.products).doc(item.productId).get();
    if (!productSnap.exists) throw new Error(`Product ${item.productId} no longer exists`);
    const product = productSnap.data()!;
    const variant = product.variants.find((v: { id: string }) => v.id === item.variantId);
    if (!variant) throw new Error(`Variant ${item.variantId} no longer exists`);
    if (variant.stock < item.quantity) {
      throw new Error(`Not enough stock for ${product.title} (size ${variant.size})`);
    }
    verifiedItems.push({ ...item, price: variant.price, title: product.title });
  }

  const subtotal = verifiedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // 2. Coupon (re-validated server-side, never trust a client-supplied discount amount).
  let discount = 0;
  if (input.couponCode) {
    const result = await validateCoupon(input.couponCode, subtotal);
    if (result.valid) {
      discount = result.discount;
      const coupon = await getCouponByCode(input.couponCode);
      if (coupon) {
        await adminDb
          .collection(COLLECTIONS.coupons)
          .doc(coupon.id)
          .update({ usedCount: FieldValue.increment(1) });
      }
    }
  }

  // 3. Shipping fee from the real serviceability check.
  const shippingCheck = await checkPincodeServiceability(
    input.shippingAddress.pincode,
    subtotal - discount
  );
  const shippingFee = shippingCheck.shippingFee;
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  const total = subtotal - discount + shippingFee + tax;

  // 4. Decrement stock for each variant (simple decrement — for high concurrency,
  // wrap this in a Firestore transaction; fine for launch-scale traffic).
  for (const item of verifiedItems) {
    const productRef = adminDb.collection(COLLECTIONS.products).doc(item.productId);
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(productRef);
      const product = snap.data()!;
      const variants = product.variants.map((v: { id: string; stock: number }) =>
        v.id === item.variantId ? { ...v, stock: v.stock - item.quantity } : v
      );
      tx.update(productRef, { variants });
    });
  }

  // 5. Write the order.
  const orderId = `order-${nanoid(12)}`;
  const orderNumber = `AUR${Date.now().toString().slice(-8)}`;
  const orderDoc: Omit<OrderDoc, "createdAt" | "updatedAt"> = {
    id: orderId,
    orderNumber,
    userId: input.userId,
    guestEmail: input.guestEmail,
    items: verifiedItems,
    shippingAddress: input.shippingAddress,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    couponCode: input.couponCode,
    giftNote: input.giftNote,
    isGiftWrapped: input.isGiftWrapped,
    paymentMethod: input.paymentMethod,
    paymentStatus: "pending",
    status: "pending_payment",
    trackingTimeline: [],
  };

  await adminDb
    .collection(COLLECTIONS.orders)
    .doc(orderId)
    .set({ ...orderDoc, createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });

  return { orderId, orderNumber, total };
}

/** Marks a COD order confirmed immediately (no online payment step needed). */
export async function getOrderById(orderId: string) {
  const snap = await adminDb.collection(COLLECTIONS.orders).doc(orderId).get();
  return snap.exists ? (snap.data() as OrderDoc) : null;
}

export async function confirmCodOrder(orderId: string): Promise<void> {
  await adminDb.collection(COLLECTIONS.orders).doc(orderId).update({
    status: "confirmed",
    paymentStatus: "pending", // COD collects payment on delivery, not now
    updatedAt: FieldValue.serverTimestamp(),
  });
}

/** Marks an order paid + confirmed after successful gateway verification. */
export async function markOrderPaid(
  orderId: string,
  gateway: "razorpay" | "cashfree" | "stripe",
  gatewayPaymentId: string
): Promise<void> {
  const batch = adminDb.batch();
  const orderRef = adminDb.collection(COLLECTIONS.orders).doc(orderId);
  batch.update(orderRef, {
    paymentStatus: "paid",
    status: "confirmed",
    updatedAt: FieldValue.serverTimestamp(),
  });

  const orderSnap = await orderRef.get();
  const order = orderSnap.data() as OrderDoc;
  const paymentRef = adminDb.collection(COLLECTIONS.payments).doc();
  batch.set(paymentRef, {
    id: paymentRef.id,
    orderId,
    gateway,
    gatewayPaymentId,
    amount: order.total,
    currency: "INR",
    status: "captured",
    createdAt: FieldValue.serverTimestamp(),
  });

  await batch.commit();
}
