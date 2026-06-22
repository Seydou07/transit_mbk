export function formatMontant(montant: number | string | null | undefined, devise: string = 'XAF'): string {
  if (montant === null || montant === undefined) return '-';
  const n = typeof montant === 'string' ? parseFloat(montant) : montant;
  if (isNaN(n)) return '-';
  if (devise === 'XAF' || devise === 'XOF') {
    return `${n.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} FCFA`;
  }
  return `${n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${devise}`;
}

export function formatMontantCourt(montant: number | string | null | undefined): string {
  if (montant === null || montant === undefined) return '-';
  const n = typeof montant === 'string' ? parseFloat(montant) : montant;
  if (isNaN(n)) return '-';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1).replace('.', ',')}Md`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}
