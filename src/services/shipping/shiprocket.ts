/**
 * Shiprocket integration. Requires SHIPROCKET_EMAIL / SHIPROCKET_PASSWORD in env.
 * Docs: https://apidocs.shiprocket.in
 *
 * Shiprocket auth tokens are valid ~10 days — we cache in-memory per server
 * instance rather than re-authenticating on every call. On a serverless
 * platform (Vercel) this cache resets per cold start, which is fine — it just
 * means an occasional extra auth call, not a bug.
 */
const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAuthToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.token;

  const res = await fetch(`${SHIPROCKET_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  if (!res.ok) throw new Error("Shiprocket authentication failed");
  const data = await res.json();

  cachedToken = { token: data.token, expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000 };
  return data.token;
}

async function shiprocketFetch(path: string, init: RequestInit = {}) {
  const token = await getAuthToken();
  const res = await fetch(`${SHIPROCKET_BASE}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Shiprocket API error (${res.status}): ${body}`);
  }
  return res.json();
}

export interface ShiprocketServiceabilityResult {
  isServiceable: boolean;
  estimatedDays: number | null;
  codAvailable: boolean;
  courierName?: string;
}

/** Checks pincode serviceability + gives an ETA using Shiprocket's courier serviceability check. */
export async function checkShiprocketServiceability(
  pickupPincode: string,
  deliveryPincode: string,
  weightKg = 0.5
): Promise<ShiprocketServiceabilityResult> {
  const data = await shiprocketFetch(
    `/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${weightKg}&cod=0`
  );

  const couriers = data?.data?.available_courier_companies ?? [];
  if (couriers.length === 0) {
    return { isServiceable: false, estimatedDays: null, codAvailable: false };
  }

  const best = couriers[0];
  return {
    isServiceable: true,
    estimatedDays: best.estimated_delivery_days ? Number(best.estimated_delivery_days) : null,
    codAvailable: couriers.some((c: { cod: number }) => c.cod === 1),
    courierName: best.courier_name,
  };
}

interface CreateShiprocketOrderInput {
  orderId: string;
  orderDate: string; // YYYY-MM-DD
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  items: { name: string; sku: string; units: number; sellingPrice: number }[];
  subtotal: number;
  paymentMethod: "Prepaid" | "COD";
}

/** Pushes a confirmed order to Shiprocket so it appears in their dashboard for pickup/AWB assignment. */
export async function createShiprocketOrder(input: CreateShiprocketOrderInput) {
  return shiprocketFetch("/orders/create/adhoc", {
    method: "POST",
    body: JSON.stringify({
      order_id: input.orderId,
      order_date: input.orderDate,
      pickup_location: "Primary", // must match a pickup location configured in the Shiprocket dashboard
      billing_customer_name: input.customerName,
      billing_last_name: "",
      billing_address: input.addressLine1,
      billing_address_2: input.addressLine2 ?? "",
      billing_city: input.city,
      billing_pincode: input.pincode,
      billing_state: input.state,
      billing_country: "India",
      billing_email: input.customerEmail,
      billing_phone: input.customerPhone,
      shipping_is_billing: true,
      order_items: input.items.map((item) => ({
        name: item.name,
        sku: item.sku,
        units: item.units,
        selling_price: item.sellingPrice,
      })),
      payment_method: input.paymentMethod,
      sub_total: input.subtotal,
      length: 25,
      breadth: 20,
      height: 5,
      weight: 0.5,
    }),
  });
}

/** Assigns an AWB (courier tracking number) to an already-created Shiprocket order. */
export async function generateAwb(shipmentId: string) {
  return shiprocketFetch("/courier/assign/awb", {
    method: "POST",
    body: JSON.stringify({ shipment_id: shipmentId }),
  });
}

export async function trackShipment(awbCode: string) {
  return shiprocketFetch(`/courier/track/awb/${awbCode}`);
}
