import { NextResponse } from "next/server";

import { getInventoryProducts } from "@/lib/inventory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getInventoryProducts();
  return NextResponse.json({ products });
}
