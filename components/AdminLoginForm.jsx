"use client";

import { useActionState } from "react";

import { loginAdmin } from "@/app/admin/actions";

const initialState = {
  error: ""
};

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdmin, initialState);

  return (
    <form className="checkout-form admin-login-form" action={action}>
      <input type="password" name="password" placeholder="Admin password" />
      {state?.error ? <p className="form-error">{state.error}</p> : null}
      <button className="button" type="submit" disabled={pending}>
        {pending ? "Checking..." : "Enter Admin"}
      </button>
    </form>
  );
}
