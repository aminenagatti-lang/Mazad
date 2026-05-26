export function generateVehicleSlug(
  marque: string,
  modele: string,
  annee: number,
  id: string
): string {
  const base = `${annee}-${marque}-${modele}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base}-${id.slice(0, 8)}`;
}
