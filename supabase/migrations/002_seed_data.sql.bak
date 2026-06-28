-- ============================================================
-- SEED DATA: 10 realistic mock vehicles with auctions for MazadAuto
-- Run this after applying 001_initial_schema.sql
-- ============================================================

-- Insert seller profile (required for vehicles). 
-- In real usage this would be an auth.users row. For seed we insert manually for demo.
-- NOTE: Replace '00000000-0000-0000-0000-000000000001' with a real auth user UUID if testing with a real account.

INSERT INTO profiles (id, role, seller_type, first_name, last_name, phone, city, company_name, matricule_fiscal, kyc_status, kyc_verified_at, deposit_paid, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'seller', 'entreprise', 'Mohamed', 'Khadhraoui', '+216 71 123 456', 'Tunis', 'Tunisie Auto Location', '1234567/A/B/C/000', 'verified', now(), false, now()),
  ('00000000-0000-0000-0000-000000000002', 'seller', 'particulier', 'Sami', 'Trabelsi', '+216 20 987 654', 'Sfax', null, null, 'verified', now(), false, now()),
  ('00000000-0000-0000-0000-000000000003', 'seller', 'particulier', 'Karim', 'Ben Ali', '+216 50 111 222', 'Ariana', null, null, 'verified', now(), false, now())
ON CONFLICT (id) DO NOTHING;

-- Insert vehicles
INSERT INTO vehicles (id, seller_id, status, marque, modele, version, annee, kilometrage, carburant, transmission, couleur, nb_portes, puissance_cv, origine, prix_depart, prix_reserve, description, slug, inspection_date, inspection_score, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'active', 'Peugeot', '308', 'Allure', 2020, 78000, 'diesel', 'manuelle', 'Gris Platinium', 5, 130, 'France', 42000000, null, 'Peugeot 308 Allure en excellent état général. Entretien régulier chez concessionnaire. Carnet complet. Climatisation, GPS, radar de recul, jantes alliage. Importée de France en 2022.', 'peugeot-308-allure-2020', now(), 85, now()),
  
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000001', 'active', 'Renault', 'Clio', 'IV Intens', 2018, 45000, 'essence', 'automatique', 'Blanc Glacier', 5, 90, 'Tunisie', 28000000, 30000000, 'Renault Clio IV Intens, première main. Entretien fait chez Renault Tunisie. Distribution neuve, pneus neufs. Parfait état intérieur et extérieur.', 'renault-clio-iv-intens-2018', now(), 92, now()),
  
  ('33333333-3333-3333-3333-333333333333', '00000000-0000-0000-0000-000000000002', 'active', 'Volkswagen', 'Passat', 'Carat', 2020, 92000, 'diesel', 'automatique', 'Noir Intense', 5, 150, 'Allemagne', 55000000, null, 'Volkswagen Passat Carat, motorisation TDI 150 ch. Intérieur cuir, toit ouvrant, sièges chauffants. Contrôle technique à jour. Véhicule de flotte entretenu.', 'volkswagen-passat-carat-2020', now(), 88, now()),
  
  ('44444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000002', 'active', 'Ford', 'Ranger', 'Wildtrak', 2021, 35000, 'diesel', 'automatique', 'Rouge Racing', 4, 213, 'Thaïlande', 72000000, 75000000, 'Ford Ranger Wildtrak 2.0L Bi-turbo. 4x4, différentiel arrière bloquant. Hayon avec assistence électrique. Caméra 360°, régulateur adaptatif. Parfait pour professionnels.', 'ford-ranger-wildtrak-2021', now(), 90, now()),
  
  ('55555555-5555-5555-5555-555555555555', '00000000-0000-0000-0000-000000000003', 'active', 'Hyundai', 'Tucson', 'Executive', 2019, 62000, 'essence', 'automatique', 'Bleu Ocean', 5, 177, 'Corée du Sud', 46000000, null, 'Hyundai Tucson Executive, motorisation 1.6 T-GDi. Toit panoramique, sièges électriques, affichage tête haute. Full LED, freinage d''urgence automatique.', 'hyundai-tucson-executive-2019', now(), 87, now()),
  
  ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000003', 'active', 'BMW', 'Série 3', '320d M Sport', 2019, 55000, 'diesel', 'automatique', 'Gris Minéral', 4, 190, 'Allemagne', 68000000, 70000000, 'BMW 320d M Sport, pack esthétique M. Jantes 19 pouces, suspensions sport, volant M. Intérieur Alcantara, iDrive Pro. Historique entretien BMW complet.', 'bmw-serie-3-320d-msport-2019', now(), 94, now()),
  
  ('77777777-7777-7777-7777-777777777777', '00000000-0000-0000-0000-000000000001', 'active', 'Toyota', 'Corolla', 'Design', 2021, 28000, 'hybride', 'automatique', 'Gris Eclipse', 5, 122, 'Japon', 38000000, null, 'Toyota Corolla Hybride 122ch Design. Consommation moyenne 4.2L/100km. Système Toyota Safety Sense, écran 10 pouces, Apple CarPlay. Garantie constructeur encore active.', 'toyota-corolla-design-2021', now(), 96, now()),
  
  ('88888888-8888-8888-8888-888888888888', '00000000-0000-0000-0000-000000000002', 'active', 'Mercedes', 'Classe C', '220d Avantgarde', 2020, 48000, 'diesel', 'automatique', 'Argent Iridium', 4, 194, 'Allemagne', 72000000, 78000000, 'Mercedes Classe C 220d Avantgarde. Intérieur Artico cuir noir, ambiance 64 couleurs. MBUX avec Hey Mercedes, stationnement autonome. Carnet digital Mercedes.', 'mercedes-classe-c-220d-2020', now(), 91, now()),
  
  ('99999999-9999-9999-9999-999999999999', '00000000-0000-0000-0000-000000000003', 'active', 'Kia', 'Sportage', 'GT Line', 2020, 41000, 'diesel', 'automatique', 'Blanc White Pearl', 5, 136, 'Corée du Sud', 42000000, null, 'Kia Sportage GT Line, look sportif avec boucliers spécifiques. Jantes 19 pouces, échappement double sortie. Système audio JBL, sièges chauffants et ventilés.', 'kia-sportage-gtline-2020', now(), 89, now()),
  
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', 'active', 'Citroën', 'C5 Aircross', 'Shine', 2021, 32000, 'essence', 'automatique', 'Bleu Lazuli', 5, 180, 'France', 52000000, 55000000, 'Citroën C5 Aircross Shine, motorisation PureTech 180 EAT8. Suspensions à butées hydrauliques progressives, sièges Advanced Comfort. Hayon électrique, caméra de recul.', 'citroen-c5-aircross-shine-2021', now(), 93, now());

