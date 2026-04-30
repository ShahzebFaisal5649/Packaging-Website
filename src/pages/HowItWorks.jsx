import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, MessageSquare, Upload, Eye, Package } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import CTABanner from '../components/CTABanner';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const steps = [
  { num: '01', Icon: MessageSquare, title: 'Get a Custom Box',
    desc: 'Use our online box configurator or call our team to specify your dimensions, style, material, finish, and quantity for an instant price estimate.',
    tips: ['No account required', 'Instant pricing estimate', 'All box styles covered'] },
  { num: '02', Icon: Upload, title: 'Submit Your Artwork',
    desc: "Upload your design files (AI, EPS, PDF, PSD) or our free design team will build print-ready artwork from your logo. We'll prepare a dieline template for your exact dimensions.",
    tips: ['Free dieline template', 'In-house design team', 'CMYK + Pantone matching'] },
  { num: '03', Icon: Eye, title: 'Approve Your Proof',
    desc: "Review a detailed 2D flat dieline and a full-color 3D digital mockup. We don't start production until you're 100% satisfied with how it looks.",
    tips: ['2D and 3D digital proofs', 'Unlimited revisions', 'Physical sample available'] },
  { num: '04', Icon: Package, title: 'Receive Your Order',
    desc: 'Your custom boxes are printed, quality-inspected, and shipped directly to your door with real-time tracking and a dedicated account manager keeping you informed.',
    tips: ['8–10 day production', 'Real-time tracking', '14-point quality check'] },
];

export default function HowItWorks() {
  return (
    <div style={{ backgroundColor: BG }}>
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 24px 60px', backgroundColor: G, minHeight: 420 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(1.1) contrast(1.15)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,77,46,0.35), rgba(26,77,46,0.65))' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-2 text-white/70 text-xs mb-5 mobile-center-header">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">How It Works</span>
          </div>
          <div className="max-w-2xl mobile-center-text">
            <SectionLabel text="Our Process" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-1 mb-4 leading-tight">
              How It Works
            </h1>
            <p className="text-white/80 text-base leading-relaxed mobile-center-text">
              Ordering custom packaging has never been easier. Our 4-step process gets you from
              idea to delivery as smoothly and reliably as possible.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {steps.map(({ num, Icon, title, desc, tips }, i) => (
            <motion.div
              key={num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex gap-6 mb-14 last:mb-0"
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-[#1A4D2E] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <Icon size={22} className="text-white" />
                </div>
                {i < 3 && <div className="w-px flex-1 bg-[#1A4D2E]/15 mt-3" style={{ minHeight: 48 }} />}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-xs font-bold text-[#C8860A] uppercase tracking-widest mb-1">Step {num}</p>
                <h2 className="text-2xl font-bold text-[#1A4D2E] mb-3">{title}</h2>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4 text-left">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tips.map((tip) => (
                    <span key={tip} className="bg-[#F5F2ED] text-[#1A4D2E] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#1A4D2E]/10">
                      ✓ {tip}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#1A4D2E] py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/70 text-sm mb-7">
            Use our interactive box builder to configure your custom packaging and get an instant quote.
          </p>
          <Link
            to="/custom-box"
            className="inline-block bg-[#C8860A] hover:bg-[#b07509] text-white font-semibold px-10 py-4 rounded-md text-base transition-all hover:scale-105"
          >
            Build Your Box Now
          </Link>
        </div>
      </section>

      <CTABanner wave={false} />
    </div>
  );
}
