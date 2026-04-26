import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    num: '1',
    title: 'Choose your custom shipping boxes',
    desc: 'Explore our range of curated custom packaging solutions to discover the packaging solution that\'s right for your business. If you\'re not sure what custom box design, box style or dimensions to go for, chat with us - we\'re happy to help!'
  },
  {
    num: '2',
    title: 'Request a free instant quote',
    desc: 'It\'s simple, speedy and free to request a quote from us. Remember to include valuable packaging needs like box dimensions, existing supply chain, custom options, the quantity of boxes you need, design ideas and internal deadlines.'
  },
  {
    num: '3',
    title: 'Finalize your order',
    desc: 'As soon as we\'ve received your request, our customer support team will prepare your tailored quote. We guarantee to come back to you within 1-2 hours, so you can swiftly start your packaging journey.'
  },
  {
    num: '4',
    title: 'Roll-on production!',
    desc: 'Get creative and add your own artwork to your custom dieline file. We\'ll then prepare a 2D and 3D rendering of your beautiful packaging for review. After everything is approved, you can sit back and relax while we customize and create your attention-grabbing branded packaging.'
  }
];

export default function HowItWorks() {
  return (
    <section className="bg-brand-teal py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-5xl font-black text-white text-center mb-16 max-w-4xl mx-auto leading-tight">
          How Refine Packaging Brings Your Packaging Design Ideas to Life
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="flex flex-col h-full bg-transparent">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                      {step.num}
                   </div>
                   {idx < 3 && (
                     <div className="hidden lg:block flex-1 h-[2px] bg-white/20 relative">
                        <ArrowRight size={20} className="absolute -right-2 -top-2.5 text-white/40" />
                     </div>
                   )}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 leading-tight">{step.title}</h3>
                <p className="text-white/70 text-[14px] leading-relaxed mb-6">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link 
            to="/how-it-works" 
            className="px-10 py-4 bg-white text-brand-teal font-black rounded-full hover:scale-105 transition-transform shadow-xl"
          >
            How It Works
          </Link>
        </div>
      </div>
      
      {/* Wave Decorative SVG */}
      <div className="absolute bottom-0 right-0 w-1/3 opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 200" fill="white">
          <path d="M0,100 C150,200 250,0 400,100 L400,200 L0,200 Z" />
        </svg>
      </div>
    </section>
  );
}
