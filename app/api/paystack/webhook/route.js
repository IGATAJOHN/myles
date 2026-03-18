import crypto from "node:crypto";

import { NextResponse } from "next/server";
import { decrementStockForOrderItems } from "@/lib/inventory";
import { getOrderByReference, getOrderItems, markOrderFailed, markOrderPaid } from "@/lib/orders";

export async function POST(request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ message: "Missing PAYSTACK_SECRET_KEY." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const expected = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");

  if (!signature || signature !== expected) {
    return NextResponse.json({ message: "Invalid Paystack signature." }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  console.log("Paystack webhook received:", event.event, event.data?.reference);

  const reference = event.data?.reference;

  if (event.event === "charge.success" && reference) {
    const existingOrder = await getOrderByReference(reference);

    if (existingOrder?.paymentStatus !== "paid") {
      const orderItems = await getOrderItems(reference);
      await decrementStockForOrderItems(orderItems);
      await markOrderPaid(reference);
    }
  }

  if (event.event === "charge.failed" && reference) {
    await markOrderFailed(reference);
  }

  return NextResponse.json({ received: true });
}
