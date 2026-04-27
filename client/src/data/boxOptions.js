/**
 * Box Types Configuration
 * Premium packaging options with descriptions and base pricing
 */
export const BOX_TYPES = [
  {
    id: 'tuck-end',
    name: 'Tuck-End Box',
    description: 'Classic retail box with tucked flaps. Perfect for small products.',
    icon: '📦',
    basePrice: 0.45,
    minQuantity: 100,
  },
  {
    id: 'rigid',
    name: 'Rigid Box',
    description: 'Premium rigid construction. Ideal for luxury and high-end items.',
    icon: '🎁',
    basePrice: 1.2,
    minQuantity: 50,
  },
  {
    id: 'mailer',
    name: 'Mailer Box',
    description: 'Corrugated mailer with integrated flaps. Great for shipping.',
    icon: '📮',
    basePrice: 0.65,
    minQuantity: 100,
  },
  {
    id: 'auto-bottom',
    name: 'Auto-Bottom Box',
    description: 'Self-locking bottom. Efficient for assembly and shipping.',
    icon: '📫',
    basePrice: 0.55,
    minQuantity: 100,
  },
  {
    id: 'pillow',
    name: 'Pillow Box',
    description: 'Curved, elegant design. Perfect for gifts and cosmetics.',
    icon: '🎀',
    basePrice: 0.75,
    minQuantity: 100,
  },
  {
    id: 'display',
    name: 'Display Box',
    description: 'Open-top box for retail display. Attracts attention on shelves.',
    icon: '🏪',
    basePrice: 0.85,
    minQuantity: 100,
  },
];

/**
 * Materials with sustainability badges and pricing modifiers
 */
export const MATERIALS = [
  {
    id: 'kraft',
    name: 'Kraft Paper',
    description: 'Natural, eco-friendly brown kraft. Sustainable choice.',
    priceModifier: 1.0,
    badge: 'Eco',
    badgeColor: 'green',
    thickness: '400gsm',
  },
  {
    id: 'corrugated',
    name: 'Corrugated',
    description: 'Durable corrugated board with excellent protection.',
    priceModifier: 1.15,
    badge: 'Strong',
    badgeColor: 'blue',
    thickness: 'Single/Double Wall',
  },
  {
    id: 'rigid-board',
    name: 'Rigid Board',
    description: 'Premium rigid board. Luxurious, durable, and reusable.',
    priceModifier: 2.5,
    badge: 'Premium',
    badgeColor: 'gold',
    thickness: '2.5-3mm',
  },
  {
    id: 'eco-kraft',
    name: 'Recycled Kraft',
    description: '100% recycled kraft paper. Maximum sustainability.',
    priceModifier: 1.05,
    badge: 'Eco+',
    badgeColor: 'green',
    thickness: '350gsm',
  },
  {
    id: 'coated',
    name: 'Coated Paper',
    description: 'Glossy-coated board for vibrant colors and premium feel.',
    priceModifier: 1.3,
    badge: 'Vivid',
    badgeColor: 'purple',
    thickness: '300gsm',
  },
  {
    id: 'cardboard',
    name: 'Premium Cardboard',
    description: 'High-quality cardboard with excellent print quality.',
    priceModifier: 1.2,
    badge: 'Quality',
    badgeColor: 'cyan',
    thickness: '350gsm',
  },
];

/**
 * Finish and Special Treatments
 */
export const FINISHES = [
  {
    id: 'matte',
    name: 'Matte',
    description: 'Elegant, non-reflective surface',
    priceModifier: 1.0,
  },
  {
    id: 'gloss',
    name: 'Gloss',
    description: 'High-shine, vibrant appearance',
    priceModifier: 1.08,
  },
  {
    id: 'soft-touch',
    name: 'Soft-Touch',
    description: 'Velvety, premium feel with subtle texture',
    priceModifier: 1.15,
  },
  {
    id: 'matte-foil',
    name: 'Matte + Foil',
    description: 'Matte base with metallic foil accents',
    priceModifier: 1.35,
  },
  {
    id: 'gloss-foil',
    name: 'Gloss + Foil',
    description: 'Gloss base with metallic foil highlights',
    priceModifier: 1.45,
  },
  {
    id: 'emboss',
    name: 'Embossed',
    description: 'Raised texture for tactile luxury',
    priceModifier: 1.25,
  },
];

/**
 * Color Palette Options
 */
export const COLOR_OPTIONS = [
  { name: 'Deep Navy', hex: '#0f172a', category: 'dark' },
  { name: 'Charcoal', hex: '#1f2937', category: 'dark' },
  { name: 'Classic Black', hex: '#000000', category: 'dark' },
  { name: 'White', hex: '#ffffff', category: 'light' },
  { name: 'Cream', hex: '#fef3c7', category: 'light' },
  { name: 'Teal', hex: '#14b8a6', category: 'accent' },
  { name: 'Gold', hex: '#d97706', category: 'accent' },
  { name: 'Rose', hex: '#ec4899', category: 'accent' },
  { name: 'Slate', hex: '#6b7280', category: 'neutral' },
];

/**
 * Default Configuration
 */
export const DEFAULT_CONFIG = {
  boxType: null,
  dimensions: {
    length: 20,
    width: 15,
    height: 10,
    unit: 'cm',
  },
  quantity: 100,
  material: null,
  finish: null,
  colors: {
    primary: '#0f172a',
    accent: '#14b8a6',
  },
  artwork: null,
  artworkPlacement: 'all-faces',
  specialTreatments: [],
  notes: '',
};
