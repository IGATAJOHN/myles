"use client";

import { useState } from "react";

import { addCartItem } from "@/lib/cart";
import { formatPrice } from "@/data/products";

const sizes = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetailClient({ product }) {
  const variants = product.variants || [];
  const defaultVariant = variants.find((variant) => variant.id === product.defaultVariantId) || variants[0] || null;
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [variantId, setVariantId] = useState(defaultVariant?.id || "");

  const selectedVariant = variants.find((variant) => variant.id === variantId) || defaultVariant;

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentStock = selectedVariant?.stock ?? product.stock;
  const isOutOfStock = currentStock <= 0;

  function addSelectedItem() {
    addCartItem({
      slug: product.slug,
      variantId: selectedVariant?.id || null,
      variantLabel: selectedVariant?.label || "",
      name: product.name,
      price: currentPrice,
      size,
      quantity
    });
  }

  return (
    <div className="sticky-card">
      <div className="about-card">
        <div className={`badge ${isOutOfStock ? "badge-out" : ""}`}>{product.tag}</div>
        <h2>{product.name}</h2>
        <p className="section-copy">
          Myles Luxe boxer briefs are designed for men who value comfort, support, and confidence.
          Each set contains 3 premium boxer briefs made from breathable fabric with a flexible stretch
          waistband that provides support without restriction.
        </p>
        <div className="price-line">
          <strong className="price">{formatPrice(currentPrice)}</strong>
          <span className="limited">
            {isOutOfStock ? "Currently out of stock" : `Only ${currentStock} sets remaining`}
          </span>
        </div>

        {variants.length ? (
          <div>
            <strong>Variety</strong>
            <div className="variant-grid">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  className={`size-button ${variantId === variant.id ? "active" : ""}`}
                  type="button"
                  onClick={() => setVariantId(variant.id)}
                >
                  {variant.color || variant.label}
                </button>
              ))}
            </div>
            {selectedVariant ? (
              <p className="muted variant-note">
                Selected: {selectedVariant.label}
                {selectedVariant.color ? ` | ${selectedVariant.color}` : ""}
              </p>
            ) : null}
          </div>
        ) : null}

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
            max={Math.max(currentStock, 1)}
            value={quantity}
            onChange={(event) =>
              setQuantity(Math.max(1, Math.min(Number(event.target.value) || 1, Math.max(currentStock, 1))))
            }
          />
        </div>
        <div className="product-actions">
          <button className="button" type="button" disabled={isOutOfStock} onClick={addSelectedItem}>
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
          <a
            className="ghost-button"
            aria-disabled={isOutOfStock}
            href={
              isOutOfStock
                ? "#"
                : `https://wa.me/2349064372830?text=${encodeURIComponent(
                    `Hello, I want to order the ${product.name}${selectedVariant ? ` (${selectedVariant.label})` : ""}. Size: ${size} Quantity: ${quantity}`
                  )}`
            }
          >
            {isOutOfStock ? "Unavailable" : "Order via WhatsApp"}
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
            <strong>
              {product.name}
              {selectedVariant ? ` | ${selectedVariant.label}` : ""}
            </strong>
            <span className="price">{formatPrice(currentPrice)}</span>
            <button className="button" type="button" disabled={isOutOfStock} onClick={addSelectedItem}>
              {isOutOfStock ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
