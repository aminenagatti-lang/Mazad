// Resend client — uses mock object when RESEND_API_KEY is missing
// Install `resend` package and uncomment imports when ready for production

// import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey
  ? (null as unknown as {
      emails: {
        send: (opts: {
          from: string;
          to: string;
          subject: string;
          html: string;
        }) => Promise<{ id?: string }>;
      };
    })
  : null;

export const FROM_EMAIL = "MazadAuto <noreply@mazadauto.tn>";
