export function calculerCBM(longueurCm: number, largeurCm: number, hauteurCm: number, quantite: number = 1): number {
  const cbmUnitaire = (longueurCm * largeurCm * hauteurCm) / 1_000_000;
  return Math.round(cbmUnitaire * quantite * 10000) / 10000;
}

export function calculerPoidsVolumetrique(cbm: number, facteur: number = 1000): number {
  return cbm * facteur;
}

export function calculerPoidsFacturable(poidsReelKg: number, cbm: number, facteur: number = 1000): number {
  const poidsVol = calculerPoidsVolumetrique(cbm, facteur);
  return Math.max(poidsReelKg, poidsVol);
}

export function formatCBM(cbm: number | null | undefined): string {
  if (!cbm || cbm === 0) return '-';
  return `${cbm.toFixed(3)} m³`;
}
