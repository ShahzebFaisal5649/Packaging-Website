import { Link } from 'react-router-dom';

export default function NeedHelp() {
  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-[640px] mx-auto bg-white rounded-3xl border border-gray-100 shadow-2xl p-10 md:p-16 text-center relative mt-10">
          {/* Avatar */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-brand-light-green">
            <img 
              src="https://rpack.b-cdn.net/wp-content/themes/refine/assets/images/support.png" 
              alt="Support Expert" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="pt-4">
            <p className="text-[11px] font-black text-brand-teal uppercase tracking-[0.3em] mb-4">Need help?</p>
            <h2 className="text-3xl md:text-4xl font-black text-brand-navy mb-6 leading-tight">
              Get In Touch for a <span className="text-brand-coral">Consultation</span>
            </h2>
            <p className="text-brand-navy/60 text-lg font-medium leading-relaxed mb-10">
              Our packaging specialists are here to guide you from concept to doorstep. Chat live, call us, or send a message now for expert advice.
            </p>
            <Link 
              to="/contact-us" 
              className="inline-block px-12 py-4 bg-brand-coral text-white font-black rounded-full shadow-xl shadow-brand-coral/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
