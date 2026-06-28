# MazadAuto — Enchères Automobile en Tunisie

[![Build](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Tests](https://img.shields.io/badge/tests-38%2F38%20passing-brightgreen)]()
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue)]()
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth-green)]()

Plateforme d'enchères en ligne dédiée au marché automobile tunisien. MazadAuto connecte vendeurs (particuliers et professionnels) avec des acheteurs pour des enchères sécurisées, transparentes et certifiées.

---

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture technique](#architecture-technique)
- [Stack technique](#stack-technique)
- [Modèle économique](#modèle-économique)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Base de données](#base-de-données)
- [Authentification](#authentification)
- [Flow de paiement](#flow-de-paiement)
- [Tests](#tests)
- [Mode Test](#mode-test)
- [Déploiement](#déploiement)
- [API Routes](#api-routes)
- [Sécurité](#sécurité)
- [Améliorations futures](#améliorations-futures)
- [Licence](#licence)

---

## Vue d'ensemble

MazadAuto est une plateforme d'enchères automobiles en Tunisie où :

- **Les vendeurs** déposent leurs véhicules avec photos, fiche technique et contrôle technique
- **Les acheteurs** enchérissent en temps réel sur les véhicules qui les intéressent
- **MazadAuto** garantit la transaction via KYC, inspection certifiée et caution bancaire

La plateforme est entièrement en français, avec les prix affichés en Dinars Tunisiens (DT), et est optimisée mobile-first avec une expérience responsive complète.

### URL de démonstration
- **Production** : `https://mazadauto.tn` *(à configurer)*
- **Local** : `http://localhost:3000`

---

## Fonctionnalités

### Pour les acheteurs
- **Parcourir les enchères** — Filtrer par marque, carburant, transmission, prix, kilométrage, année
- **Trier les résultats** — Plus récentes, se terminent bientôt, prix croissant/décroissant
- **Fiche véhicule détaillée** — Photos haute résolution, fiche technique, rapport d'inspection, contrôle technique PDF
- **Enchérir en temps réel** — Boutons rapides (+200 DT, +500 DT, +1 000 DT) ou montant personnalisé avec modal de confirmation
- **Suivre les enchères** — Ajouter aux favoris, notifications en temps réel
- **Portefeuille** — Dépôt de caution (200 DT), suivi des transactions

### Pour les vendeurs
- **Déposer un véhicule** — Wizard 5 étapes avec upload de photos et documents
- **Tableau de bord vendeur** — Suivi des véhicules en ligne, enchères, ventes
- **Historique des ventes** — Revenus, commissions, statistiques

### Pour les administrateurs
- **Validation KYC** — Approuver/rejeter les documents des utilisateurs
- **Gestion des véhicules** — Approuver les annonces avant mise en ligne
- **Statistiques** — Utilisateurs, véhicules actifs, enchères en cours
- **Gestion des utilisateurs** — Liste complète avec filtres

### Fonctionnalités techniques
- **SEO complet** — Meta tags dynamiques, Open Graph, Twitter Cards, sitemap XML, JSON-LD
- **Images OG dynamiques** — Génération automatique 1200×630 pour chaque véhicule
- **Notifications temps réel** — WebSocket Supabase Realtime pour les enchères et notifications
- **Mode Test** — Bypass authentification pour les démonstrations

---

## Architecture technique

### App Router (Next.js 16)

```
app/
├── (marketing)/          # Pages publiques (landing, CGU, confidentialité)
├── (auth)/               # Authentification (connexion, inscription)
├── encheres/             # Listing et fiches véhicules
├── dashboard/            # Tableaux de bord (acheteur, vendeur, admin)
├── api/                  # API routes (REST interne)
│   ├── vehicles/         # Données publiques des véhicules
│   ├── me/               # Profil utilisateur connecté
│   ├── admin/            # Endpoints admin sécurisés
│   ├── og/               # Génération d'images Open Graph
│   └── webhooks/         # Webhooks de paiement (Konnect, Flouci)
├── sitemap.ts            # Sitemap dynamique
└── robots.ts             # robots.txt
```

### Flux de données

1. **Données publiques** (véhicules, photos, enchères) → API Routes avec `service_role` (bypass RLS)
2. **Données privées** (profils, wallets, enchères utilisateur) → Server Actions avec authentification
3. **Auth session** → `getSession()` dans le middleware (auto-refresh des tokens)
4. **Temps réel** → Supabase Realtime pour les mises à jour des enchères

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| **Framework** | Next.js 16.2.6 (App Router, Turbopack) |
| **Langage** | TypeScript 5 (strict mode) |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (JWT, cookies) |
| **Storage** | Supabase Storage (photos, PDFs) |
| **Realtime** | Supabase Realtime (WebSocket) |
| **Emails** | Resend (à activer) |
| **SMS** | Twilio (à activer) |
| **Paiement** | Konnect / Flouci (à activer) |
| **Tests E2E** | Playwright |
| **Validation** | Zod |
| **Notifications** | Sonner (toasts) |

---

## Modèle économique

### Commission
- **Acheteur** : 2% du prix d'adjudication (minimum 200 DT)
- **Vendeur** : 0% (gratuit)
- **Le prix affiché est TTC** — la commission est incluse dans le prix final

### Caution
- **Montant** : 200 DT (obligatoire pour enchérir)
- **Remboursement** : Sur demande si aucune enchère active
- **Perte** : Si l'acheteur gagnant ne paie pas la commission sous 48h → caution perdue + blacklist 30 jours

### Paiement
- **Caution** : Paiement en ligne via Konnect/Flouci
- **Commission** : Paiement en ligne via Konnect/Flouci
- **Prix du véhicule** : Paiement direct vendeur→acheteur (espèce ou virement)

---

## Structure du projet

```
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Routes d'authentification
│   │   ├── connexion/page.tsx    # Page de connexion
│   │   ├── inscription/          # Pages d'inscription
│   │   └── ...
│   ├── (marketing)/              # Pages marketing
│   │   └── page.tsx              # Landing page
│   ├── dashboard/                # Tableaux de bord
│   │   ├── page.tsx              # Redirection selon le rôle
│   │   ├── acheteur/             # Dashboard acheteur
│   │   ├── vendeur/              # Dashboard vendeur
│   │   └── admin/                # Dashboard admin
│   ├── encheres/                 # Enchères
│   │   ├── page.tsx              # Listing avec filtres
│   │   └── [slug]/               # Fiche véhicule
│   ├── api/                      # API Routes
│   │   ├── vehicles/route.ts     # Liste des véhicules
│   │   ├── vehicles/[slug]/      # Détail d'un véhicule
│   │   ├── me/route.ts           # Profil connecté
│   │   ├── admin/                # Endpoints admin
│   │   ├── og/route.tsx          # Images OG dynamiques
│   │   └── webhooks/             # Webhooks de paiement
│   ├── actions/                  # Server Actions
│   │   ├── admin.ts              # Actions admin (KYC, véhicules)
│   │   ├── bids.ts               # Placer une enchère
│   │   ├── vehicles.ts           # Créer un véhicule
│   │   ├── wallet.ts             # Gestion du portefeuille
│   │   └── profile.ts            # Modifier le profil
│   ├── layout.tsx                # Layout racine
│   ├── error.tsx                 # Boundary d'erreur
│   └── sitemap.ts                # Sitemap dynamique
│
├── components/                   # Composants React
│   ├── landing/                  # Composants landing page
│   ├── search/                   # Filtres, tri, pagination
│   ├── ui/                       # Composants UI réutilisables
│   └── vehicle/                  # Composants fiche véhicule
│
├── lib/                          # Utilitaires
│   ├── data/                     # Helpers de données
│   │   ├── vehicles.ts           # Types véhicules
│   │   ├── vehicles-server.ts    # Requêtes serveur
│   │   └── vehicles-client.ts    # Requêtes client
│   ├── dashboard/                # Logique dashboard
│   │   ├── data.ts               # Fetchers de données
│   │   ├── hooks.ts              # React hooks
│   │   └── demo-data.ts          # Données de test
│   ├── email/                    # Templates d'emails
│   ├── payments/                 # Intégration paiement
│   ├── sms/                      # Templates SMS
│   ├── supabase/                 # Clients Supabase
│   │   ├── client.ts             # Client navigateur
│   │   ├── server.ts             # Client serveur (SSR)
│   │   ├── admin.ts              # Client service role
│   │   ├── storage.ts            # Helpers Storage
│   │   └── realtime.ts           # Subscriptions temps réel
│   └── validations/              # Schémas Zod
│
├── supabase/
│   └── migrations/               # Migrations SQL
│       ├── 001_initial_schema.sql
│       ├── 006_wallet_system.sql
│       ├── 008_storage_buckets.sql
│       ├── 010_security_policies_and_fixes.sql
│       └── 011_fix_profiles_rls_recursion.sql
│
├── tests/
│   └── e2e/                      # Tests Playwright
│       ├── 01-landing.spec.ts
│       ├── 02-auction-browsing.spec.ts
│       ├── 03-auth-flow.spec.ts
│       ├── 04-dashboard.spec.ts
│       ├── 05-bidding.spec.ts
│       ├── 06-security-and-docs.spec.ts
│       └── 07-auth-real-login.spec.ts
│
├── scripts/                      # Scripts utilitaires
│   ├── seed-production-data.ts   # Seeding de la base
│   ├── upload-documents.ts       # Upload des PDFs
│   └── ...
│
├── .env.local                    # Variables d'environnement (non commité)
├── next.config.ts                # Configuration Next.js
├── playwright.config.ts          # Configuration Playwright
├── tailwind.config.ts            # Configuration Tailwind
└── tsconfig.json                 # Configuration TypeScript
```

---

## Installation

### Prérequis
- Node.js >= 20.0.0
- npm ou yarn
- Compte Supabase (projet configuré)

### Étapes

```bash
# 1. Cloner le repo
git clone https://github.com/aminenagatti-lang/Mazad.git
cd Mazad

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase

# 4. Lancer le serveur de développement
npm run dev

# 5. Ouvrir http://localhost:3000
```

### Seeder la base de données
```bash
# Option 1 : via les migrations Supabase
# Appliquer les migrations SQL dans l'ordre dans l'éditeur SQL Supabase

# Option 2 : via le script Node.js
npx tsx scripts/seed-production-data.ts
```

---

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_APP_URL=https://mazadauto.tn

# Paiement — Konnect (à activer)
# KONNECT_API_KEY=
# KONNECT_SECRET=
# KONNECT_RECEIVER_WALLET_ID=

# Paiement — Flouci (à activer)
# FLOUCI_API_KEY=
# FLOUCI_SECRET=
# FLOUCI_APP_ID=

# Notifications — Resend (à activer)
# RESEND_API_KEY=

# Notifications — Twilio (à activer)
# TWILIO_ACCOUNT_SID=
# TWILIO_AUTH_TOKEN=
# TWILIO_PHONE_NUMBER=

# Rate limiting — Upstash (optionnel)
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=

# Monitoring — Sentry (optionnel)
# NEXT_PUBLIC_SENTRY_DSN=
# SENTRY_AUTH_TOKEN=
```

---

## Base de données

### Tables principales

| Table | Description |
|-------|-------------|
| `profiles` | Profils utilisateurs (rôle, KYC, caution) |
| `kyc_documents` | Documents KYC uploadés (CIN, RIB, etc.) |
| `vehicles` | Véhicules en vente |
| `vehicle_photos` | Photos des véhicules (lien Supabase Storage) |
| `vehicle_documents` | Documents PDF (contrôle technique) |
| `inspection_items` | Items du rapport d'inspection |
| `auctions` | Enchères (prix actuel, gagnant, dates) |
| `bids` | Historique des enchères |
| `wallets` | Portefeuilles utilisateurs |
| `wallet_transactions` | Transactions (dépôts, retraits) |
| `watchlist` | Favoris |
| `notifications` | Notifications in-app |

### RLS (Row Level Security)

La table `profiles` a une policy `admin_all_profiles` qui provoque une récursion infinie. Un contournement est en place : toutes les requêtes `profiles` passent par le **service role** (`createAdminClient()`) côté serveur.

**Migration à appliquer** : `supabase/migrations/011_fix_profiles_rls_recursion.sql`

---

## Authentification

### Flow de connexion
1. L'utilisateur entre email + mot de passe sur `/connexion`
2. `supabase.auth.signInWithPassword()` crée la session
3. `window.location.href = "/dashboard"` force le rechargement complet
4. Le middleware vérifie la session via `getSession()` (auto-refresh du token)
5. Le serveur redirige vers le dashboard approprié selon le rôle

### Rôles utilisateur
- `buyer` — Acheteur (peut enchérir)
- `seller` — Vendeur (peut déposer des véhicules)
- `admin` — Administrateur (valide KYC, approuve les véhicules)

### KYC (Know Your Customer)
1. Upload de documents selon le type de compte :
   - **Particulier** : CIN recto/verso, selfie, RIB
   - **Entreprise** : CIN, selfie, RIB, patente, statuts
2. Validation manuelle par un admin sous 24-48h
3. Statut mis à jour : `pending` → `verified` ou `rejected`

---

## Flow de paiement

### 1. Caution (200 DT)
```
Acheteur → Choix méthode (Konnect/Flouci)
    ↓
Création transaction "pending"
    ↓
Redirection vers la passerelle de paiement
    ↓
Webhook de confirmation
    ↓
Mise à jour wallet (balance +200 DT)
    ↓
Activation des enchères
```

### 2. Commission (2% du prix, min 200 DT)
```
Fin de l'enchère + Victoire
    ↓
Redirection vers page de paiement
    ↓
Paiement de la commission
    ↓
Webhook de confirmation
    ↓
Commission marquée comme payée
    ↓
Révélation des coordonnées du vendeur
```

### 3. Paiement du véhicule
- **Direct** : L'acheteur paie le vendeur en espèce ou par virement
- **Hors plateforme** : MazadAuto ne traite pas le prix total du véhicule (minimise les frais de transaction)

---

## Tests

### Tests E2E (Playwright)

```bash
# Lancer tous les tests
npx playwright test

# Lancer un fichier spécifique
npx playwright test tests/e2e/07-auth-real-login.spec.ts

# Mode UI (visuel)
npx playwright test --ui
```

### Suite de tests (38 tests)

| Fichier | Tests | Description |
|---------|-------|-------------|
| `01-landing.spec.ts` | 5 | Landing page, navigation, CTA, footer |
| `02-auction-browsing.spec.ts` | 8 | Filtres, tri, fiches véhicules |
| `03-auth-flow.spec.ts` | 4 | Connexion, inscription, mode test |
| `04-dashboard.spec.ts` | 9 | Dashboards acheteur/vendeur/admin |
| `05-bidding.spec.ts` | 7 | Enchères, boutons rapides, modal |
| `06-security-and-docs.spec.ts` | 2 | Headers sécurité, documents PDF |
| `07-auth-real-login.spec.ts` | 4 | Connexion réelle avec les 3 rôles |

### Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | `admin@mazadauto.tn` | `Admin123!` |
| Vendeur | `vendeur@example.tn` | `Vendeur123!` |
| Acheteur | `acheteur@example.tn` | `Acheteur123!` |

---

## Mode Test

Le Mode Test permet de tester l'application sans authentification.

### Activation
1. Sur la landing page, cliquer sur **"Activer le Mode Test"**
2. Ou exécuter dans la console du navigateur :
   ```javascript
   localStorage.setItem("__mazad_test_mode", "true");
   document.cookie = "__test_mode=true; path=/";
   ```

### Effets
- Bypass de l'authentification sur `/dashboard/*`
- Données de démonstration injectées (stats, enchères, historique)
- Bannière jaune visible sur toutes les pages
- Les enchères fonctionnent en mode simulation (pas de requêtes réelles)

### Désactivation
Cliquer sur **"Quitter le mode test"** dans la bannière jaune.

---

## Déploiement

### Vercel (recommandé)

1. Connecter le repo GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel Dashboard
3. Déployer automatiquement sur chaque push

```bash
# Build de production locale
npm run build

# Démarrer en mode production
npm run start
```

### Points importants
- **Middleware** : S'exécute sur toutes les routes (protection `/dashboard/*`)
- **API Routes** : Les endpoints `/api/vehicles/*` utilisent le service role
- **Images** : Configurer les `remotePatterns` dans `next.config.ts` pour Supabase Storage
- **Cron jobs** : Configurer `pg_cron` dans Supabase pour les jobs d'enchères

---

## API Routes

### Publiques (sans auth)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/vehicles` | GET | Liste tous les véhicules actifs avec photos/auctions |
| `/api/vehicles/[slug]` | GET | Détail d'un véhicule (photos, inspection, documents, vendeur) |
| `/api/og` | GET | Génère une image Open Graph 1200×630 |

### Authentifiées

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/me` | GET | Profil de l'utilisateur connecté |
| `/api/wallet` | GET/POST | Opérations sur le portefeuille |
| `/api/seller-info?slug=` | GET | Coordonnées du vendeur (après paiement commission) |

### Admin (auth + rôle admin)

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/admin/stats` | GET | Statistiques globales |
| `/api/admin/kyc-pending` | GET | Liste KYC en attente |
| `/api/admin/users` | GET | Liste des utilisateurs |

### Webhooks

| Endpoint | Description |
|----------|-------------|
| `/api/webhooks/konnect` | Confirmation de paiement Konnect |
| `/api/webhooks/flouci` | Confirmation de paiement Flouci |

---

## Sécurité

### Headers de sécurité (middleware)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy` (CSP complet)
- `Referrer-Policy: strict-origin-when-cross-origin`

### Protection des données
- **RLS** activé sur toutes les tables sensibles
- **Service role** utilisé uniquement côté serveur (jamais exposé au client)
- **Validation Zod** sur toutes les entrées utilisateur
- **Upload sécurisé** : whitelist MIME, 5MB max, vérification magic bytes

### Auth
- JWT stocké dans des cookies HttpOnly (pas de localStorage)
- Auto-refresh des tokens via `getSession()`
- Middleware vérifie la session sur chaque requête

---

## Améliorations futures

### Haute priorité
- [ ] Appliquer la migration `011_fix_profiles_rls_recursion.sql` en production
- [ ] Activer les vraies APIs de paiement (Konnect/Flouci)
- [ ] Activer Resend pour les emails de notification
- [ ] Activer Twilio pour les SMS
- [ ] Supprimer le Mode Test avant le lancement public

### Moyenne priorité
- [ ] Rate limiting avec Upstash Redis
- [ ] Monitoring avec Sentry
- [ ] Analytics (Plausible ou Google Analytics)
- [ ] PWA (Progressive Web App)
- [ ] Notifications push navigateur

### Basse priorité
- [ ] Dashboard analytics avancé pour les vendeurs
- [ ] Système de messagerie entre acheteur et vendeur
- [ ] API publique (GraphQL ou REST)
- [ ] Application mobile (React Native ou Flutter)

---

## Ressources

- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation Supabase** : https://supabase.com/docs
- **Documentation Tailwind CSS** : https://tailwindcss.com/docs
- **Playwright** : https://playwright.dev

---

## Licence

Propriétaire — MazadAuto © 2026. Tous droits réservés.

---

## Contact

Pour toute question ou suggestion, contactez l'équipe MazadAuto.

---

*Dernière mise à jour : 28 juin 2026*
