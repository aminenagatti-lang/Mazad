export interface MockVehicle {
  id: string;
  slug: string;
  status: string;
  marque: string;
  modele: string;
  version: string | null;
  annee: number;
  kilometrage: number;
  carburant: string;
  transmission: string;
  couleur: string | null;
  nb_portes: number | null;
  puissance_cv: number | null;
  origine: string;
  prix_depart: number;
  prix_reserve: number | null;
  description: string;
  inspection_date: string;
  inspection_score: number;
  seller_id: string;
  seller_first_name: string;
  seller_last_name: string;
  seller_company_name: string | null;
  seller_type: string | null;
  seller_kyc_status: string;
  seller_member_since: string;
  photos: { id: string; storage_path: string; is_cover: boolean; display_order: number }[];
  inspection_items: { id: string; category: string; label: string; status: "ok" | "warning" | "fail"; note: string | null }[];
  inspection_document?: { storage_path: string; file_name: string } | null;
  auction: {
    id: string;
    current_price: number;
    bid_count: number;
    ends_at: string;
    bids: { bidder_id: string; amount: number; placed_at: string }[];
  };
}

const now = new Date();
const addDays = (d: number, h: number = 0) =>
  new Date(now.getTime() + d * 24 * 60 * 60 * 1000 + h * 60 * 60 * 1000).toISOString();

