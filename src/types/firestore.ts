import type { Timestamp } from "firebase/firestore";

/** Firestore collection names — import this instead of hardcoding strings. */
export const COLLECTIONS = {
  users: "users",
  products: "products",
  categories: "categories",
  orders: "orders",
  reviews: "reviews",
  wishlist: "wishlist",
  cart: "cart",
  coupons: "coupons",
  inventory: "inventory",
  collections: "collections",
  lookbooks: "lookbooks",
  returns: "returns",
  refunds: "refunds",
  payments: "payments",
  shipping: "shipping",
  notifications: "notifications",
  newsletter: "newsletter",
  admin: "admin",
  settings: "settings",
  banners: "banners",
  cmsPages: "cms_pages",
} as const;

export type UserRole = "customer" | "admin" | "support" | "inventory_manager";

export interface UserDoc {
  uid: string;
  email: string;
  phone?: string;
  displayName: string;
  role: UserRole;
  addresses: Address[];
  defaultAddressId?: string;
  rewardPoints: number;
  storeCredits: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Address {
  id: string;
  label: string; // "Home", "Office"
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
}

export interface ProductDoc {
  id: string;
  slug: string;
  title: string;
  description: string;
  fabricDetails: string;
  washCare: string;
  stylingTips?: string;
  categoryId: string;
  collectionIds: string[];
  images: string[];
  videoUrl?: string;
  variants: ProductVariant[];
  basePrice: number;
  compareAtPrice?: number;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  ratingAverage: number;
  ratingCount: number;
  seo: SeoFields;
  status: "draft" | "published" | "archived";
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface SeoFields {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface CategoryDoc {
  id: string;
  slug: string;
  name: string;
  parentId?: string | null;
  image?: string;
  seo: SeoFields;
  order: number;
}

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export interface OrderItem {
  productId: string;
  variantId: string;
  title: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderDoc {
  id: string;
  orderNumber: string;
  userId: string | null; // null for guest checkout
  guestEmail?: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  giftNote?: string;
  isGiftWrapped: boolean;
  paymentMethod: "razorpay" | "cashfree" | "stripe" | "cod" | "partial_cod";
  paymentStatus: "pending" | "paid" | "failed" | "refunded" | "partially_refunded";
  status: OrderStatus;
  awbNumber?: string;
  courierPartner?: "shiprocket" | "delhivery" | "bluedart";
  estimatedDelivery?: Timestamp;
  trackingTimeline: TrackingEvent[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TrackingEvent {
  status: string;
  location?: string;
  timestamp: Timestamp;
}

export interface CartItem {
  productId: string;
  variantId: string;
  title: string;
  slug: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

export interface CartDoc {
  userId: string;
  items: CartItem[];
  updatedAt: Timestamp;
}

export interface WishlistDoc {
  userId: string;
  productIds: string[];
  updatedAt: Timestamp;
}

export interface ReviewDoc {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  body: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: Timestamp;
}

export interface CouponDoc {
  id: string;
  code: string;
  type: "flat" | "percentage";
  value: number;
  minOrderValue?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  validFrom: Timestamp;
  validTill: Timestamp;
  isActive: boolean;
}

export interface InventoryDoc {
  productId: string;
  variantId: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  reservedStock: number; // held during checkout
}

export interface CollectionDoc {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  productIds: string[];
  seo: SeoFields;
}

export interface LookbookDoc {
  id: string;
  title: string;
  coverImage: string;
  images: { url: string; linkedProductIds: string[] }[];
  publishedAt: Timestamp;
}

export interface ReturnDoc {
  id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  reason: string;
  status: "requested" | "pickup_scheduled" | "received" | "approved" | "rejected";
  createdAt: Timestamp;
}

export interface RefundDoc {
  id: string;
  orderId: string;
  returnId?: string;
  amount: number;
  method: "original_payment" | "store_credit";
  status: "initiated" | "processing" | "completed" | "failed";
  createdAt: Timestamp;
}

export interface PaymentDoc {
  id: string;
  orderId: string;
  gateway: "razorpay" | "cashfree" | "stripe";
  gatewayPaymentId: string;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  rawWebhookPayload?: Record<string, unknown>;
  createdAt: Timestamp;
}

export interface ShippingRateDoc {
  pincode: string;
  isServiceable: boolean;
  estimatedDays: number;
  codAvailable: boolean;
}

export interface NotificationDoc {
  id: string;
  userId: string;
  type: "order" | "promo" | "system";
  title: string;
  body: string;
  isRead: boolean;
  createdAt: Timestamp;
}

export interface NewsletterSubscriberDoc {
  id: string;
  email: string;
  subscribedAt: Timestamp;
  isActive: boolean;
}

export interface BannerDoc {
  id: string;
  placement: "home_hero" | "category_top" | "checkout_promo";
  image: string;
  mobileImage?: string;
  headline?: string;
  ctaLabel?: string;
  ctaLink?: string;
  isActive: boolean;
  order: number;
}

export interface CmsPageDoc {
  id: string;
  slug: string;
  title: string;
  contentBlocks: Record<string, unknown>[]; // homepage-builder / page-builder blocks
  seo: SeoFields;
  updatedAt: Timestamp;
}

export interface SettingsDoc {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  currency: string;
  taxPercentage: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  partialCodPercentage?: number;
}
