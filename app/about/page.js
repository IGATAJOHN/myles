export const metadata = {
  title: "About | Myles Luxe"
};

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-panel">
          <div className="eyebrow">About Myles Luxe</div>
          <h1>Designed for comfort, support, and everyday confidence.</h1>
          <p>
            Myles Luxe is a premium men&apos;s essentials brand focused on breathable fabrics,
            flexible stretch, durable construction, and a polished visual identity that feels global and modern.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container page-grid">
          <article className="about-card">
            <h3>Brand Direction</h3>
            <p className="muted">Black leads the experience. Gold acts as the luxury accent across calls-to-action and details.</p>
          </article>
          <article className="about-card">
            <h3>Product Promise</h3>
            <p className="muted">Breathable comfort, modern support, and durable waistbands that hold their shape.</p>
          </article>
          <article className="about-card">
            <h3>Launch Strategy</h3>
            <p className="muted">A focused first drop of 8 exclusive designs with urgency, social proof, and direct-response shopping.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
