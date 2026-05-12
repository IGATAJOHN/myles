export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>Myles Luxe</strong>
          <p className="muted">Built for comfort. Designed for confidence.</p>
        </div>
        <div>
          <strong>Contact</strong>
          <p className="muted">mylesluxe@gmail.com<br />09064372830<br />@mylesluxecorner</p>
        </div>
        <div>
          <strong>Next Build Targets</strong>
          <p className="muted">Payments, inventory, shipping rules, analytics, and admin management.</p>
        </div>
      </div>
      <div className="container footer-note">&copy; {new Date().getFullYear()} Myles Luxe. All rights reserved.</div>
    </footer>
  );
}
