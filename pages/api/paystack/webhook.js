import crypto from "node:crypto";

import { decrementStockForOrderItems } from "@/lib/inventory";
import { getOrderByReference, getOrderItems, markOrderFailed, markOrderPaid } from "@/lib/orders";

async function readRawBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return res.status(503).json({ message: "Missing PAYSTACK_SECRET_KEY." });
  }

  const rawBody = await readRawBody(req);
  const signature = req.headers["x-paystack-signature"];
  const expected = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");

  if (!signature || signature !== expected) {
    return res.status(401).json({ message: "Invalid Paystack signature." });
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

  return res.status(200).json({ received: true });
}
