const logo = `<div style="text-align:center;margin-bottom:24px"><span style="font-size:22px;font-weight:800"><span style="color:#111827">Mazad</span><span style="color:#16a34a">Auto</span></span></div>`;

const footer = `
<div style="border-top:1px solid #e5e7eb;margin-top:32px;padding-top:16px">
  <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">MazadAuto — Enchères de véhicules en Tunisie</p>
  <p style="font-size:12px;color:#9ca3af;text-align:center;margin-top:4px"><a href="#" style="color:#9ca3af;text-decoration:underline">Se désabonner</a></p>
</div>`;

const wrapper = (content: string) => `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="background-color:#f6f7f9;margin:0;padding:0;font-family:Inter,sans-serif">
  <div style="max-width:600px;margin:0 auto;background-color:#ffffff;padding:32px">
    ${logo}
    ${content}
    ${footer}
  </div>
</body>
</html>`;

export function welcomeBuyerHtml(firstName: string | null) {
  const name = firstName ?? "there";
  return wrapper(`
    <div>
      <h1 style="font-size:28px;font-weight:700;color:#111827;margin-bottom:16px">Bienvenue ${name} !</h1>
      <p style="font-size:16px;line-height:24px;color:#374151">Votre compte acheteur a été créé avec succès. Vous faites maintenant partie de la communauté MazadAuto.</p>
    </div>
    <div style="background-color:#fef9c3;border-radius:8px;padding:16px;margin-top:24px;margin-bottom:24px">
      <p style="font-size:14px;color:#854d0e;margin:0;line-height:20px"><strong>Prochaine étape :</strong> Pour enchérir, votre identité doit être vérifiée. Délai habituel : 24-48h.</p>
    </div>
    <div style="text-align:center;margin-bottom:32px">
      <a href="https://mazadauto.tn/inscription/nouveau" style="background-color:#16a34a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">Compléter ma vérification</a>
    </div>
    <div>
      <p style="font-size:14px;font-weight:700;color:#111827;margin-bottom:12px">Votre parcours en 3 étapes :</p>
      <div style="display:table;width:100%">
        <div style="display:table-cell;width:33%;text-align:center;padding:8px"><span style="font-size:24px">1️⃣</span><p style="font-size:12px;color:#374151;margin-top:4px">Vérification</p></div>
        <div style="display:table-cell;width:33%;text-align:center;padding:8px"><span style="font-size:24px">2️⃣</span><p style="font-size:12px;color:#374151;margin-top:4px">Enchérir</p></div>
        <div style="display:table-cell;width:33%;text-align:center;padding:8px"><span style="font-size:24px">3️⃣</span><p style="font-size:12px;color:#374151;margin-top:4px">Remporter</p></div>
      </div>
    </div>
  `);
}

export function welcomeSellerHtml(firstName: string | null) {
  const name = firstName ?? "there";
  return wrapper(`
    <div>
      <h1 style="font-size:28px;font-weight:700;color:#111827;margin-bottom:16px">Dossier reçu ✓</h1>
      <p style="font-size:16px;line-height:24px;color:#374151">Bonjour ${name}, nous avons bien reçu votre dossier vendeur. Notre équipe l'examine sous 24-48h.</p>
    </div>
    <div style="margin-top:24px;margin-bottom:24px">
      <p style="font-size:14px;font-weight:700;color:#111827;margin-bottom:12px">Que se passe-t-il ensuite ?</p>
      <p style="font-size:14px;line-height:24px;color:#374151;margin:0">1. Examen de vos documents</p>
      <p style="font-size:14px;line-height:24px;color:#374151;margin:0">2. Validation de votre compte</p>
      <p style="font-size:14px;line-height:24px;color:#374151;margin:0">3. Mise en ligne de vos véhicules</p>
    </div>
    <div style="background-color:#f0fdf4;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="font-size:14px;color:#166534;margin:0;line-height:20px">Vous recevrez un email dès que votre compte est activé.</p>
    </div>
  `);
}

