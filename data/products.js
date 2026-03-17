export const products = [
  { slug: "sunny-ade", name: "Myles Luxe - SUNNY ADE", price: 15000, colors: ["White", "Beige", "Black", "Random"], tag: "First Drop", stock: 7 },
  { slug: "bongos", name: "Myles Luxe - BONGOS", price: 12000, colors: ["Black", "Olive", "Sand"], tag: "Best Seller", stock: 10 },
  { slug: "osadebe", name: "Myles Luxe - OSADEBE", price: 15000, colors: ["Gold", "Beige", "Black"], tag: "Premium", stock: 6 },
  { slug: "lagbaja", name: "Myles Luxe - LAGBAJA", price: 12000, colors: ["Black", "Smoke", "Khaki"], tag: "Limited", stock: 8 },
  { slug: "fela", name: "Myles Luxe - FELA", price: 12000, colors: ["Black", "Cocoa", "Stone"], tag: "New", stock: 12 },
  { slug: "raski-mono", name: "Myles Luxe - RASKI MONO", price: 12000, colors: ["Black", "Charcoal", "Tan"], tag: "Core", stock: 9 },
  { slug: "tu-baba", name: "Myles Luxe - TU-BABA", price: 12000, colors: ["Black", "Ivory", "Bronze"], tag: "Popular", stock: 11 },
  { slug: "sir-uwaifo", name: "Myles Luxe - SIR UWAIFO I & II", price: 15000, colors: ["Black", "Gold", "Cream"], tag: "Exclusive", stock: 5 }
];

export function getProduct(slug) {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(value);
}
