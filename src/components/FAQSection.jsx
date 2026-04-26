import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "What is your minimum order quantity?",
    a: "Our minimum order quantity starts from 100 boxes for most custom packaging styles. This allows small businesses and startups to get professional packaging without a massive upfront investment."
  },
  {
    q: "How long does shipping take?",
    a: "Standard production and shipping time is 8-10 business days after artwork approval. We also offer expedited shipping options if you need your boxes sooner."
  },
  {
    q: "Do you offer free design support?",
    a: "Yes! We provide 100% free design support and file verification to ensure your artwork looks perfect when printed. Our packaging specialists are available to guide you through the process."
  },
  {
    q: "Can I get a sample before ordering?",
    a: "Absolutely. We offer sample kits and custom-printed prototypes so you can check the material quality, size, and printing before committing to a full production run."
  },
  {
    q: "What printing methods do you use?",
    a: "We use high-quality offset and digital printing to ensure vibrant colors and sharp details. We also offer specialty finishes like spot UV, foil stamping, and embossing."
  },
  {
    q: "Are your materials eco-friendly?",
    a: "Yes, we are committed to sustainability. Our materials are FSC-certified and we use soy-based, eco-friendly inks for all our printing."
  },
  {
    q: "How do I get a price quote?",
    a: "You can use our online configurator to get an instant estimate, or click 'Get Free Quote' to send us your project details for a custom 1-on-1 consultation."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const leftFaqs = faqs.slice(0, 4);
  const rightFaqs = faqs.slice(4);

  const AccordionItem = ({ faq, realIndex }) => (
    <div className="border-b border-gray-100 last:border-0 overflow-hidden">
      <button 
        onClick={() => setOpenIndex(openIndex === realIndex ? null : realIndex)}
        className="w-full py-6 flex items-center justify-between gap-4 text-left group"
      >
        <span className={`text-[15px] font-black transition-colors ${openIndex === realIndex ? 'text-brand-coral' : 'text-brand-navy group-hover:text-brand-teal'}`}>
          {faq.q}
        </span>
        <ChevronDown 
          size={20} 
          className={`text-brand-teal transition-transform duration-300 flex-shrink-0 ${openIndex === realIndex ? 'rotate-180' : ''}`} 
        />
      </button>
      <div 
        className={`transition-all duration-300 ease-in-out ${
          openIndex === realIndex ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-[14px] text-brand-navy/60 leading-relaxed font-medium">
          {faq.a}
        </p>
      </div>
    </div>
  );

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-brand-navy mb-6">Frequently Asked Questions</h2>
          <p className="text-brand-navy/60 max-w-2xl text-lg font-medium">
            Everything you need to know about our custom packaging process, materials, and delivery.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-x-20 items-start">
          <div className="space-y-2">
            {leftFaqs.map((faq, i) => (
              <AccordionItem key={i} faq={faq} realIndex={i} />
            ))}
          </div>
          <div className="space-y-2">
            {rightFaqs.map((faq, i) => (
              <AccordionItem key={i} faq={faq} realIndex={i + 4} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
