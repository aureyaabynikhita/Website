import { z } from "zod";

export const checkoutAddressSchema = z.object({
  label: z.string().default("Home"),
  line1: z.string().min(3, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
  country: z.string().default("India"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
});

export const checkoutSchema = z.object({
  guestEmail: z.string().email().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive(),
        title: z.string(),
        slug: z.string(),
        size: z.string(),
        color: z.string(),
        price: z.number(),
        image: z.string(),
      })
    )
    .min(1, "Cart is empty"),
  shippingAddress: checkoutAddressSchema,
  couponCode: z.string().optional(),
  giftNote: z.string().max(300).optional(),
  isGiftWrapped: z.boolean().default(false),
  paymentMethod: z.enum(["razorpay", "cashfree", "stripe", "cod", "partial_cod"]),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
