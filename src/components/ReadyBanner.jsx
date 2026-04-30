import { Link } from 'react-router-dom';

export default function ReadyBanner() {
  return (
    <section className="bg-brand-coral py-20 overflow-hidden relative">
      {/* Decorative SVGs */}
      <div className="absolute top-0 left-0 w-64 h-64 opacity-10 pointer-events-none -translate-x-1/2 -translate-y-1/2">
         <svg viewBox="0 0 200 200" fill="white">
            <circle cx="100" cy="100" r="100" />
         </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-96 h-96 opacity-10 pointer-events-none translate-x-1/3 translate-y-1/3">
         <svg viewBox="0 0 200 200" fill="white">
            <circle cx="100" cy="100" r="100" />
         </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 max-w-4xl leading-tight">
          Ready to supercharge your brand with stunning custom packaging?
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          <Link 
            to="/get-free-quote" 
            className="px-12 py-5 bg-white text-brand-coral font-black text-lg rounded-full shadow-2xl hover:scale-105 transition-transform"
          >
            Get free quote
          </Link>
          <a 
            href="tel:9132282682" 
            className="px-12 py-5 bg-transparent border-2 border-white text-white font-black text-lg rounded-full hover:bg-white hover:text-brand-coral transition-all"
          >
            (913) 228-2682
          </a>
        </div>
      </div>
    </section>
  );
}
