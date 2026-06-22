export function formatMontant(value: number, devise: string = 'XOF'): string {
  if (devise === 'XOF' || devise === 'CFA') {
    return `${formatNumber(value)} FCFA`;
  }
  return `${formatNumber(value)} ${devise}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    const n = value / 1_000_000;
    return n % 1 === 0 ? `${n} M` : `${n.toFixed(1)} M`;
  }
  if (value >= 1_000) {
    const n = value / 1_000;
    return n % 1 === 0 ? `${n} k` : `${n.toFixed(1)} k`;
  }
  return value.toString();
}

export function formatPoids(kg: number): string {
  if (kg >= 1000) {
    const t = kg / 1000;
    return t % 1 === 0 ? `${t} t` : `${t.toFixed(1)} t`;
  }
  return kg % 1 === 0 ? `${kg} kg` : `${kg.toFixed(1)} kg`;
}
