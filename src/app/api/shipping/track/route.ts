import { NextResponse } from "next/server";
import { trackShipment } from "@/services/shipping/shiprocket";
import { trackDelhiveryShipment } from "@/services/shipping/delhivery";

export async function POST(request: Request) {
  const { awb, courier } = await request.json();
  if (!awb) return NextResponse.json({ error: "Missing AWB number" }, { status: 400 });

  try {
    const data =
      courier === "delhivery" ? await trackDelhiveryShipment(awb) : await trackShipment(awb);
    return NextResponse.json({ ok: true, data });
  } catch {
    return NextResponse.json({ error: "Couldn't fetch tracking info" }, { status: 502 });
  }
}
