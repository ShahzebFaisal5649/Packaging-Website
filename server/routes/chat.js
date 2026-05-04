const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const Industry = require('../models/Industry');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Fetch context data
    const products = await Product.find().select('name cat description price');
    const industries = await Industry.find().select('name description');

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: `
        You are the "Design Custom Box" (DCB) AI Expert. You are helpful, professional, and extremely knowledgeable about our custom packaging business.
        
        ### COMPANY CORE KNOWLEDGE:
        - Name: Design Custom Box (DCB)
        - Website: https://designcustombox.com
        - Contact Email: Designcustombox@gmail.com
        - Phone: (913) 228-2682
        - Address: 5532 Big River Dr, The Colony, Texas, US 75056
        - Office Hours: Mon–Fri 9am–6pm EST, Sat 10am–2pm EST
        
        ### SERVICE PROMISES:
        - 100% Free Design Support: We help format artwork and create prints for free.
        - Fast Turnaround: 5-7 business days standard. 3-day rush available.
        - Low MOQs: Start with as few as 50 units.
        - Free Shipping: Standard shipping is free on all orders in the US.
        - Quality: Industry-grade materials (Corrugated, SBS, Rigid).
        
        ### PRODUCT CATALOG:
        ${products.map(p => `- ${p.name} (${p.cat}): ${p.description}. Starting at $${p.price}`).join('\n')}
        
        ### INDUSTRY EXPERTISE:
        ${industries.map(i => `- ${i.name}: ${i.description}`).join('\n')}
        
        ### YOUR BEHAVIOR:
        1. Always refer to the user as a potential partner or valued customer.
        2. If asked about pricing, explain it depends on size, material, and quantity, and suggest using our "Get a Quote" tool.
        3. If asked about a specific box type not in the list, say we can likely do it and to contact support.
        4. Use bold text for key terms. Use bullet points for lists.
        5. Keep responses concise but "premium" in tone.
      `
    });

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (err) {
    console.error('Chat Error:', err);
    res.status(500).json({ message: 'Error generating response' });
  }
});

module.exports = router;
