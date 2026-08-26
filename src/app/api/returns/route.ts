import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/session";
import { adminDb } from "@/firebase/admin";
import { COLLECTIONS, type ReturnDoc, type OrderDoc } from "@/types/firestore";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orderId, reason, type, comments } = await request.json();

    if (!orderId || !reason || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderRef = adminDb.collection(COLLECTIONS.orders).doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = orderSnap.data() as OrderDoc;

    if (order.userId !== session.uid) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create return request record in Firestore
    const returnId = `ret-${Date.now()}`;
    const returnDoc: ReturnDoc = {
      id: returnId,
      orderId: order.id,
      userId: session.uid,
      items: order.items,
      reason: `${reason} - ${comments || ""}`,
      status: "requested",
      createdAt: FieldValue.serverTimestamp() as any,
    };

    const batch = adminDb.batch();
    batch.set(adminDb.collection(COLLECTIONS.returns).doc(returnId), returnDoc);
    batch.update(orderRef, {
      status: "return_requested",
      updatedAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return NextResponse.json({ ok: true, returnId });
  } catch (err: any) {
    console.error("Error creating return request:", err);
    return NextResponse.json({ error: err.message || "Failed to submit return request" }, { status: 500 });
  }
}
