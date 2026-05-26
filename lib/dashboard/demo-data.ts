/**
 * Demo data for dashboard pages in test mode.
 * Provides realistic mock datasets so all dashboard views are populated
 * when the user has no real Supabase session.
 *
 * Shapes must exactly match the exported interfaces in data.ts
 * and the Notification type in types.ts.
 */

const now = Date.now();
const iso = (ms: number) => new Date(ms).toISOString();
const inDays = (d: number) => iso(now + d * 86400000);
const agoDays = (d: number) => iso(now - d * 86400000);
const agoHours = (h: number) => iso(now - h * 3600000);
const agoMins = (m: number) => iso(now - m * 60000);

// ——— User ———
export const demoUser = {
  id: "demo-user-id",
  email: "demo@mazadauto.tn",
  first_name: "Ahmed",
  last_name: "Ben Salah",
  phone: "+216 20 123 456",
  city: "Tunis",
  role: "buyer" as const,
  seller_type: null,
  company_name: null,
  kyc_status: "verified" as const,
  deposit_paid: true,
  deposit_amount: 600000,
  created_at: "2024-01-15T10:00:00Z",
};

// ——— Buyer ———
export const demoBuyerStats = {
  activeBids: 3,
  wonAuctions: 2,
  lostAuctions: 1,
  totalSpent: 145000000,
};

export const demoActiveBids = [
  {
    auctionId: "a-peugeot-308",
    vehicleSlug: "peugeot-308-2020",
    vehicleName: "Peugeot 308 2020",
    myBid: 43000000,
    currentBid: 43500000,
    status: "outbid" as const,
    endsAt: inDays(1),
  },
  {
    auctionId: "a-vw-passat",
    vehicleSlug: "volkswagen-passat-2019",
    vehicleName: "Volkswagen Passat 2019",
    myBid: 59000000,
    currentBid: 59000000,
    status: "leading" as const,
    endsAt: inDays(2),
  },
  {
    auctionId: "a-bmw-serie3",
    vehicleSlug: "bmw-serie-3-2020",
    vehicleName: "BMW Série 3 2020",
    myBid: 51000000,
    currentBid: 51000000,
    status: "leading" as const,
    endsAt: inDays(3),
  },
];

export const demoBidHistory = [
  {
    auctionId: "a-renault-clio",
    vehicleSlug: "renault-clio-iv-2018",
    vehicleName: "Renault Clio IV 2018",
    finalAmount: 32000000,
    status: "won" as const,
    date: agoDays(5),
  },
  {
    auctionId: "a-hyundai-tucson",
    vehicleSlug: "hyundai-tucson-2021",
    vehicleName: "Hyundai Tucson 2021",
    finalAmount: 48000000,
    status: "lost" as const,
    date: agoDays(8),
  },
  {
    auctionId: "a-toyota-corolla",
    vehicleSlug: "toyota-corolla-2021",
    vehicleName: "Toyota Corolla 2021",
    finalAmount: 52000000,
    status: "won" as const,
    date: agoDays(12),
  },
];

export const demoWatchlist = [
  {
    slug: "peugeot-308-2020",
    name: "Peugeot 308",
    year: 2020,
    currentPrice: 43500000,
    endsAt: inDays(1),
  },
  {
    slug: "ford-ranger-2021",
    name: "Ford Ranger",
    year: 2021,
    currentPrice: 74500000,
    endsAt: inDays(2),
  },
  {
    slug: "kia-sportage-2022",
    name: "Kia Sportage",
    year: 2022,
    currentPrice: 58000000,
    endsAt: inDays(4),
  },
];

// ——— Seller ———
export const demoSellerStats = {
  activeListings: 2,
  soldVehicles: 1,
  totalRevenue: 78000000,
  totalCommission: 1170000,
};

export const demoSellerListings = [
  {
    id: "v-peugeot-308",
    vehicleName: "Peugeot 308 2020",
    prixDepart: 42000000,
    currentBid: 43500000,
    bidCount: 12,
    status: "active" as const,
    endsAt: inDays(1),
  },
  {
    id: "v-renault-clio",
    vehicleName: "Renault Clio IV 2018",
    prixDepart: 28000000,
    currentBid: 31500000,
    bidCount: 8,
    status: "active" as const,
    endsAt: inDays(2),
  },
];

export const demoSellerDrafts = [
  {
    id: "v-citroen-c5",
    vehicleName: "Citroën C5 Aircross 2022",
    status: "pending_inspection",
    submittedAt: agoDays(1),
  },
];

export const demoSellerSales = [
  {
    id: "v-toyota-corolla",
    vehicleName: "Toyota Corolla 2021",
    prixAdjudication: 52000000,
    commission: 780000,
    net: 51220000,
    buyer: "A***i",
    date: agoDays(12),
  },
];

// ——— Admin ———
export const demoAdminStats = {
  totalUsers: 124,
  buyers: 89,
  sellers: 35,
  kycPending: 8,
  activeVehicles: 12,
  activeAuctions: 10,
};

