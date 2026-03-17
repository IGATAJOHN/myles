import CheckoutPageClient from "@/components/CheckoutPageClient";

export const metadata = {
  title: "Checkout | Myles Luxe"
};

export default function CheckoutPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-panel">
          <div className="eyebrow">Checkout System</div>
          <h1>Simple, mobile-first checkout</h1>
          <p>This checkout now validates totals server-side and initializes Paystack or a manual bank-transfer/WhatsApp fallback.</p>
        </div>
      </section>
      <CheckoutPageClient />
    </main>
  );
}
