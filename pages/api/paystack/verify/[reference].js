import { getOrderByReference, markOrderFailed, markOrderPaid, markOrderProcessing } from "@/lib/orders";
import { verifyPaystackPayment } from "@/lib/payments";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const reference = Array.isArray(req.query.reference) ? req.query.reference[0] : req.query.reference;
  const order = await getOrderByReference(reference);

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  const result = await verifyPaystackPayment(reference);

  if (!result.ok) {
    return res.status(result.status || 500).json({ message: result.message });
  }

  if (result.paymentStatus === "success") {
    await markOrderPaid(reference);
  } else if (result.paymentStatus === "failed" || result.paymentStatus === "abandoned") {
    await markOrderFailed(reference);
  } else {
    await markOrderProcessing(reference);
  }

  const updatedOrder = await getOrderByReference(reference);

  return res.status(200).json({
    order: updatedOrder,
    verification: result
  });
}
