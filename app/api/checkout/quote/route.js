import { NextResponse } from "next/server";

import { calculateCheckoutSummary } from "@/lib/checkout";

export async function POST(request) {
  const payload = await request.json();
  const summary = calculateCheckoutSummary(payload.items || [], payload.state);

  return NextResponse.json(summary);
}