export function kycApprovedHtml(firstName: string | null, role: string) {
  const name = firstName ?? "there";
  const isBuyer = role === "buyer";
  return wrapper(`
    <div style="text-align:center;margin-bottom:24px">
      <span style="font-size:48px;line-height:48px">✓</span>
      <p style="font-size:14px;color:#16a34a;font-weight:700;margin-top:8px">Compte vérifié</p>
    </div>
    <div>
      <h1 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:12px">Félicitations ${name}, votre identité a été vérifiée !</h1>
      <p style="font-size:16px;line-height:24px;color:#374151">${isBuyer ? "Vous pouvez maintenant placer des enchères sur tous les véhicules disponibles." : "Vous pouvez maintenant mettre vos véhicules aux enchères."}</p>
    </div>
    <div style="text-align:center;margin-top:32px;margin-bottom:32px">
      <a href="${isBuyer ? "https://mazadauto.tn/encheres" : "https://mazadauto.tn/dashboard/vendeur/vehicules/nouveau"}" style="background-color:#16a34a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">${isBuyer ? "Voir les enchères en cours" : "Mettre un véhicule en vente"}</a>
    </div>
  `);
}

export function kycRejectedHtml(firstName: string | null, reason: string) {
  const name = firstName ?? "there";
  return wrapper(`
    <div style="text-align:center;margin-bottom:24px">
      <span style="font-size:40px;line-height:40px">⚠️</span>
      <p style="font-size:14px;color:#b45309;font-weight:700;margin-top:8px">Action requise</p>
    </div>
    <div>
      <h1 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:12px">Bonjour ${name}, votre vérification n'a pas abouti</h1>
    </div>
    <div style="background-color:#fef2f2;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="font-size:14px;color:#991b1b;margin:0;line-height:20px"><strong>Raison :</strong> ${reason}</p>
    </div>
    <div style="margin-bottom:24px">
      <p style="font-size:14px;font-weight:700;color:#111827;margin-bottom:8px">Que faire ?</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">• Vérifiez que vos documents sont lisibles</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">• Assurez-vous que les 4 coins sont visibles</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">• Le document doit être en cours de validité</p>
    </div>
    <div style="text-align:center;margin-bottom:24px">
      <a href="https://mazadauto.tn/dashboard" style="background-color:#16a34a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">Resoumettre mes documents</a>
    </div>
    <p style="font-size:13px;color:#6b7280;text-align:center">Besoin d'aide ? <a href="mailto:contact@mazadauto.tn" style="color:#16a34a;text-decoration:underline">contact@mazadauto.tn</a></p>
  `);
}

export function outbidHtml(
  firstName: string | null,
  vehicleName: string,
  vehicleSlug: string,
  currentBid: number,
  myBid: number,
  endsAt: string
) {
  const name = firstName ?? "there";
  const endDate = new Date(endsAt);
  const dateStr = endDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = endDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return wrapper(`
    <div style="background-color:#fef2f2;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="font-size:16px;font-weight:700;color:#991b1b;margin:0">Vous n'êtes plus en tête !</p>
    </div>
    <div>
      <h1 style="font-size:18px;font-weight:700;color:#111827;margin-bottom:16px">${vehicleName}</h1>
    </div>
    <div style="margin-bottom:24px">
      <div style="display:table;width:100%">
        <div style="display:table-cell;width:50%;padding-right:8px">
          <div style="background-color:#f9fafb;border-radius:8px;padding:16px;text-align:center">
            <p style="font-size:12px;color:#6b7280;margin:0;margin-bottom:4px">Votre enchère</p>
            <p style="font-size:20px;font-weight:700;color:#111827;margin:0">${(myBid / 1000).toLocaleString("fr-FR")} DT</p>
          </div>
        </div>
        <div style="display:table-cell;width:50%;padding-left:8px">
          <div style="background-color:#f0fdf4;border-radius:8px;padding:16px;text-align:center">
            <p style="font-size:12px;color:#6b7280;margin:0;margin-bottom:4px">Enchère actuelle</p>
            <p style="font-size:20px;font-weight:700;color:#16a34a;margin:0">${(currentBid / 1000).toLocaleString("fr-FR")} DT</p>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-bottom:24px">
      <p style="font-size:14px;color:#374151">L'enchère se termine le <strong>${dateStr}</strong> à <strong>${timeStr}</strong></p>
    </div>
    <div style="text-align:center;margin-bottom:24px">
      <a href="https://mazadauto.tn/encheres/${vehicleSlug}" style="background-color:#16a34a;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;font-size:15px;font-weight:600;display:inline-block">Renchérir maintenant →</a>
    </div>
    <p style="font-size:12px;color:#9ca3af;text-align:center">Si vous ne renchérissez pas, vous perdrez cette enchère.</p>
  `);
}