-- Insert inspection items for each vehicle
INSERT INTO inspection_items (vehicle_id, category, label, status, note)
VALUES
  -- Peugeot 308
  ('11111111-1111-1111-1111-111111111111', 'Moteur', 'Moteur', 'ok', 'Compression OK, pas de fuite'),
  ('11111111-1111-1111-1111-111111111111', 'Carrosserie', 'Carrosserie', 'ok', 'Aucun défaut constaté'),
  ('11111111-1111-1111-1111-111111111111', 'Intérieur', 'Intérieur', 'ok', 'Sièges en cuir bien conservés'),
  ('11111111-1111-1111-1111-111111111111', 'Pneumatiques', 'Pneumatiques', 'warning', 'Usure de 40%, remplacement conseillé'),
  ('11111111-1111-1111-1111-111111111111', 'Freins', 'Freins', 'ok', 'Disques et plaquettes OK'),
  ('11111111-1111-1111-1111-111111111111', 'Électricité', 'Électricité', 'ok', 'Tous les systèmes fonctionnels'),
  -- Renault Clio
  ('22222222-2222-2222-2222-222222222222', 'Moteur', 'Moteur', 'ok', 'Chaines de distribution neuves'),
  ('22222222-2222-2222-2222-222222222222', 'Carrosserie', 'Carrosserie', 'ok', '1ère main, jamais accidentée'),
  ('22222222-2222-2222-2222-222222222222', 'Intérieur', 'Intérieur', 'ok', 'Tissu impeccable'),
  ('22222222-2222-2222-2222-222222222222', 'Pneumatiques', 'Pneumatiques', 'ok', '4 pneus neufs Michelin'),
  ('22222222-2222-2222-2222-222222222222', 'Freins', 'Freins', 'ok', 'Freins avant neufs'),
  ('22222222-2222-2222-2222-222222222222', 'Électricité', 'Électricité', 'ok', 'Ecran R-Link fonctionnel'),
  -- VW Passat
  ('33333333-3333-3333-3333-333333333333', 'Moteur', 'Moteur', 'ok', 'TDI 150 ch, couple excellent'),
  ('33333333-3333-3333-3333-333333333333', 'Carrosserie', 'Carrosserie', 'warning', 'Légère rayure pare-choc arrière'),
  ('33333333-3333-3333-3333-333333333333', 'Intérieur', 'Intérieur', 'ok', 'Cuir Nappa entretenu'),
  ('33333333-3333-3333-3333-333333333333', 'Pneumatiques', 'Pneumatiques', 'ok', '50% d''usure restante'),
  ('33333333-3333-3333-3333-333333333333', 'Freins', 'Freins', 'ok', 'Disques ventilés OK'),
  ('33333333-3333-3333-3333-333333333333', 'Électricité', 'Électricité', 'ok', 'Discover Pro OK'),
  -- Ford Ranger
  ('44444444-4444-4444-4444-444444444444', 'Moteur', 'Moteur', 'ok', 'Bi-turbo 213 ch, puissance nominale'),
  ('44444444-4444-4444-4444-444444444444', 'Carrosserie', 'Carrosserie', 'ok', 'Protections de benne installées'),
  ('44444444-4444-4444-4444-444444444444', 'Intérieur', 'Intérieur', 'ok', 'Cuir/suede sport Wildtrak'),
  ('44444444-4444-4444-4444-444444444444', 'Pneumatiques', 'Pneumatiques', 'ok', 'Pneus tout-terrain BF Goodrich'),
  ('44444444-4444-4444-4444-444444444444', 'Freins', 'Freins', 'warning', 'Plaquettes arrière à 30%'),
  ('44444444-4444-4444-4444-444444444444', 'Électricité', 'Électricité', 'ok', 'Caméra 360°, SYNC 3'),
  -- Hyundai Tucson
  ('55555555-5555-5555-5555-555555555555', 'Moteur', 'Moteur', 'ok', 'T-GDi 177 ch, turbo récent'),
  ('55555555-5555-5555-5555-555555555555', 'Carrosserie', 'Carrosserie', 'ok', 'Peinture métallisée impeccable'),
  ('55555555-5555-5555-5555-555555555555', 'Intérieur', 'Intérieur', 'ok', 'Cuir noir, sièges électriques'),
  ('55555555-5555-5555-5555-555555555555', 'Pneumatiques', 'Pneumatiques', 'ok', 'Continental PremiumContact'),
  ('55555555-5555-5555-5555-555555555555', 'Freins', 'Freins', 'ok', 'Freinage électrique OK'),
  ('55555555-5555-5555-5555-555555555555', 'Électricité', 'Électricité', 'warning', 'Capteur de pluie à calibrer'),
  -- BMW Série 3
  ('66666666-6666-6666-6666-666666666666', 'Moteur', 'Moteur', 'ok', 'B47, couple linéaire, pas de fumée'),
  ('66666666-6666-6666-6666-666666666666', 'Carrosserie', 'Carrosserie', 'ok', 'Pack M, jantes 19 sans éclat'),
  ('66666666-6666-6666-6666-666666666666', 'Intérieur', 'Intérieur', 'ok', 'Alcantara, volant M chauffant'),
  ('66666666-6666-6666-6666-666666666666', 'Pneumatiques', 'Pneumatiques', 'ok', 'Michelin Pilot Sport 4'),
  ('66666666-6666-6666-6666-666666666666', 'Freins', 'Freins', 'ok', 'Étriers M bleu, disques OK'),
  ('66666666-6666-6666-6666-666666666666', 'Électricité', 'Électricité', 'ok', 'iDrive Pro, affichage tête haute'),
  -- Toyota Corolla
  ('77777777-7777-7777-7777-777777777777', 'Moteur', 'Moteur', 'ok', 'Hybride, batterie à 98% SOH'),
  ('77777777-7777-7777-7777-777777777777', 'Carrosserie', 'Carrosserie', 'ok', 'Aucune rayure, 1ère main'),
  ('77777777-7777-7777-7777-777777777777', 'Intérieur', 'Intérieur', 'ok', 'Tissu Design neuf'),
  ('77777777-7777-7777-7777-777777777777', 'Pneumatiques', 'Pneumatiques', 'ok', 'Dunlop Sport, 80% restant'),
  ('77777777-7777-7777-7777-777777777777', 'Freins', 'Freins', 'ok', 'Freinage régénératif + disques OK'),
  ('77777777-7777-7777-7777-777777777777', 'Électricité', 'Électricité', 'ok', 'Toyota Safety Sense 2.0 complet'),
  -- Mercedes Classe C
  ('88888888-8888-8888-8888-888888888888', 'Moteur', 'Moteur', 'ok', 'OM654, couple excellent'),
  ('88888888-8888-8888-8888-888888888888', 'Carrosserie', 'Carrosserie', 'ok', 'Aucun défaut, traitement céramique'),
  ('88888888-8888-8888-8888-888888888888', 'Intérieur', 'Intérieur', 'ok', 'Artico cuir, 64 couleurs LED'),
  ('88888888-8888-8888-8888-888888888888', 'Pneumatiques', 'Pneumatiques', 'ok', 'Michelin Primacy 4, 60%'),
  ('88888888-8888-8888-8888-888888888888', 'Freins', 'Freins', 'warning', 'Disques avant à remplacer sous 5000km'),
  ('88888888-8888-8888-8888-888888888888', 'Électricité', 'Électricité', 'ok', 'MBUX, Hey Mercedes, parking auto'),
  -- Kia Sportage
  ('99999999-9999-9999-9999-999999999999', 'Moteur', 'Moteur', 'ok', 'CRDi 136 ch, couple satisfaisant'),
  ('99999999-9999-9999-9999-999999999999', 'Carrosserie', 'Carrosserie', 'ok', 'GT Line, look sportif intact'),
  ('99999999-9999-9999-9999-999999999999', 'Intérieur', 'Intérieur', 'ok', 'Cuir rouge surpiqûres rouges'),
  ('99999999-9999-9999-9999-999999999999', 'Pneumatiques', 'Pneumatiques', 'ok', 'Continental 4x4 Contact'),
  ('99999999-9999-9999-9999-999999999999', 'Freins', 'Freins', 'ok', 'Freins OK'),
  ('99999999-9999-9999-9999-999999999999', 'Électricité', 'Électricité', 'ok', 'JBL, caméra, affichage 8"'),
  -- Citroën C5 Aircross
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Moteur', 'Moteur', 'ok', 'PureTech 180, pas de calage'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Carrosserie', 'Carrosserie', 'ok', 'Airbumps sans marque'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Intérieur', 'Intérieur', 'ok', 'Advanced Comfort, sièges larges'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pneumatiques', 'Pneumatiques', 'ok', 'Michelin Primacy SUV+'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Freins', 'Freins', 'ok', 'Freinage progressif OK'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Électricité', 'Électricité', 'warning', 'Mise à jour cartographie conseillée');

