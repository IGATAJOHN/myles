import CartPageClient from "@/components/CartPageClient";

export const metadata = {
  title: "Cart | Myles Luxe"
};

export default function CartPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-panel">
          <div className="eyebrow">Cart Page</div>
          <h1>Review your order</h1>
          <p>Cart summary with delivery cost placeholder and a clean route into checkout.</p>
        </div>
      </section>
      <CartPageClient />
    </main>
  );
}
