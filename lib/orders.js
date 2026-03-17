import crypto from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const storageDir = path.join(process.cwd(), "storage");
const ordersFile = path.join(storageDir, "orders.json");

async function ensureStorage() {
  await mkdir(storageDir, { recursive: true });

  try {
    await readFile(ordersFile, "utf8");
  } catch {
    await writeFile(ordersFile, "[]", "utf8");
  }
}

async function readOrders() {
  await ensureStorage();
  const raw = await readFile(ordersFile, "utf8");
  return JSON.parse(raw);
}

async function writeOrders(orders) {
  await ensureStorage();
  await writeFile(ordersFile, JSON.stringify(orders, null, 2), "utf8");
}

export async function createOrder({
  reference,
  paymentProvider,
  checkoutMethod,
  customer,
  summary,
  whatsappUrl,
  paymentUrl
}) {
  const orders = await readOrders();
  const order = {
    id: crypto.randomUUID(),
    reference,
    paymentProvider,
    checkoutMethod,
    paymentStatus: "pending",
    customerName: customer.name,
    customerPhone: customer.phone,
    customerEmail: customer.email,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    subtotal: summary.subtotal,
    shipping: summary.shipping,
    total: summary.total,
    whatsappUrl: whatsappUrl || null,
    paymentUrl: paymentUrl || null,
    paidAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: summary.items.map((item) => ({
      id: crypto.randomUUID(),
      productId: item.slug,
      name: item.name,
      size: item.size,
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.price * item.quantity
    }))
  };

  orders.push(order);
  await writeOrders(orders);
  return order;
}

export async function updateOrderPaymentUrls(reference, values) {
  const orders = await readOrders();
  const index = orders.findIndex((order) => order.reference === reference);
  if (index === -1) return null;

  orders[index] = {
    ...orders[index],
    ...values,
    updatedAt: new Date().toISOString()
  };

  await writeOrders(orders);
  return orders[index];
}

export async function markOrderPaid(reference) {
  return updateOrderPaymentUrls(reference, {
    paymentStatus: "paid",
    paidAt: new Date().toISOString()
  });
}

export async function markOrderFailed(reference) {
  return updateOrderPaymentUrls(reference, {
    paymentStatus: "failed"
  });
}

export async function getOrderByReference(reference) {
  if (!reference) return null;
  const orders = await readOrders();
  return orders.find((order) => order.reference === reference) || null;
}
