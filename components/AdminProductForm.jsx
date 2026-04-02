"use client";

import { useActionState, useEffect, useRef } from "react";

import { updateProductInventory } from "@/app/admin/actions";

const initialState = {
  error: "",
  success: ""
};

export default function AdminProductForm({ product }) {
  const [state, action, pending] = useActionState(updateProductInventory, initialState);
  const formRef = useRef(null);

  useEffect(() => {
    if (!state?.success || !formRef.current) return;

    for (const fieldName of [
      "newVariantLabel",
      "newVariantColor",
      "newVariantPrice",
      "newVariantStock",
      "newVariantImage"
    ]) {
      const field = formRef.current.elements.namedItem(fieldName);
      if (field && "value" in field) {
        field.value = "";
      }
    }
  }, [state]);

  return (
    <form ref={formRef} className="inventory-form" action={action}>
      <input type="hidden" name="id" value={product.id} />
      <div className="inventory-card">
        <strong>{product.name}</strong>
        <p className="muted">{product.slug}</p>
        {product.imageUrl ? (
          <div className="inventory-image-preview">
            <img src={product.imageUrl} alt={product.name} />
          </div>
        ) : (
          <div className="inventory-image-preview inventory-image-empty">No default asset uploaded</div>
        )}
        <label className="inventory-field">
          <span>Base Price</span>
          <input type="number" name="price" min="0" defaultValue={product.price} />
        </label>
        <label className="inventory-field">
          <span>Tag</span>
          <input type="text" name="tag" defaultValue={product.tag} />
        </label>
        <label className="inventory-field">
          <span>Default Asset Upload</span>
          <input type="file" name="image" accept="image/*" />
        </label>
        <label className="inventory-check">
          <input type="checkbox" name="active" defaultChecked={product.active} />
          <span>Active product</span>
        </label>

        <div className="variant-admin-stack">
          <strong>Varieties</strong>
          {product.variants?.map((variant) => (
            <div key={variant.id} className="variant-admin-card">
              <input type="hidden" name="variantId" value={variant.id} />
              {variant.imageUrl ? (
                <div className="inventory-image-preview variant-preview">
                  <img src={variant.imageUrl} alt={`${product.name} ${variant.label}`} />
                </div>
              ) : (
                <div className="inventory-image-preview inventory-image-empty variant-preview">
                  No variant asset uploaded
                </div>
              )}
              <label className="inventory-field">
                <span>Label</span>
                <input type="text" name="variantLabel" defaultValue={variant.label} />
              </label>
              <label className="inventory-field">
                <span>Color</span>
                <input type="text" name="variantColor" defaultValue={variant.color || ""} />
              </label>
              <label className="inventory-field">
                <span>Price</span>
                <input type="number" name="variantPrice" min="0" defaultValue={variant.price} />
              </label>
              <label className="inventory-field">
                <span>Stock</span>
                <input type="number" name="variantStock" min="0" defaultValue={variant.stock} />
              </label>
              <label className="inventory-field">
                <span>Variant Asset Upload</span>
                <input type="file" name="variantImage" accept="image/*" />
              </label>
            </div>
          ))}

          <div className="variant-admin-card variant-admin-card-new">
            <strong>Add New Variety</strong>
            <p className="muted variant-helper">
              Save once to create it. These fields clear automatically after a successful save.
            </p>
            <label className="inventory-field">
              <span>Label</span>
              <input type="text" name="newVariantLabel" placeholder="Example: Gold Waistband" />
            </label>
            <label className="inventory-field">
              <span>Color</span>
              <input type="text" name="newVariantColor" placeholder="Example: Gold" />
            </label>
            <label className="inventory-field">
              <span>Price</span>
              <input type="number" name="newVariantPrice" min="0" placeholder="12000" />
            </label>
            <label className="inventory-field">
              <span>Stock</span>
              <input type="number" name="newVariantStock" min="0" placeholder="5" />
            </label>
            <label className="inventory-field">
              <span>Asset Upload</span>
              <input type="file" name="newVariantImage" accept="image/*" />
            </label>
          </div>
        </div>

        {state?.error ? <p className="form-error">{state.error}</p> : null}
        {state?.success ? <p className="form-note">{state.success}</p> : null}
        <button className="button-secondary" type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
}
