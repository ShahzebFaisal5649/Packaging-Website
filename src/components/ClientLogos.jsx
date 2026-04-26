import { Link } from 'react-router-dom';
import logos from '../assets/client-logos.png';

export default function ClientLogos() {
  return (
    <section className="bg-white border-t border-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-8">Trusted By 1000s of Businesses Worldwide</p>
        <div className="w-full overflow-hidden mb-6 opacity-80 hover:opacity-100 transition-opacity">
          <img src={logos} alt="Client Logos" className="h-10 md:h-12 w-auto mx-auto object-contain" />
        </div>
        <Link 
          to="/success-stories" 
          className="text-brand-teal font-black text-sm border-b-2 border-brand-teal/20 hover:border-brand-teal transition-all"
        >
          Explore Our Success Stories
        </Link>
      </div>
    </section>
  );
}
