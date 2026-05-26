/**
 * Konnect payment integration — stub
 * Install `konnect` SDK and replace stubs when credentials are available.
 */

const apiKey = process.env.KONNECT_API_KEY;
const secret = process.env.KONNECT_SECRET;

export const isKonnectConfigured = () => !!apiKey && !!secret;

export async function createKonnectPayment(opts: {
  amount: number; // in millimes (1 DT = 1000)
  reference: string;
  description: string;
  successUrl: string;
  failUrl: string;
}) {
  if (!isKonnectConfigured()) {
    throw new Error("Konnect non configuré");
  }

  // TODO: Replace with real Konnect API call when SDK/credentials available
  // Example pseudo-implementation:
  // const response = await fetch("https://api.konnect.network/api/v2/payments/init-payment", {
  //   method: "POST",
  //   headers: { "X-Api-Key": apiKey, "Content-Type": "application/json" },
  //   body: JSON.stringify({
  //     receiverWalletId: process.env.KONNECT_RECEIVER_WALLET_ID,
  //     token: "TND",
  //     amount: opts.amount,
  //     type: "immediate",
  //     description: opts.description,
  //     lifespan: 10,
  //     checkoutUrl: opts.successUrl,
  //     failUrl: opts.failUrl,
  //     orderId: opts.reference,
  //   }),
  // });
  // const data = await response.json();
  // return { paymentRef: data.paymentRef, payUrl: data.payUrl };

  // Stub: return a fake payment reference and URL
  const fakeRef = `konnect_${opts.reference}_${Date.now()}`;
  return {
    paymentRef: fakeRef,
    payUrl: `${process.env.NEXT_PUBLIC_APP_URL}/portefeuille/confirmation?ref=${fakeRef}&provider=konnect`,
  };
}

export async function verifyKonnectPayment(paymentRef: string) {
  if (!isKonnectConfigured()) return { success: false };

  // TODO: Real Konnect verification
  // const response = await fetch(`https://api.konnect.network/api/v2/payments/${paymentRef}`, {
  //   headers: { "X-Api-Key": apiKey },
  // });
  // const data = await response.json();
  // return { success: data.payment.status === "completed" };

  return { success: true }; // stub
}

export async function refundKonnectPayment(paymentRef: string, amount: number) {
  if (!isKonnectConfigured()) return { success: false };

  // TODO: Real Konnect refund
  return { success: true }; // stub
}
