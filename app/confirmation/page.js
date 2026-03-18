import Link from "next/link";
import ConfirmationClient from "@/components/ConfirmationClient";
import { getOrderByReference, markOrderFailed, markOrderPaid, markOrderProcessing } from "@/lib/orders";
import { verifyPaystackPayment } from "@/lib/payments";

export const metadata = {
  title: "Order Confirmed | Myles Luxe"
};

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ searchParams }) {
  const reference = searchParams?.reference || "";
  let order = await getOrderByReference(reference);

  if (reference && order?.paymentProvider === "paystack" && order.paymentStatus !== "paid") {
    const verification = await verifyPaystackPayment(reference);

    if (verification.ok) {
      if (verification.paymentStatus === "success") {
        await markOrderPaid(reference);
      } else if (verification.paymentStatus === "failed" || verification.paymentStatus === "abandoned") {
        await markOrderFailed(reference);
      } else {
        await markOrderProcessing(reference);
      }

      order = await getOrderByReference(reference);
    }
  }

  const status = order?.paymentStatus || "pending";
  const headline =
    status === "paid"
      ? "Your Myles Luxe payment is confirmed."
      : status === "processing"
        ? "Your payment is being confirmed."
      : status === "failed"
        ? "Your payment did not go through."
        : "Your Myles Luxe order is being processed.";
  const copy =
    status === "paid"
      ? `Reference ${reference} has been marked paid. We can now fulfill the order.`
      : status === "processing"
        ? `Reference ${reference} is still being verified with Paystack. Refresh shortly if this does not update.`
      : status === "failed"
        ? `Reference ${reference} is marked failed. You can retry checkout or complete the order manually.`
        : reference
          ? `Reference ${reference} has been created and is waiting for payment confirmation.`
          : "Your order was created, but no payment reference was provided in the URL.";

  return (
    <main className="page-hero">
      <ConfirmationClient status={status} />
      <div className="container page-panel confirmation-box">
        <div className="eyebrow">Order Confirmation</div>
        <h1>{headline}</h1>
        <p>{copy}</p>
        {reference ? <p className="muted">Reference: {reference}</p> : null}
        <div className="button-row center-row">
          <Link className="button" href="/shop">Continue Shopping</Link>
          <Link className="button-secondary" href="/">Back Home</Link>
        </div>
      </div>
    </main>
  );
}
