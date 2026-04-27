# 🚀 Quick Start Guide - Custom Box Builder

## Installation & Running

### 1. Install Dependencies
```bash
cd client
npm install
```

This installs:
- ✅ `framer-motion` - Smooth animations
- ✅ `react-dropzone` - File upload handling
- ✅ `@react-three/fiber` & `three` - Optional 3D support
- ✅ All peer dependencies

### 2. Start Development Server
```bash
cd client
npm run dev
```

The app will run on `http://localhost:5174` (or your configured port)

### 3. Access the Builder
Navigate to: **http://localhost:5174/custom-box**

Or click **"Custom Box Builder"** in the navbar

---

## 🎯 Testing the Features

### Test Each Step

#### Step 1: Box Type Selection
- Click different box types (Tuck-End, Rigid, Mailer, etc.)
- Verify selection state changes
- Check base price displays correctly

#### Step 2: Dimensions & Quantity
- Adjust length, width, height (try different units: cm, mm, in)
- Use slider to set quantity
- Verify volume calculation updates
- Check discount badge appears at 250+ units

#### Step 3: Material Selection
- Select different materials
- Verify price modifier percentage shows
- Notice sustainability badges (Eco, Premium, etc.)

#### Step 4: Design & Colors
- Click primary color palette
- Select accent color
- Choose finish type (Gloss, Matte, Soft-Touch, Foil, etc.)
- See color preview update in real-time

#### Step 5: Artwork Upload
- Drag and drop a PNG/JPG file
- Or click to browse
- File preview should appear
- Select artwork placement (Front Only, All Faces, Front & Back)

#### Step 6: Review
- Verify all selections display correctly
- Check price breakdown with tax
- See discount amount if applicable
- Click "Save Design" (shows alert - ready for backend)
- Click "Request Quote" or "Add to Cart" (placeholder functionality)

### Test Responsive Design

#### Desktop (1024px+)
- Preview panel should be sticky on right side
- Stepper and form on left
- All controls visible

#### Tablet (768px - 1023px)
- Single column layout
- Preview moves below form
- Touch-friendly spacing

#### Mobile (<768px)
- Stack layout
- Fixed "Preview" button appears (bottom right)
- Click to toggle preview modal
- Horizontal stepper becomes scrollable

### Test Animations

✨ **Watch for:**
- Smooth step transitions (slide + fade)
- Option card hover scale effects
- Price updates with pop animation
- Progress bar animation
- Checkmark reveals on selection
- Button hover and tap effects

---

## 📊 Verify Pricing Logic

### Example Calculation

**Configuration:**
- Box Type: Rigid ($1.20 base)
- Material: Rigid Board (2.5x multiplier)
- Finish: Soft-Touch (1.15x multiplier)
- Dimensions: 20 × 15 × 10 cm
- Quantity: 500 units
- Artwork: Yes ($50 fee)

**Expected Calculation:**
1. Unit Price: $1.20 × 2.5 × 1.15 = $3.45
2. Plus dimensions: Surface area = 1400 cm², × 0.002 = +$2.80 = $6.25/unit
3. Material cost: $6.25 × 500 = $3,125
4. Quantity discount: 10% off (500+ units) = -$312.50
5. Subtotal: $2,812.50
6. Artwork fee: +$50
7. Total before tax: $2,862.50
8. Tax (10%): +$286.25
9. **Final Total: ~$3,148.75**

Try this configuration and verify the price matches!

---

## 🛠️ Customization Examples

### Change Brand Colors

Edit `client/src/components/CustomBox/CustomBox.css`:
```css
:root {
  --cb-accent-teal: #14b8a6;    /* Change this to your brand color */
  --cb-bg-primary: #0f172a;     /* Change background */
  --cb-text-primary: #f8fafc;   /* Change text color */
}
```

### Add New Box Type

Edit `client/src/data/boxOptions.js`:
```javascript
{
  id: 'your-box-id',
  name: 'Your Box Name',
  description: 'Description here',
  icon: '📦',  // Any emoji
  basePrice: 0.50,
  minQuantity: 100,
}
```

### Adjust Pricing Multipliers

Edit `client/src/utils/calculatePrice.js`:
```javascript
// In calculatePrice function, adjust these multipliers:
unitPrice *= materialData.priceModifier;  // Material cost factor
unitPrice *= finishData.priceModifier;    // Finish cost factor
unitPrice += surfaceArea * 0.002;         // Dimension cost (0.002 per cm²)
```

---

## ⚠️ Troubleshooting

### Issue: "Module not found: framer-motion"
**Solution:** Run `npm install` in the client folder
```bash
cd client
npm install
```

### Issue: Styling looks broken / missing
**Solution:** Ensure CSS file is imported
- Check `CustomBoxPage.jsx` has: `import '../CustomBox.css'`
- Verify CSS variables are in `:root` in `CustomBox.css`

### Issue: Route `/custom-box` not found
**Solution:** Verify route is in `App.jsx`
```javascript
if (path === '/custom-box') {
  return <CustomBoxPage />;
}
```

### Issue: Navbar link not showing
**Solution:** Check `Navbar.jsx` includes the link:
```javascript
{ label: 'Custom Box Builder', href: '/custom-box' }
```

---

## 🔌 Backend Integration Checklist

When ready to connect to backend, implement these endpoints:

- [ ] `POST /api/designs` - Save user design
- [ ] `GET /api/designs/:id` - Load saved design
- [ ] `POST /api/quotes` - Request quote
- [ ] `POST /api/cart` - Add to cart
- [ ] `POST /api/upload` - Upload artwork file
- [ ] `GET /api/pricing` - Get pricing (optional, for real-time updates)

Replace the `alert()` calls in `CustomBoxPage.jsx` with actual API calls.

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `CustomBoxPage.jsx` | Main page orchestrator |
| `CustomBoxContext.jsx` | Global state management |
| `useCustomBox.js` | Custom hook with logic |
| `calculatePrice.js` | Pricing & validation |
| `boxOptions.js` | Static configuration data |
| `Stepper.jsx` | Progress indicator |
| `PreviewPanel.jsx` | 2D/3D box preview |
| `PriceSummary.jsx` | Price display & CTA |
| `Step1-6.jsx` | 6 configuration steps |
| `OptionCard.jsx` | Reusable selection card |
| `FileUploader.jsx` | Drag-drop upload |
| `CustomBox.css` | Global theme CSS |

---

## 🎓 Learning

### See Animations in Action
Look at `CustomBoxPage.jsx` and step components for:
- `<motion.div>` for animations
- `AnimatePresence` for exit animations
- `whileHover`, `whileTap` props for interactions

### Understand State Flow
Trace through:
1. `CustomBoxContext.jsx` - Defines context
2. `useCustomBox.js` - Wraps with logic
3. `Step components` - Use hook to get/update config
4. `PriceSummary.jsx` - Displays calculated values

### CSS Structure
- `CustomBox.css` - CSS variables & global classes (`.cb-*`)
- `*.module.css` - Component-specific styles
- Uses CSS custom properties for theming

---

## 🎉 You're All Set!

The Custom Box Builder is fully functional and ready for:
1. ✅ Testing
2. ✅ Backend integration
3. ✅ Design customization
4. ✅ Feature extensions

**Happy building!** 🚀

For more details, see `CUSTOM_BOX_BUILDER_GUIDE.md`
