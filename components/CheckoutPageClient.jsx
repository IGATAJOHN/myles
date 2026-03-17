"use client";

import { useEffect, useState, useTransition } from "react";

import { nigeriaStates } from "@/data/locations";
import { formatPrice } from "@/data/products";
import { readCart } from "@/lib/cart";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  paymentMethod: "paystack"
};

export default function CheckoutPageClient() {
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [quote, setQuote] = useState({ subtotal: 0, shipping: 0, total: 0 });
  const [quoteError, setQuoteError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    function syncCart() {
      setCart(readCart());
    }

    syncCart();
    window.addEventListener("myles-luxe-cart-changed", syncCart);
    return () => window.removeEventListener("myles-luxe-cart-changed", syncCart);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadQuote() {
      try {
        const response = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            items: cart,
            state: form.state
          })
        });

        if (!response.ok) {
          throw new Error("Unable to calculate delivery total right now.");
        }

        const data = await response.json();
        if (!cancelled) {
          setQuote(data);
          setQuoteError("");
        }
      } catch (error) {
        if (!cancelled) {
          setQuoteError(error.message);
        }
      }
    }

    loadQuote();
    return () => {
      cancelled = true;
    };
  }, [cart, form.state]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setNotice("");

    startTransition(async () => {
      try {
        const response = await fetch("/api/checkout/initialize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            items: cart,
            customer: {
              name: form.name,
              phone: form.phone,
              email: form.email,
              address: form.address,
              city: form.city,
              state: form.state
            },
            paymentMethod: form.paymentMethod
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to start checkout.");
        }

        if (data.paymentUrl) {
          setNotice(data.message || "Redirecting to payment...");
          window.location.href = data.paymentUrl;
          return;
        }

        setNotice("Checkout initialized.");
      } catch (error) {
        setSubmitError(error.message);
      }
    });
  }

  return (
    <section className="section">
      <div className="container checkout-grid">
        <article className="checkout-card">
          <h3>Delivery Details</h3>
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-row">
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </div>
            <div className="checkout-row">
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
              />
            </div>
            <div className="checkout-row">
              <select value={form.state} onChange={(event) => updateField("state", event.target.value)}>
                <option value="" disabled>Select state</option>
                {nigeriaStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <select
                value={form.paymentMethod}
                onChange={(event) => updateField("paymentMethod", event.target.value)}
              >
                <option value="paystack">Paystack</option>
                <option value="bank_transfer">Bank Transfer / WhatsApp</option>
              </select>
            </div>
            <textarea
              rows="4"
              placeholder="Delivery address"
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
            />
            {submitError ? <p className="form-error">{submitError}</p> : null}
            {notice ? <p className="form-note">{notice}</p> : null}
            <button className="button" type="submit" disabled={isPending || cart.length === 0}>
              {isPending ? "Starting checkout..." : "Confirm Order"}
            </button>
          </form>
        </article>

        <aside className="checkout-card">
          <h3>Order Summary</h3>
          {cart.length ? (
            <div className="summary-stack">
              {cart.map((item) => (
                <div key={`${item.slug}-${item.size}`} className="summary-line">
                  <span>
                    {item.name}
                    <br />
                    <span className="muted">Size {item.size} x {item.quantity}</span>
                  </span>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">Your cart is empty. Add products before checkout.</p>
          )}
          <div className="summary-line">
            <span>Subtotal</span>
            <strong>{formatPrice(quote.subtotal || 0)}</strong>
          </div>
          <div className="summary-line">
            <span>Delivery</span>
            <strong>{formatPrice(quote.shipping || 0)}</strong>
          </div>
          <div className="summary-line total">
            <span>Total</span>
            <strong>{formatPrice(quote.total || 0)}</strong>
          </div>
          {quoteError ? <p className="form-error">{quoteError}</p> : null}
          <ul className="detail-list">
            <li>Secure Payment</li>
            <li>Nationwide Delivery</li>
            <li>Premium Quality</li>
            <li>Customer Support</li>
          </ul>
        </aside>
      </div>
    </section>
  );
}
