import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, ArrowRight, ChevronRight, CheckCircle } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import CTABanner from '../components/CTABanner';

const fadeUp = {
  hidden:  { opacity: 0, y: 22 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const partners = ['T-Mobile','Adidas','Pandora','Marriott','MetLife','Old Spice'];

const supportFeatures = [
  { title: 'Expert Packaging Consultants',  desc: 'Specialists help you choose the perfect style, material, and finish for your product and budget.' },
  { title: 'Free Design Artwork Support',   desc: 'Our in-house designers create print-ready artwork at no additional charge — just send your logo.' },
  { title: 'Digital Proof Approval',        desc: 'Review a full-color 2D dieline and 3D mockup before we send anything to production.' },
  { title: 'Dedicated Account Manager',     desc: 'Every order gets a dedicated point of contact who keeps you informed from quote to doorstep.' },
];

const values = [
  'ISO-certified manufacturing facilities',
  'FSC-certified eco-friendly materials',
  'CMYK + Pantone color matching',
  '100% satisfaction guarantee',
  'Free physical sample kits',
  'Real-time shipment tracking',
];

function WaveDivider({ fromColor = '#fff', toColor = '#EEF4FB', flip = false }) {
  return (
    <div className="w-full overflow-hidden leading-none" style={{ background: fromColor }}>
      <svg viewBox="0 0 1440 50" preserveAspectRatio="none" className={`w-full h-10 sm:h-14 block ${flip ? 'rotate-180' : ''}`}>
        <path d="M0,30 C480,60 960,0 1440,30 L1440,50 L0,50 Z" fill={toColor} />
      </svg>
    </div>
  );
}

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-[#1B3F6A] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">About</span>
          </div>
          <div className="text-center max-w-3xl mx-auto">
            <SectionLabel text="Our Story" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-1 mb-4 leading-tight">
              About Refine Packaging
            </h1>
            <p className="text-white/75 text-base leading-relaxed mb-10">
              We are a team of packaging enthusiasts dedicated to helping brands of all sizes create
              packaging that makes a lasting impression — from solo founders to Fortune 500 companies.
            </p>
          </div>
          {/* Video */}
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
              <img
                src="https://placehold.co/900x440/152f52/ffffff?text=Refine+Packaging+Story"
                alt="About video"
                className="w-full"
              />
              <div className="absolute inset-0 bg-[#1B3F6A]/40 flex items-center justify-center">
                <div className="w-18 h-18 w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-[#F47920] ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <svg className="w-full mt-10 -mb-1 block" viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,50 L0,50 Z" fill="white" />
        </svg>
      </section>

      {/* Mission */}
      <section className="bg-white py-16 relative overflow-hidden">
        {/* Blob decorations */}
        <svg className="absolute -left-16 top-1/2 -translate-y-1/2 w-40 opacity-[0.06] pointer-events-none" viewBox="0 0 200 400">
          <ellipse cx="0" cy="200" rx="160" ry="180" fill="#1B3F6A" />
        </svg>
        <svg className="absolute -right-16 top-1/2 -translate-y-1/2 w-40 opacity-[0.06] pointer-events-none" viewBox="0 0 200 400">
          <ellipse cx="200" cy="200" rx="160" ry="180" fill="#F47920" />
        </svg>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <SectionLabel text="Our Mission" />
          <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-5">
            Packaging that tells your brand's story
          </h2>
          <p className="text-[#6B7280] text-base leading-relaxed mb-4">
            Our mission is to democratize premium custom packaging — making world-class design and
            production accessible to businesses of every size. We believe every product deserves
            packaging that excites, inspires, and creates a memorable unboxing moment.
          </p>
          <p className="text-[#6B7280] leading-relaxed text-sm">
            Founded in 2015, Refine Packaging has grown from a small team of 5 to a global operation
            with manufacturing partners across North America, Europe, and Asia — all held to the same
            strict quality and sustainability standards.
          </p>
        </div>
      </section>

      {/* Trusted by */}
      <WaveDivider fromColor="#fff" toColor="#EEF4FB" />
      <section className="bg-[#EEF4FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <SectionLabel text="Our Clients" />
          <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-10">
            Trusted By The World's Top Brands
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-5 mb-8">
            {partners.map((p, i) => (
              <motion.div
                key={p}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-xl p-5 flex items-center justify-center shadow-card hover:shadow-card-hover transition-shadow"
              >
                <span className="font-bold text-sm text-[#1B3F6A] text-center">{p}</span>
              </motion.div>
            ))}
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[#F47920] font-semibold text-sm hover:gap-2.5 transition-all"
          >
            Explore our customer stories <ArrowRight size={14} />
          </Link>
        </div>
      </section>
      <WaveDivider fromColor="#EEF4FB" toColor="#fff" flip />

      {/* Who We Are */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionLabel text="Who We Are" />
              <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-5">
                A team obsessed with packaging excellence
              </h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
                Refine Packaging was built by designers, engineers, and logistics experts who saw a
                gap in the market: brands were either stuck with generic packaging or navigating
                complex, expensive custom manufacturing processes.
              </p>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                We built a better way. Our streamlined process, in-house design support, and global
                manufacturing network mean you get custom-quality packaging with the speed and
                simplicity of a standard order.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {values.map((v) => (
                  <div key={v} className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-[#F47920] mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-[#6B7280]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://placehold.co/540x420/EEF4FB/1B3F6A?text=Our+Team"
                alt="Our team"
                className="w-full rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-lg p-5 border border-gray-100">
                <div className="font-bold text-[#1B3F6A] text-3xl">10+</div>
                <div className="text-xs text-[#6B7280] font-medium">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <WaveDivider fromColor="#fff" toColor="#EEF4FB" />
      <section className="bg-[#EEF4FB] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <SectionLabel text="What We Do" />
          <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1 mb-5">
            End-to-end custom packaging solutions
          </h2>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            From initial concept to final delivery, Refine Packaging handles every aspect of your
            custom packaging journey — structural engineering, artwork design, material sourcing,
            printing, quality control, and logistics — all under one roof.
          </p>
          <p className="text-[#6B7280] leading-relaxed text-sm">
            Our online configurator lets you design, visualize, and order your packaging in minutes.
            Or speak with one of our experts who will guide you through every decision to ensure
            you get the perfect result.
          </p>
        </div>
      </section>
      <WaveDivider fromColor="#EEF4FB" toColor="#fff" flip />

      {/* Unrivaled Support */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel text="Customer Support" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1">Unrivaled Customer Support</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {supportFeatures.map(({ title, desc }, i) => (
              <motion.div
                key={title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-[#EEF4FB] rounded-lg p-7"
              >
                <div className="w-3 h-3 bg-[#F47920] rounded-full mb-4" />
                <h3 className="font-bold text-[#1B3F6A] text-base mb-2">{title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Kit CTA */}
      <section className="bg-[#EEF4FB] py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-[#1B3F6A] rounded-2xl p-10 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <SectionLabel text="Free Sample Kit" />
            <h2 className="text-3xl font-bold text-white mt-1 mb-3">
              Request a Free Sample Kit
            </h2>
            <p className="text-white/75 text-sm mb-7 max-w-md mx-auto">
              See our material quality and print standards firsthand. We'll ship a free sample kit
              directly to your door — no strings attached.
            </p>
            <Link
              to="/custom-box"
              className="inline-block bg-[#F47920] hover:bg-[#d96510] text-white font-semibold px-10 py-4 rounded-md text-base transition-all hover:scale-105"
            >
              Request Free Sample
            </Link>
          </div>
        </div>
      </section>

      <CTABanner wave={false} />
    </div>
  );
}
