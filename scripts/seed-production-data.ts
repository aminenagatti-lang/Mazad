/**
 * Production Seed Script for MazadAuto
 * Idempotent — can be safely run multiple times.
 *
 * Creates:
 *   • 3 auth users (admin, seller, buyer)
 *   • 3 profiles
 *   • 2 wallets (200 DT)
 *   • 10 vehicles with photos
 *   • 60 inspection items (6 per vehicle)
 *   • 10 auctions
 *   • 25 bids (2-3 per auction)
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkjjxewilfdrhbnsglrn.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "your-service-role-key";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/* ------------------------------------------------------------------ */
/*  CONFIG                                                            */
/* ------------------------------------------------------------------ */

const SEED_USERS = [
  {
    email: "admin@mazadauto.tn",
    password: "Admin123!",
    profile: {
      role: "admin" as const,
      first_name: "Admin",
      last_name: "MazadAuto",
      phone: "+216 70 000 001",
      city: "Tunis",
      kyc_status: "verified" as const,
      kyc_verified_at: new Date().toISOString(),
    },
  },
  {
    email: "vendeur@example.tn",
    password: "Vendeur123!",
    profile: {
      role: "seller" as const,
      seller_type: "particulier" as const,
      first_name: "Sami",
      last_name: "Trabelsi",
      phone: "+216 20 987 654",
      city: "Tunis",
      kyc_status: "verified" as const,
      kyc_verified_at: new Date().toISOString(),
    },
  },
  {
    email: "acheteur@example.tn",
    password: "Acheteur123!",
    profile: {
      role: "buyer" as const,
      first_name: "Karim",
      last_name: "Ben Ali",
      phone: "+216 50 111 222",
      city: "Tunis",
      kyc_status: "verified" as const,
      kyc_verified_at: new Date().toISOString(),
    },
  },
];

