import { NextResponse } from "next/server";

import {
  buildWhatsAppOrderLink,
  calculateCheckoutSummary,
  createOrderReference,
  validateCustomer
} from "@/lib/checkout";
import { initializePaystackPayment } from "@/lib/payments";

export async function POST(request) {
  const payload = await request.json();
  const customer = payload.customer || {};
  const paymentMethod = payload.paymentMethod || "";

  const customerValidation = validateCustomer(customer);
  if (!customerValidation.valid) {
    return NextResponse.json(
      { message: "Missing required customer fields.", missingFields: customerValidation.missingFields },
      { status: 400 }
    );
  }

  const summary = calculateCheckoutSummary(payload.items || [], customer.state);
  if (!summary.items.length) {
    return NextResponse.json({ message: "Cart is empty." }, { status: 400 });
  }

  const reference = createOrderReference();
  const metadata = {
    customer,
    items: summary.items,
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    total: summary.total
  };

  if (paymentMethod === "paystack") {
    const result = await initializePaystackPayment({
      customer,
      amount: summary.total,
      reference,
      metadata
    });

    if (!result.ok) {
      return NextResponse.json({ message: result.message }, { status: result.status || 500 });
    }

    return NextResponse.json({
      ...result,
      summary: {
        subtotal: summary.subtotal,
        shipping: summary.shipping,
        total: summary.total
      }
    });
  }

  const whatsappUrl = buildWhatsAppOrderLink({
    customer,
    items: summary.items,
    total: summary.total,
    reference
  });

  return NextResponse.json({
    provider: "manual",
    reference,
    paymentUrl: whatsappUrl,
    message: "Manual checkout created. Complete this order over WhatsApp or bank transfer.",
    summary: {
      subtotal: summary.subtotal,
      shipping: summary.shipping,
      total: summary.total
    }
  });
}
