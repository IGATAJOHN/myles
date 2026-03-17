"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import BrandMark from "@/components/BrandMark";
import { readCart } from "@/lib/cart";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/product/sunny-ade", label: "Product" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/checkout", label: "Checkout" }
];

export default function SiteHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function syncCount() {
      setCount(readCart().reduce((total, item) => total + item.quantity, 0));
    }

    syncCount();
    window.addEventListener("myles-luxe-cart-changed", syncCount);
    return () => window.removeEventListener("myles-luxe-cart-changed", syncCount);
  }, []);

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link className="brand" href="/">
          <BrandMark />
          <div className="brand-copy">
            <strong>Myles Luxe</strong>
            <span>Built for comfort. Designed for confidence.</span>
          </div>
        </Link>
        <nav className="nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="cart-pill" href="/cart">
            Cart ({count})
          </Link>
        </div>
      </div>
    </header>
  );
}
