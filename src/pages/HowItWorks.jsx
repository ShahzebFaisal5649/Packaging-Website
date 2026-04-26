import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, MessageSquare, Upload, Eye, Package } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import CTABanner from '../components/CTABanner';

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
    <div>
      <section className="bg-[#1B3F6A] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">How It Works</span>
          </div>
          <div className="max-w-2xl">
            <SectionLabel text="Our Process" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-1 mb-4 leading-tight">
              How It Works
            </h1>
            <p className="text-white/75 text-base leading-relaxed">
              Ordering custom packaging has never been easier. Our 4-step process gets you from
              idea to delivery as smoothly as possible.
            </p>
          </div>
        </div>
        <svg className="w-full mt-10 -mb-1 block" viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,50 L0,50 Z" fill="white" />
        </svg>
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
                <div className="w-14 h-14 bg-[#1B3F6A] rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <Icon size={22} className="text-white" />
                </div>
                {i < 3 && <div className="w-px flex-1 bg-[#1B3F6A]/15 mt-3" style={{ minHeight: 48 }} />}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-xs font-bold text-[#F47920] uppercase tracking-widest mb-1">Step {num}</p>
                <h2 className="text-2xl font-bold text-[#1B3F6A] mb-3">{title}</h2>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-4">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tips.map((tip) => (
                    <span key={tip} className="bg-[#EEF4FB] text-[#1B3F6A] text-xs font-semibold px-3 py-1.5 rounded-full">
                      ✓ {tip}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#EEF4FB] py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-[#1B3F6A] mb-4">Ready to get started?</h2>
          <p className="text-[#6B7280] text-sm mb-7">
            Use our interactive box builder to configure your custom packaging and get an instant quote.
          </p>
          <Link
            to="/custom-box"
            className="inline-block bg-[#F47920] hover:bg-[#d96510] text-white font-semibold px-10 py-4 rounded-md text-base transition-all hover:scale-105"
          >
            Build Your Box Now
          </Link>
        </div>
      </section>

      <CTABanner wave={false} />
    </div>
  );
}