export const mockVehicles: MockVehicle[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "peugeot-308-allure-2020",
    status: "active",
    marque: "Peugeot", modele: "308", version: "Allure", annee: 2020, kilometrage: 78000,
    carburant: "diesel", transmission: "manuelle", couleur: "Gris Platinium", nb_portes: 5, puissance_cv: 130, origine: "France",
    prix_depart: 42000000, prix_reserve: null,
    description: "Peugeot 308 Allure en excellent etat general. Entretien regulier chez concessionnaire. Carnet complet. Climatisation, GPS, radar de recul, jantes alliage. Importee de France en 2022.",
    inspection_date: now.toISOString(), inspection_score: 85,
    seller_id: "s1", seller_first_name: "Mohamed", seller_last_name: "Khadhraoui", seller_company_name: "Tunisie Auto Location", seller_type: "entreprise", seller_kyc_status: "verified", seller_member_since: "2024-01-15",
    photos: [
      { id: "p1", storage_path: "vehicles/111/1.jpg", is_cover: true, display_order: 0 },
      { id: "p2", storage_path: "vehicles/111/2.jpg", is_cover: false, display_order: 1 },
    ],
    inspection_items: [
      { id: "i1", category: "Moteur", label: "Moteur", status: "ok", note: "Compression OK, pas de fuite" },
      { id: "i2", category: "Carrosserie", label: "Carrosserie", status: "ok", note: "Aucun defaut constate" },
      { id: "i3", category: "Interieur", label: "Interieur", status: "ok", note: "Sieges en cuir bien conserves" },
      { id: "i4", category: "Pneumatiques", label: "Pneumatiques", status: "warning", note: "Usure de 40%, remplacement conseille" },
      { id: "i5", category: "Freins", label: "Freins", status: "ok", note: "Disques et plaquettes OK" },
      { id: "i6", category: "Electricite", label: "Electricite", status: "ok", note: "Tous les systemes fonctionnels" },
    ],
    inspection_document: { storage_path: "#", file_name: "rapport_controle_technique_308.pdf" },
    auction: {
      id: "b1", current_price: 42500000, bid_count: 12, ends_at: addDays(2, 14),
      bids: [
        { bidder_id: "u2", amount: 42500000, placed_at: addDays(0, -0.07) },
        { bidder_id: "u3", amount: 42000000, placed_at: addDays(0, -0.2) },
        { bidder_id: "u2", amount: 41500000, placed_at: addDays(0, -0.5) },
      ],
    },
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    slug: "renault-clio-iv-intens-2018",
    status: "active",
    marque: "Renault", modele: "Clio", version: "IV Intens", annee: 2018, kilometrage: 45000,
    carburant: "essence", transmission: "automatique", couleur: "Blanc Glacier", nb_portes: 5, puissance_cv: 90, origine: "Tunisie",
    prix_depart: 28000000, prix_reserve: 30000000,
    description: "Renault Clio IV Intens, premiere main. Entretien fait chez Renault Tunisie. Distribution neuve, pneus neufs. Parfait etat interieur et exterieur.",
    inspection_date: now.toISOString(), inspection_score: 92,
    seller_id: "s1", seller_first_name: "Mohamed", seller_last_name: "Khadhraoui", seller_company_name: "Tunisie Auto Location", seller_type: "entreprise", seller_kyc_status: "verified", seller_member_since: "2024-01-15",
    photos: [{ id: "p3", storage_path: "vehicles/222/1.jpg", is_cover: true, display_order: 0 }],
    inspection_items: [
      { id: "i7", category: "Moteur", label: "Moteur", status: "ok", note: "Chaines de distribution neuves" },
      { id: "i8", category: "Carrosserie", label: "Carrosserie", status: "ok", note: "1ere main, jamais accidentee" },
      { id: "i9", category: "Interieur", label: "Interieur", status: "ok", note: "Tissu impeccable" },
      { id: "i10", category: "Pneumatiques", label: "Pneumatiques", status: "ok", note: "4 pneus neufs Michelin" },
      { id: "i11", category: "Freins", label: "Freins", status: "ok", note: "Freins avant neufs" },
      { id: "i12", category: "Electricite", label: "Electricite", status: "ok", note: "Ecran R-Link fonctionnel" },
    ],
    inspection_document: { storage_path: "#", file_name: "rapport_controle_technique_clio.pdf" },
    auction: { id: "b2", current_price: 31500000, bid_count: 8, ends_at: addDays(1, 8), bids: [{ bidder_id: "u3", amount: 31500000, placed_at: addDays(0, -1) }] },
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    slug: "volkswagen-passat-carat-2020",
    status: "active",
    marque: "Volkswagen", modele: "Passat", version: "Carat", annee: 2020, kilometrage: 92000,
    carburant: "diesel", transmission: "automatique", couleur: "Noir Intense", nb_portes: 5, puissance_cv: 150, origine: "Allemagne",
    prix_depart: 55000000, prix_reserve: null,
    description: "Volkswagen Passat Carat, motorisation TDI 150 ch. Interieur cuir, toit ouvrant, sieges chauffants. Controle technique a jour. Vehicule de flotte entretenu.",
    inspection_date: now.toISOString(), inspection_score: 88,
    seller_id: "s2", seller_first_name: "Sami", seller_last_name: "Trabelsi", seller_company_name: null, seller_type: "particulier", seller_kyc_status: "verified", seller_member_since: "2024-03-22",
    photos: [{ id: "p4", storage_path: "vehicles/333/1.jpg", is_cover: true, display_order: 0 }],
    inspection_items: [
      { id: "i13", category: "Moteur", label: "Moteur", status: "ok", note: "TDI 150 ch, couple excellent" },
      { id: "i14", category: "Carrosserie", label: "Carrosserie", status: "warning", note: "Legere rayure pare-choc arriere" },
      { id: "i15", category: "Interieur", label: "Interieur", status: "ok", note: "Cuir Nappa entretenu" },
      { id: "i16", category: "Pneumatiques", label: "Pneumatiques", status: "ok", note: "50% d usure restante" },
      { id: "i17", category: "Freins", label: "Freins", status: "ok", note: "Disques ventiles OK" },
      { id: "i18", category: "Electricite", label: "Electricite", status: "ok", note: "Discover Pro OK" },
    ],
    inspection_document: { storage_path: "#", file_name: "rapport_controle_technique_passat.pdf" },
    auction: { id: "b3", current_price: 58000000, bid_count: 5, ends_at: addDays(3, 2), bids: [{ bidder_id: "u2", amount: 58000000, placed_at: addDays(0, -2) }] },
  },
  {
    id: "44444444-4444-4444-4444-444444444444",
    slug: "ford-ranger-wildtrak-2021",
    status: "active",
    marque: "Ford", modele: "Ranger", version: "Wildtrak", annee: 2021, kilometrage: 35000,
    carburant: "diesel", transmission: "automatique", couleur: "Rouge Racing", nb_portes: 4, puissance_cv: 213, origine: "Thailande",
    prix_depart: 72000000, prix_reserve: 75000000,
    description: "Ford Ranger Wildtrak 2.0L Bi-turbo. 4x4, differentiel arriere bloquant. Hayon avec assistence electrique. Camera 360deg, regulateur adaptatif. Parfait pour professionnels.",
    inspection_date: now.toISOString(), inspection_score: 90,
    seller_id: "s2", seller_first_name: "Sami", seller_last_name: "Trabelsi", seller_company_name: null, seller_type: "particulier", seller_kyc_status: "verified", seller_member_since: "2024-03-22",
    photos: [{ id: "p5", storage_path: "vehicles/444/1.jpg", is_cover: true, display_order: 0 }],
    inspection_items: [
      { id: "i19", category: "Moteur", label: "Moteur", status: "ok", note: "Bi-turbo 213 ch, puissance nominale" },
      { id: "i20", category: "Carrosserie", label: "Carrosserie", status: "ok", note: "Protections de benne installees" },
      { id: "i21", category: "Interieur", label: "Interieur", status: "ok", note: "Cuir/suede sport Wildtrak" },
      { id: "i22", category: "Pneumatiques", label: "Pneumatiques", status: "ok", note: "Pneus tout-terrain BF Goodrich" },
      { id: "i23", category: "Freins", label: "Freins", status: "warning", note: "Plaquettes arriere a 30%" },
      { id: "i24", category: "Electricite", label: "Electricite", status: "ok", note: "Camera 360deg, SYNC 3" },
    ],
    inspection_document: { storage_path: "#", file_name: "rapport_controle_technique_ranger.pdf" },
    auction: { id: "b4", current_price: 74500000, bid_count: 18, ends_at: addDays(4, 6), bids: [{ bidder_id: "u2", amount: 74500000, placed_at: addDays(0, -0.13) }] },
  },
  {
    id: "55555555-5555-5555-5555-555555555555",
    slug: "hyundai-tucson-executive-2019",
    status: "active",
    marque: "Hyundai", modele: "Tucson", version: "Executive", annee: 2019, kilometrage: 62000,
    carburant: "essence", transmission: "automatique", couleur: "Bleu Ocean", nb_portes: 5, puissance_cv: 177, origine: "Coree du Sud",
    prix_depart: 46000000, prix_reserve: null,
    description: "Hyundai Tucson Executive, motorisation 1.6 T-GDi. Toit panoramique, sieges electriques, affichage tete haute. Full LED, freinage d urgence automatique.",
    inspection_date: now.toISOString(), inspection_score: 87,
    seller_id: "s3", seller_first_name: "Karim", seller_last_name: "Ben Ali", seller_company_name: null, seller_type: "particulier", seller_kyc_status: "verified", seller_member_since: "2024-02-10",
    photos: [{ id: "p6", storage_path: "vehicles/555/1.jpg", is_cover: true, display_order: 0 }],
    inspection_items: [
      { id: "i25", category: "Moteur", label: "Moteur", status: "ok", note: "T-GDi 177 ch, turbo recent" },
      { id: "i26", category: "Carrosserie", label: "Carrosserie", status: "ok", note: "Peinture metallisee impeccable" },
      { id: "i27", category: "Interieur", label: "Interieur", status: "ok", note: "Cuir noir, sieges electriques" },
      { id: "i28", category: "Pneumatiques", label: "Pneumatiques", status: "ok", note: "Continental PremiumContact" },
      { id: "i29", category: "Freins", label: "Freins", status: "ok", note: "Freinage electrique OK" },
      { id: "i30", category: "Electricite", label: "Electricite", status: "warning", note: "Capteur de pluie a calibrer" },
    ],
    inspection_document: { storage_path: "#", file_name: "rapport_controle_technique_tucson.pdf" },
    auction: { id: "b5", current_price: 46800000, bid_count: 3, ends_at: addDays(1, 22), bids: [{ bidder_id: "u3", amount: 46800000, placed_at: addDays(0, -3) }] },
  },
  {
    id: "66666666-6666-6666-6666-666666666666",
    slug: "bmw-serie-3-320d-msport-2019",
    status: "active",
    marque: "BMW", modele: "Serie 3", version: "320d M Sport", annee: 2019, kilometrage: 55000,
    carburant: "diesel", transmission: "automatique", couleur: "Gris Mineral", nb_portes: 4, puissance_cv: 190, origine: "Allemagne",
    prix_depart: 68000000, prix_reserve: 70000000,
    description: "BMW 320d M Sport, pack esthetique M. Jantes 19 pouces, suspensions sport, volant M. Interieur Alcantara, iDrive Pro. Historique entretien BMW complet.",
    inspection_date: now.toISOString(), inspection_score: 94,
    seller_id: "s3", seller_first_name: "Karim", seller_last_name: "Ben Ali", seller_company_name: null, seller_type: "particulier", seller_kyc_status: "verified", seller_member_since: "2024-02-10",
    photos: [{ id: "p7", storage_path: "vehicles/666/1.jpg", is_cover: true, display_order: 0 }],
    inspection_items: [
      { id: "i31", category: "Moteur", label: "Moteur", status: "ok", note: "B47, couple lineaire, pas de fumee" },
      { id: "i32", category: "Carrosserie", label: "Carrosserie", status: "ok", note: "Pack M, jantes 19 sans eclat" },
      { id: "i33", category: "Interieur", label: "Interieur", status: "ok", note: "Alcantara, volant M chauffant" },
      { id: "i34", category: "Pneumatiques", label: "Pneumatiques", status: "ok", note: "Michelin Pilot Sport 4" },
      { id: "i35", category: "Freins", label: "Freins", status: "ok", note: "Etriers M bleu, disques OK" },
      { id: "i36", category: "Electricite", label: "Electricite", status: "ok", note: "iDrive Pro, affichage tete haute" },
    ],
    auction: { id: "b6", current_price: 69500000, bid_count: 7, ends_at: addDays(5, 12), bids: [{ bidder_id: "u2", amount: 69500000, placed_at: addDays(0, -5) }] },
  },
  {
    id: "77777777-7777-7777-7777-777777777777",
    slug: "toyota-corolla-design-2021",
    status: "active",
    marque: "Toyota", modele: "Corolla", version: "Design", annee: 2021, kilometrage: 28000,
    carburant: "hybride", transmission: "automatique", couleur: "Gris Eclipse", nb_portes: 5, puissance_cv: 122, origine: "Japon",
    prix_depart: 38000000, prix_reserve: null,
    description: "Toyota Corolla Hybride 122ch Design. Consommation moyenne 4.2L/100km. Systeme Toyota Safety Sense, ecran 10 pouces, Apple CarPlay. Garantie constructeur encore active.",
    inspection_date: now.toISOString(), inspection_score: 96,
    seller_id: "s1", seller_first_name: "Mohamed", seller_last_name: "Khadhraoui", seller_company_name: "Tunisie Auto Location", seller_type: "entreprise", seller_kyc_status: "verified", seller_member_since: "2024-01-15",
    photos: [{ id: "p8", storage_path: "vehicles/777/1.jpg", is_cover: true, display_order: 0 }],
    inspection_items: [
      { id: "i37", category: "Moteur", label: "Moteur", status: "ok", note: "Hybride, batterie a 98% SOH" },
      { id: "i38", category: "Carrosserie", label: "Carrosserie", status: "ok", note: "Aucune rayure, 1ere main" },
      { id: "i39", category: "Interieur", label: "Interieur", status: "ok", note: "Tissu Design neuf" },
      { id: "i40", category: "Pneumatiques", label: "Pneumatiques", status: "ok", note: "Dunlop Sport, 80% restant" },
      { id: "i41", category: "Freins", label: "Freins", status: "ok", note: "Freinage regeneratif + disques OK" },
      { id: "i42", category: "Electricite", label: "Electricite", status: "ok", note: "Toyota Safety Sense 2.0 complet" },
    ],
    auction: { id: "b7", current_price: 39500000, bid_count: 9, ends_at: addDays(2, 4), bids: [{ bidder_id: "u3", amount: 39500000, placed_at: addDays(0, -2) }] },
  },
  {
    id: "88888888-8888-8888-8888-888888888888",
    slug: "mercedes-classe-c-220d-2020",
    status: "active",
    marque: "Mercedes", modele: "Classe C", version: "220d Avantgarde", annee: 2020, kilometrage: 48000,
    carburant: "diesel", transmission: "automatique", couleur: "Argent Iridium", nb_portes: 4, puissance_cv: 194, origine: "Allemagne",
    prix_depart: 72000000, prix_reserve: 78000000,
    description: "Mercedes Classe C 220d Avantgarde. Interieur Artico cuir noir, ambiance 64 couleurs. MBUX avec Hey Mercedes, stationnement autonome. Carnet digital Mercedes.",
    inspection_date: now.toISOString(), inspection_score: 91,
    seller_id: "s2", seller_first_name: "Sami", seller_last_name: "Trabelsi", seller_company_name: null, seller_type: "particulier", seller_kyc_status: "verified", seller_member_since: "2024-03-22",
    photos: [{ id: "p9", storage_path: "vehicles/888/1.jpg", is_cover: true, display_order: 0 }],
    inspection_items: [
      { id: "i43", category: "Moteur", label: "Moteur", status: "ok", note: "OM654, couple excellent" },
      { id: "i44", category: "Carrosserie", label: "Carrosserie", status: "ok", note: "Aucun defaut, traitement ceramique" },
      { id: "i45", category: "Interieur", label: "Interieur", status: "ok", note: "Artico cuir, 64 couleurs LED" },
      { id: "i46", category: "Pneumatiques", label: "Pneumatiques", status: "ok", note: "Michelin Primacy 4, 60%" },
      { id: "i47", category: "Freins", label: "Freins", status: "warning", note: "Disques avant a remplacer sous 5000km" },
      { id: "i48", category: "Electricite", label: "Electricite", status: "ok", note: "MBUX, Hey Mercedes, parking auto" },
    ],
    auction: { id: "b8", current_price: 73500000, bid_count: 4, ends_at: addDays(6, 8), bids: [{ bidder_id: "u2", amount: 73500000, placed_at: addDays(0, -1.5) }] },
  },
  {
    id: "99999999-9999-9999-9999-999999999999",
    slug: "kia-sportage-gtline-2020",
    status: "active",
    marque: "Kia", modele: "Sportage", version: "GT Line", annee: 2020, kilometrage: 41000,
    carburant: "diesel", transmission: "automatique", couleur: "Blanc White Pearl", nb_portes: 5, puissance_cv: 136, origine: "Coree du Sud",
    prix_depart: 42000000, prix_reserve: null,
    description: "Kia Sportage GT Line, look sportif avec boucliers specifiques. Jantes 19 pouces, echappement double sortie. Systeme audio JBL, sieges chauffants et ventiles.",
    inspection_date: now.toISOString(), inspection_score: 89,
    seller_id: "s3", seller_first_name: "Karim", seller_last_name: "Ben Ali", seller_company_name: null, seller_type: "particulier", seller_kyc_status: "verified", seller_member_since: "2024-02-10",
    photos: [{ id: "p10", storage_path: "vehicles/999/1.jpg", is_cover: true, display_order: 0 }],
    inspection_items: [
      { id: "i49", category: "Moteur", label: "Moteur", status: "ok", note: "CRDi 136 ch, couple satisfaisant" },
      { id: "i50", category: "Carrosserie", label: "Carrosserie", status: "ok", note: "GT Line, look sportif intact" },
      { id: "i51", category: "Interieur", label: "Interieur", status: "ok", note: "Cuir rouge surpiqures rouges" },
      { id: "i52", category: "Pneumatiques", label: "Pneumatiques", status: "ok", note: "Continental 4x4 Contact" },
      { id: "i53", category: "Freins", label: "Freins", status: "ok", note: "Freins OK" },
      { id: "i54", category: "Electricite", label: "Electricite", status: "ok", note: "JBL, camera, affichage 8\"" },
    ],
    auction: { id: "b9", current_price: 43500000, bid_count: 6, ends_at: addDays(3, 18), bids: [{ bidder_id: "u3", amount: 43500000, placed_at: addDays(0, -2.5) }] },
  },
  {
    id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    slug: "citroen-c5-aircross-shine-2021",
    status: "active",
    marque: "Citroen", modele: "C5 Aircross", version: "Shine", annee: 2021, kilometrage: 32000,
    carburant: "essence", transmission: "automatique", couleur: "Bleu Lazuli", nb_portes: 5, puissance_cv: 180, origine: "France",
    prix_depart: 52000000, prix_reserve: 55000000,
    description: "Citroen C5 Aircross Shine, motorisation PureTech 180 EAT8. Suspensions a butees hydrauliques progressives, sieges Advanced Comfort. Hayon electrique, camera de recul.",
    inspection_date: now.toISOString(), inspection_score: 93,
    seller_id: "s1", seller_first_name: "Mohamed", seller_last_name: "Khadhraoui", seller_company_name: "Tunisie Auto Location", seller_type: "entreprise", seller_kyc_status: "verified", seller_member_since: "2024-01-15",
    photos: [{ id: "p11", storage_path: "vehicles/aaa/1.jpg", is_cover: true, display_order: 0 }],
    inspection_items: [
      { id: "i55", category: "Moteur", label: "Moteur", status: "ok", note: "PureTech 180, pas de calage" },
      { id: "i56", category: "Carrosserie", label: "Carrosserie", status: "ok", note: "Airbumps sans marque" },
      { id: "i57", category: "Interieur", label: "Interieur", status: "ok", note: "Advanced Comfort, sieges larges" },
      { id: "i58", category: "Pneumatiques", label: "Pneumatiques", status: "ok", note: "Michelin Primacy SUV+" },
      { id: "i59", category: "Freins", label: "Freins", status: "ok", note: "Freinage progressif OK" },
      { id: "i60", category: "Electricite", label: "Electricite", status: "warning", note: "Mise a jour cartographie conseillee" },
    ],
    auction: { id: "b10", current_price: 54000000, bid_count: 11, ends_at: addDays(1, 3), bids: [{ bidder_id: "u2", amount: 54000000, placed_at: addDays(0, -0.25) }] },
  },
];
