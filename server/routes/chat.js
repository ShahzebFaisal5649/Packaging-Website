const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

const router = express.Router();

// Static fallback product/industry data in case DB is unavailable
const FALLBACK_PRODUCTS = [
  'Mailer Box — Ideal for e-commerce, subscription boxes. Starting at $0.80/unit',
  'Shipping Box — Corrugated for safe delivery. Starting at $0.60/unit',
  'Rigid Box — Premium product packaging (jewelry, electronics). Starting at $2.50/unit',
  'Folding Carton — Lightweight retail box. Starting at $0.40/unit',
  'Sleeve Box — Elegant slide-out style. Starting at $1.20/unit',
  'Display Box — Point-of-sale counter display. Starting at $1.00/unit',
  'Kraft Box — Eco-friendly natural craft. Starting at $0.50/unit',
  'Gable Box — Handle-top for gifts & food. Starting at $0.70/unit',
];

const FALLBACK_INDUSTRIES = [
  'E-Commerce — Fast, secure mailer and shipping boxes optimized for fulfillment',
  'Food & Beverage — FDA-safe, grease-resistant packaging for edibles',
  'Cosmetics & Beauty — Premium rigid and folding carton boxes for beauty brands',
  'Retail — Eye-catching point-of-sale and shelf-ready packaging',
  'Electronics — Anti-static inserts and corrugated protection',
  'Health & Wellness — Clean-design boxes for supplements and personal care',
  'Apparel & Accessories — Branded tissue-lined boxes for fashion items',
];

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Try to load live product/industry data — fall back to static if DB unavailable
    let productLines = FALLBACK_PRODUCTS;
    let industryLines = FALLBACK_INDUSTRIES;

    if (mongoose.connection.readyState === 1) {
      try {
        const Product = require('../models/Product');
        const Industry = require('../models/Industry');
        const [products, industries] = await Promise.all([
          Product.find().select('name cat description price').lean(),
          Industry.find().select('name description').lean(),
        ]);
        if (products.length > 0) {
          productLines = products.map(p => `${p.name} (${p.cat}): ${p.description}. Starting at $${p.price}`);
        }
        if (industries.length > 0) {
          industryLines = industries.map(i => `${i.name}: ${i.description}`);
        }
      } catch (dbErr) {
        console.warn('Chat: using fallback product data —', dbErr.message);
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ text: "I'm temporarily unavailable. Please contact us at Designcustombox@gmail.com or call (913) 228-2682." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: `
You are the official AI assistant for **Design Custom Box (DCB)** — a premium US-based custom packaging company. You are knowledgeable, professional, and warm.

## COMPANY FACTS
- **Name:** Design Custom Box (DCB)
- **Contact:** Designcustombox@gmail.com | (913) 228-2682
- **Address:** 5532 Big River Dr, The Colony, Texas, US 75056
- **Hours:** Mon–Fri 9am–6pm EST | Sat 10am–2pm EST
- **Website:** https://designcustombox.com

## WHAT WE OFFER
- **Free Design Support:** Our in-house designers help format artwork and create print-ready files at no charge.
- **Fast Turnaround:** Standard 5–7 business days. Rush 3-day production available.
- **Low MOQ:** Start with as few as 50 units — no huge order required.
- **Free US Shipping:** On all standard orders within the United States.
- **Eco-Friendly Options:** Kraft, recycled corrugated, soy-based inks available.
- **Printing:** CMYK, Pantone, digital, offset — we handle it all.
- **Finishes:** Matte Lam, Gloss Lam, Soft-Touch, Spot UV, Foil Stamp.

## OUR PRODUCTS
${productLines.map(l => `- ${l}`).join('\n')}

## INDUSTRIES WE SERVE
${industryLines.map(l => `- ${l}`).join('\n')}

## HOW TO RESPOND
1. Be concise but premium-sounding — like a luxury brand consultant.
2. Use **bold** for key terms, and bullet points for lists.
3. If a user asks about pricing, explain it depends on size, material, finish, and quantity — then invite them to use our **Get a Quote** tool or contact us directly.
4. For product questions outside our listed catalog, say "We can almost certainly create that for you — contact us to discuss your project."
5. If someone seems frustrated, empathize warmly and offer the direct email.
6. NEVER say you don't have information about DCB — use the facts above confidently.
7. Keep responses under 200 words unless the question requires detail.
`,
    });

    // Sanitize history to avoid malformed roles (Gemini requires alternating user/model)
    const sanitizedHistory = (history || []).filter(
      (h, i, arr) => h.role && h.parts && h.parts[0]?.text && (i === 0 || h.role !== arr[i - 1].role)
    );

    const chat = model.startChat({
      history: sanitizedHistory,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.75,
      },
    });

    const result = await chat.sendMessage(message.trim());
    const text = result.response.text();

    res.json({ text });
  } catch (err) {
    console.error('Chat Error:', err.message || err);

    // Return a helpful fallback instead of a raw 500
    res.json({
      text: "I'm having a momentary hiccup! For immediate help, please email us at **Designcustombox@gmail.com** or call **(913) 228-2682**. We typically respond within a few hours during business hours.",
    });
  }
});

module.exports = router;
