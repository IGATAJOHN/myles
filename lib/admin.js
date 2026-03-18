import { cookies } from "next/headers";

const ADMIN_COOKIE = "myles_admin_session";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  const password = getAdminPassword();

  if (!password) return false;

  return store.get(ADMIN_COOKIE)?.value === password;
}

export async function setAdminSession() {
  const store = await cookies();
  const password = getAdminPassword();

  store.set(ADMIN_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}
