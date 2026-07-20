/**
 * Only reviews remain here — products/categories now come from real Firestore
 * (src/services/products.ts, src/services/categories.ts). Reviews get wired to
 * the real `reviews` collection in a later phase alongside the PDP.
 */
export const mockReviews = [
  { id: "r1", name: "Ananya S.", rating: 5, body: "The fabric quality and finishing are unlike anything I've bought before. Truly heirloom pieces." },
  { id: "r2", name: "Rhea M.", rating: 5, body: "Every detail feels considered — from the packaging to the fit. Worth every rupee." },
  { id: "r3", name: "Priya K.", rating: 5, body: "Aureyaa has become my go-to for occasion wear. Nothing looks like it off the rack." },
];
