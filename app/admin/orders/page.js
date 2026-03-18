import { formatPrice } from "@/data/products";
import { getRecentOrders } from "@/lib/orders";

export const metadata = {
  title: "Admin Orders | Myles Luxe"
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getRecentOrders();

  return (
    <main>
      <section className="page-hero">
        <div className="container page-panel">
          <div className="eyebrow">Admin</div>
          <h1>Orders</h1>
          <p>Live order visibility for pending, processing, paid, and failed checkout records.</p>
        </div>
      </section>
      <section className="section">
        <div className="container admin-orders">
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
                  <span>Total</span>
                  <strong>{formatPrice(order.total)}</strong>
                </div>
                <ul className="detail-list">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} | Size {item.size} | Qty {item.quantity}
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
