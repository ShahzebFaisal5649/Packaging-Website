import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    num: '1',
    title: 'Pick your custom shipping boxes',
    desc: 'Take a look at our range of curated custom packaging solutions to find the one that fits your business perfectly. If you are not sure about the design, style, or size, just chat with us – we are happy to help you figure it out!'
  },
  {
    num: '2',
    title: 'Get a free instant quote',
    desc: 'It is simple, fast, and free to get a quote from us. Just let us know things like your box dimensions, how you ship, any custom options you want, the amount of boxes you need, and when you need them by.'
  },
  {
    num: '3',
    title: 'Confirm your order',
    desc: 'Once we get your request, our team will put together a quote just for you. We promise to get back to you within 1 to 2 hours so you can get started on your packaging journey right away.'
  },
  {
    num: '4',
    title: 'Start production!',
    desc: 'Get creative and add your own artwork to your custom template. We will prepare a 2D and 3D preview of your packaging for you to check. After you approve everything, you can relax while we create your eye catching branded packaging.'
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
