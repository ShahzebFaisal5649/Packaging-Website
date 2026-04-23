import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ProductCard({ name, img, to = '/products', portrait = false }) {
  return (
    <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      <div className="overflow-hidden">
        <img
          src={img}
          alt={name}
          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
            portrait ? 'h-40' : 'h-44'
          }`}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1B3F6A] text-sm mb-3 leading-snug">{name}</h3>
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-[#F47920] text-xs font-semibold hover:gap-2 transition-all"
        >
          Learn More <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}