const SEED_VEHICLES = [
  {
    marque: "Peugeot", modele: "308", version: "Allure", annee: 2020,
    kilometrage: 78000, carburant: "diesel" as const, transmission: "manuelle" as const,
    couleur: "Gris Platinium", nb_portes: 5, puissance_cv: 130, origine: "France",
    prix_depart: 35000000, prix_reserve: 42000000,
    description: "Peugeot 308 Allure en excellent état général. Entretien régulier chez concessionnaire. Carnet complet. Climatisation, GPS, radar de recul, jantes alliage. Importée de France en 2022.",
    ville: "Tunis",
    photos: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80",
    ],
    inspection: [
      { category: "Moteur", label: "Moteur", status: "ok" as const, note: "Compression OK, pas de fuite" },
      { category: "Carrosserie", label: "Carrosserie", status: "ok" as const, note: "Aucun défaut constaté" },
      { category: "Intérieur", label: "Intérieur", status: "ok" as const, note: "Sièges en cuir bien conservés" },
      { category: "Pneumatiques", label: "Pneumatiques", status: "warning" as const, note: "Usure de 40%, remplacement conseillé" },
      { category: "Freins", label: "Freins", status: "ok" as const, note: "Disques et plaquettes OK" },
      { category: "Électricité", label: "Électricité", status: "ok" as const, note: "Tous les systèmes fonctionnels" },
    ],
    bids: [
      { amount: 35000000, status: "outbid" as const, minutesAgo: 45 },
      { amount: 38000000, status: "outbid" as const, minutesAgo: 20 },
      { amount: 42000000, status: "active" as const, minutesAgo: 5 },
    ],
    endsInDays: 2, endsInHours: 14,
  },
  {
    marque: "Renault", modele: "Clio", version: "IV Intens", annee: 2018,
    kilometrage: 45000, carburant: "essence" as const, transmission: "automatique" as const,
    couleur: "Blanc Glacier", nb_portes: 5, puissance_cv: 90, origine: "Tunisie",
    prix_depart: 25000000, prix_reserve: 30000000,
    description: "Renault Clio IV Intens, première main. Entretien fait chez Renault Tunisie. Distribution neuve, pneus neufs. Parfait état intérieur et extérieur.",
    ville: "Ariana",
    photos: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    ],
    inspection: [
      { category: "Moteur", label: "Moteur", status: "ok" as const, note: "Chaines de distribution neuves" },
      { category: "Carrosserie", label: "Carrosserie", status: "ok" as const, note: "1ère main, jamais accidentée" },
      { category: "Intérieur", label: "Intérieur", status: "ok" as const, note: "Tissu impeccable" },
      { category: "Pneumatiques", label: "Pneumatiques", status: "ok" as const, note: "4 pneus neufs Michelin" },
      { category: "Freins", label: "Freins", status: "ok" as const, note: "Freins avant neufs" },
      { category: "Électricité", label: "Électricité", status: "ok" as const, note: "Ecran R-Link fonctionnel" },
    ],
    bids: [
      { amount: 25000000, status: "outbid" as const, minutesAgo: 60 },
      { amount: 28000000, status: "active" as const, minutesAgo: 10 },
    ],
    endsInDays: 1, endsInHours: 8,
  },
  {
    marque: "Volkswagen", modele: "Passat", version: "Carat", annee: 2020,
    kilometrage: 92000, carburant: "diesel" as const, transmission: "automatique" as const,
    couleur: "Noir Intense", nb_portes: 5, puissance_cv: 150, origine: "Allemagne",
    prix_depart: 48000000, prix_reserve: 55000000,
    description: "Volkswagen Passat Carat, motorisation TDI 150 ch. Intérieur cuir, toit ouvrant, sièges chauffants. Contrôle technique à jour. Véhicule de flotte entretenu.",
    ville: "Sousse",
    photos: [
      "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80",
    ],
    inspection: [
      { category: "Moteur", label: "Moteur", status: "ok" as const, note: "TDI 150 ch, couple excellent" },
      { category: "Carrosserie", label: "Carrosserie", status: "warning" as const, note: "Légère rayure pare-choc arrière" },
      { category: "Intérieur", label: "Intérieur", status: "ok" as const, note: "Cuir Nappa entretenu" },
      { category: "Pneumatiques", label: "Pneumatiques", status: "ok" as const, note: "50% d'usure restante" },
      { category: "Freins", label: "Freins", status: "ok" as const, note: "Disques ventilés OK" },
      { category: "Électricité", label: "Électricité", status: "ok" as const, note: "Discover Pro OK" },
    ],
    bids: [
      { amount: 48000000, status: "outbid" as const, minutesAgo: 90 },
      { amount: 52000000, status: "outbid" as const, minutesAgo: 30 },
      { amount: 55000000, status: "active" as const, minutesAgo: 8 },
    ],
    endsInDays: 3, endsInHours: 2,
  },
  {
    marque: "Ford", modele: "Ranger", version: "Wildtrak", annee: 2021,
    kilometrage: 35000, carburant: "diesel" as const, transmission: "automatique" as const,
    couleur: "Rouge Racing", nb_portes: 4, puissance_cv: 213, origine: "Thaïlande",
    prix_depart: 65000000, prix_reserve: 75000000,
    description: "Ford Ranger Wildtrak 2.0L Bi-turbo. 4x4, différentiel arrière bloquant. Hayon avec assistence électrique. Caméra 360°, régulateur adaptatif. Parfait pour professionnels.",
    ville: "Tunis",
    photos: [
      "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80",
    ],
    inspection: [
      { category: "Moteur", label: "Moteur", status: "ok" as const, note: "Bi-turbo 213 ch, puissance nominale" },
      { category: "Carrosserie", label: "Carrosserie", status: "ok" as const, note: "Protections de benne installées" },
      { category: "Intérieur", label: "Intérieur", status: "ok" as const, note: "Cuir/suede sport Wildtrak" },
      { category: "Pneumatiques", label: "Pneumatiques", status: "ok" as const, note: "Pneus tout-terrain BF Goodrich" },
      { category: "Freins", label: "Freins", status: "warning" as const, note: "Plaquettes arrière à 30%" },
      { category: "Électricité", label: "Électricité", status: "ok" as const, note: "Caméra 360°, SYNC 3" },
    ],
    bids: [
      { amount: 65000000, status: "outbid" as const, minutesAgo: 120 },
      { amount: 72000000, status: "active" as const, minutesAgo: 15 },
    ],
    endsInDays: 4, endsInHours: 6,
  },
  {
    marque: "Hyundai", modele: "Tucson", version: "Executive", annee: 2019,
    kilometrage: 62000, carburant: "essence" as const, transmission: "automatique" as const,
    couleur: "Bleu Ocean", nb_portes: 5, puissance_cv: 177, origine: "Corée du Sud",
    prix_depart: 40000000, prix_reserve: 46000000,
    description: "Hyundai Tucson Executive, motorisation 1.6 T-GDi. Toit panoramique, sièges électriques, affichage tête haute. Full LED, freinage d'urgence automatique.",
    ville: "Sfax",
    photos: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    ],
    inspection: [
      { category: "Moteur", label: "Moteur", status: "ok" as const, note: "T-GDi 177 ch, turbo récent" },
      { category: "Carrosserie", label: "Carrosserie", status: "ok" as const, note: "Peinture métallisée impeccable" },
      { category: "Intérieur", label: "Intérieur", status: "ok" as const, note: "Cuir noir, sièges électriques" },
      { category: "Pneumatiques", label: "Pneumatiques", status: "ok" as const, note: "Continental PremiumContact" },
      { category: "Freins", label: "Freins", status: "ok" as const, note: "Freinage électrique OK" },
      { category: "Électricité", label: "Électricité", status: "warning" as const, note: "Capteur de pluie à calibrer" },
    ],
    bids: [
      { amount: 40000000, status: "outbid" as const, minutesAgo: 50 },
      { amount: 43000000, status: "active" as const, minutesAgo: 12 },
    ],
    endsInDays: 1, endsInHours: 22,
  },
  {
    marque: "BMW", modele: "Série 3", version: "320d M Sport", annee: 2019,
    kilometrage: 55000, carburant: "diesel" as const, transmission: "automatique" as const,
    couleur: "Gris Minéral", nb_portes: 4, puissance_cv: 190, origine: "Allemagne",
    prix_depart: 60000000, prix_reserve: 70000000,
    description: "BMW 320d M Sport, pack esthétique M. Jantes 19 pouces, suspensions sport, volant M. Intérieur Alcantara, iDrive Pro. Historique entretien BMW complet.",
    ville: "Tunis",
    photos: [
      "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80",
      "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80",
    ],
    inspection: [
      { category: "Moteur", label: "Moteur", status: "ok" as const, note: "B47, couple linéaire, pas de fumée" },
      { category: "Carrosserie", label: "Carrosserie", status: "ok" as const, note: "Pack M, jantes 19 sans éclat" },
      { category: "Intérieur", label: "Intérieur", status: "ok" as const, note: "Alcantara, volant M chauffant" },
      { category: "Pneumatiques", label: "Pneumatiques", status: "ok" as const, note: "Michelin Pilot Sport 4" },
      { category: "Freins", label: "Freins", status: "ok" as const, note: "Étriers M bleu, disques OK" },
      { category: "Électricité", label: "Électricité", status: "ok" as const, note: "iDrive Pro, affichage tête haute" },
    ],
    bids: [
      { amount: 60000000, status: "outbid" as const, minutesAgo: 180 },
      { amount: 65000000, status: "outbid" as const, minutesAgo: 60 },
      { amount: 70000000, status: "active" as const, minutesAgo: 20 },
    ],
    endsInDays: 5, endsInHours: 12,
  },
  {
    marque: "Toyota", modele: "Corolla", version: "Design", annee: 2021,
    kilometrage: 28000, carburant: "hybride" as const, transmission: "automatique" as const,
    couleur: "Gris Eclipse", nb_portes: 5, puissance_cv: 122, origine: "Japon",
    prix_depart: 32000000, prix_reserve: 38000000,
    description: "Toyota Corolla Hybride 122ch Design. Consommation moyenne 4.2L/100km. Système Toyota Safety Sense, écran 10 pouces, Apple CarPlay. Garantie constructeur encore active.",
    ville: "Ariana",
    photos: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80",
    ],
    inspection: [
      { category: "Moteur", label: "Moteur", status: "ok" as const, note: "Hybride, batterie à 98% SOH" },
      { category: "Carrosserie", label: "Carrosserie", status: "ok" as const, note: "Aucune rayure, 1ère main" },
      { category: "Intérieur", label: "Intérieur", status: "ok" as const, note: "Tissu Design neuf" },
      { category: "Pneumatiques", label: "Pneumatiques", status: "ok" as const, note: "Dunlop Sport, 80% restant" },
      { category: "Freins", label: "Freins", status: "ok" as const, note: "Freinage régénératif + disques OK" },
      { category: "Électricité", label: "Électricité", status: "ok" as const, note: "Toyota Safety Sense 2.0 complet" },
    ],
    bids: [
      { amount: 32000000, status: "outbid" as const, minutesAgo: 90 },
      { amount: 36000000, status: "active" as const, minutesAgo: 25 },
    ],
    endsInDays: 2, endsInHours: 4,
  },
  {
    marque: "Mercedes", modele: "Classe C", version: "220d Avantgarde", annee: 2020,
    kilometrage: 48000, carburant: "diesel" as const, transmission: "automatique" as const,
    couleur: "Argent Iridium", nb_portes: 4, puissance_cv: 194, origine: "Allemagne",
    prix_depart: 62000000, prix_reserve: 78000000,
    description: "Mercedes Classe C 220d Avantgarde. Intérieur Artico cuir noir, ambiance 64 couleurs. MBUX avec Hey Mercedes, stationnement autonome. Carnet digital Mercedes.",
    ville: "Sousse",
    photos: [
      "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80",
      "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80",
    ],
    inspection: [
      { category: "Moteur", label: "Moteur", status: "ok" as const, note: "OM654, couple excellent" },
      { category: "Carrosserie", label: "Carrosserie", status: "ok" as const, note: "Aucun défaut, traitement céramique" },
      { category: "Intérieur", label: "Intérieur", status: "ok" as const, note: "Artico cuir, 64 couleurs LED" },
      { category: "Pneumatiques", label: "Pneumatiques", status: "ok" as const, note: "Michelin Primacy 4, 60%" },
      { category: "Freins", label: "Freins", status: "warning" as const, note: "Disques avant à remplacer sous 5000km" },
      { category: "Électricité", label: "Électricité", status: "ok" as const, note: "MBUX, Hey Mercedes, parking auto" },
    ],
    bids: [
      { amount: 62000000, status: "outbid" as const, minutesAgo: 110 },
      { amount: 70000000, status: "outbid" as const, minutesAgo: 40 },
      { amount: 73500000, status: "active" as const, minutesAgo: 10 },
    ],
    endsInDays: 6, endsInHours: 8,
  },
  {
    marque: "Kia", modele: "Sportage", version: "GT Line", annee: 2020,
    kilometrage: 41000, carburant: "diesel" as const, transmission: "automatique" as const,
    couleur: "Blanc White Pearl", nb_portes: 5, puissance_cv: 136, origine: "Corée du Sud",
    prix_depart: 36000000, prix_reserve: 42000000,
    description: "Kia Sportage GT Line, look sportif avec boucliers spécifiques. Jantes 19 pouces, échappement double sortie. Système audio JBL, sièges chauffants et ventilés.",
    ville: "Tunis",
    photos: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80",
    ],
    inspection: [
      { category: "Moteur", label: "Moteur", status: "ok" as const, note: "CRDi 136 ch, couple satisfaisant" },
      { category: "Carrosserie", label: "Carrosserie", status: "ok" as const, note: "GT Line, look sportif intact" },
      { category: "Intérieur", label: "Intérieur", status: "ok" as const, note: "Cuir rouge surpiqûres rouges" },
      { category: "Pneumatiques", label: "Pneumatiques", status: "ok" as const, note: "Continental 4x4 Contact" },
      { category: "Freins", label: "Freins", status: "ok" as const, note: "Freins OK" },
      { category: "Électricité", label: "Électricité", status: "ok" as const, note: "JBL, caméra, affichage 8\"" },
    ],
    bids: [
      { amount: 36000000, status: "outbid" as const, minutesAgo: 70 },
      { amount: 40000000, status: "active" as const, minutesAgo: 18 },
    ],
    endsInDays: 3, endsInHours: 18,
  },
  {
    marque: "Citroën", modele: "C5 Aircross", version: "Shine", annee: 2021,
    kilometrage: 32000, carburant: "essence" as const, transmission: "automatique" as const,
    couleur: "Bleu Lazuli", nb_portes: 5, puissance_cv: 180, origine: "France",
    prix_depart: 46000000, prix_reserve: 55000000,
    description: "Citroën C5 Aircross Shine, motorisation PureTech 180 EAT8. Suspensions à butées hydrauliques progressives, sièges Advanced Comfort. Hayon électrique, caméra de recul.",
    ville: "Sfax",
    photos: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80",
    ],
    inspection: [
      { category: "Moteur", label: "Moteur", status: "ok" as const, note: "PureTech 180, pas de calage" },
      { category: "Carrosserie", label: "Carrosserie", status: "ok" as const, note: "Airbumps sans marque" },
      { category: "Intérieur", label: "Intérieur", status: "ok" as const, note: "Advanced Comfort, sièges larges" },
      { category: "Pneumatiques", label: "Pneumatiques", status: "ok" as const, note: "Michelin Primacy SUV+" },
      { category: "Freins", label: "Freins", status: "ok" as const, note: "Freinage progressif OK" },
      { category: "Électricité", label: "Électricité", status: "warning" as const, note: "Mise à jour cartographie conseillée" },
    ],
    bids: [
      { amount: 46000000, status: "outbid" as const, minutesAgo: 80 },
      { amount: 51000000, status: "outbid" as const, minutesAgo: 35 },
      { amount: 54000000, status: "active" as const, minutesAgo: 15 },
    ],
    endsInDays: 1, endsInHours: 3,
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                           */
/* ------------------------------------------------------------------ */

