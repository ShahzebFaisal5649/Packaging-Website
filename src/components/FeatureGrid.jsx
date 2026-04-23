import { Package, Settings, Palette, Box, Globe, Truck } from 'lucide-react';

const features = [
  { Icon: Package,  title: 'Successful Packaging Solutions',     desc: 'Over 10,000 brands trust our packaging expertise to create boxes that protect and impress.' },
  { Icon: Settings, title: 'Exceptional Structural Engineering', desc: 'Every box is engineered for structural integrity — protecting your product from warehouse to doorstep.' },
  { Icon: Palette,  title: 'Full Artwork Design Guidance',       desc: 'Our in-house design team helps bring your brand vision to life with print-ready files at no extra cost.' },
  { Icon: Box,      title: '2D and 3D Mockup Prototyping',       desc: 'See exactly how your packaging looks before production with detailed digital 2D dielines and 3D proofs.' },
  { Icon: Globe,    title: 'Global Manufacturing Excellence',    desc: 'ISO-certified facilities across North America, Europe, and Asia ensure consistent quality on every order.' },
  { Icon: Truck,    title: 'Stress-Free Shipping and Tracking',  desc: 'Real-time shipment tracking and a dedicated account manager keep you informed from print to delivery.' },
];

export default function FeatureGrid({ count = 6 }) {
  const shown = features.slice(0, count);
  return (
    <section className="py-16 bg-[#EEF4FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F47920] mb-2">Why Choose Us</p>
          <h2 className="text-3xl font-bold text-[#1B3F6A]">Unrivaled Customer Support</h2>
        </div>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${count > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-5`}>
          {shown.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-lg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 p-6"
            >
              <div className="w-11 h-11 bg-[#EEF4FB] rounded-lg flex items-center justify-center mb-4">
                <Icon size={20} className="text-[#1B3F6A]" />
              </div>
              <h3 className="font-semibold text-[#1B3F6A] mb-2">{title}</h3>
              <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
