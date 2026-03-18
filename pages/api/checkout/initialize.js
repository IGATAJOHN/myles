import {
  buildWhatsAppOrderLink,
  calculateCheckoutSummary,
  createOrderReference,
  validateCustomer
} from "@/lib/checkout";
import { validateInventory } from "@/lib/inventory";
import { createOrder, updateOrderPaymentUrls } from "@/lib/orders";
import { initializePaystackPayment } from "@/lib/payments";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const payload = req.body || {};
    const customer = payload.customer || {};
    const paymentMethod = payload.paymentMethod || "";

    const customerValidation = validateCustomer(customer);
    if (!customerValidation.valid) {
      return res.status(400).json({
        message: "Missing required customer fields.",
        missingFields: customerValidation.missingFields
      });
    }

    const requestedSummary = calculateCheckoutSummary(payload.items || [], customer.state);
    if (!requestedSummary.items.length) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const inventory = await validateInventory(requestedSummary.items);
    if (!inventory.valid) {
      return res.status(409).json({
        message: inventory.issues[0]?.message || "Some items are out of stock.",
        issues: inventory.issues
      });
    }

    const summary = calculateCheckoutSummary(inventory.items, customer.state);
    const reference = createOrderReference();
    const metadata = {
      customer,
      items: summary.items,
      subtotal: summary.subtotal,
      shipping: summary.shipping,
      total: summary.total
    };

    if (paymentMethod === "paystack") {
      await createOrder({
        reference,
        paymentProvider: "paystack",
        checkoutMethod: "paystack",
        customer,
        summary
      });

      const result = await initializePaystackPayment({
        customer,
        amount: summary.total,
        reference,
        metadata
      });

      if (!result.ok) {
        return res.status(result.status || 500).json({ message: result.message });
      }

      await updateOrderPaymentUrls(reference, {
        paymentUrl: result.paymentUrl
      });

      return res.status(200).json({
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

    await createOrder({
      reference,
      paymentProvider: "manual",
      checkoutMethod: "bank_transfer",
      customer,
      summary,
      whatsappUrl
    });

    return res.status(200).json({
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
  } catch (error) {
    console.error("Checkout initialization failed:", error);
    return res.status(503).json({
      message:
        "We could not reach the order database right now. Please wait a moment and try again. If this keeps happening, wake the Neon database in the dashboard and retry."
    });
  }
}