async function getOrCreateUsers() {
  const result: { id: string; email: string; role: string }[] = [];

  for (const user of SEED_USERS) {
    // Check if user already exists
    const { data: list } = await supabase.auth.admin.listUsers();
    const existing = list.users.find((u: any) => u.email === user.email);

    if (existing) {
      console.log(`  ??  User ${user.email} already exists`);
      const profile = await supabase.from("profiles").select("role").eq("id", existing.id).single();
      result.push({ id: existing.id, email: user.email, role: profile.data?.role || user.profile.role });
      continue;
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error(`  ? Failed to create user ${user.email}:`, authError?.message);
      continue;
    }

    const userId = authData.user.id;
    console.log(`  ? Created user: ${user.email} (${userId})`);

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      ...user.profile,
    });

    if (profileError) {
      console.error(`  ? Profile ${user.email}:`, profileError.message);
    } else {
      console.log(`  ? Profile created for ${user.email}`);
    }

    result.push({ id: userId, email: user.email, role: user.profile.role });
  }

  return result;
}

async function getOrCreateWallets(users: { id: string; email: string; role: string }[]) {
  const target = users.filter((u) => u.role === "buyer" || u.role === "seller");

  for (const user of target) {
    const { data: existing } = await supabase.from("wallets").select("id").eq("user_id", user.id).single();
    if (existing) {
      console.log(`  ??  Wallet for ${user.email} already exists`);
      continue;
    }

    const { error } = await supabase.from("wallets").insert({
      user_id: user.id,
      balance: 200000,
      status: "active",
      deposit_verified_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`  ? Wallet ${user.email}:`, error.message);
    } else {
      console.log(`  ? Wallet created for ${user.email} (200 DT)`);
    }
  }
}

