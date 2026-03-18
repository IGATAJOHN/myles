import { NextResponse } from "next/server";

import { getInventoryProducts } from "@/lib/inventory";

export async function GET() {
  const products = await getInventoryProducts();
  return NextResponse.json({ products });
}
