import { Package, DollarSign, PenTool, Printer, Clock } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Starting From 100 Boxes',
    desc: 'Perfect for small batches, limited runs, and testing new product lines without massive upfront costs.'
  },
  {
    icon: DollarSign,
    title: 'Competitive Pricing',
    desc: 'Industry-leading rates that scale with your volume, ensuring you get the best value for your packaging spend.'
  },
  {
    icon: PenTool,
    title: 'Custom Design & Sizes',
    desc: '100% customizable dimensions, materials, and styles tailored specifically to your product\'s needs.'
  },
  {
    icon: Printer,
    title: 'Premium Quality Printing',
    desc: 'State-of-the-art offset and digital printing for vibrant, color-accurate, and professional results.'
  },
  {
    icon: Clock,
    title: 'Fast 8-10 Day Turnaround',
    desc: 'Streamlined production processes guarantee your packaging is printed and shipped quickly and reliably.'
  }
];

export default function ReliablePackaging() {
  return (
    <section className="bg-brand-primary text-white py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Stacked Features List */}
          <div data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-display font-bold mb-6 leading-[1.1]">
              Fast & Reliable Custom Packaging Boxes
            </h2>
            <p className="text-[15px] text-white/70 mb-12 max-w-lg">
              We combine premium materials, state-of-the-art printing, and expert design support to deliver packaging that protects your product and elevates your brand.
            </p>
            
            <div className="space-y-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className={`flex items-start gap-6 pb-6 ${idx !== features.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <div className="mt-1 bg-white/5 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-brand-accent stroke-[1.5px]" />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-[14px] text-white/60 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Large Product Image */}
          <div className="relative h-full min-h-[500px]" data-aos="fade-left">
            <div className="absolute inset-0 bg-brand-accent/5 rounded-[24px] rotate-3 transform origin-bottom-right"></div>
            <img 
              src="https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?q=80&w=1000&auto=format&fit=crop" 
              alt="Premium Custom Packaging Process" 
              className="absolute inset-0 w-full h-full object-cover rounded-[24px] shadow-2xl relative z-10 hover:scale-[1.02] transition-transform duration-700"
            />
            {/* Overlay badge */}
            <div className="absolute -left-8 top-12 z-20 bg-brand-surface text-brand-textPrimary px-6 py-4 rounded-xl shadow-xl flex items-center gap-4 animate-slide-in">
              <div className="w-10 h-10 bg-brand-success/10 rounded-full flex items-center justify-center text-brand-success">
                <span className="font-bold text-lg">✓</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-widest text-brand-textSecondary mb-1">Quality Assured</span>
                <span className="block text-[14px] font-bold">100% Satisfaction</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
