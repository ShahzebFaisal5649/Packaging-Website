import { useState } from 'react';
import { ChevronDown, Search, MessageSquare, Phone, Mail } from 'lucide-react';

const categories = [
  { id: 'general', name: 'General Questions' },
  { id: 'ordering', name: 'Ordering & Pricing' },
  { id: 'design', name: 'Design & Artwork' },
  { id: 'shipping', name: 'Shipping & Delivery' },
];

const faqs = [
  { 
    cat: 'general',
    q: "What makes Refine Packaging different?",
    a: "We combine world-class manufacturing with a focus on ease-of-use and professional design support. Unlike traditional manufacturers, we offer low minimums, instant pricing, and a dedicated account manager for every project."
  },
  {
    cat: 'ordering',
    q: "What is your minimum order quantity?",
    a: "Our standard minimum is 100 units for most box styles. This allows brands to test new products or seasonal packaging without a large capital commitment."
  },
  {
    cat: 'design',
    q: "Do I need to have my own designer?",
    a: "Not at all! We offer 100% free design support. Our in-house team of structural and graphic designers can help you create print-ready artwork from your logo and ideas."
  },
  {
    cat: 'shipping',
    q: "How fast can I get my boxes?",
    a: "Our standard turnaround is 8-10 business days after artwork approval. We also offer rush production for time-sensitive projects."
  },
  {
    cat: 'ordering',
    q: "Can I get a bulk discount?",
    a: "Yes, our unit prices drop significantly as quantity increases. You can see tiered pricing in our online configurator or contact us for high-volume quotes (50,000+ units)."
  },
  {
    cat: 'design',
    q: "What file formats do you accept?",
    a: "We prefer vector files like .AI, .EPS, .PDF, or .SVG. However, we can also work with high-resolution .PNG or .JPG files if needed."
  }
];

export default function FAQ() {
  const [activeCat, setActiveCat] = useState('all');
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter(faq => {
    const matchesCat = activeCat === 'all' || faq.cat === activeCat;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-[140px] pb-24 bg-brand-navy text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">Help Center</h1>
          <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Find answers to frequently asked questions about our process, pricing, and materials.
          </p>

          <div className="mt-12 max-w-xl mx-auto relative">
             <input 
               type="text" 
               placeholder="Search for answers..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-white/10 border border-white/20 rounded-full px-8 py-5 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-teal transition-colors pr-20"
             />
             <button className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-brand-teal text-brand-navy rounded-full flex items-center justify-center hover:bg-brand-coral hover:text-white transition-all">
                <Search size={20} />
             </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Sidebar: Categories */}
            <div className="lg:col-span-3 sticky top-[140px]">
              <h3 className="text-sm font-black text-brand-navy uppercase tracking-widest mb-6">Categories</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveCat('all')}
                  className={`px-6 py-4 rounded-xl text-left font-black text-sm transition-all ${activeCat === 'all' ? 'bg-brand-teal text-white shadow-xl shadow-brand-teal/20' : 'text-gray-400 hover:bg-gray-50 hover:text-brand-navy'}`}
                >
                  All Questions
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`px-6 py-4 rounded-xl text-left font-black text-sm transition-all ${activeCat === cat.id ? 'bg-brand-teal text-white shadow-xl shadow-brand-teal/20' : 'text-gray-400 hover:bg-gray-50 hover:text-brand-navy'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="mt-12 p-8 bg-[#F9FAFB] rounded-[32px] border border-gray-100">
                <h4 className="text-lg font-black text-brand-navy mb-4">Still have questions?</h4>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">Our team of packaging experts is here to help you.</p>
                <div className="space-y-4">
                  <a href="tel:18007259660" className="flex items-center gap-3 text-sm font-bold text-brand-navy hover:text-brand-teal transition-colors">
                    <Phone size={18} className="text-brand-teal" /> 1-800-725-9660
                  </a>
                  <a href="mailto:support@refinepackaging.com" className="flex items-center gap-3 text-sm font-bold text-brand-navy hover:text-brand-teal transition-colors">
                    <Mail size={18} className="text-brand-teal" /> Email Support
                  </a>
                  <button className="flex items-center gap-3 text-sm font-bold text-brand-navy hover:text-brand-teal transition-colors">
                    <MessageSquare size={18} className="text-brand-teal" /> Live Chat
                  </button>
                </div>
              </div>
            </div>

            {/* Content: FAQs */}
            <div className="lg:col-span-9">
              <div className="space-y-4">
                {filteredFaqs.length > 0 ? filteredFaqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                    <button 
                      onClick={() => setOpenIndex(openIndex === i ? null : i)}
                      className="w-full p-8 md:p-10 flex items-center justify-between text-left"
                    >
                      <span className={`text-xl font-black transition-colors ${openIndex === i ? 'text-brand-coral' : 'text-brand-navy group-hover:text-brand-teal'}`}>
                        {faq.q}
                      </span>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${openIndex === i ? 'bg-brand-coral text-white rotate-180' : 'bg-gray-50 text-brand-teal'}`}>
                        <ChevronDown size={20} />
                      </div>
                    </button>
                    <div className={`transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-[500px] opacity-100 pb-10 px-10 md:px-12' : 'max-h-0 opacity-0'}`}>
                      <p className="text-lg text-brand-navy/60 font-medium leading-relaxed max-w-4xl">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                    <Search size={48} className="text-gray-200 mx-auto mb-6" />
                    <h3 className="text-xl font-black text-brand-navy mb-2">No results found</h3>
                    <p className="text-gray-400 font-medium">Try searching for something else or browse categories.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-navy py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">Ready to think outside the box?</h2>
          <button className="px-14 py-6 bg-brand-coral text-white font-black text-xl rounded-full shadow-2xl shadow-brand-coral/40 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest">
            Get Free Quote
          </button>
        </div>
      </section>
    </div>
  );
}
