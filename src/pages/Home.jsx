import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, Package, Clock, Award, Printer, DollarSign } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import ProductCard from '../components/ProductCard';
import FAQAccordion from '../components/FAQAccordion';
import CTABanner from '../components/CTABanner';
import { productCategories, blogPosts } from '../data';

/* ─── animation preset ─────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

/* ─── data ──────────────────────────────────────────────── */
const industryCards = [
  { name: 'Retail Boxes',       img: 'https://placehold.co/400x260/1B3F6A/ffffff?text=Retail+Boxes',      to: '/industries/retail-boxes' },
  { name: 'Cannabis & Vape',    img: 'https://placehold.co/400x260/22c55e/ffffff?text=Cannabis+%26+Vape', to: '/industries/cbd-packaging' },
  { name: 'Cosmetics & Beauty', img: 'https://placehold.co/400x260/ec4899/ffffff?text=Cosmetics',         to: '/industries/cosmetic-boxes' },
  { name: 'Kraft Boxes',        img: 'https://placehold.co/400x260/d97706/ffffff?text=Kraft+Boxes',       to: '/industries' },
  { name: 'Food Boxes',         img: 'https://placehold.co/400x260/F47920/ffffff?text=Food+Boxes',        to: '/industries/food-beverage' },
  { name: 'Ecommerce Boxes',    img: 'https://placehold.co/400x260/2a5fa0/ffffff?text=Ecommerce',         to: '/industries/ecommerce-boxes' },
  { name: 'Chocolate Boxes',    img: 'https://placehold.co/400x260/7c3aed/ffffff?text=Chocolate',         to: '/industries' },
  { name: 'Candle Boxes',       img: 'https://placehold.co/400x260/f59e0b/ffffff?text=Candle+Boxes',      to: '/industries/candle-boxes' },
  { name: 'Healthcare',         img: 'https://placehold.co/400x260/ef4444/ffffff?text=Healthcare',        to: '/industries' },
];

const statTiles = [
  { Icon: Package,    label: 'Starting From',       value: '100 Boxes' },
  { Icon: DollarSign, label: 'Competitive',          value: 'Pricing' },
  { Icon: Printer,    label: 'Custom Design',        value: 'Sizes & Style' },
  { Icon: Award,      label: 'High Quality',         value: 'Offset Printing' },
  { Icon: Clock,      label: 'Fast Turnaround',      value: '8–10 Business Days' },
];

const trendingNames = [
  'Mailer Boxes','Soap Boxes','Vape Cartridge Boxes','Hair Extension Boxes','CBD Boxes',
  'Candle Boxes','Pillow Boxes','Eyelash Boxes','Cardboard Boxes','Product Boxes','Lip Gloss Boxes',
];

const trendingProducts = trendingNames.map((name) => ({
  name,
  img: `https://placehold.co/220x300/EEF4FB/1B3F6A?text=${encodeURIComponent(name)}`,
}));

const steps = [
  { num: '01', title: 'Choose your custom shipping boxes',  desc: 'Browse 50+ box styles or let our experts recommend the perfect option for your product.' },
  { num: '02', title: 'Request a free instant quote',       desc: 'Use our configurator or speak with a specialist to get pricing in minutes.' },
  { num: '03', title: 'Finalize your order',               desc: 'Approve your 2D and 3D digital proofs, confirm specs, and place your order securely.' },
  { num: '04', title: 'Roll-on production!',               desc: 'Your boxes are printed, quality-checked, and shipped directly to your door in 8–10 business days.' },
];

const instagramImgs = [
  'https://placehold.co/320x320/1B3F6A/ffffff?text=@refinepackaging',
  'https://placehold.co/320x320/F47920/ffffff?text=Unboxing',
  'https://placehold.co/320x320/22c55e/ffffff?text=Custom+Boxes',
  'https://placehold.co/320x320/2a5fa0/ffffff?text=Brand+Stories',
];

