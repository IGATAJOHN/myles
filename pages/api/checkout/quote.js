import { calculateCheckoutSummary } from "@/lib/checkout";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method not allowed." });
  }

  const payload = req.body || {};
  const summary = calculateCheckoutSummary(payload.items || [], payload.state);

  return res.status(200).json(summary);
}
