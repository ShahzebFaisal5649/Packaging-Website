import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import FAQAccordion from '../components/FAQAccordion';
import CTABanner from '../components/CTABanner';

const allFaqs = [
  { q: 'Can you design my custom boxes?',
    a: "Yes! Our in-house design team provides free artwork support. Share your logo and brand guidelines and we'll create a print-ready dieline at no extra charge." },
  { q: 'What is the minimum order quantity?',
    a: 'Our minimum order quantity starts at just 100 boxes. We offer competitive per-unit pricing at every level from 100 to 100,000+ units.' },
  { q: 'How long does production take?',
    a: 'Standard production takes 8–10 business days after artwork approval. Rush options are available for 5–7 day turnaround at an additional cost.' },
  { q: 'Do you offer discounts for large bulk orders?',
    a: 'Absolutely. Per-unit cost decreases significantly at higher quantities. Orders of 1,000+ units receive our best rates. Contact us for a custom bulk quote.' },
  { q: 'When will I receive my order?',
    a: 'Standard production takes 8–10 business days after artwork approval, plus 3–5 business days shipping. Rush production options are also available.' },
  { q: 'What printing methods do you use?',
    a: 'We use CMYK offset printing, digital printing, and specialty finishes including matte/gloss lamination, soft-touch, UV spot coating, foil stamping, and embossing.' },
  { q: 'Can you print inside and outside?',
    a: 'Yes. We offer outside-only printing, full inside and outside printing, and no-print options. Inside printing is ideal for premium unboxing experiences.' },
  { q: 'Can I get a physical sample before ordering?',
    a: 'Absolutely. We offer a free sample kit showcasing our materials and print quality. Request it through our website or by calling our team.' },
  { q: 'What file formats do you accept for artwork?',
    a: 'We accept AI, EPS, PDF, and PSD files at 300 DPI with CMYK color mode and proper bleed/safe zone margins.' },
  { q: 'How will I know what my box looks like before finalizing?',
    a: 'Every order includes a full-color 2D dieline proof and a 3D digital mockup. Production only begins after you provide written approval of your proof.' },
  { q: 'Do you offer eco-friendly packaging options?',
    a: 'Yes! We offer FSC-certified Kraft materials, soy-based inks, and fully recyclable corrugated options. Ask your account manager about our Green Packaging program.' },
  { q: 'Is there a setup fee?',
    a: 'No setup fees for standard orders. Rush production, specialty finishes, and physical sample kits may carry additional costs — always disclosed upfront in your quote.' },
];

export default function FAQs() {
  return (
    <div>
      <section className="bg-[#1B3F6A] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-5">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">FAQs</span>
          </div>
          <div className="max-w-2xl">
            <SectionLabel text="Help Center" />
            <h1 className="text-4xl sm:text-5xl font-bold text-white mt-1 mb-4 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-white/75 text-base leading-relaxed">
              Everything you need to know about ordering custom packaging with Refine Packaging.
            </p>
          </div>
        </div>
        <svg className="w-full mt-10 -mb-1 block" viewBox="0 0 1440 50" fill="none" preserveAspectRatio="none">
          <path d="M0,30 C480,60 960,0 1440,30 L1440,50 L0,50 Z" fill="white" />
        </svg>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <FAQAccordion items={allFaqs} />
        </div>
      </section>

      <section className="bg-[#EEF4FB] py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-bold text-[#1B3F6A] mb-3">Still have questions?</h2>
          <p className="text-[#6B7280] text-sm mb-7">
            Our packaging experts are available Monday–Friday, 9am–6pm EST.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/custom-box"
              className="bg-[#F47920] hover:bg-[#d96510] text-white font-semibold px-7 py-3 rounded-md transition-colors"
            >
              Get a Free Quote
            </Link>
            <a
              href="tel:8001234567"
              className="border-2 border-[#1B3F6A] text-[#1B3F6A] hover:bg-[#1B3F6A] hover:text-white font-semibold px-7 py-3 rounded-md transition-all"
            >
              Call (800) 123-4567
            </a>
          </div>
        </div>
      </section>

      <CTABanner wave={false} />
    </div>
  );
}
