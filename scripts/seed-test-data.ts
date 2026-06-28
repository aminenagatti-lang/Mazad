/**
 * Seed script for MazadAuto test data
 * Run with: npx tsx scripts/seed-test-data.ts
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://fkjjxewilfdrhbnsglrn.supabase.co";
const SERVICE_ROLE_KEY = "your-service-role-key";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const USERS = [
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

const VEHICLES = [
  {
    marque: "Volkswagen",
    modele: "Golf 7",
    annee: 2018,
    kilometrage: 85000,
    prix_reserve: 45000000,
    description: "Golf 7 en excellent état, première main, carnet d'entretien complet. Climatisation, GPS, sièges cuir.",
    transmission: "automatique" as const,
    carburant: "diesel" as const,
    ville: "Tunis",
    photos: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
      "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80",
    ],
  },
  {
    marque: "Renault",
    modele: "Clio 4",
    annee: 2019,
    kilometrage: 62000,
    prix_reserve: 32000000,
    description: "Clio 4 essence, très bon état général, faible consommation. Parfaite pour la ville.",
    transmission: "manuelle" as const,
    carburant: "essence" as const,
    ville: "Tunis",
    photos: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    ],
  },
  {
    marque: "Peugeot",
    modele: "208",
    annee: 2020,
    kilometrage: 45000,
    prix_reserve: 38000000,
    description: "Peugeot 2020 comme neuve. Écran tactile, caméra de recul, capteurs de stationnement.",
    transmission: "automatique" as const,
    carburant: "essence" as const,
    ville: "Tunis",
    photos: [
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
    ],
  },
  {
    marque: "BMW",
    modele: "Série 3",
    annee: 2017,
    kilometrage: 110000,
    prix_reserve: 65000000,
    description: "BMW Série 3, moteur 2.0L, intérieur cuir, toit ouvrant. Entretien BMW suivi.",
    transmission: "automatique" as const,
    carburant: "diesel" as const,
    ville: "Tunis",
    photos: [
      "https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80",
      "https://images.unsplash.com/photo-1503376763036-066120622c74?w=800&q=80",
    ],
  },
  {
    marque: "Toyota",
    modele: "Corolla",
    annee: 2021,
    kilometrage: 30000,
    prix_reserve: 55000000,
    description: "Toyota Corolla hybride, quasi neuve. Consommation record, fiabilité légendaire.",
    transmission: "automatique" as const,
    carburant: "hybride" as const,
    ville: "Tunis",
    photos: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800&q=80",
    ],
  },
];

async function seed() {
  console.log("🌱 Starting seed...\n");

  // 1. Create users
  const createdUsers: { id: string; email: string; role: string }[] = [];
  for (const user of USERS) {
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", (await supabase.auth.admin.listUsers()).data.users.find((u) => u.email === user.email)?.id ?? "")
      .single();

    if (existing) {
      console.log(`  ⏭️  User ${user.email} already exists`);
      const existingUser = (await supabase.auth.admin.listUsers()).data.users.find((u) => u.email === user.email)!;
      createdUsers.push({ id: existingUser.id, email: user.email, role: user.profile.role });
      continue;
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error(`  ❌ Failed to create user ${user.email}:`, authError?.message);
      continue;
    }

    const userId = authData.user.id;
    console.log(`  ✅ Created user: ${user.email} (${userId})`);

    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      ...user.profile,
    });

    if (profileError) {
      console.error(`  ❌ Failed to create profile for ${user.email}:`, profileError.message);
    } else {
      console.log(`  ✅ Created profile for ${user.email}`);
    }

    createdUsers.push({ id: userId, email: user.email, role: user.profile.role });
  }

  const seller = createdUsers.find((u) => u.role === "seller");
  const buyer = createdUsers.find((u) => u.role === "buyer");
  const admin = createdUsers.find((u) => u.role === "admin");

  // 2. Create wallets for buyer and seller
  for (const user of [buyer, seller]) {
    if (!user) continue;
    const { data: existingWallet } = await supabase
      .from("wallets")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingWallet) {
      console.log(`  ⏭️  Wallet for ${user.email} already exists`);
      continue;
    }

    const { error: walletError } = await supabase.from("wallets").insert({
      user_id: user.id,
      balance: 200000, // 200 DT caution
      status: "active",
      deposit_verified_at: new Date().toISOString(),
    });

    if (walletError) {
      console.error(`  ❌ Wallet for ${user.email}:`, walletError.message);
    } else {
      console.log(`  ✅ Wallet created for ${user.email} (200 DT)`);
    }
  }

  // 3. Create vehicles + auctions
  if (!seller) {
    console.error("  ❌ No seller found, skipping vehicles");
    return;
  }

  for (let i = 0; i < VEHICLES.length; i++) {
    const v = VEHICLES[i];
    const slug = `${v.marque.toLowerCase()}-${v.modele.toLowerCase().replace(/\s+/g, "-")}-${v.annee}-${Date.now()}-${i}`;

    const { data: vehicleData, error: vehicleError } = await supabase
      .from("vehicles")
      .insert({
        seller_id: seller.id,
        marque: v.marque,
        modele: v.modele,
        annee: v.annee,
        kilometrage: v.kilometrage,
        prix_depart: Math.round(v.prix_reserve * 0.7),
        prix_reserve: v.prix_reserve,
        description: v.description,
        transmission: v.transmission,
        carburant: v.carburant,
        origine: "Tunisie",
        slug,
        status: "active",
      })
      .select("id")
      .single();

    if (vehicleError || !vehicleData) {
      console.error(`  ❌ Vehicle ${v.marque} ${v.modele}:`, vehicleError?.message);
      continue;
    }

    console.log(`  ✅ Vehicle created: ${v.marque} ${v.modele}`);

    // Insert photos
    for (let p = 0; p < v.photos.length; p++) {
      await supabase.from("vehicle_photos").insert({
        vehicle_id: vehicleData.id,
        storage_path: v.photos[p],
        is_cover: p === 0,
        display_order: p,
      });
    }

    // Create auction
    const endsAt = new Date(Date.now() + (3 + i) * 24 * 60 * 60 * 1000); // 3-7 days from now
    const startingPrice = Math.round(v.prix_reserve * 0.7);
    const { error: auctionError } = await supabase.from("auctions").insert({
      vehicle_id: vehicleData.id,
      current_price: startingPrice,
      starts_at: new Date().toISOString(),
      ends_at: endsAt.toISOString(),
      status: "active",
    });

    if (auctionError) {
      console.error(`  ❌ Auction for ${v.marque} ${v.modele}:`, auctionError.message);
    } else {
      console.log(`  ✅ Auction created for ${v.marque} ${v.modele} (ends ${endsAt.toLocaleDateString("fr-FR")})`);
    }
  }

  console.log("\n🎉 Seed completed!");
  console.log("\nTest accounts:");
  console.log(`  Admin:    admin@mazadauto.tn / Admin123!`);
  console.log(`  Seller:   vendeur@example.tn / Vendeur123!`);
  console.log(`  Buyer:    acheteur@example.tn / Acheteur123!`);
}

seed().catch(console.error);
