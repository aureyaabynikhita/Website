const CASHFREE_BASE =
  process.env.CASHFREE_ENV === "PROD"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

interface CreateCashfreeOrderInput {
  orderId: string;
  amount: number;
  customerId: string;
  customerPhone: string;
  customerEmail: string;
  returnUrl: string;
}

/** Creates a Cashfree order and returns a payment_session_id for the client-side drop-in checkout. */
export async function createCashfreeOrder(input: CreateCashfreeOrderInput) {
  const res = await fetch(`${CASHFREE_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": "2023-08-01",
      "x-client-id": process.env.CASHFREE_APP_ID!,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
    },
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.amount,
      order_currency: "INR",
      customer_details: {
        customer_id: input.customerId,
        customer_phone: input.customerPhone,
        customer_email: input.customerEmail,
      },
      order_meta: {
        return_url: input.returnUrl,
      },
    }),
  });
  if (!res.ok) throw new Error(`Cashfree order creation failed (${res.status})`);
  return res.json() as Promise<{ payment_session_id: string; order_id: string }>;
}

export async function getCashfreeOrderStatus(orderId: string) {
  const res = await fetch(`${CASHFREE_BASE}/orders/${orderId}`, {
    headers: {
      "x-api-version": "2023-08-01",
      "x-client-id": process.env.CASHFREE_APP_ID!,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY!,
    },
  });
  if (!res.ok) throw new Error(`Cashfree status check failed (${res.status})`);
  return res.json() as Promise<{ order_status: string }>;
}
