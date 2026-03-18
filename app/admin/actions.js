"use server";

import { redirect } from "next/navigation";

import { clearAdminSession, getAdminPassword, setAdminSession } from "@/lib/admin";

export async function loginAdmin(_previousState, formData) {
  const submitted = String(formData.get("password") || "");
  const expected = getAdminPassword();

  if (!expected) {
    return { error: "ADMIN_PASSWORD is not configured yet in your environment." };
  }

  if (submitted !== expected) {
    return { error: "Incorrect admin password." };
  }

  await setAdminSession();
  redirect("/admin/orders");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin");
}
