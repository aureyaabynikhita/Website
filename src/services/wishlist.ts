import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/client";
import { COLLECTIONS, type WishlistDoc } from "@/types/firestore";

export async function getWishlist(userId: string): Promise<string[]> {
  const snap = await getDoc(doc(db, COLLECTIONS.wishlist, userId));
  return snap.exists() ? (snap.data() as WishlistDoc).productIds : [];
}

export async function toggleWishlistItem(userId: string, productId: string): Promise<string[]> {
  const current = await getWishlist(userId);
  const updated = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId];

  await setDoc(doc(db, COLLECTIONS.wishlist, userId), {
    userId,
    productIds: updated,
    updatedAt: serverTimestamp(),
  });
  return updated;
}