async function seedVehicles(sellerId: string) {
  const createdVehicles: { id: string; slug: string }[] = [];

  for (let i = 0; i < SEED_VEHICLES.length; i++) {
    const v = SEED_VEHICLES[i];
    const slug = `${v.marque.toLowerCase()}-${v.modele.toLowerCase().replace(/\s+/g, "-")}-${v.version.toLowerCase().replace(/\s+/g, "-")}-${v.annee}`;

    // Check if already exists
    const { data: existingVehicle } = await supabase.from("vehicles").select("id, slug").eq("slug", slug).single();
    if (existingVehicle) {
      console.log(`  ??  Vehicle ${v.marque} ${v.modele} already exists`);
      createdVehicles.push(existingVehicle);
      continue;
    }

    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicles")
      .insert({
        seller_id: sellerId,
        marque: v.marque,
        modele: v.modele,
        version: v.version,
        annee: v.annee,
        kilometrage: v.kilometrage,
        carburant: v.carburant,
        transmission: v.transmission,
        couleur: v.couleur,
        nb_portes: v.nb_portes,
        puissance_cv: v.puissance_cv,
        origine: v.origine,
        prix_depart: v.prix_depart,
        prix_reserve: v.prix_reserve,
        description: v.description,
        slug,
        status: "active",
        inspection_date: new Date().toISOString(),
        inspection_score: Math.round(v.inspection.filter((x) => x.status === "ok").length / v.inspection.length * 100),
      })
      .select("id, slug")
      .single();

    if (vehicleError || !vehicleData) {
      console.error(`  ? Vehicle ${v.marque} ${v.modele}:`, vehicleError?.message);
      continue;
    }

    console.log(`  ? Vehicle: ${v.marque} ${v.modele} ${v.version} (${v.annee})`);
    createdVehicles.push(vehicleData);

    // Photos
    for (let p = 0; p < v.photos.length; p++) {
      await supabase.from("vehicle_photos").insert({
        vehicle_id: vehicleData.id,
        storage_path: v.photos[p],
        is_cover: p === 0,
        display_order: p,
      });
    }

    // Inspection items
    for (const item of v.inspection) {
      await supabase.from("inspection_items").insert({
        vehicle_id: vehicleData.id,
        category: item.category,
        label: item.label,
        status: item.status,
        note: item.note,
      });
    }
    console.log(`     ?? ${v.inspection.length} inspection items`);

    // Auction
    const endsAt = new Date(Date.now() + v.endsInDays * 24 * 60 * 60 * 1000 + v.endsInHours * 60 * 60 * 1000);
    const { data: auctionData, error: auctionError } = await supabase
      .from("auctions")
      .insert({
        vehicle_id: vehicleData.id,
        current_price: v.prix_depart,
        starts_at: new Date().toISOString(),
        ends_at: endsAt.toISOString(),
        status: "active",
      })
      .select("id")
      .single();

    if (auctionError || !auctionData) {
      console.error(`  ? Auction ${v.marque}:`, auctionError?.message);
      continue;
    }

    console.log(`     ???  Auction ends: ${endsAt.toLocaleDateString("fr-FR")} ${endsAt.toLocaleTimeString("fr-FR")}`);

    // Bids
    const bidderIds = users.filter((u) => u.role === "buyer").map((u) => u.id);
    if (bidderIds.length === 0) {
      console.log(`     ??  No bidder available`);
      continue;
    }

    for (let b = 0; b < v.bids.length; b++) {
      const bid = v.bids[b];
      const bidderId = bidderIds[b % bidderIds.length];
      const placedAt = new Date(Date.now() - bid.minutesAgo * 60 * 1000);

      await supabase.from("bids").insert({
        auction_id: auctionData.id,
        bidder_id: bidderId,
        amount: bid.amount,
        status: bid.status,
        placed_at: placedAt.toISOString(),
      });
    }
    console.log(`     ?? ${v.bids.length} bids placed`);
  }

  return createdVehicles;
}

