import { getInventoryProducts } from "@/lib/inventory";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const products = await getInventoryProducts();
  return res.status(200).json({ products });
}
