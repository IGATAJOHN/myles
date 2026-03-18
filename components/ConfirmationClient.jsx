"use client";

import { useEffect } from "react";

import { clearCart } from "@/lib/cart";

export default function ConfirmationClient({ status }) {
  useEffect(() => {
    if (status === "paid") {
      clearCart();
    }
  }, [status]);

  return null;
}
