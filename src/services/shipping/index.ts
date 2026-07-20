import { checkShiprocketServiceability } from "./shiprocket";
import { checkDelhiveryServiceability } from "./delhivery";

const PICKUP_PINCODE = process.env.WAREHOUSE_PINCODE || "400001"; // set to Essar Bakery / Tofaah warehouse pincode
const FREE_SHIPPING_THRESHOLD = 15000;
const FLAT_SHIPPING_FEE = 250;
const FALLBACK_ETA_DAYS = 6;

export interface ShippingCheckResult {
  isServiceable: boolean;
  estimatedDays: number;
  codAvailable: boolean;
  shippingFee: number;
  source: "shiprocket" | "delhivery" | "fallback";
}

/**
 * Checks a delivery pincode against Shiprocket first, then Delhivery, then
 * falls back to a generic estimate. The fallback exists so checkout keeps
 * working the moment this repo is cloned, before real carrier keys are added —
 * remove the fallback branch once Shiprocket/Delhivery are live in production.
 */
export async function checkPincodeServiceability(
  pincode: string,
  subtotal: number
): Promise<ShippingCheckResult> {
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;

  try {
    const shiprocket = await checkShiprocketServiceability(PICKUP_PINCODE, pincode);
    if (shiprocket.isServiceable) {
      return {
        isServiceable: true,
        estimatedDays: shiprocket.estimatedDays ?? FALLBACK_ETA_DAYS,
        codAvailable: shiprocket.codAvailable,
        shippingFee,
        source: "shiprocket",
      };
    }
  } catch {
    // Shiprocket not configured or API call failed — try Delhivery next.
  }

  try {
    const delhivery = await checkDelhiveryServiceability(pincode);
    if (delhivery.isServiceable) {
      return {
        isServiceable: true,
        estimatedDays: FALLBACK_ETA_DAYS,
        codAvailable: delhivery.codAvailable,
        shippingFee,
        source: "delhivery",
      };
    }
  } catch {
    // Delhivery not configured either — fall through to the generic estimate.
  }

  return {
    isServiceable: true, // optimistic default; real carriers will correct this once keys are added
    estimatedDays: FALLBACK_ETA_DAYS,
    codAvailable: true,
    shippingFee,
    source: "fallback",
  };
}
