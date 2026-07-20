import { NextResponse } from "next/server";
import { checkPincodeServiceability } from "@/services/shipping";

export async function POST(request: Request) {
  const { pincode, subtotal } = await request.json();
  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return NextResponse.json({ error: "Enter a valid 6-digit pincode" }, { status: 400 });
  }
  const result = await checkPincodeServiceability(pincode, subtotal ?? 0);
  return NextResponse.json(result);
}
