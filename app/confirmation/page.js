import Link from "next/link";
import { getOrderByReference } from "@/lib/orders";

export const metadata = {
  title: "Order Confirmed | Myles Luxe"
};

export default async function ConfirmationPage({ searchParams }) {
  const reference = searchParams?.reference || "";
  const order = await getOrderByReference(reference);
  const status = order?.paymentStatus || "pending";
  const headline =
    status === "paid"
      ? "Your Myles Luxe payment is confirmed."
      : status === "failed"
        ? "Your payment did not go through."
        : "Your Myles Luxe order is being processed.";
  const copy =
    status === "paid"
      ? `Reference ${reference} has been marked paid. We can now fulfill the order.`
      : status === "failed"
        ? `Reference ${reference} is marked failed. You can retry checkout or complete the order manually.`
        : reference
          ? `Reference ${reference} has been created and is waiting for payment confirmation.`
          : "Your order was created, but no payment reference was provided in the URL.";

  return (
    <main className="page-hero">
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
