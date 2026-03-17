import Link from "next/link";

export const metadata = {
  title: "Order Confirmed | Myles Luxe"
};

export default function ConfirmationPage() {
  return (
    <main className="page-hero">
      <div className="container page-panel confirmation-box">
        <div className="eyebrow">Order Confirmation</div>
        <h1>Your Myles Luxe order is in.</h1>
        <p>
          This placeholder confirmation screen is ready to be connected to a real checkout provider and
          order system once payments and backend flows are added.
        </p>
        <div className="button-row center-row">
          <Link className="button" href="/shop">Continue Shopping</Link>
          <Link className="button-secondary" href="/">Back Home</Link>
        </div>
      </div>
    </main>
  );
}
