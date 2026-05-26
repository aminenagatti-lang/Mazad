"use server";

import { twilio, SMS_FROM } from "@/lib/twilio/client";
import { getProfileById } from "@/lib/profile/get";

export async function sendSMS(userId: string, message: string) {
  try {
    const profile = await getProfileById(userId);
    if (!profile || !profile.sms_enabled || !profile.phone) return;
    if (!twilio || !SMS_FROM) {
      return;
    }
    const phone = profile.phone.startsWith("+") ? profile.phone : `+216${profile.phone}`;
    await twilio.messages.create({
      body: `MazadAuto: ${message}`,
      from: SMS_FROM,
      to: phone,
    });
  } catch {
    // ignore
  }
}

export const smsTemplates = {
  outbid: (vehicle: string, amount: number) =>
    `Vous avez été surenchéri sur ${vehicle}. Enchère: ${(amount / 1000).toLocaleString("fr-FR")} DT. mazadauto.tn`,

  won: (vehicle: string, amount: number) =>
    `Félicitations! Vous avez gagné ${vehicle} pour ${(amount / 1000).toLocaleString("fr-FR")} DT. Notre équipe vous contacte sous 24h.`,

  endingSoon: (vehicle: string, amount: number) =>
    `Plus que 1h pour ${vehicle}! Enchère: ${(amount / 1000).toLocaleString("fr-FR")} DT. mazadauto.tn`,

  kycApproved: () =>
    `Votre compte est vérifié! Vous pouvez enchérir sur mazadauto.tn`,
};
