import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import ProductCard from '../components/ProductCard';
import FeatureGrid from '../components/FeatureGrid';
import CTABanner from '../components/CTABanner';
import { productCategories } from '../data';

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

export default function Products() {
  const [visibleCount, setVisibleCount] = useState(5);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1B3F6A] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">Products</span>
          </div>
          <div className="max-w-2xl">
            <SectionLabel text="All Products" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-1 mb-4 leading-tight">
              Custom Box Styles for Every Product
            </h1>
            <p className="text-white/75 text-base leading-relaxed">
              Browse 50+ custom box styles across 8 categories. Every order includes free artwork
              guidance and a digital proof before production begins.
            </p>
          </div>
        </div>
        <svg className="w-full mt-10 -mb-1 block" viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,50 L0,50 Z" fill="white" />
        </svg>
      </section>

      {/* Category sections */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {productCategories.slice(0, visibleCount).map((cat, ci) => (
            <motion.div
              key={cat.slug}
              custom={ci}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mb-14"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <Link
                    to={`/products/${cat.slug}`}
                    className="text-xl font-bold text-[#1B3F6A] hover:text-[#F47920] transition-colors"
                  >
                    {cat.name}
                  </Link>
                  <p className="text-[#6B7280] text-xs mt-0.5">{cat.products.length} styles available</p>
                </div>
                <Link
                  to={`/products/${cat.slug}`}
                  className="flex items-center gap-1 text-[#F47920] text-xs font-semibold hover:gap-2 transition-all"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {cat.products.map((p, i) => (
                  <motion.div key={p.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                    <ProductCard name={p.name} img={p.img} to={`/products/${cat.slug}`} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {visibleCount < productCategories.length && (
            <div className="text-center mb-8">
              <button
                onClick={() => setVisibleCount((v) => Math.min(v + 3, productCategories.length))}
                className="border-2 border-[#1B3F6A] text-[#1B3F6A] hover:bg-[#1B3F6A] hover:text-white font-semibold px-10 py-3 rounded-md transition-all"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Brand Recognition */}
      <WaveDivider fromColor="#fff" toColor="#EEF4FB" />
      <section className="bg-[#EEF4FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel text="Quality First" />
              <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-3">
                Build Long-Lasting Brand Recognition
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-3">
                <span className="font-semibold text-[#1B3F6A]">Quality custom retail boxes designed to impress.</span>{' '}
                Your packaging is the first physical touchpoint between your brand and your customer.
                We help you make it unforgettable — with premium materials and meticulous quality control.
              </p>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-5">
                <span className="font-semibold text-[#1B3F6A]">Professional-grade materials.</span>{' '}
                From lightweight 14pt cardstock to heavy-duty corrugated, every material is FSC-certified
                and printed with eco-friendly soy-based inks.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {['FSC Certified Materials','Soy-Based Inks','100% Recyclable','CMYK + Pantone Match'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm font-medium text-[#1B3F6A]">
                    <span className="w-4 h-4 rounded-full bg-[#F47920] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[9px] font-bold">✓</span>
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://placehold.co/240x300/1B3F6A/ffffff?text=Product+1" alt="Product" className="w-full rounded-xl shadow-md object-cover" />
              <img src="https://placehold.co/240x300/F47920/ffffff?text=Product+2" alt="Product" className="w-full rounded-xl shadow-md object-cover mt-6" />
            </div>
          </div>
        </div>
      </section>
      <WaveDivider fromColor="#EEF4FB" toColor="#fff" flip />

      {/* Empowering brands grid */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel text="All Products" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1">
              Empowering Brands In Every Industry
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {productCategories.flatMap((c) => c.products).slice(0, 15).map((p, i) => (
              <motion.div key={p.name + i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <ProductCard name={p.name} img={p.img} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeatureGrid />
      <CTABanner wave={false} />
    </div>
  );
}
