"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

import { clearAdminSession, getAdminPassword, setAdminSession } from "@/lib/admin";
import { updateInventoryProduct } from "@/lib/inventory";

const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

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

export async function updateProductInventory(_previousState, formData) {
  try {
    const id = String(formData.get("id") || "");
    const stock = Number(formData.get("stock") || 0);
    const price = Number(formData.get("price") || 0);
    const tag = String(formData.get("tag") || "");
    const active = String(formData.get("active") || "") === "on";
    const image = formData.get("image");

    if (!id) {
      return { error: "Missing product id." };
    }

    const update = {
      stock: Math.max(0, stock),
      price: Math.max(0, price),
      tag,
      active
    };

    if (image && typeof image === "object" && "size" in image && image.size > 0) {
      const safeName = String(image.name || "asset.jpg").replace(/[^a-zA-Z0-9.-]/g, "-");
      const fileName = `${Date.now()}-${safeName}`;

      if (blobToken) {
        const blob = await put(`products/${fileName}`, image, {
          access: "public",
          token: blobToken
        });

        update.imageUrl = blob.url;
      } else {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        const bytes = Buffer.from(await image.arrayBuffer());

        await writeFile(filePath, bytes);
        update.imageUrl = `/uploads/products/${fileName}`;
      }
    }

    await updateInventoryProduct(id, update);
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/orders");
    revalidatePath("/product");

    return { success: "Product updated." };
  } catch (error) {
    console.error("Product update failed:", error);
    return { error: "Could not update this product right now." };
  }
}
