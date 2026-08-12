export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function progressRatio(current: number, target: number) {
  if (!target) return 0;
  return Math.max(0, Math.min(1, current / target));
}

export const shoppingCategoryLabels: Record<string, string> = {
  Proteínas: 'Proteínas',
  Carboidratos: 'Carboidratos',
  Frutas: 'Frutas',
  Vegetais: 'Vegetais',
  Laticínios: 'Laticínios',
  Outros: 'Outros',
  proteins: 'Proteínas',
  carbs: 'Carboidratos',
  fruits: 'Frutas',
  vegetables: 'Vegetais',
  dairy: 'Laticínios',
  other: 'Outros',
};