export const demoAdminActivities = [
  { icon: "gavel", text: "Nouvelle enchère publiée : Ford Ranger", time: "Il y a 5 min" },
  { icon: "user-check", text: "KYC approuvé : Sami Trabelsi", time: "Il y a 12 min" },
  { icon: "gavel", text: "Enchère terminée : Toyota Corolla", time: "Il y a 1 h" },
  { icon: "user-plus", text: "Nouvel utilisateur inscrit", time: "Il y a 2 h" },
  { icon: "car", text: "Véhicule soumis : Citroën C5", time: "Il y a 3 h" },
  { icon: "user-x", text: "KYC rejeté : Karim Ben Ali", time: "Il y a 5 h" },
  { icon: "check-circle", text: "Véhicule approuvé : BMW Série 3", time: "Il y a 8 h" },
  { icon: "gavel", text: "Enchère terminée : Hyundai Tucson", time: "Il y a 1 jour" },
];

export const demoKycPending = [
  {
    id: "kyc-1",
    email: "ahmed@email.tn",
    first_name: "Ahmed",
    last_name: "Ben Salah",
    phone: "+216 25 456 789",
    city: "Sousse",
    role: "buyer" as const,
    company_name: null,
    seller_type: null,
    kyc_status: "pending" as const,
    deposit_paid: false,
    deposit_amount: null,
    created_at: agoDays(1),
    kyc_submitted_at: agoHours(18),
  },
  {
    id: "kyc-2",
    email: "moncef@auto.tn",
    first_name: "Moncef",
    last_name: null,
    phone: "+216 71 234 567",
    city: "Ariana",
    role: "seller" as const,
    company_name: "Moncef Auto SARL",
    seller_type: "entreprise",
    kyc_status: "pending" as const,
    deposit_paid: true,
    deposit_amount: 600000,
    created_at: agoDays(10),
    kyc_submitted_at: agoDays(2),
  },
  {
    id: "kyc-3",
    email: "karim@email.tn",
    first_name: "Karim",
    last_name: "Ben Ali",
    phone: "+216 98 765 432",
    city: "Nabeul",
    role: "buyer" as const,
    company_name: null,
    seller_type: null,
    kyc_status: "pending" as const,
    deposit_paid: false,
    deposit_amount: null,
    created_at: agoDays(3),
    kyc_submitted_at: agoHours(6),
  },
  {
    id: "kyc-4",
    email: "fatima@email.tn",
    first_name: "Fatima",
    last_name: "Khadhraoui",
    phone: "+216 52 111 222",
    city: "Tunis",
    role: "buyer" as const,
    company_name: null,
    seller_type: null,
    kyc_status: "verified" as const,
    deposit_paid: true,
    deposit_amount: 600000,
    created_at: agoDays(20),
    kyc_submitted_at: agoDays(15),
  },
  {
    id: "kyc-5",
    email: "mohamed@email.tn",
    first_name: "Mohamed",
    last_name: "Trabelsi",
    phone: "+216 93 333 444",
    city: "Sfax",
    role: "seller" as const,
    company_name: "Trabelsi Motors",
    seller_type: "entreprise",
    kyc_status: "rejected" as const,
    deposit_paid: false,
    deposit_amount: null,
    created_at: agoDays(5),
    kyc_submitted_at: agoDays(4),
  },
];

// ——— Profile edit helpers ———
export const demoProfile = {
  id: "demo-user-id",
  first_name: "Ahmed",
  last_name: "Ben Salah",
  phone: "+216 20 123 456",
  city: "Tunis",
  seller_type: null,
  company_name: null,
  role: "buyer" as const,
};

// ——— Notifications ———
export const demoNotifications = [
  {
    id: "n-1",
    user_id: "demo-user-id",
    type: "outbid",
    title: "Vous avez été surenchéri",
    body: "Quelqu'un a surenchéri sur Peugeot 308 (43 500 DT).",
    read: false,
    created_at: agoMins(15),
  },
  {
    id: "n-2",
    user_id: "demo-user-id",
    type: "auction_ending",
    title: "Enchère se termine bientôt",
    body: "VW Passat se termine dans 2 heures. Votre mise : 59 000 DT.",
    read: false,
    created_at: agoMins(45),
  },
  {
    id: "n-3",
    user_id: "demo-user-id",
    type: "won",
    title: "Enchère remportée",
    body: "Félicitations ! Vous avez remporté Toyota Corolla pour 52 000 DT.",
    read: true,
    created_at: agoDays(12),
  },
  {
    id: "n-4",
    user_id: "demo-user-id",
    type: "outbid",
    title: "Enchère perdue",
    body: "Vous n'avez pas remporté Hyundai Tucson. Adjugé à 48 000 DT.",
    read: true,
    created_at: agoDays(8),
  },
  {
    id: "n-5",
    user_id: "demo-user-id",
    type: "kyc_approved",
    title: "KYC approuvé",
    body: "Votre vérification d'identité est validée.",
    read: true,
    created_at: agoDays(30),
  },
  {
    id: "n-6",
    user_id: "demo-user-id",
    type: "auction_ending",
    title: "Alerte prix",
    body: "Ford Ranger a atteint 74 500 DT (+5 000 DT depuis hier).",
    read: false,
    created_at: agoMins(120),
  },
];
