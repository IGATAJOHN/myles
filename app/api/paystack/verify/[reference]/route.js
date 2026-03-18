import { NextResponse } from "next/server";

import { getOrderByReference, markOrderFailed, markOrderPaid, markOrderProcessing } from "@/lib/orders";
import { verifyPaystackPayment } from "@/lib/payments";

export async function GET(_request, { params }) {
  const reference = params.reference;
  const order = await getOrderByReference(reference);

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  const result = await verifyPaystackPayment(reference);

  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status || 500 });
  }

  if (result.paymentStatus === "success") {
    await markOrderPaid(reference);
  } else if (result.paymentStatus === "failed" || result.paymentStatus === "abandoned") {
    await markOrderFailed(reference);
  } else {
    await markOrderProcessing(reference);
  }

  const updatedOrder = await getOrderByReference(reference);

  return NextResponse.json({
    order: updatedOrder,
    verification: result
  });
}
