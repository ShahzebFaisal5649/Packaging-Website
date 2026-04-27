/**
 * Type Definitions and Interfaces for Custom Box Builder
 * Use these for better IDE autocomplete and documentation
 */

/**
 * Box configuration object
 */
export const CustomBoxConfigType = {
  boxType: String, // 'tuck-end' | 'rigid' | 'mailer' | etc.
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: String, // 'cm' | 'mm' | 'in'
  },
  quantity: Number,
  material: String, // 'kraft' | 'corrugated' | 'rigid-board' | etc.
  finish: String, // 'matte' | 'gloss' | 'soft-touch' | etc.
  colors: {
    primary: String, // hex color
    accent: String, // hex color
  },
  artwork: File | null,
  artworkPlacement: String, // 'front' | 'all-faces' | 'front-back'
  specialTreatments: Array,
  notes: String,
};

/**
 * Box Type Definition
 */
export const BoxTypeDefinition = {
  id: String,
  name: String,
  description: String,
  icon: String,
  basePrice: Number,
  minQuantity: Number,
};

/**
 * Material Definition
 */
export const MaterialDefinition = {
  id: String,
  name: String,
  description: String,
  priceModifier: Number,
  badge: String,
  badgeColor: String, // 'green' | 'blue' | 'gold' | etc.
  thickness: String,
};

/**
 * Finish Definition
 */
export const FinishDefinition = {
  id: String,
  name: String,
  description: String,
  priceModifier: Number,
};

/**
 * Color Option Definition
 */
export const ColorOptionDefinition = {
  name: String,
  hex: String,
  category: String, // 'dark' | 'light' | 'accent' | 'neutral'
};

/**
 * Price Breakdown Object
 */
export const PriceBreakdownType = {
  unitPrice: Number,
  materialCost: Number,
  artworkFee: Number,
  subtotal: Number,
  discountAmount: Number,
  discountPercent: Number,
  tax: Number,
  total: Number,
};

/**
 * Validation Result
 */
export const ValidationResultType = {
  isValid: Boolean,
  errors: Array, // string[]
};

/**
 * Design Object for saving
 */
export const SavedDesignType = {
  id: Number,
  name: String,
  config: CustomBoxConfigType,
  createdAt: String, // ISO datetime
};

/**
 * Context Type
 */
export const CustomBoxContextType = {
  config: CustomBoxConfigType,
  updateConfig: Function, // (key: string | object, value: any) => void
  resetConfig: Function, // () => void
  currentStep: Number,
  setCurrentStep: Function, // (step: number) => void
  savedDesigns: Array, // SavedDesignType[]
  saveDesign: Function, // (name: string) => number (returns id)
  loadDesign: Function, // (id: number) => void
  deleteDesign: Function, // (id: number) => void
};

/**
 * useCustomBox Hook Return Type
 */
export const UseCustomBoxReturnType = {
  config: CustomBoxConfigType,
  updateConfig: Function,
  resetConfig: Function,
  currentStep: Number,
  setCurrentStep: Function,
  savedDesigns: Array,
  saveDesign: Function,
  loadDesign: Function,
  deleteDesign: Function,
  price: Number, // calculated total price
  priceBreakdown: PriceBreakdownType,
  validation: ValidationResultType,
  nextStep: Function, // () => void
  prevStep: Function, // () => void
  goToStep: Function, // (step: number) => void
};

/**
 * Component Props Types
 */

export const CustomBoxPageProps = {};

export const StepperProps = {
  currentStep: Number,
  setCurrentStep: Function,
  totalSteps: Number,
};

export const PreviewPanelProps = {
  config: CustomBoxConfigType,
};

export const PriceSummaryProps = {
  config: CustomBoxConfigType,
  onQuoteRequest: Function, // () => void
  onAddToCart: Function, // () => void
};

export const StepComponentProps = {
  config: CustomBoxConfigType,
  updateConfig: Function, // (key: string | object, value: any) => void
};

export const OptionCardProps = {
  option: Object, // BoxTypeDefinition | MaterialDefinition
  isSelected: Boolean,
  onSelect: Function, // () => void
  image: String, // optional image URL
  badge: String, // optional badge text
  badgeColor: String, // 'primary' | 'success' | 'warning' | 'gold'
};

export const FileUploaderProps = {
  onUpload: Function, // (file: File) => void
  currentFile: File | null,
  maxSize: Number, // bytes (default 10MB)
  acceptedFormats: Array, // MIME types
};

export const DimensionInputProps = {
  label: String,
  value: Number,
  onChange: Function, // (value: number) => void
  unit: String, // 'cm' | 'mm' | 'in'
  onUnitChange: Function, // (unit: string) => void
  min: Number,
  max: Number,
  step: Number,
  hint: String, // optional
  error: String, // optional error message
};

/**
 * CSS Variables in CustomBox.css
 * Theme customization through CSS variables
 */
export const CSSVariables = {
  // Colors
  '--cb-bg-primary': '#0f172a',
  '--cb-bg-secondary': '#1a2332',
  '--cb-bg-tertiary': '#252d3d',
  '--cb-accent-teal': '#14b8a6',
  '--cb-accent-gold': '#d97706',
  '--cb-text-primary': '#f8fafc',
  '--cb-text-secondary': '#cbd5e1',
  '--cb-text-muted': '#94a3b8',

  // Spacing (multiply by 4px base unit)
  '--cb-space-xs': '4px',
  '--cb-space-sm': '8px',
  '--cb-space-md': '16px',
  '--cb-space-lg': '24px',
  '--cb-space-xl': '32px',
  '--cb-space-2xl': '48px',

  // Border radius
  '--cb-radius-sm': '6px',
  '--cb-radius-md': '12px',
  '--cb-radius-lg': '20px',
  '--cb-radius-xl': '28px',

  // Shadows
  '--cb-shadow-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
  '--cb-shadow-md': '0 4px 12px rgba(0, 0, 0, 0.15)',
  '--cb-shadow-lg': '0 10px 32px rgba(0, 0, 0, 0.25)',
  '--cb-shadow-glow-teal': '0 0 20px rgba(20, 184, 166, 0.2)',

  // Transitions
  '--cb-transition-fast': '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  '--cb-transition-base': '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  '--cb-transition-slow': '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

/**
 * Utility Functions
 */

/**
 * Calculate total price
 * @param {CustomBoxConfigType} config
 * @returns {number} total price
 */
export function calculatePrice(config) {}

/**
 * Get price breakdown
 * @param {CustomBoxConfigType} config
 * @returns {PriceBreakdownType}
 */
export function getPriceBreakdown(config) {}

/**
 * Validate configuration
 * @param {CustomBoxConfigType} config
 * @returns {ValidationResultType}
 */
export function validateConfig(config) {}

/**
 * Generate quote summary text
 * @param {CustomBoxConfigType} config
 * @returns {string}
 */
export function generateQuoteSummary(config) {}
