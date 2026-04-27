# Custom Box Builder Implementation Guide

## 🎉 Overview

The **Premium Custom Box Builder** has been fully integrated into your MERN Packaging Website. This is a sophisticated 6-step configurator for designing and pricing custom packaging boxes with a premium dark glassmorphism UI.

## 📁 File Structure

```
client/src/
├── components/CustomBox/
│   ├── CustomBoxPage.jsx              # Main orchestrator
│   ├── CustomBoxPage.module.css       # Page styling
│   ├── CustomBox.css                  # Global theme CSS
│   ├── Stepper.jsx                    # Progress stepper
│   ├── Stepper.module.css
│   ├── PreviewPanel.jsx               # 2D/3D box preview
│   ├── PreviewPanel.module.css
│   ├── PriceSummary.jsx               # Dynamic pricing display
│   ├── PriceSummary.module.css
│   ├── steps/
│   │   ├── Step1_BoxType.jsx
│   │   ├── Step2_Dimensions.jsx
│   │   ├── Step3_Material.jsx
│   │   ├── Step4_DesignColors.jsx
│   │   ├── Step5_Artwork.jsx
│   │   ├── Step6_Review.jsx
│   │   └── Step.module.css
│   ├── ui/
│   │   ├── OptionCard.jsx
│   │   ├── OptionCard.module.css
│   │   ├── FileUploader.jsx
│   │   ├── FileUploader.module.css
│   │   ├── DimensionInput.jsx
│   │   └── DimensionInput.module.css
│   └── hooks/
│       └── useCustomBox.js
├── context/
│   └── CustomBoxContext.jsx           # Global state management
├── pages/
│   └── CustomBoxPage.jsx              # Page wrapper
├── utils/
│   └── calculatePrice.js              # Pricing logic & validation
└── data/
    └── boxOptions.js                  # Static configuration data
```

## 🚀 Getting Started

### 1. Install Dependencies

The required dependencies have been added to `client/package.json`:
- `framer-motion` - Animation library
- `react-dropzone` - File upload handling
- `@react-three/fiber` - 3D preview (optional, can be used for future enhancements)
- `three` - 3D graphics (optional)

Install them:
```bash
cd client
npm install
```

### 2. Access the Builder

Navigate to `/custom-box` or click "Custom Box Builder" in the navbar.

## 🎨 Design Features

