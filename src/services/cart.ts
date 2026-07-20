import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/client";
import { COLLECTIONS, type CartItem, type CartDoc } from "@/types/firestore";

const GUEST_CART_KEY = "aureyaa_guest_cart";

function cartItemKey(item: Pick<CartItem, "productId" | "variantId">): string {
  return `${item.productId}::${item.variantId}`;
}

function mergeItems(existing: CartItem[], incoming: CartItem): CartItem[] {
  const key = cartItemKey(incoming);
  const idx = existing.findIndex((i) => cartItemKey(i) === key);
  if (idx === -1) return [...existing, incoming];

  const updated = [...existing];
  updated[idx] = { ...updated[idx]!, quantity: updated[idx]!.quantity + incoming.quantity };
  return updated;
}

// ---- Guest cart (localStorage) ----
export function getGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function setGuestCart(items: CartItem[]): void {
  window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function clearGuestCart(): void {
  window.localStorage.removeItem(GUEST_CART_KEY);
}

// ---- Signed-in cart (Firestore) ----
export async function getUserCart(userId: string): Promise<CartItem[]> {
  const snap = await getDoc(doc(db, COLLECTIONS.cart, userId));
  return snap.exists() ? (snap.data() as CartDoc).items : [];
}

async function setUserCart(userId: string, items: CartItem[]): Promise<void> {
  await setDoc(doc(db, COLLECTIONS.cart, userId), {
    userId,
    items,
    updatedAt: serverTimestamp(),
  });
}

/** Unified entry point — pass `userId` when signed in, omit/undefined for guests. */
export async function addToCart(item: CartItem, userId?: string | null): Promise<CartItem[]> {
  if (userId) {
    const current = await getUserCart(userId);
    const updated = mergeItems(current, item);
    await setUserCart(userId, updated);
    return updated;
  }
  const current = getGuestCart();
  const updated = mergeItems(current, item);
  setGuestCart(updated);
  return updated;
}

export async function updateCartItemQuantity(
  productId: string,
  variantId: string,
  quantity: number,
  userId?: string | null
): Promise<CartItem[]> {
  const current = userId ? await getUserCart(userId) : getGuestCart();
  const updated =
    quantity <= 0
      ? current.filter((i) => cartItemKey(i) !== `${productId}::${variantId}`)
      : current.map((i) =>
          cartItemKey(i) === `${productId}::${variantId}` ? { ...i, quantity } : i
        );

  if (userId) await setUserCart(userId, updated);
  else setGuestCart(updated);
  return updated;
}

export async function removeFromCart(
  productId: string,
  variantId: string,
  userId?: string | null
): Promise<CartItem[]> {
  return updateCartItemQuantity(productId, variantId, 0, userId);
}

/** Called right after login — folds any guest-session items into the user's Firestore cart. */
export async function mergeGuestCartIntoUserCart(userId: string): Promise<CartItem[]> {
  const guestItems = getGuestCart();
  if (guestItems.length === 0) return getUserCart(userId);

  const userItems = await getUserCart(userId);
  const merged = guestItems.reduce(mergeItems, userItems);
  await setUserCart(userId, merged);
  clearGuestCart();
  return merged;
}
