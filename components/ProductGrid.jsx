"use client";

import Link from "next/link";
import { useState } from "react";

import { addCartItem } from "@/lib/cart";
import { formatPrice } from "@/data/products";

function QuickViewModal({ product, onClose }) {
  if (!product) return null;

  const isOutOfStock = product.stock === 0;

  return (
    <div className="modal open" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-grid">
          <div className="modal-visual">{product.name}</div>
          <div className="modal-body">
            <div className="modal-head">
              <div>
                <div className={`badge ${isOutOfStock ? "badge-out" : ""}`}>{product.tag}</div>
                <h3>{product.name}</h3>
              </div>
              <button className="close-button" type="button" onClick={onClose}>
                x
              </button>
            </div>
            <p className="section-copy">
              Premium boxer brief set made for breathable comfort, stylish support, and everyday confidence.
            </p>
            <strong className="price">{formatPrice(product.price)}</strong>
            <div className="tag-row">
              {product.colors.map((color) => (
                <span key={color} className="tag">
                  {color}
                </span>
              ))}
            </div>
            <div className="product-actions">
              <button
                className="button-secondary"
                type="button"
                disabled={isOutOfStock}
                onClick={() =>
                  addCartItem({
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    size: "M",
                    quantity: 1
                  })
                }
              >
                {isOutOfStock ? "Sold Out" : "Add to Cart"}
              </button>
              <Link className="ghost-button" href={`/product/${product.slug}`}>
                View Product Page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, enableFilters = false }) {
  const [query, setQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [modalProduct, setModalProduct] = useState(null);

  const visibleProducts = products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "12000" && product.price <= 12000) ||
      (priceFilter === "15000" && product.price >= 15000);

    return matchesQuery && matchesPrice;
  });

  return (
    <>
      {enableFilters ? (
        <div className="filters">
          <div className="filter-item">
            <input
              type="search"
              placeholder="Search product name"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="filter-item">
            <select value={priceFilter} onChange={(event) => setPriceFilter(event.target.value)}>
              <option value="all">All prices</option>
              <option value="12000">N12,000 and below</option>
              <option value="15000">N15,000 premium sets</option>
            </select>
          </div>
        </div>
      ) : null}

      <div className="product-grid">
        {visibleProducts.map((product) => {
          const isOutOfStock = product.stock === 0;

          return (
            <article key={product.slug} className="product-card">
              <div className="product-image">
                <span>{product.tag}</span>
              </div>
              <div className="product-body">
                <div className={`badge ${isOutOfStock ? "badge-out" : ""}`}>
                  {isOutOfStock ? "Out of stock" : `Only ${product.stock} sets remaining`}
                </div>
                <h3>{product.name}</h3>
                <p className="muted">3 premium boxer briefs | {product.colors.join(" / ")}</p>
                <div className="price-line">
                  <strong className="price">{formatPrice(product.price)}</strong>
                  <span className="muted">3-pack set</span>
                </div>
                <div className="product-actions">
                  <button className="ghost-button" type="button" onClick={() => setModalProduct(product)}>
                    Quick View
                  </button>
                  <button
                    className="button-secondary"
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() =>
                      addCartItem({
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                        size: "M",
                        quantity: 1
                      })
                    }
                  >
                    {isOutOfStock ? "Sold Out" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <QuickViewModal product={modalProduct} onClose={() => setModalProduct(null)} />
    </>
  );
}