-- Insert auctions (ends in future)
INSERT INTO auctions (id, vehicle_id, status, starts_at, ends_at, current_price, bid_count, created_at)
VALUES
  ('b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'active', now(), now() + interval '2 days 14 hours', 42500000, 12, now()),
  ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'active', now(), now() + interval '1 day 8 hours', 31500000, 8, now()),
  ('b3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'active', now(), now() + interval '3 days 2 hours', 58000000, 5, now()),
  ('b4444444-4444-4444-4444-444444444444', '44444444-4444-4444-4444-444444444444', 'active', now(), now() + interval '4 days 6 hours', 74500000, 18, now()),
  ('b5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'active', now(), now() + interval '1 day 22 hours', 46800000, 3, now()),
  ('b6666666-6666-6666-6666-666666666666', '66666666-6666-6666-6666-666666666666', 'active', now(), now() + interval '5 days 12 hours', 69500000, 7, now()),
  ('b7777777-7777-7777-7777-777777777777', '77777777-7777-7777-7777-777777777777', 'active', now(), now() + interval '2 days 4 hours', 39500000, 9, now()),
  ('b8888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888888', 'active', now(), now() + interval '6 days 8 hours', 73500000, 4, now()),
  ('b9999999-9999-9999-9999-999999999999', '99999999-9999-9999-9999-999999999999', 'active', now(), now() + interval '3 days 18 hours', 43500000, 6, now()),
  ('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'active', now(), now() + interval '1 day 3 hours', 54000000, 11, now());

-- Insert mock bids
INSERT INTO bids (auction_id, bidder_id, amount, status, placed_at)
VALUES
  ('b1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 42500000, 'active', now() - interval '4 minutes'),
  ('b1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000003', 42000000, 'outbid', now() - interval '12 minutes'),
  ('b1111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000002', 41500000, 'outbid', now() - interval '28 minutes'),
  ('b2222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000003', 31500000, 'active', now() - interval '1 hour'),
  ('b4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000002', 74500000, 'active', now() - interval '8 minutes'),
  ('b4444444-4444-4444-4444-444444444444', '00000000-0000-0000-0000-000000000003', 74000000, 'outbid', now() - interval '25 minutes'),
  ('baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000002', 54000000, 'active', now() - interval '15 minutes');
