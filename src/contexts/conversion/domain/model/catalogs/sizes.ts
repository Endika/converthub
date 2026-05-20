export const SIZE_REGIONS = ['eu', 'us', 'uk'] as const;
export type SizeRegion = (typeof SIZE_REGIONS)[number];

export const SIZE_CATEGORIES = [
  'shoes_men',
  'shoes_women',
  'clothing_men',
  'clothing_women',
] as const;
export type SizeCategory = (typeof SIZE_CATEGORIES)[number];

export interface SizeRow {
  readonly eu: string;
  readonly us: string;
  readonly uk: string;
}

const shoesMen: readonly SizeRow[] = [
  { eu: '39', us: '6.5', uk: '6' },
  { eu: '40', us: '7', uk: '6.5' },
  { eu: '41', us: '8', uk: '7' },
  { eu: '42', us: '8.5', uk: '8' },
  { eu: '43', us: '9.5', uk: '9' },
  { eu: '44', us: '10', uk: '9.5' },
  { eu: '45', us: '11', uk: '10.5' },
  { eu: '46', us: '12', uk: '11' },
  { eu: '47', us: '13', uk: '12' },
];

const shoesWomen: readonly SizeRow[] = [
  { eu: '35', us: '5', uk: '2.5' },
  { eu: '36', us: '5.5', uk: '3.5' },
  { eu: '37', us: '6.5', uk: '4' },
  { eu: '38', us: '7.5', uk: '5' },
  { eu: '39', us: '8', uk: '6' },
  { eu: '40', us: '9', uk: '6.5' },
  { eu: '41', us: '9.5', uk: '7.5' },
  { eu: '42', us: '10.5', uk: '8.5' },
];

const clothingMen: readonly SizeRow[] = [
  { eu: '44', us: 'XS', uk: '34' },
  { eu: '46', us: 'S', uk: '36' },
  { eu: '48', us: 'M', uk: '38' },
  { eu: '50', us: 'L', uk: '40' },
  { eu: '52', us: 'XL', uk: '42' },
  { eu: '54', us: 'XXL', uk: '44' },
];

const clothingWomen: readonly SizeRow[] = [
  { eu: '32', us: 'XS', uk: '4' },
  { eu: '34', us: 'S', uk: '6' },
  { eu: '36', us: 'M', uk: '8' },
  { eu: '38', us: 'L', uk: '10' },
  { eu: '40', us: 'XL', uk: '12' },
  { eu: '42', us: 'XXL', uk: '14' },
];

export const SIZE_TABLES: Record<SizeCategory, readonly SizeRow[]> = {
  shoes_men: shoesMen,
  shoes_women: shoesWomen,
  clothing_men: clothingMen,
  clothing_women: clothingWomen,
};

export const isSizeCategory = (raw: string): raw is SizeCategory =>
  (SIZE_CATEGORIES as readonly string[]).includes(raw);

export const isSizeRegion = (raw: string): raw is SizeRegion =>
  (SIZE_REGIONS as readonly string[]).includes(raw);
