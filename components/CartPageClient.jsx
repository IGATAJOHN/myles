"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { formatPrice } from "@/data/products";
import { readCart } from "@/lib/cart";

export default function CartPageClient() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    function syncCart() {
      setCart(readCart());
    }

    syncCart();
    window.addEventListener("myles-luxe-cart-changed", syncCart);
    return () => window.removeEventListener("myles-luxe-cart-changed", syncCart);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 2500;
  const total = subtotal + delivery;

  return (
    <section className="section">
      <div className="container checkout-grid">
        <article className="cart-card padded-card">
          {cart.length ? (
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={`${item.slug}-${item.size}`}>
                    <td>
                      {item.name}
                      <br />
                      <span className="muted">Size {item.size}</span>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="muted">Your cart is empty. Add a few boxer sets to continue.</p>
          )}
        </article>
        <aside className="checkout-card">
          <h3>Order Summary</h3>
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>
          <div className="summary-line">
            <span>Delivery</span>
            <strong>{formatPrice(delivery)}</strong>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <div className="product-actions">
            <Link className="button" href="/checkout">
              Proceed to Checkout
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
