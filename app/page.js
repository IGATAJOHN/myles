import Link from "next/link";

import BrandMark from "@/components/BrandMark";
import ProductGrid from "@/components/ProductGrid";
import { getInventorySeedCompatibleProducts } from "@/lib/inventory";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getInventorySeedCompatibleProducts();

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">Luxury Men&apos;s Essentials</div>
            <div className="hero-brand-lockup">
              <BrandMark className="hero-brand-mark" />
              <div>
                <div className="hero-wordmark">Myles Luxe</div>
                <div className="hero-slogan">Built for comfort. Designed for confidence.</div>
              </div>
            </div>
            <h1>Myles Luxe</h1>
            <p>
              Premium men&apos;s boxer briefs designed for comfort, support, and everyday confidence.
              Built mobile-first with a premium visual direction, smooth shopping flow, and WhatsApp-ready ordering.
            </p>
            <div className="button-row">
              <Link className="button" href="/shop">Shop Collection</Link>
              <Link className="button-secondary" href="#collection">Explore Designs</Link>
            </div>
            <div className="tag-row">
              <span className="tag">Secure Payment</span>
              <span className="tag">Nationwide Delivery</span>
              <span className="tag">Premium Quality</span>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-content">
              <div className="hero-card-panel">
                <div className="eyebrow">First Drop Collection</div>
                <strong>8 Exclusive Designs</strong>
                <p className="muted">Limited availability with premium black-and-gold brand presentation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stats-grid">
          <article className="info-card">
            <h3>Welcome to Myles Luxe</h3>
            <p className="muted">A premium men&apos;s essentials brand built for comfort and designed for confidence through breathable fabrics, flexible stretch, and durable construction.</p>
          </article>
          <article className="info-card">
            <h3>Built for Mobile</h3>
            <p className="muted">The layout is optimized around small screens first, then scales up cleanly.</p>
          </article>
          <article className="info-card">
            <h3>WhatsApp Ordering</h3>
            <p className="muted">Customers can jump straight into a pre-filled WhatsApp order from product flows.</p>
          </article>
        </div>
      </section>

      <section className="section" id="collection">
        <div className="container">
          <h2 className="section-title">The Myles Luxe Collection</h2>
          <p className="section-copy">Eight boxer sets with premium presentation, quick view, and add-to-cart actions.</p>
          <ProductGrid products={products} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose Myles Luxe</h2>
          <div className="why-grid">
            <article className="mini-card"><h3>Premium Breathable Fabric</h3><p className="muted">Comfort built for everyday wear.</p></article>
            <article className="mini-card"><h3>Comfortable Stretch Fit</h3><p className="muted">Support without restriction.</p></article>
            <article className="mini-card"><h3>Durable Waistband</h3><p className="muted">Designed to hold shape and structure.</p></article>
            <article className="mini-card"><h3>Stylish Modern Design</h3><p className="muted">Sharp essentials with a luxury edge.</p></article>
            <article className="mini-card"><h3>Built for Confidence</h3><p className="muted">Premium feel from the first wear.</p></article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container cta-row">
          <div className="about-card">
            <div className="eyebrow">Launch Momentum</div>
            <h2 className="section-headline">First Drop Collection</h2>
            <p className="section-copy">8 exclusive designs. Limited availability. This reflects the urgency in the brief.</p>
            <Link className="button" href="/shop">Shop Myles Luxe</Link>
          </div>
          <div className="about-card">
            <div className="eyebrow">Social Proof</div>
            <h2 className="section-headline">@MylesLuxeCorner</h2>
            <div className="instagram-grid">
              <div className="instagram-card"><strong>Drop 01</strong><p className="muted">Premium set reveal</p></div>
              <div className="instagram-card"><strong>Comfort</strong><p className="muted">Fabric close-up</p></div>
              <div className="instagram-card"><strong>Style</strong><p className="muted">Lifestyle showcase</p></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
