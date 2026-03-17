"use client";

import { useState } from "react";

import { addCartItem } from "@/lib/cart";
import { formatPrice } from "@/data/products";

const sizes = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetailClient({ product }) {
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="sticky-card">
      <div className="about-card">
        <div className="badge">{product.tag}</div>
        <h2>{product.name}</h2>
        <p className="section-copy">
          Myles Luxe boxer briefs are designed for men who value comfort, support, and confidence.
          Each set contains 3 premium boxer briefs made from breathable fabric with a flexible stretch
          waistband that provides support without restriction.
        </p>
        <div className="price-line">
          <strong className="price">{formatPrice(product.price)}</strong>
          <span className="limited">Only {product.stock} sets remaining</span>
        </div>
        <div>
          <strong>Sizes</strong>
          <div className="size-grid">
            {sizes.map((entry) => (
              <button
                key={entry}
                className={`size-button ${size === entry ? "active" : ""}`}
                type="button"
                onClick={() => setSize(entry)}
              >
                {entry}
              </button>
            ))}
          </div>
        </div>
        <div className="inline-actions">
          <input
            className="quantity-input"
            type="number"
            min="1"
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value) || 1)}
          />
        </div>
        <div className="product-actions">
          <button
            className="button"
            type="button"
            onClick={() =>
              addCartItem({
                slug: product.slug,
                name: product.name,
                price: product.price,
                size,
                quantity
              })
            }
          >
            Add to Cart
          </button>
          <a
            className="ghost-button"
            href={`https://wa.me/2349064372830?text=${encodeURIComponent(
              `Hello, I want to order the ${product.name}. Size: ${size} Quantity: ${quantity}`
            )}`}
          >
            Order via WhatsApp
          </a>
        </div>
        <ul className="feature-list">
          <li>Breathable fabric</li>
          <li>Stretch fit</li>
          <li>Durable waistband</li>
          <li>All-day comfort</li>
        </ul>
        <div className="sticky-add">
          <div className="sticky-add-row">
            <strong>{product.name}</strong>
            <span className="price">{formatPrice(product.price)}</span>
            <button
              className="button"
              type="button"
              onClick={() =>
                addCartItem({
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  size,
                  quantity
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
