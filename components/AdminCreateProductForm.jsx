"use client";

import { useActionState, useEffect, useRef } from "react";

import { createProductAction } from "@/app/admin/actions";

const initialState = {
  error: "",
  success: ""
};

export default function AdminCreateProductForm() {
  const [state, action, pending] = useActionState(createProductAction, initialState);
  const formRef = useRef(null);

  useEffect(() => {
    if (!state?.success || !formRef.current) return;
    formRef.current.reset();
  }, [state]);

  return (
    <form ref={formRef} className="inventory-form" action={action}>
      <div className="inventory-card create-product-card">
        <strong>Create New Product</strong>
        <p className="muted">Add a new product type like singlets, then manage its varieties below.</p>
        <label className="inventory-field">
          <span>Product Name</span>
          <input type="text" name="name" placeholder="Myles Luxe Singlet" required />
        </label>
        <label className="inventory-field">
          <span>Slug</span>
          <input type="text" name="slug" placeholder="myles-luxe-singlet" required />
        </label>
        <label className="inventory-field">
          <span>Tag</span>
          <input type="text" name="tag" placeholder="New Arrival" />
        </label>
        <label className="inventory-field">
          <span>Colors</span>
          <input type="text" name="colors" placeholder="Black, White, Sand" />
        </label>
        <label className="inventory-field">
          <span>Base Price</span>
          <input type="number" name="price" min="0" placeholder="12000" required />
        </label>
        <label className="inventory-field">
          <span>Initial Stock</span>
          <input type="number" name="stock" min="0" placeholder="10" required />
        </label>
        <label className="inventory-field">
          <span>Default Variety Label</span>
          <input type="text" name="variantLabel" placeholder="Core" />
        </label>
        <label className="inventory-field">
          <span>Default Variety Color</span>
          <input type="text" name="variantColor" placeholder="Black" />
        </label>
        <label className="inventory-field">
          <span>Default Product Image</span>
          <input type="file" name="image" accept="image/*" />
        </label>
        <label className="inventory-check">
          <input type="checkbox" name="active" defaultChecked />
          <span>Active product</span>
        </label>
        {state?.error ? <p className="form-error">{state.error}</p> : null}
        {state?.success ? <p className="form-note">{state.success}</p> : null}
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create Product"}
        </button>
      </div>
    </form>
  );
}
