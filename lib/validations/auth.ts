import { z } from "zod";

const phoneSchema = z
  .string()
  .regex(/^[0-9]{8}$/, "Numéro invalide — 8 chiffres sans indicatif");

const passwordSchema = z
  .string()
  .min(8, "Minimum 8 caractères")
  .regex(/[A-Z]/, "Au moins une majuscule")
  .regex(/[0-9]/, "Au moins un chiffre");

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const buyerRegistrationSchema = z
  .object({
    firstName: z.string().min(2, "Minimum 2 caractères").max(50),
    lastName: z.string().min(2).max(50),
    email: z.string().email("Email invalide"),
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptCgu: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les CGU",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const sellerParticulierSchema = buyerRegistrationSchema.extend({
  city: z.string().min(2, "Ville requise"),
});

export const sellerEntrepriseSchema = z
  .object({
    companyName: z.string().min(2).max(100),
    matriculeFiscal: z.string().min(5, "Matricule fiscal requis"),
    secteur: z.string().min(1, "Secteur requis"),
    representantLegal: z.string().min(2),
    email: z.string().email(),
    phone: phoneSchema,
    adresse: z.string().min(5),
    city: z.string().min(2),
    password: passwordSchema,
    confirmPassword: z.string(),
    acceptCgu: z.boolean().refine((val) => val === true, {
      message: "Vous devez accepter les CGU",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type BuyerRegistrationInput = z.infer<typeof buyerRegistrationSchema>;
export type SellerParticulierInput = z.infer<typeof sellerParticulierSchema>;
export type SellerEntrepriseInput = z.infer<typeof sellerEntrepriseSchema>;
