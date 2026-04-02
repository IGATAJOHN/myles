"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

import { clearAdminSession, getAdminPassword, setAdminSession } from "@/lib/admin";
import {
  createInventoryProduct,
  createProductVariant,
  deleteProductVariant,
  updateInventoryProduct,
  updateProductVariant
} from "@/lib/inventory";

const blobToken = process.env.PUBLIC_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

async function uploadAsset(image, folder = "products") {
  const safeName = String(image.name || "asset.jpg").replace(/[^a-zA-Z0-9.-]/g, "-");
  const fileName = `${Date.now()}-${safeName}`;

  if (blobToken) {
    const blob = await put(`${folder}/${fileName}`, image, {
      access: "public",
      token: blobToken
    });

    return blob.url;
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);
  const bytes = Buffer.from(await image.arrayBuffer());

  await writeFile(filePath, bytes);
  return `/uploads/${folder}/${fileName}`;
}

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

export async function deleteVariantAction(formData) {
  const deleteVariantId = String(formData.get("deleteVariantId") || "");

  if (!deleteVariantId) {
    return;
  }

  await deleteProductVariant(deleteVariantId);

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/orders");
  revalidatePath("/product");
}

export async function createProductAction(_previousState, formData) {
  try {
    const name = String(formData.get("name") || "").trim();
    const slug = String(formData.get("slug") || "").trim().toLowerCase();
    const tag = String(formData.get("tag") || "").trim();
    const colors = String(formData.get("colors") || "").trim();
    const price = Number(formData.get("price") || 0);
    const stock = Number(formData.get("stock") || 0);
    const variantLabel = String(formData.get("variantLabel") || "").trim();
    const variantColor = String(formData.get("variantColor") || "").trim();
    const active = String(formData.get("active") || "") === "on";
    const image = formData.get("image");

    if (!name || !slug) {
      return { error: "Product name and slug are required." };
    }

    const payload = {
      name,
      slug,
      tag,
      colors,
      price: Math.max(0, price),
      stock: Math.max(0, stock),
      variantLabel,
      variantColor,
      active
    };

    if (image && typeof image === "object" && "size" in image && image.size > 0) {
      payload.imageUrl = await uploadAsset(image, "products");
    }

    await createInventoryProduct(payload);

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/orders");
    revalidatePath("/product");

    return { success: "Product created." };
  } catch (error) {
    console.error("Product creation failed:", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Could not create this product right now.";

    return { error: message };
  }
}

export async function updateProductInventory(_previousState, formData) {
  try {
    const id = String(formData.get("id") || "");
    const price = Number(formData.get("price") || 0);
    const tag = String(formData.get("tag") || "");
    const active = String(formData.get("active") || "") === "on";
    const image = formData.get("image");

    if (!id) {
      return { error: "Missing product id." };
    }

    const update = {
      price: Math.max(0, price),
      tag,
      active
    };

    if (image && typeof image === "object" && "size" in image && image.size > 0) {
      update.imageUrl = await uploadAsset(image, "products");
    }

    await updateInventoryProduct(id, update);

    const variantIds = formData.getAll("variantId").map((value) => String(value || ""));
    const variantLabels = formData.getAll("variantLabel").map((value) => String(value || ""));
    const variantColors = formData.getAll("variantColor").map((value) => String(value || ""));
    const variantPrices = formData.getAll("variantPrice").map((value) => Number(value || 0));
    const variantStocks = formData.getAll("variantStock").map((value) => Number(value || 0));
    const variantImages = formData.getAll("variantImage");

    for (let index = 0; index < variantIds.length; index += 1) {
      const variantUpdate = {
        label: variantLabels[index] || `Variant ${index + 1}`,
        color: variantColors[index] || "",
        price: Math.max(0, variantPrices[index] || 0),
        stock: Math.max(0, variantStocks[index] || 0)
      };

      const variantImage = variantImages[index];
      if (variantImage && typeof variantImage === "object" && "size" in variantImage && variantImage.size > 0) {
        variantUpdate.imageUrl = await uploadAsset(variantImage, "variants");
      }

      await updateProductVariant(variantIds[index], variantUpdate);
    }

    const newVariantLabel = String(formData.get("newVariantLabel") || "").trim();
    const newVariantColor = String(formData.get("newVariantColor") || "").trim();
    const newVariantPrice = Number(formData.get("newVariantPrice") || 0);
    const newVariantStock = Number(formData.get("newVariantStock") || 0);
    const newVariantImage = formData.get("newVariantImage");

    if (newVariantLabel) {
      const newVariantData = {
        label: newVariantLabel,
        color: newVariantColor,
        price: Math.max(0, newVariantPrice),
        stock: Math.max(0, newVariantStock)
      };

      if (
        newVariantImage &&
        typeof newVariantImage === "object" &&
        "size" in newVariantImage &&
        newVariantImage.size > 0
      ) {
        newVariantData.imageUrl = await uploadAsset(newVariantImage, "variants");
      }

      await createProductVariant(id, newVariantData);
    }

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/orders");
    revalidatePath("/product");

    return { success: "Product updated." };
  } catch (error) {
    console.error("Product update failed:", error);
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Could not update this product right now.";

    return { error: message };
  }
}