export function auctionEndingSoonHtml(
  firstName: string | null,
  vehicleName: string,
  vehicleSlug: string,
  currentBid: number,
  isWinning: boolean
) {
  const name = firstName ?? "there";
  return wrapper(`
    <div style="background-color:${isWinning ? "#f0fdf4" : "#fff7ed"};border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="font-size:16px;font-weight:700;color:${isWinning ? "#166534" : "#9a3412"};margin:0">${isWinning ? "Vous êtes en tête ! Ne laissez pas passer ça." : "Dernière chance !"}</p>
    </div>
    <div>
      <h1 style="font-size:18px;font-weight:700;color:#111827;margin-bottom:8px">${vehicleName}</h1>
      <p style="font-size:24px;font-weight:700;color:#16a34a;margin:0">${(currentBid / 1000).toLocaleString("fr-FR")} DT</p>
    </div>
    <div style="margin-top:16px;margin-bottom:24px">
      <p style="font-size:14px;color:#374151">L'enchère se termine dans moins d'1 heure.</p>
    </div>
    <div style="text-align:center;margin-bottom:24px">
      <a href="https://mazadauto.tn/encheres/${vehicleSlug}" style="background-color:#16a34a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">Voir l'enchère →</a>
    </div>
  `);
}

export function auctionWonHtml(firstName: string | null, vehicleName: string, vehicleSlug: string, finalPrice: number) {
  const name = firstName ?? "there";
  return wrapper(`
    <div style="text-align:center;margin-bottom:24px"><span style="font-size:48px;line-height:48px">🏆</span></div>
    <div>
      <h1 style="font-size:20px;font-weight:700;color:#111827;text-align:center;margin-bottom:8px">Félicitations ${name} !</h1>
      <p style="font-size:16px;color:#374151;text-align:center;margin-bottom:16px">Vous avez remporté : <strong>${vehicleName}</strong></p>
    </div>
    <div style="text-align:center;margin-bottom:24px">
      <p style="font-size:32px;font-weight:800;color:#16a34a;margin:0">${(finalPrice / 1000).toLocaleString("fr-FR")} DT</p>
    </div>
    <div style="background-color:#f0fdf4;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="font-size:14px;color:#166534;margin:0;line-height:20px">Notre équipe vous contactera sous 24h pour organiser le transfert du véhicule.</p>
    </div>
    <div style="margin-bottom:24px">
      <p style="font-size:14px;font-weight:700;color:#111827;margin-bottom:8px">Prochaines étapes :</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">1. Confirmation de votre identité en agence</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">2. Signature des documents de transfert</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">3. Remise des clés et carte grise</p>
    </div>
    <div style="text-align:center;margin-bottom:24px">
      <a href="https://mazadauto.tn/encheres/${vehicleSlug}" style="background-color:#16a34a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">Voir ma transaction →</a>
    </div>
    <p style="font-size:13px;color:#6b7280;text-align:center">Des questions ? <a href="mailto:contact@mazadauto.tn" style="color:#16a34a;text-decoration:underline">contact@mazadauto.tn</a></p>
  `);
}

export function auctionLostHtml(firstName: string | null, vehicleName: string, finalPrice: number) {
  const name = firstName ?? "there";
  return wrapper(`
    <div>
      <h1 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:8px">L'enchère est terminée</h1>
      <p style="font-size:16px;line-height:24px;color:#374151;margin-bottom:16px">Bonjour ${name}, le véhicule <strong>${vehicleName}</strong> a été adjugé pour <strong>${(finalPrice / 1000).toLocaleString("fr-FR")} DT</strong>.</p>
    </div>
    <div style="background-color:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="font-size:14px;color:#374151;margin:0;line-height:20px">Ne vous découragez pas — de nouveaux véhicules arrivent chaque jour.</p>
    </div>
    <div style="text-align:center;margin-bottom:24px">
      <a href="https://mazadauto.tn/encheres" style="background-color:#16a34a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">Voir les enchères en cours →</a>
    </div>
  `);
}

