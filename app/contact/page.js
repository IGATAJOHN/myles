export const metadata = {
  title: "Contact | Myles Luxe"
};

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container page-panel">
          <div className="eyebrow">Contact</div>
          <h1>Talk to Myles Luxe</h1>
          <p>Contact details from the PRD are wired in here so the site has a clear customer support path from day one.</p>
        </div>
      </section>
      <section className="section">
        <div className="container contact-grid">
          <article className="contact-card"><h3>Email</h3><p className="muted">mylesluxe@gmail.com</p></article>
          <article className="contact-card"><h3>WhatsApp</h3><p className="muted">09064372830</p></article>
          <article className="contact-card"><h3>Call</h3><p className="muted">08146626801<br />09024353205</p></article>
          <article className="contact-card"><h3>Social</h3><p className="muted">@mylesluxecorner on Instagram and TikTok</p></article>
        </div>
      </section>
    </main>
  );
}
