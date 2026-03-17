function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function initializePaystackPayment({ customer, amount, reference, metadata, channel }) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return {
      ok: false,
      status: 503,
      message: "Missing PAYSTACK_SECRET_KEY. Add it to your environment before using Paystack."
    };
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: customer.email,
      amount: amount * 100,
      reference,
      callback_url: `${siteUrl()}/confirmation?reference=${reference}&provider=paystack`,
      channels: channel ? [channel] : undefined,
      metadata
    })
  });

  const data = await response.json();

  if (!response.ok || !data.status) {
    return {
      ok: false,
      status: response.status,
      message: data.message || "Unable to initialize Paystack payment."
    };
  }

  return {
    ok: true,
    provider: "paystack",
    paymentUrl: data.data.authorization_url,
    accessCode: data.data.access_code,
    reference
  };
}
