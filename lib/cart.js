const CART_KEY = "myles-luxe-cart";

export function readCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeCart(cart) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("myles-luxe-cart-changed"));
}

export function addCartItem(item) {
  const cart = readCart();
  const existing = cart.find((entry) => entry.slug === item.slug && entry.size === item.size);
  if (existing) existing.quantity += item.quantity;
  else cart.push(item);
  writeCart(cart);
}

export function clearCart() {
  writeCart([]);
}
