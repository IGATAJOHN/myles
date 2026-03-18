import { notFound } from "next/navigation";

import ProductDetailClient from "@/components/ProductDetailClient";
import { getInventoryProductBySlug } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  const product = await getInventoryProductBySlug(params.slug);

  if (!product) notFound();

  return (
    <main>
      <section className="page-hero">
        <div className="container product-layout">
          <section className="gallery">
            <div className="gallery-main">
              {product.imageUrl ? (
                <img className="gallery-main-image" src={product.imageUrl} alt={product.name} />
              ) : (
                product.name.replace("Myles Luxe - ", "")
              )}
            </div>
            <div className="gallery-strip">
              <div className="gallery-secondary">{product.imageUrl ? "Uploaded asset" : "Front view"}</div>
              <div className="gallery-secondary">Folded display</div>
              <div className="gallery-secondary">Waistband close-up</div>
              <div className="gallery-secondary">Fabric texture</div>
            </div>
          </section>
          <aside className="product-summary">
            <ProductDetailClient product={product} />
          </aside>
        </div>
      </section>
      <section className="section">
        <div className="container bundle-grid">
          <article className="mini-card">
            <div className="eyebrow">Size Guide</div>
            <h3>Find Your Fit</h3>
            <ul className="detail-list">
              <li>S: Waist 28-30</li>
              <li>M: Waist 31-33</li>
              <li>L: Waist 34-36</li>
              <li>XL: Waist 37-39</li>
              <li>XXL: Waist 40-42</li>
            </ul>
          </article>
          <article className="mini-card">
            <div className="eyebrow">Build Your Luxe Collection</div>
            <h3>Bundle Offers</h3>
            <ul className="detail-list">
              <li>Buy 2 sets and save N1,000</li>
              <li>Buy 3 sets and save N3,000</li>
              <li>Perfect for repeat essentials and gifting</li>
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
