import { logoutAdmin } from "@/app/admin/actions";
import { formatPrice } from "@/data/products";
import { isAdminAuthenticated } from "@/lib/admin";
import { getRecentOrders } from "@/lib/orders";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Orders | Myles Luxe"
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin");
  }

  let orders = [];
  let loadError = "";

  try {
    orders = await getRecentOrders();
  } catch (error) {
    console.error("Admin orders load failed:", error);
    loadError = "The orders database is temporarily unavailable. Try again after the Neon project wakes up.";
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container page-panel">
          <div className="eyebrow">Admin</div>
          <h1>Orders</h1>
          <p>Live order visibility for pending, processing, paid, and failed checkout records.</p>
          <form action={logoutAdmin} className="admin-logout-form">
            <button className="ghost-button" type="submit">Log out</button>
          </form>
        </div>
      </section>
      <section className="section">
        <div className="container admin-orders">
          {loadError ? <p className="form-error">{loadError}</p> : null}
          {orders.length ? (
            orders.map((order) => (
              <article key={order.id} className="about-card">
                <div className="admin-order-head">
                  <div>
                    <strong>{order.customerName}</strong>
                    <p className="muted">{order.reference}</p>
                  </div>
                  <span className={`status-badge status-${order.paymentStatus}`}>{order.paymentStatus}</span>
                </div>
                <p className="muted">
                  {order.customerEmail}<br />
                  {order.customerPhone}<br />
                  {order.address}, {order.city}, {order.state}
                </p>
                <div className="summary-line">
                  <span>Provider</span>
                  <strong>{order.paymentProvider}</strong>
                </div>
                <div className="summary-line">
                  <span>Created</span>
                  <strong>{new Date(order.createdAt).toLocaleString("en-NG")}</strong>
                </div>
                <div className="summary-line">
                  <span>Delivery</span>
                  <strong>{formatPrice(order.shipping)}</strong>
                </div>
                <div className="summary-line">
                  <span>Subtotal</span>
                  <strong>{formatPrice(order.subtotal)}</strong>
                </div>
                <div className="summary-line">
                  <span>Total</span>
                  <strong>{formatPrice(order.total)}</strong>
                </div>
                {order.paymentUrl ? (
                  <div className="summary-line">
                    <span>Payment Link</span>
                    <a className="muted" href={order.paymentUrl} target="_blank" rel="noreferrer">
                      Open checkout
                    </a>
                  </div>
                ) : null}
                {order.paidAt ? (
                  <div className="summary-line">
                    <span>Paid At</span>
                    <strong>{new Date(order.paidAt).toLocaleString("en-NG")}</strong>
                  </div>
                ) : null}
                <ul className="detail-list">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} | Size {item.size} | Qty {item.quantity} | {formatPrice(item.total)}
                    </li>
                  ))}
                </ul>
              </article>
            ))
          ) : (
            <p className="muted">No orders yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
