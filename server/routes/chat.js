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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `
      You are the AI Assistant for "Design Custom Box", a premium custom packaging company.
      Your goal is to help visitors with their packaging needs, product info, and general inquiries.
      
      Website Details:
      - We offer Mailer Boxes, Shipping Boxes, Pizza Boxes, Product Boxes, and more.
      - We serve various industries: Food & Beverage, Cosmetics, E-commerce, Retail, etc.
      - We provide free design services, fast turnaround, and no minimum order quantities (MOQ).
      - Prices are dynamic based on dimensions and quantity.
      
      Product List:
      ${products.map(p => `- ${p.name} (${p.cat}): ${p.description} Starting at $${p.price}`).join('\n')}
      
      Industry Insights:
      ${industries.map(i => `- ${i.name}: ${i.description}`).join('\n')}
      
      Instructions:
      - Be professional, helpful, and concise.
      - If you don't know something, suggest they contact us via the contact form.
      - Use markdown for formatting.
      - Keep responses friendly and encouraging.
    `;

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 500,
      },
    });

    // We can't easily pass system instructions to startChat in the same way as the base model call without adjusting history
    // But we can prepend it to the message or use the latest model features if available.
    // For simplicity, we'll use the system instruction in a single generateContent call if history is empty, 
    // or just prepend it to the first message.
    
    const prompt = history && history.length > 0 ? message : `${systemInstruction}\n\nVisitor: ${message}`;
    
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ text });
  } catch (err) {
    console.error('Chat Error:', err);
    res.status(500).json({ message: 'Error generating response' });
  }
});

module.exports = router;
