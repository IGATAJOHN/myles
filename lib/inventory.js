import { products as seedProducts } from "@/data/products";
import { prisma } from "@/lib/prisma";

export async function syncSeedProducts() {
  for (const product of seedProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        price: product.price,
        colors: product.colors,
        tag: product.tag,
        stock: product.stock,
        active: true
      },
      create: {
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
}

export async function getInventoryProducts() {
  await syncSeedProducts();
  return prisma.product.findMany({
    where: { active: true },
    orderBy: { createdAt: "asc" }
  });
}

export async function getInventoryProductBySlug(slug) {
  await syncSeedProducts();
  return prisma.product.findUnique({
    where: { slug }
  });
}

export async function validateInventory(items) {
  await syncSeedProducts();

  const issues = [];
  const resolvedItems = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { slug: item.slug }
    });

    if (!product || !product.active) {
      issues.push({
        slug: item.slug,
        message: `${item.name} is no longer available.`
      });
      continue;
    }

    if (product.stock < item.quantity) {
      issues.push({
        slug: item.slug,
        message: `${product.name} only has ${product.stock} set(s) left.`
      });
      continue;
    }

    resolvedItems.push({
      ...item,
      productId: product.id,
      name: product.name,
      price: product.price,
      availableStock: product.stock
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