const homeFaqs = [
  { q: 'Can you design my custom boxes?',
    a: "Yes! Our in-house design team provides free artwork support. Share your logo and brand guidelines, and we'll create a print-ready dieline at no extra charge." },
  { q: 'Do you offer discounts for large bulk orders?',
    a: 'Absolutely. Our per-unit price decreases significantly at higher quantities. Orders of 1,000+ units receive our best rates. Contact us for a custom bulk quote.' },
  { q: 'When will I receive my order?',
    a: 'Standard production takes 8–10 business days after artwork approval, plus 3–5 business days for shipping. Rush options with 5–7 day production are also available.' },
  { q: 'How do I place my order?',
    a: 'Use our Custom Box configurator to specify your dimensions, style, and quantity for an instant estimate, or call our team at (800) 123-4567 for guided assistance.' },
  { q: 'Can you print inside and outside?',
    a: 'Yes. We offer outside-only printing, full inside and outside printing, and no-print options. Inside printing is perfect for premium unboxing experiences.' },
  { q: 'How do I get a quote?',
    a: 'Click "Get Free Quote" anywhere on the site, use our interactive configurator, or call us. We respond to all quote requests within a few hours on business days.' },
  { q: 'How will I know what my box looks like before finalizing?',
    a: 'Every order includes a full-color 2D dieline proof and a 3D digital mockup. Production doesn\'t begin until you\'ve reviewed and approved your proof in writing.' },
];

const brands = ['T-Mobile','Adidas','Pandora','Marriott','MetLife','Old Spice','Nike','Samsung'];

const bigGridProducts = productCategories.flatMap((c) => c.products).slice(0, 15);

/* ─── Wave divider ──────────────────────────────────────── */
function WaveDivider({ fromColor = '#fff', toColor = '#EEF4FB', flip = false }) {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ background: fromColor }}>
      <svg
        viewBox="0 0 1440 50"
        preserveAspectRatio="none"
        className={`w-full h-10 sm:h-14 ${flip ? 'rotate-180' : ''}`}
        style={{ display: 'block' }}
      >
        <path d="M0,30 C480,60 960,0 1440,30 L1440,50 L0,50 Z" fill={toColor} />
      </svg>
    </div>
  );
}

