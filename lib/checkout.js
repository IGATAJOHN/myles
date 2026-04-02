import { shippingRates } from "@/data/locations";

export function normalizeCartItems(items = []) {
  return items
    .map((item) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const size = item.size || "M";

      return {
        productId: item.productId || null,
        variantId: item.variantId || null,
        variantLabel: item.variantLabel || "",
        variantColor: item.variantColor || "",
        slug: item.slug,
        name: item.name || "",
        price: Number(item.price) || 0,
        quantity,
        size,
        availableStock: item.availableStock ?? null,
        imageUrl: item.imageUrl || null
      };
    })
    .filter(Boolean);
}

export function calculateCheckoutSummary(items, state) {
  const normalizedItems = normalizeCartItems(items);
  const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = state ? shippingRates[state] ?? shippingRates.default : shippingRates.default;

  return {
    items: normalizedItems,
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}

export function validateCustomer(customer = {}) {
  const requiredFields = ["name", "phone", "email", "address", "city", "state"];
  const missingFields = requiredFields.filter((field) => !String(customer[field] || "").trim());

  return {
    valid: missingFields.length === 0,
    missingFields
  };
}

export function buildWhatsAppOrderLink({ customer, items, total, reference }) {
  const lines = [
    `Hello, I want to complete my Myles Luxe order.`,
    `Reference: ${reference}`,
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Delivery: ${customer.address}, ${customer.city}, ${customer.state}`,
    `Items:`,
    ...items.map(
      (item) =>
        `- ${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ""} | Size ${item.size} | Qty ${item.quantity}`
    ),
    `Total: NGN ${total}`
  ];

  return `https://wa.me/2349064372830?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function createOrderReference() {
  return `ML-${Date.now()}`;
}
