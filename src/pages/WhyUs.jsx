import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Shield, Truck, Palette, HeartHandshake, Award } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import CTABanner from '../components/CTABanner';

const reasons = [
  { Icon: Star,           title: 'Premium Quality Guaranteed',   color: 'bg-yellow-50 text-yellow-600',
    desc: 'Every box goes through a 14-point quality inspection before shipping. If you\'re not happy, we make it right no questions asked.' },
  { Icon: Palette,        title: 'Free Expert Design Support',   color: 'bg-purple-50 text-purple-600',
    desc: 'Our in-house designers create stunning, print-ready artwork at zero extra cost. You get a 2D dieline and 3D mockup proof for every order.' },
  { Icon: Truck,          title: 'Fast, Reliable Shipping',      color: 'bg-blue-50 text-blue-600',
    desc: 'Standard orders ship in 8–10 business days. Need it faster? We offer 5–7 day rush production for tight deadlines.' },
  { Icon: Shield,         title: '100% Satisfaction Guarantee',  color: 'bg-green-50 text-green-600',
    desc: 'We stand behind every order. If something isn\'t right, we\'ll reprint or refund no runaround, no hassle.' },
  { Icon: HeartHandshake, title: 'Dedicated Account Managers',   color: 'bg-pink-50 text-pink-600',
    desc: 'You\'re never just an order number. Each client gets a dedicated account manager who knows your brand and your needs.' },
  { Icon: Award,          title: 'Industry-Leading Experience',  color: 'bg-orange-50 text-orange-600',
    desc: 'Over 10 years and 10,000+ brands served. Our team brings unmatched expertise to every project.' },
];

const testimonials = [
  { name: 'Jessica M.', company: 'Bloom Beauty Co.',
    text: 'Working with Refine Packaging transformed our unboxing experience. The quality is incredible for the price, and our design was turned around so fast.' },
  { name: 'David K.', company: 'Apex Ecommerce',
    text: "I've tried 3 packaging companies before and none came close to the service and quality here. The 3D mockup tool is a game-changer." },
  { name: 'Priya S.', company: 'Luna Candles',
    text: 'From first quote to delivery, the whole process was seamless. Our candle boxes look absolutely stunning and our customers love them.' },
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

export default function WhyUs() {
  return (
    <div>
      <section className="bg-[#1B3F6A] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">Why Us</span>
          </div>
          <div className="max-w-2xl">
            <SectionLabel text="Our Difference" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-1 mb-4 leading-tight">
              Why Choose Refine Packaging?
            </h1>
            <p className="text-white/75 text-base leading-relaxed">
              We don't just print boxes. We build partnerships, deliver excellence, and help your brand leave a lasting impression on every customer.
            </p>
          </div>
        </div>
        <svg className="w-full mt-10 -mb-1 block" viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,50 L0,50 Z" fill="white" />
        </svg>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reasons.map(({ Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-lg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-7"
              >
                <div className={`w-11 h-11 ${color} rounded-lg flex items-center justify-center mb-5`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-[#1B3F6A] text-base mb-2">{title}</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fromColor="#fff" toColor="#EEF4FB" />
      <section className="bg-[#EEF4FB] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <SectionLabel text="What Customers Say" />
            <h2 className="text-3xl font-bold text-[#1B3F6A] mt-1">Real Reviews from Real Brands</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg shadow-card p-7"
              >
                <div className="flex mb-3">
                  {Array(5).fill(0).map((_, si) => (
                    <Star key={si} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-[#6B7280] text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div>
                  <div className="font-bold text-[#1B3F6A] text-sm">{t.name}</div>
                  <div className="text-xs text-[#6B7280]">{t.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner wave />
    </div>
  );
}