/* ─── Decorative blob SVG ───────────────────────────────── */
function HeroBlob() {
  return (
    <svg
      className="absolute right-0 top-0 w-1/2 h-full opacity-[0.07] pointer-events-none"
      viewBox="0 0 500 600" fill="none"
    >
      <ellipse cx="400" cy="200" rx="280" ry="220" fill="#EEF4FB" />
      <ellipse cx="300" cy="450" rx="200" ry="180" fill="#EEF4FB" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="overflow-x-hidden">

      {/* ─── HERO ──────────────────────────────────────── */}
      <section className="relative bg-white overflow-hidden">
        <HeroBlob />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#F47920] mb-4">
                #1 Custom Packaging Brand
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#1B3F6A] leading-[1.15] mb-5">
                Custom boxes made easy for retail
              </h1>
              <p className="text-[#6B7280] text-base leading-relaxed mb-8 max-w-lg">
                Supercharge your brand through the power of{' '}
                <span className="font-semibold text-[#1B3F6A]">custom boxes</span> and{' '}
                <span className="font-semibold text-[#1B3F6A]">custom packaging</span>.
                Premium quality starting at 100 units — free design support, fast turnaround, and a
                100% satisfaction guarantee.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  to="/custom-box"
                  className="bg-[#F47920] hover:bg-[#d96510] text-white font-semibold px-7 py-3.5 rounded-md transition-colors shadow-sm"
                >
                  Get Free Quote
                </Link>
                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 border-2 border-[#1B3F6A] text-[#1B3F6A] hover:bg-[#1B3F6A] hover:text-white font-semibold px-7 py-3.5 rounded-md transition-all"
                >
                  <Play size={14} /> How It Works
                </a>
              </div>
              {/* Trust strip */}
              <div className="flex flex-wrap gap-5">
                {['★★★★★ Facebook 4.9/5','★★★★★ Trustpilot 4.8/5','10,000+ Happy Customers'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-[#6B7280] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F47920]" />
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:block relative"
            >
              <img
                src="https://placehold.co/560x440/EEF4FB/1B3F6A?text=Custom+Packaging"
                alt="Custom Packaging"
                className="w-full rounded-2xl shadow-xl"
              />
              {/* Floating stat */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 bg-[#EEF4FB] rounded-lg flex items-center justify-center">
                  <Package size={18} className="text-[#1B3F6A]" />
                </div>
                <div>
                  <div className="font-bold text-[#1B3F6A] text-sm">10,000+</div>
                  <div className="text-xs text-[#6B7280]">Brands Served</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#F47920] rounded-xl shadow-lg p-4 text-white">
                <div className="font-bold text-2xl">100%</div>
                <div className="text-xs font-medium opacity-85">Satisfaction</div>
              </div>
            </motion.div>
          </div>

          {/* Brand logos */}
          <div className="mt-16 pt-10 border-t border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] text-center mb-5">
              Trusted By 1000s of Businesses Worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-40">
              {brands.map((b) => (
                <span key={b} className="font-bold text-sm text-[#1B3F6A] tracking-wider">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── INDUSTRIES ────────────────────────────────── */}
      <WaveDivider fromColor="#fff" toColor="#EEF4FB" />
      <section className="bg-[#EEF4FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel text="Industries" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-3">
              Find custom boxes for your industry
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto text-sm">
              Whatever you sell, we have the perfect packaging solution. Browse by industry to find your ideal box style.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {industryCards.map((card, i) => (
              <motion.div
                key={card.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  to={card.to}
                  className="block group relative overflow-hidden rounded-lg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={card.img}
                    alt={card.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">{card.name}</span>
                    <span className="text-white/70 group-hover:text-[#F47920] transition-colors">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/industries"
              className="inline-flex items-center gap-2 border-2 border-[#1B3F6A] text-[#1B3F6A] hover:bg-[#1B3F6A] hover:text-white font-semibold px-8 py-3 rounded-md transition-all"
            >
              View all Industries <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      <WaveDivider fromColor="#EEF4FB" toColor="#fff" flip />

      {/* ─── FAST & RELIABLE ───────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
            <div>
              <SectionLabel text="Why Choose Us" />
              <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-4">
                Fast & Reliable Custom Packaging Boxes
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                We combine premium materials, state-of-the-art offset printing, and expert design support
                to deliver packaging that protects your product and elevates your brand. Every order is
                backed by our 100% satisfaction guarantee.
              </p>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                From lightweight cardstock to heavy-duty corrugated, our materials are FSC-certified and
                printed with eco-friendly soy-based inks — because great packaging doesn't have to cost the earth.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://placehold.co/540x380/EEF4FB/1B3F6A?text=Premium+Packaging"
                alt="Premium packaging"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
          {/* 5 stat tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statTiles.map(({ Icon, label, value }, i) => (
              <motion.div
                key={label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-[#EEF4FB] rounded-lg p-5 text-center hover:shadow-card transition-shadow"
              >
                <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Icon size={20} className="text-[#1B3F6A]" />
                </div>
                <div className="font-bold text-[#1B3F6A] text-sm">{value}</div>
                <div className="text-xs text-[#6B7280] mt-0.5">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRENDING PRODUCTS ─────────────────────────── */}
      <WaveDivider fromColor="#fff" toColor="#EEF4FB" />
      <section className="bg-[#EEF4FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel text="Products By Industry" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-3">
              Trending & Popular Products
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto text-sm">
              Explore our bestselling custom box styles, trusted by thousands of brands in every industry.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 mb-8">
            {trendingProducts.slice(0, 8).map((p, i) => (
              <motion.div key={p.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <ProductCard name={p.name} img={p.img} portrait />
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-[#F47920] hover:bg-[#d96510] text-white font-semibold px-8 py-3 rounded-md transition-colors"
            >
              View All Industries <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
      <WaveDivider fromColor="#EEF4FB" toColor="#fff" flip />

      {/* ─── CONSULTATION BANNER ───────────────────────── */}
      <section className="bg-[#1B3F6A] py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Looking for other custom boxes and packaging?
            </h2>
            <p className="text-white/70 text-sm">Our packaging experts are ready to help — no obligation.</p>
          </div>
          <Link
            to="/custom-box"
            className="flex-shrink-0 bg-[#F47920] hover:bg-[#d96510] text-white font-semibold px-8 py-3.5 rounded-md transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>

      {/* ─── VIDEO ─────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel text="Customer Stories" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1">
              Why 1,000s of Happy Customers Trust Refine Packaging
            </h2>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
            <img
              src="https://placehold.co/1000x500/1B3F6A/ffffff?text=Customer+Video+Testimonial"
              alt="Testimonial video"
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#1B3F6A]/40 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play size={26} className="text-[#F47920] ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────── */}
      <WaveDivider fromColor="#fff" toColor="#EEF4FB" />
      <section id="how-it-works" className="bg-[#EEF4FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <SectionLabel text="Our Process" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-3">
              How Refine Packaging Brings Your Packaging Design Ideas to Life
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* connector line */}
            <div className="hidden lg:block absolute top-[52px] left-[12.5%] right-[12.5%] h-px bg-[#1B3F6A]/20 z-0" />
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="relative bg-white rounded-lg shadow-card p-7 text-center z-10"
              >
                <div className="w-14 h-14 bg-[#1B3F6A] rounded-full flex items-center justify-center mx-auto mb-5 shadow-md">
                  <span className="text-white font-bold text-lg">{step.num}</span>
                </div>
                <h3 className="font-semibold text-[#1B3F6A] text-sm mb-2 leading-snug">{step.title}</h3>
                <p className="text-[#6B7280] text-xs leading-relaxed">{step.desc}</p>
                {i < 3 && (
                  <svg className="hidden lg:block absolute -right-3 top-12 z-20" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F47920" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                )}
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-[#F47920] font-semibold text-sm hover:gap-2.5 transition-all">
              How It Works <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>
      <WaveDivider fromColor="#EEF4FB" toColor="#fff" flip />

      {/* ─── BIG INDUSTRY PRODUCTS GRID ────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel text="All Products" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-3">
              Empowering Brands in Every Industry with Unrivaled Custom Boxes
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {bigGridProducts.map((p, i) => (
              <motion.div key={p.name + i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <ProductCard name={p.name} img={p.img} />
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/industries"
              className="inline-flex items-center gap-2 border-2 border-[#1B3F6A] text-[#1B3F6A] hover:bg-[#1B3F6A] hover:text-white font-semibold px-8 py-3 rounded-md transition-all"
            >
              View all industries <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── INSTAGRAM ─────────────────────────────────── */}
      <WaveDivider fromColor="#fff" toColor="#EEF4FB" />
      <section className="bg-[#EEF4FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <SectionLabel text="Design Inspiration" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-2">
              Get Creative Packaging Design Inspiration
            </h2>
            <p className="text-[#6B7280] text-sm">
              Follow us{' '}
              <a href="#" className="font-semibold text-[#F47920] hover:underline">@refinepackaging</a>
              {' '}for daily packaging ideas
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {instagramImgs.map((img, i) => (
              <div key={i} className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                <img src={img} alt={`Inspiration ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-[#1B3F6A]/0 group-hover:bg-[#1B3F6A]/25 transition-colors" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 border-2 border-[#1B3F6A] text-[#1B3F6A] hover:bg-[#1B3F6A] hover:text-white font-semibold px-7 py-3 rounded-md transition-all"
            >
              Follow Us On Instagram <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
      <WaveDivider fromColor="#EEF4FB" toColor="#fff" flip />

      {/* ─── FAQ ───────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel text="FAQ" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1">Frequently Asked Questions</h2>
          </div>
          <FAQAccordion items={homeFaqs} />
        </div>
      </section>

      {/* ─── HELP CTA ──────────────────────────────────── */}
      <section className="bg-[#EEF4FB] py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8">
            <img
              src="https://placehold.co/100x100/1B3F6A/ffffff?text=Support"
              alt="Support"
              className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-bold text-[#1B3F6A] mb-2">
                Need help? Get In Touch for a Consultation
              </h3>
              <p className="text-[#6B7280] text-sm mb-5">
                Our packaging specialists are available Monday–Friday, 9am–6pm EST and will respond to all inquiries within a few hours.
              </p>
              <Link
                to="/custom-box"
                className="inline-block bg-[#F47920] hover:bg-[#d96510] text-white font-semibold px-7 py-3 rounded-md transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BLOG ──────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel text="Resources" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1">
              Learn About Custom Boxes from the Pros
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {blogPosts.slice(0, 3).map((post, i) => (
              <motion.div
                key={post.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-lg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden group cursor-pointer"
              >
                <div className="overflow-hidden">
                  <img src={post.img} alt={post.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <img src={post.avatar} alt={post.author} className="w-7 h-7 rounded-full" />
                    <span className="text-xs text-[#6B7280] font-medium">{post.author}</span>
                    <span className="text-gray-300 text-xs">·</span>
                    <span className="text-xs text-[#6B7280]">{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-[#1B3F6A] text-sm leading-snug group-hover:text-[#F47920] transition-colors">
                    {post.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
          {/* 2 compact posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            {blogPosts.slice(3).map((post) => (
              <div key={post.title} className="flex gap-4 bg-white rounded-lg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-4 cursor-pointer group">
                <img src={post.img} alt={post.title} className="w-20 h-16 object-cover rounded-lg flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <img src={post.avatar} alt={post.author} className="w-5 h-5 rounded-full" />
                    <span className="text-xs text-[#6B7280]">{post.author} · {post.date}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#1B3F6A] leading-snug group-hover:text-[#F47920] transition-colors">
                    {post.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a href="#" className="inline-flex items-center gap-2 border-2 border-[#1B3F6A] text-[#1B3F6A] hover:bg-[#1B3F6A] hover:text-white font-semibold px-8 py-3 rounded-md transition-all">
              Visit The Blog <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ────────────────────────────────── */}
      <CTABanner wave />
    </div>
  );
}
