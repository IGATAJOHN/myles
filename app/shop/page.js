import ProductGrid from "@/components/ProductGrid";
import { getInventorySeedCompatibleProducts } from "@/lib/inventory";

export const metadata = {
  title: "Shop | Myles Luxe"
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getInventorySeedCompatibleProducts();

  return (
    <main>
      <section className="page-hero">
        <div className="container page-panel">
          <div className="eyebrow">Shop Page</div>
          <h1>First Drop Collection</h1>
          <p>Browse all boxer sets in a clean grid with lightweight filters and quick product preview.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <ProductGrid products={products} enableFilters />
        </div>
      </section>
    </main>
  );
}
