import { createKonnectPayment, verifyKonnectPayment, refundKonnectPayment } from "./konnect";
import { createFlouciPayment, verifyFlouciPayment, refundFlouciPayment } from "./flouci";

export type PaymentProvider = "konnect" | "flouci" | "virement";

export async function createPayment(
  provider: PaymentProvider,
  opts: {
    amount: number; // millimes
    reference: string;
    description: string;
    successUrl: string;
    failUrl: string;
  }
) {
  if (provider === "konnect") {
    return createKonnectPayment(opts);
  }
  if (provider === "flouci") {
    return createFlouciPayment(opts);
  }
  // virement manuel : pas de URL de paiement, retourne ref unique
  const fakeRef = `virement_${opts.reference}_${Date.now()}`;
  return {
    paymentRef: fakeRef,
    payUrl: `${process.env.NEXT_PUBLIC_APP_URL}/portefeuille/virement?ref=${fakeRef}`,
  };
}

export async function verifyPayment(provider: PaymentProvider, paymentRef: string) {
  if (provider === "konnect") {
    return verifyKonnectPayment(paymentRef);
  }
  if (provider === "flouci") {
    return verifyFlouciPayment(paymentRef);
  }
  // virement : vérification manuelle par admin
  return { success: false };
}

export async function refundPayment(provider: PaymentProvider, paymentRef: string, amount: number) {
  if (provider === "konnect") {
    return refundKonnectPayment(paymentRef, amount);
  }
  if (provider === "flouci") {
    return refundFlouciPayment(paymentRef, amount);
  }
  // virement : remboursement manuel
  return { success: false };
}

export function isPaymentProviderConfigured(provider: PaymentProvider): boolean {
  if (provider === "konnect") {
    return !!process.env.KONNECT_API_KEY && !!process.env.KONNECT_SECRET;
  }
  if (provider === "flouci") {
    return !!process.env.FLOUCI_API_KEY && !!process.env.FLOUCI_SECRET && !!process.env.FLOUCI_APP_ID;
  }
  return true; // virement toujours disponible
}