### Theme: Dark Glassmorphism
- **Primary Background**: Deep navy (#0f172a)
- **Glass Effect**: Semi-transparent white with backdrop blur
- **Accent Color**: Vibrant teal (#14b8a6)
- **Typography**: Inter font family with generous spacing
- **Animations**: Smooth transitions using Framer Motion

### Key UI Components
- **Stepper**: Visual progress indicator with step navigation
- **Option Cards**: Hover effects, selection states, badges
- **Live Preview**: 2D flat and 3D isometric views
- **Price Summary**: Real-time pricing with breakdown
- **File Uploader**: Drag-and-drop with file preview

## 🔄 6-Step Workflow

### Step 1: Box Type
- Select from 6 premium box styles (Tuck-End, Rigid, Mailer, Auto-Bottom, Pillow, Display)
- Shows base price and minimum quantity

### Step 2: Dimensions & Quantity
- Set L/W/H with unit toggle (cm, mm, in)
- Quantity slider with bulk discount tiers
- Volume calculation display

### Step 3: Material
- 6 premium material options with badges
- Shows thickness and price modifier
- Sustainability indicators

### Step 4: Design & Colors
- Primary color picker (9 colors)
- Accent color selector (premium options)
- Finish type grid (Matte, Gloss, Soft-Touch, Foil options)
- Live color preview

### Step 5: Artwork Upload
- Drag-and-drop file upload
- Supports PNG, JPG, PDF, AI, EPS
- Placement options (Front, All Faces, Front & Back)
- Optional step with helpful messaging

### Step 6: Review & Confirm
- Complete configuration summary
- Full price breakdown with tax
- Save design option
- Request quote / Add to cart buttons

## 💰 Pricing System

### Price Calculation
The `calculatePrice` function in `utils/calculatePrice.js`:
1. Starts with box type base price
2. Applies material multiplier
3. Applies finish multiplier
4. Adds dimension-based cost (by surface area)
5. Applies quantity discount tiers:
   - 1000+ units: 15% off
   - 500-999: 10% off
   - 250-499: 5% off
6. Adds artwork handling fee ($50 if artwork included)
7. Calculates tax (10%)

### Quantity Discounts
- Built-in tiered pricing rewards bulk orders
- Users see discount badge at 250+ units
- Real-time price updates as config changes

## 🎯 State Management

### Context: CustomBoxContext
- Manages global configuration
- Saves/loads designs
- Provides hooks for components

### Custom Hook: useCustomBox
- Wraps context with business logic
- Calculates price and breakdown
- Handles step navigation
- Validation helpers

### Default Config
```javascript
{
  boxType: null,
  dimensions: { length: 20, width: 15, height: 10, unit: 'cm' },
  quantity: 100,
  material: null,
  finish: null,
  colors: { primary: '#0f172a', accent: '#14b8a6' },
  artwork: null,
  artworkPlacement: 'all-faces',
  specialTreatments: [],
  notes: ''
}
```

## 🎬 Animations

Uses **Framer Motion** for:
- Step transitions (slide + fade)
- Option card hover effects (scale, shadow)
- Progress bar animations
- Price update pops
- Checkmark reveals
- Smooth micro-interactions throughout

## 📱 Responsive Design

### Desktop (1024px+)
- Side-by-side layout (Configurator + Preview)
- Sticky preview panel
- Full controls visible

### Tablet (768px - 1023px)
- Single column layout
- Preview moved to bottom
- Touch-friendly button sizes

### Mobile (< 768px)
- Stacked layout
- Preview toggle button (fixed)
- Optimized form sizes
- Horizontal stepper becomes scrollable

## 🔧 Customization

### Adding New Box Types
Edit `data/boxOptions.js`:
```javascript
export const BOX_TYPES = [
  {
    id: 'custom-id',
    name: 'Box Name',
    description: '...',
    icon: '📦',
    basePrice: 0.45,
    minQuantity: 100,
  },
  // ...
];
```

### Modifying Colors
Update CSS variables in `CustomBox.css`:
```css
--cb-accent-teal: #14b8a6;
--cb-accent-gold: #d97706;
```

### Adjusting Pricing Logic
Edit `utils/calculatePrice.js`:
- Change base prices
- Adjust material/finish multipliers
- Modify discount tiers
- Add/remove fees

## 🔌 Backend Integration (Next Steps)

### Save Design Endpoint
```javascript
POST /api/designs
{ config, name, userId }
```

### Request Quote Endpoint
```javascript
POST /api/quotes
{ config, userInfo }
→ { quoteId, estimatedPrice, pdf }
```

### Add to Cart Endpoint
```javascript
POST /api/cart
{ config, quantity, sessionId }
```

## 🐛 Troubleshooting

### Dependencies Not Installed
```bash
cd client
npm install
npm install framer-motion react-dropzone @react-three/fiber @react-three/drei three
```

### Styling Issues
- Ensure CSS modules are properly imported
- Check that `CustomBox.css` is imported in `CustomBoxPage.jsx`
- Verify CSS variables are defined in `:root`

### Route Not Working
- Confirm `/custom-box` route is added to `App.jsx`
- Check Navbar links are updated
- Ensure `useRoute` hook works with your routing system

## 📝 Notes

- The 3D preview currently uses SVG isometric rendering (lightweight)
- Can be upgraded to Three.js for true 3D with rotation
- File upload integration points to browser storage (no backend yet)
- Quote/Cart buttons have placeholder alerts (ready for backend)
- Design saving currently shows alerts (ready for localStorage/DB)

## 🎓 Learning Resources

- **Framer Motion**: See `CustomBoxPage.jsx` for `AnimatePresence` and motion components
- **CSS Modules**: Check `Step.module.css` for comprehensive styling patterns
- **Custom Hooks**: Review `useCustomBox.js` for context wrapping
- **Form Handling**: See individual step components for input patterns

---

**Happy building!** 🚀 The Custom Box Builder is production-ready and extensible. Integrate it with your backend to complete the purchasing flow.
