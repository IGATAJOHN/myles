"use client";

import { useActionState } from "react";

import { updateProductInventory } from "@/app/admin/actions";

const initialState = {
  error: "",
  success: ""
};

export default function AdminProductForm({ product }) {
  const [state, action, pending] = useActionState(updateProductInventory, initialState);

  return (
    <form className="inventory-form" action={action}>
      <input type="hidden" name="id" value={product.id} />
      <div className="inventory-card">
        <strong>{product.name}</strong>
        <p className="muted">{product.slug}</p>
        {product.imageUrl ? (
          <div className="inventory-image-preview">
            <img src={product.imageUrl} alt={product.name} />
          </div>
        ) : (
          <div className="inventory-image-preview inventory-image-empty">No asset uploaded</div>
        )}
        <label className="inventory-field">
          <span>Stock</span>
          <input type="number" name="stock" min="0" defaultValue={product.stock} />
        </label>
        <label className="inventory-field">
          <span>Price</span>
          <input type="number" name="price" min="0" defaultValue={product.price} />
        </label>
        <label className="inventory-field">
          <span>Tag</span>
          <input type="text" name="tag" defaultValue={product.tag} />
        </label>
        <label className="inventory-field">
          <span>Asset Upload</span>
          <input type="file" name="image" accept="image/*" />
        </label>
        <label className="inventory-check">
          <input type="checkbox" name="active" defaultChecked={product.active} />
          <span>Active product</span>
        </label>
        {state?.error ? <p className="form-error">{state.error}</p> : null}
        {state?.success ? <p className="form-note">{state.success}</p> : null}
        <button className="button-secondary" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
