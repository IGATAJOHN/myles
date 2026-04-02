import { products as seedProducts } from "@/data/products";
import { prisma } from "@/lib/prisma";

function normalizeVariantLabel(label) {
  return String(label || "").trim();
}

function normalizeVariantColor(color) {
  return String(color || "").trim();
}

function toVariantSummary(variant, fallbackProduct) {
  return {
    id: variant.id,
    productId: variant.productId,
    label: variant.label,
    color: variant.color || "",
    price: variant.price,
    stock: variant.stock,
    imageUrl: variant.imageUrl || fallbackProduct.imageUrl || null,
    active: variant.active,
    sortOrder: variant.sortOrder
  };
}

function summarizeProduct(product) {
  const activeVariants = (product.variants || [])
    .filter((variant) => variant.active)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.createdAt - right.createdAt);

  const primaryVariant = activeVariants[0] || null;
  const variantColors = activeVariants
    .map((variant) => variant.color || variant.label)
    .filter(Boolean);

  return {
    ...product,
    price: primaryVariant?.price ?? product.price,
    stock: activeVariants.length
      ? activeVariants.reduce((sum, variant) => sum + variant.stock, 0)
      : product.stock,
    colors: variantColors.length ? [...new Set(variantColors)] : Array.isArray(product.colors) ? product.colors : [],
    imageUrl: primaryVariant?.imageUrl || product.imageUrl || null,
    variants: activeVariants.map((variant) => toVariantSummary(variant, product)),
    defaultVariantId: primaryVariant?.id || null
  };
}

async function ensureDefaultVariant(product) {
  const existingVariants = await prisma.productVariant.findMany({
    where: { productId: product.id },
    orderBy: { sortOrder: "asc" }
  });

  if (existingVariants.length) {
    return existingVariants;
  }

  await prisma.productVariant.create({
    data: {
      productId: product.id,
      label: "Core",
      color: product.colors[0] || "",
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      sortOrder: 0
    }
  });

  return prisma.productVariant.findMany({
    where: { productId: product.id },
    orderBy: { sortOrder: "asc" }
  });
}

export async function syncSeedProducts() {
  for (const [index, product] of seedProducts.entries()) {
    let existing = await prisma.product.findUnique({
      where: { slug: product.slug }
    });

    if (!existing) {
      existing = await prisma.product.create({
        data: {
          slug: product.slug,
          name: product.name,
          price: product.price,
          colors: product.colors,
          tag: product.tag,
          stock: product.stock,
          active: true
        }
      });
    }

    await ensureDefaultVariant(existing);

    // Keep legacy summary fields aligned with the original seed for missing records.
    await prisma.product.update({
      where: { id: existing.id },
      data: {
        colors: existing.colors?.length ? existing.colors : product.colors,
        tag: existing.tag || product.tag
      }
    });
  }
}

export async function getInventoryProducts() {
  await syncSeedProducts();

  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" },
    include: {
      variants: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  return products.map(summarizeProduct);
}

export async function getInventoryProductBySlug(slug) {
  await syncSeedProducts();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: {
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  return product ? summarizeProduct(product) : null;
}

export async function getInventorySeedCompatibleProducts() {
  return getInventoryProducts();
}

export async function validateInventory(items) {
  await syncSeedProducts();

  const issues = [];
  const resolvedItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { slug: item.slug },
      include: {
        variants: {
          where: { active: true },
          orderBy: { sortOrder: "asc" }
        }
      }
    });

    if (!product || !product.active) {
      issues.push({
        slug: item.slug,
        message: `${item.name} is no longer available.`
      });
      continue;
    }

    const chosenVariant =
      product.variants.find((variant) => variant.id === item.variantId) ||
      product.variants[0] ||
      null;

    if (!chosenVariant) {
      issues.push({
        slug: item.slug,
        message: `${product.name} has no active varieties available right now.`
      });
      continue;
    }

    if (chosenVariant.stock < item.quantity) {
      issues.push({
        slug: item.slug,
        message: `${product.name} (${chosenVariant.label}) only has ${chosenVariant.stock} set(s) left.`
      });
      continue;
    }

    resolvedItems.push({
      ...item,
      productId: product.id,
      variantId: chosenVariant.id,
      variantLabel: chosenVariant.label,
      variantColor: chosenVariant.color || "",
      name: product.name,
      price: chosenVariant.price,
      availableStock: chosenVariant.stock,
      imageUrl: chosenVariant.imageUrl || product.imageUrl || null
    });
  }

  return {
    valid: issues.length === 0,
    issues,
    items: resolvedItems
  };
}

export async function decrementStockForOrderItems(orderItems) {
  for (const item of orderItems) {
    if (item.variantId) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    } else {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }
  }
}

export async function updateInventoryProduct(id, data) {
  await syncSeedProducts();

  return prisma.product.update({
    where: { id },
    data
  });
}

export async function updateProductVariant(id, data) {
  return prisma.productVariant.update({
    where: { id },
    data
  });
}

export async function createProductVariant(productId, data) {
  const existingCount = await prisma.productVariant.count({
    where: { productId }
  });

  return prisma.productVariant.create({
    data: {
      productId,
      label: normalizeVariantLabel(data.label) || `Variant ${existingCount + 1}`,
      color: normalizeVariantColor(data.color),
      price: Math.max(0, Number(data.price) || 0),
      stock: Math.max(0, Number(data.stock) || 0),
      imageUrl: data.imageUrl || null,
      sortOrder: existingCount
    }
  });
}
