import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BoxConfigurator from '../components/BoxConfigurator';
import SectionLabel from '../components/SectionLabel';

export default function CustomBox() {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-brand-blue px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-white/60 text-sm">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight size={14} />
          <span className="text-white font-semibold">Custom Box Builder</span>
        </div>
      </div>

      <BoxConfigurator />
    </div>
  );
}
