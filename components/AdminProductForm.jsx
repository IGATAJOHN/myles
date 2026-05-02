"use client";

import { useActionState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteVariantAction, updateProductInventory } from "@/app/admin/actions";

const initialState = {
  error: "",
  success: ""
};

export default function AdminProductForm({ product }) {
  const [state, action, pending] = useActionState(updateProductInventory, initialState);
  const formRef = useRef(null);
  const router = useRouter();
  const [isDeleting, startDeleteTransition] = useTransition();

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

  function handleBasePriceChange(event) {
    const newPrice = event.target.value;
    if (!formRef.current) return;

    const variantInputs = formRef.current.querySelectorAll('input[name="variantPrice"]');
    variantInputs.forEach((input) => {
      input.value = newPrice;
    });

    const newVariantInput = formRef.current.querySelector('input[name="newVariantPrice"]');
    if (newVariantInput) {
      newVariantInput.value = newPrice;
    }
  }

  function handleDeleteVariant(variantId) {
    startDeleteTransition(async () => {
      const formData = new FormData();
      formData.set("deleteVariantId", variantId);
      await deleteVariantAction(formData);
      router.refresh();
    });
  }

  return (
    <form ref={formRef} className="inventory-form" action={action}>
      <input type="hidden" name="id" value={product.id} />
      <div className="inventory-card">
        <div className="inventory-card-header">
          <strong>{product.name}</strong>
          <div className="price-input-wrapper" style={{ width: "140px", marginTop: "0" }}>
            <span className="price-input-prefix">₦</span>
            <input
              type="number"
              name="price"
              min="0"
              step="500"
              defaultValue={product.price}
              className="price-input"
              onChange={handleBasePriceChange}
              style={{
                paddingTop: "8px",
                paddingBottom: "8px",
                borderRadius: "999px",
                background: "rgba(199,165,75,0.12)",
                borderColor: "rgba(199,165,75,0.25)"
              }}
              aria-label="Base Price"
            />
          </div>
        </div>
        <p className="muted">{product.slug}</p>
        {product.imageUrl ? (
          <div className="inventory-image-preview">
            <img src={product.imageUrl} alt={product.name} />
          </div>
        ) : (
          <div className="inventory-image-preview inventory-image-empty">No default asset uploaded</div>
        )}
        <label className="inventory-field">
          <span>Product Name</span>
          <input type="text" name="name" defaultValue={product.name} />
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
                <span>Variant Price (₦)</span>
                <div className="price-input-wrapper">
                  <span className="price-input-prefix">₦</span>
                  <input type="number" name="variantPrice" min="0" step="500" defaultValue={variant.price} className="price-input" />
                </div>
              </label>
              <label className="inventory-field">
                <span>Stock</span>
                <input type="number" name="variantStock" min="0" defaultValue={variant.stock} />
              </label>
              <label className="inventory-field">
                <span>Variant Asset Upload</span>
                <input type="file" name="variantImage" accept="image/*" />
              </label>
              <button
                className="ghost-button variant-delete-button"
                type="button"
                disabled={pending || isDeleting}
                onClick={() => handleDeleteVariant(variant.id)}
              >
                {isDeleting ? "Deleting..." : "Delete Variety"}
              </button>
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
              <span>Price (₦)</span>
              <div className="price-input-wrapper">
                <span className="price-input-prefix">₦</span>
                <input type="number" name="newVariantPrice" min="0" step="500" placeholder="12000" className="price-input" />
              </div>
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
