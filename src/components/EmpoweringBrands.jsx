import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const industries = [
  {
    id: 'food',
    name: 'Food & Beverage',
    title: 'Food-Safe Packaging that Preserves Quality',
    desc: 'From custom printed boxes for artisanal chocolates to durable shipping cartons for subscription meals, our food-grade packaging ensures your products arrive fresh and looking appetizing.',
    img: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=1200&auto=format&fit=crop',
    features: ['FDA-Compliant Materials', 'Grease-Resistant Coatings', 'Temperature-Safe']
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics',
    title: 'Luxurious Boxes for Beauty Brands',
    desc: 'Elevate your skincare and makeup products with premium packaging. We offer specialty finishes like foil stamping and soft-touch lamination to create an unforgettable unboxing experience.',
    img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&auto=format&fit=crop',
    features: ['Premium Finishes', 'Custom Inserts', 'Eco-Friendly Options']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    title: 'Durable Mailers Built for Transit',
    desc: 'Protect your products while making a great first impression. Our corrugated mailer boxes are designed to withstand the rigors of shipping while showcasing your brand the moment they arrive.',
    img: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1200&auto=format&fit=crop',
    features: ['Crush-Resistant', 'Inside Printing Available', 'Self-Locking Design']
  },
  {
    id: 'apparel',
    name: 'Apparel & Retail',
    title: 'Boutique Packaging for Fashion',
    desc: 'Create a retail experience that customers want to share. Our apparel boxes, tissue paper, and custom stickers help fashion brands build loyalty and drive social media engagement.',
    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop',
    features: ['Custom Sizes', 'Brand Color Matching', 'Retail-Ready']
  }
];

export default function EmpoweringBrands() {
  const [activeTab, setActiveTab] = useState(industries[0].id);

  const activeData = industries.find(ind => ind.id === activeTab);

  return (
    <section className="bg-white py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-textPrimary mb-4">Packaging for Every Industry</h2>
          <p className="text-[15px] text-brand-textSecondary max-w-2xl mx-auto">
            We've helped thousands of businesses across diverse sectors create the perfect custom boxes for their unique products.
          </p>
        </div>

        {/* Pill-style Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {industries.map(ind => (
            <button
              key={ind.id}
              onClick={() => setActiveTab(ind.id)}
              className={`px-6 py-3 rounded-full text-[14px] font-bold transition-button ${
                activeTab === ind.id 
                  ? 'bg-brand-primary text-white shadow-card' 
                  : 'bg-brand-bg text-brand-textSecondary hover:bg-gray-200 hover:text-brand-textPrimary'
              }`}
            >
              {ind.name}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="bg-brand-bg rounded-[32px] overflow-hidden shadow-card border border-gray-100">
          <div className="grid lg:grid-cols-2 min-h-[500px]">
            
            {/* Content Left */}
            <div className="p-10 lg:p-16 flex flex-col justify-center animate-fade-in" key={`content-${activeTab}`}>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-textPrimary mb-6 leading-tight">
                {activeData.title}
              </h3>
              <p className="text-[15px] text-brand-textSecondary leading-relaxed mb-8">
                {activeData.desc}
              </p>
              
              <ul className="space-y-4 mb-12">
                {activeData.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-[14px] font-bold text-brand-textPrimary">
                    <div className="w-5 h-5 rounded-full bg-brand-success/20 text-brand-success flex items-center justify-center text-[10px]">✓</div>
                    {feat}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Link to="/get-free-quote" className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-accent text-white font-bold text-[14px] rounded-button hover:bg-[#b57a3d] hover:scale-[1.02] transition-button shadow-sm">
                  Get a Custom Quote <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Image Right */}
            <div className="relative h-[300px] lg:h-auto overflow-hidden">
              <img 
                key={`img-${activeTab}`}
                src={activeData.img} 
                alt={activeData.name} 
                className="absolute inset-0 w-full h-full object-cover animate-fade-in"
              />
            </div>
            
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <Link to="/industries" className="px-8 py-3 bg-transparent text-brand-textPrimary border border-gray-300 font-bold text-[14px] rounded-button hover:border-brand-textPrimary hover:bg-white transition-button">
            View All Industries
          </Link>
        </div>
        
      </div>
    </section>
  );
}
