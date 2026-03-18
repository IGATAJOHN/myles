import { prisma } from "@/lib/prisma";

export async function createOrder({
  reference,
  paymentProvider,
  checkoutMethod,
  customer,
  summary,
  whatsappUrl,
  paymentUrl
}) {
  return prisma.order.create({
    data: {
      reference,
      paymentProvider,
      checkoutMethod,
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
      items: {
        create: summary.items.map((item) => ({
          productId: item.slug,
          name: item.name,
          size: item.size,
          quantity: item.quantity,
          unitPrice: item.price,
          total: item.price * item.quantity
        }))
      }
    },
    include: {
      items: true
    }
  });
}

export async function updateOrderPaymentUrls(reference, values) {
  return prisma.order.update({
    where: { reference },
    data: values,
    include: {
      items: true
    }
  });
}

export async function markOrderPaid(reference) {
  return updateOrderPaymentUrls(reference, {
    paymentStatus: "paid",
    paidAt: new Date()
  });
}

export async function markOrderFailed(reference) {
  return updateOrderPaymentUrls(reference, {
    paymentStatus: "failed"
  });
}

export async function getOrderByReference(reference) {
  if (!reference) return null;

  return prisma.order.findUnique({
    where: { reference },
    include: {
      items: true
    }
  });
}
