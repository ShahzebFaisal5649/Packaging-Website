import { BOX_TYPES, MATERIALS, FINISHES } from '../data/boxOptions';

/**
 * Calculate dynamic price based on configuration
 * Includes base price, material modifiers, finishes, quantity discounts
 */
export const calculatePrice = (config) => {
  if (!config.boxType || !config.material || !config.finish) {
    return 0;
  }

  // Find base pricing
  const boxTypeData = BOX_TYPES.find(b => b.id === config.boxType);
  const materialData = MATERIALS.find(m => m.id === config.material);
  const finishData = FINISHES.find(f => f.id === config.finish);

  if (!boxTypeData || !materialData || !finishData) {
    return 0;
  }

  // Calculate per-unit cost
  let unitPrice = boxTypeData.basePrice;
  unitPrice *= materialData.priceModifier;
  unitPrice *= finishData.priceModifier;

  // Add dimension-based cost (larger boxes cost more)
  const { length, width, height } = config.dimensions;
  const surfaceArea = 2 * (length * width + width * height + height * length);
  unitPrice += surfaceArea * 0.002; // $0.002 per cm²

  // Quantity discount tiers
  const quantity = config.quantity || 0;
  let discountMultiplier = 1.0;
  if (quantity >= 1000) discountMultiplier = 0.85;
  else if (quantity >= 500) discountMultiplier = 0.9;
  else if (quantity >= 250) discountMultiplier = 0.95;

  unitPrice *= discountMultiplier;

  // Artwork handling fee (one-time)
  const artworkFee = config.artwork ? 50 : 0;

  // Total price
  const totalPrice = unitPrice * quantity + artworkFee;
  return parseFloat(totalPrice.toFixed(2));
};

/**
 * Calculate price breakdown for display
 */
export const getPriceBreakdown = (config) => {
  if (!config.boxType || !config.material || !config.finish) {
    return {
      unitPrice: 0,
      materialCost: 0,
      artworkFee: 0,
      subtotal: 0,
      discount: 0,
      tax: 0,
      total: 0,
    };
  }

  const boxTypeData = BOX_TYPES.find(b => b.id === config.boxType);
  const materialData = MATERIALS.find(m => m.id === config.material);
  const finishData = FINISHES.find(f => f.id === config.finish);

  let unitPrice = boxTypeData.basePrice;
  unitPrice *= materialData.priceModifier;
  unitPrice *= finishData.priceModifier;

  const { length, width, height } = config.dimensions;
  const surfaceArea = 2 * (length * width + width * height + height * length);
  const dimensionCost = surfaceArea * 0.002;
  unitPrice += dimensionCost;

  const quantity = config.quantity || 0;
  let discountMultiplier = 1.0;
  let discountPercent = 0;
  if (quantity >= 1000) {
    discountMultiplier = 0.85;
    discountPercent = 15;
  } else if (quantity >= 500) {
    discountMultiplier = 0.9;
    discountPercent = 10;
  } else if (quantity >= 250) {
    discountMultiplier = 0.95;
    discountPercent = 5;
  }

  const baseTotalCost = unitPrice * quantity;
  const discountAmount = baseTotalCost * (1 - discountMultiplier);
  const subtotal = baseTotalCost - discountAmount;
  const artworkFee = config.artwork ? 50 : 0;
  const total = subtotal + artworkFee;
  const tax = total * 0.1; // 10% tax

  return {
    unitPrice: parseFloat(unitPrice.toFixed(2)),
    materialCost: parseFloat((unitPrice * quantity).toFixed(2)),
    artworkFee,
    subtotal: parseFloat(subtotal.toFixed(2)),
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    discountPercent,
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat((total + tax).toFixed(2)),
  };
};

/**
 * Validate configuration
 */
export const validateConfig = (config) => {
  const errors = [];

  if (!config.boxType) errors.push('Please select a box type');
  if (!config.material) errors.push('Please select a material');
  if (!config.finish) errors.push('Please select a finish');

  if (!config.dimensions.length || config.dimensions.length <= 0) {
    errors.push('Length must be greater than 0');
  }
  if (!config.dimensions.width || config.dimensions.width <= 0) {
    errors.push('Width must be greater than 0');
  }
  if (!config.dimensions.height || config.dimensions.height <= 0) {
    errors.push('Height must be greater than 0');
  }

  const minQuantity = BOX_TYPES.find(b => b.id === config.boxType)?.minQuantity || 100;
  if (!config.quantity || config.quantity < minQuantity) {
    errors.push(`Minimum quantity is ${minQuantity}`);
  }
  if (config.quantity > 100000) {
    errors.push('Maximum quantity is 100,000');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate quote summary text
 */
export const generateQuoteSummary = (config) => {
  const boxTypeData = BOX_TYPES.find(b => b.id === config.boxType);
  const materialData = MATERIALS.find(m => m.id === config.material);
  const finishData = FINISHES.find(f => f.id === config.finish);

  return `
${config.quantity}x ${boxTypeData?.name || 'Box'}
${config.dimensions.length} × ${config.dimensions.width} × ${config.dimensions.height} ${config.dimensions.unit}
Material: ${materialData?.name || 'N/A'}
Finish: ${finishData?.name || 'N/A'}
${config.artwork ? 'Custom Artwork Included' : ''}
  `.trim();
};
