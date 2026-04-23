import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import ProductCard from '../components/ProductCard';
import FeatureGrid from '../components/FeatureGrid';
import CTABanner from '../components/CTABanner';
import { industries } from '../data';

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: 'easeOut' },
  }),
};

function WaveDivider({ fromColor = '#fff', toColor = '#EEF4FB', flip = false }) {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ background: fromColor }}>
      <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className={`w-full h-10 sm:h-14 block ${flip ? 'rotate-180' : ''}`}>
        <path d="M0,30 C480,60 960,0 1440,30 L1440,50 L0,50 Z" fill={toColor} />
      </svg>
    </div>
  );
}

export default function Industries() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1B3F6A] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">Industries</span>
          </div>
          <div className="max-w-2xl">
            <SectionLabel text="Industries We Serve" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-1 mb-4 leading-tight">
              Custom Boxes for Every Industry
            </h1>
            <p className="text-white/75 text-base leading-relaxed">
              Whatever your industry, we have custom packaging solutions that protect your product,
              elevate your brand, and delight your customers.
            </p>
          </div>
        </div>
        <svg className="w-full mt-10 -mb-1 block" viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,50 L0,50 Z" fill="white" />
        </svg>
      </section>

      {/* Industry sections */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {industries.map((ind, ci) => (
            <motion.div
              key={ind.slug}
              custom={ci}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mb-14"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                  <img
                    src={ind.img}
                    alt={ind.name}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm"
                  />
                  <div>
                    <Link
                      to={`/industries/${ind.slug}`}
                      className="text-xl font-bold text-[#1B3F6A] hover:text-[#F47920] transition-colors"
                    >
                      {ind.name}
                    </Link>
                    <p className="text-[#6B7280] text-xs mt-0.5">{ind.products.length} box styles</p>
                  </div>
                </div>
                <Link
                  to={`/industries/${ind.slug}`}
                  className="flex items-center gap-1 text-[#F47920] text-xs font-semibold hover:gap-2 transition-all"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {ind.products.map((p, i) => (
                  <motion.div key={p.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                    <ProductCard name={p.name} img={p.img} to={`/industries/${ind.slug}`} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <WaveDivider fromColor="#fff" toColor="#EEF4FB" />
      <FeatureGrid />
      <WaveDivider fromColor="#EEF4FB" toColor="#fff" flip />
      <CTABanner wave={false} />
    </div>
  );
}