export function vehicleListedHtml(firstName: string | null, vehicleName: string, vehicleSlug: string, endsAt: string) {
  const name = firstName ?? "there";
  const endDate = new Date(endsAt);
  const dateStr = endDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = endDate.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return wrapper(`
    <div>
      <h1 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:12px">Votre ${vehicleName} est maintenant aux enchères !</h1>
      <p style="font-size:16px;line-height:24px;color:#374151;margin-bottom:16px">L'enchère se termine le <strong>${dateStr}</strong> à <strong>${timeStr}</strong></p>
    </div>
    <div style="background-color:#f0fdf4;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="font-size:14px;font-weight:700;color:#166534;margin-bottom:8px">Conseils pour maximiser vos chances :</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">• Partagez le lien de votre annonce</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">• Répondez rapidement aux questions des acheteurs</p>
    </div>
    <div style="text-align:center;margin-bottom:24px">
      <a href="https://mazadauto.tn/encheres/${vehicleSlug}" style="background-color:#16a34a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">Voir mon annonce →</a>
    </div>
  `);
}

export function vehicleSoldHtml(
  firstName: string | null,
  vehicleName: string,
  adjudicationPrice: number,
  sellerCommission: number,
  sellerPayout: number
) {
  const name = firstName ?? "there";
  return wrapper(`
    <div style="text-align:center;margin-bottom:8px"><span style="font-size:40px;line-height:40px">🎉</span></div>
    <div>
      <h1 style="font-size:20px;font-weight:700;color:#111827;text-align:center;margin-bottom:8px">Félicitations ${name} !</h1>
      <p style="font-size:16px;color:#374151;text-align:center;margin-bottom:24px"><strong>${vehicleName}</strong> a trouvé preneur.</p>
    </div>
    <div style="margin-bottom:24px">
      <div style="display:table;width:100%">
        <div style="display:table-cell;width:33%;text-align:center;padding:8px">
          <p style="font-size:11px;color:#6b7280;margin:0;margin-bottom:4px">Prix d'adjudication</p>
          <p style="font-size:16px;font-weight:700;color:#111827;margin:0">${(adjudicationPrice / 1000).toLocaleString("fr-FR")} DT</p>
        </div>
        <div style="display:table-cell;width:33%;text-align:center;padding:8px">
          <p style="font-size:11px;color:#6b7280;margin:0;margin-bottom:4px">Commission (1.5%)</p>
          <p style="font-size:16px;font-weight:700;color:#ef4444;margin:0">-${(sellerCommission / 1000).toLocaleString("fr-FR")} DT</p>
        </div>
        <div style="display:table-cell;width:33%;text-align:center;padding:8px">
          <p style="font-size:11px;color:#6b7280;margin:0;margin-bottom:4px">Net à recevoir</p>
          <p style="font-size:16px;font-weight:700;color:#16a34a;margin:0">${(sellerPayout / 1000).toLocaleString("fr-FR")} DT</p>
        </div>
      </div>
    </div>
    <div style="background-color:#f0fdf4;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="font-size:14px;color:#166534;margin:0;line-height:20px">Notre équipe vous contactera sous 24h pour organiser le virement et le transfert du véhicule.</p>
    </div>
    <div style="text-align:center;margin-bottom:24px">
      <a href="https://mazadauto.tn/dashboard/vendeur" style="background-color:#16a34a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">Voir ma transaction →</a>
    </div>
  `);
}

export function auctionNoBidsHtml(firstName: string | null, vehicleName: string) {
  const name = firstName ?? "there";
  return wrapper(`
    <div>
      <h1 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:8px">Enchère terminée sans offre</h1>
      <p style="font-size:16px;line-height:24px;color:#374151;margin-bottom:16px">Bonjour ${name}, l'enchère de <strong>${vehicleName}</strong> s'est terminée sans enchère.</p>
    </div>
    <div style="background-color:#f9fafb;border-radius:8px;padding:16px;margin-bottom:24px">
      <p style="font-size:14px;font-weight:700;color:#111827;margin-bottom:8px">Conseils pour la prochaine fois :</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">• Vérifiez que votre prix de départ est compétitif</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">• Ajoutez plus de photos de qualité</p>
      <p style="font-size:14px;line-height:22px;color:#374151;margin:0">• Complétez la description du véhicule</p>
    </div>
    <div style="text-align:center;margin-bottom:24px">
      <a href="https://mazadauto.tn/dashboard/vendeur" style="background-color:#16a34a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;display:inline-block">Remettre en vente →</a>
    </div>
  `);
}
