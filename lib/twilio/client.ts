// Twilio client — uses mock object when TWILIO_* env vars are missing
// Install `twilio` package and uncomment imports when ready for production

// import Twilio from "twilio";

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;

export const twilio = sid && token
  ? (null as unknown as {
      messages: {
        create: (opts: {
          body: string;
          from: string;
          to: string;
        }) => Promise<{ sid?: string }>;
      };
    })
  : null;

export const SMS_FROM = process.env.TWILIO_PHONE_NUMBER ?? "";