/* ------------------------------------------------------------------ */
/*  MAIN                                                              */
/* ------------------------------------------------------------------ */

let users: { id: string; email: string; role: string }[] = [];

async function main() {
  console.log("?? MazadAuto Production Seed\n");
  console.log("---------------------------------------\n");

  // 1. Users
  console.log("?? Creating users...");
  users = await getOrCreateUsers();
  console.log();

  // 2. Wallets
  console.log("?? Creating wallets...");
  await getOrCreateWallets(users);
  console.log();

  // 3. Vehicles
  const seller = users.find((u) => u.role === "seller");
  if (!seller) {
    console.error("? No seller found. Aborting.");
    process.exit(1);
  }

  console.log("?? Creating vehicles, inspections, auctions & bids...");
  const vehicles = await seedVehicles(seller.id);
  console.log();

  // 4. Summary
  console.log("---------------------------------------");
  console.log("?? SEED SUMMARY");
  console.log("---------------------------------------");
  console.log(`Users created:     ${users.length}`);
  console.log(`Vehicles created:  ${vehicles.length}`);
  console.log(`Inspection items:  ${vehicles.length > 0 ? vehicles.length * 6 : 0}`);
  console.log(`Auctions created:  ${vehicles.length}`);
  console.log(`Bids placed:       ${SEED_VEHICLES.reduce((acc, v) => acc + v.bids.length, 0)}`);
  console.log();
  console.log("Test accounts:");
  console.log(`  Admin:    admin@mazadauto.tn / Admin123!`);
  console.log(`  Seller:   vendeur@example.tn / Vendeur123!`);
  console.log(`  Buyer:    acheteur@example.tn / Acheteur123!`);
  console.log();
  console.log("? Seed completed successfully!");
}

main().catch((err) => {
  console.error("\n? Fatal error:", err);
  process.exit(1);
});

