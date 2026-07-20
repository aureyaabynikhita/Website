/**
 * Delhivery integration. Requires DELHIVERY_API_TOKEN in env.
 * Docs: https://track.delhivery.com/api-docs/
 * Kept as an alternate/fallback carrier alongside Shiprocket — pick one as
 * primary in checkout (see src/services/shipping/index.ts) and use the other
 * for pincodes the primary doesn't cover, or switch entirely later.
 */
const DELHIVERY_BASE = "https://track.delhivery.com";

export interface DelhiveryServiceabilityResult {
  isServiceable: boolean;
  codAvailable: boolean;
  prepaidAvailable: boolean;
}

export async function checkDelhiveryServiceability(
  pincode: string
): Promise<DelhiveryServiceabilityResult> {
  const res = await fetch(`${DELHIVERY_BASE}/c/api/pin-codes/json/?filter_codes=${pincode}`, {
    headers: { Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}` },
  });
  if (!res.ok) {
    return { isServiceable: false, codAvailable: false, prepaidAvailable: false };
  }
  const data = await res.json();
  const entry = data?.delivery_codes?.[0]?.postal_code;
  if (!entry) return { isServiceable: false, codAvailable: false, prepaidAvailable: false };

  return {
    isServiceable: true,
    codAvailable: entry.cod === "Y",
    prepaidAvailable: entry.pre_paid === "Y",
  };
}

/** Creates a Delhivery shipment (B2C manifest API) once an order is confirmed. */
export async function createDelhiveryShipment(payload: {
  orderId: string;
  customerName: string;
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  paymentMode: "COD" | "Prepaid";
  totalAmount: number;
}) {
  const res = await fetch(`${DELHIVERY_BASE}/api/cmu/create.json`, {
    method: "POST",
    headers: {
      Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shipments: [
        {
          name: payload.customerName,
          add: payload.addressLine1,
          city: payload.city,
          state: payload.state,
          pin: payload.pincode,
          phone: payload.phone,
          order: payload.orderId,
          payment_mode: payload.paymentMode,
          total_amount: payload.totalAmount,
        },
      ],
      pickup_location: { name: "Primary" },
    }),
  });
  if (!res.ok) throw new Error(`Delhivery shipment creation failed (${res.status})`);
  return res.json();
}

export async function trackDelhiveryShipment(waybill: string) {
  const res = await fetch(`${DELHIVERY_BASE}/api/v1/packages/json/?waybill=${waybill}`, {
    headers: { Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Delhivery tracking failed (${res.status})`);
  return res.json();
}
