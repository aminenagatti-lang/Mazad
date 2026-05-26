/**
 * Flouci payment integration — stub
 * Install `flouci` SDK and replace stubs when credentials are available.
 */

const apiKey = process.env.FLOUCI_API_KEY;
const secret = process.env.FLOUCI_SECRET;
const appId = process.env.FLOUCI_APP_ID;

export const isFlouciConfigured = () => !!apiKey && !!secret && !!appId;

export async function createFlouciPayment(opts: {
  amount: number; // in millimes
  reference: string;
  description: string;
  successUrl: string;
  failUrl: string;
}) {
  if (!isFlouciConfigured()) {
    throw new Error("Flouci non configuré");
  }

  // TODO: Replace with real Flouci API call
  const fakeRef = `flouci_${opts.reference}_${Date.now()}`;
  return {
    paymentRef: fakeRef,
    payUrl: `${process.env.NEXT_PUBLIC_APP_URL}/portefeuille/confirmation?ref=${fakeRef}&provider=flouci`,
  };
}

export async function verifyFlouciPayment(paymentRef: string) {
  if (!isFlouciConfigured()) return { success: false };

  // TODO: Real Flouci verification
  return { success: true };
}

export async function refundFlouciPayment(paymentRef: string, amount: number) {
  if (!isFlouciConfigured()) return { success: false };

  // TODO: Real Flouci refund
  return { success: true };
}
