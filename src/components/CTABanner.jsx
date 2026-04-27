import { Link } from 'react-router-dom';

/* Wave SVG top divider */
function WaveTop() {
  return (
    <div className="w-full overflow-hidden leading-none -mb-1">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-14 sm:h-16">
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="#1B3F6A" />
      </svg>
    </div>
  );
}

export default function CTABanner({
  heading = "Ready to think outside the box? Let's get started!",
  sub     = 'Get your custom packaging quote today free design support included.',
  cta     = 'Get Free Quote',
  to      = '/custom-box',
  wave    = true,
}) {
  return (
    <>
      {wave && <WaveTop />}
      <section className="bg-[#1B3F6A] py-16 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">{heading}</h2>
          <p className="text-white/75 text-base mb-8 max-w-xl mx-auto">{sub}</p>
          <Link
            to={to}
            className="inline-block bg-[#F47920] hover:bg-[#d96510] text-white font-semibold px-10 py-4 rounded-md text-base transition-all hover:scale-105 shadow-lg shadow-orange-900/25"
          >
            {cta}
          </Link>
        </div>
      </section>
    </>
  );
}
