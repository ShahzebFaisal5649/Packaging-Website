import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, MessageSquare, Upload, Eye, Package, ShieldCheck, Zap, Award, Headphones, Box, ArrowRight, Play, Info, CheckCircle2 } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';
import CTABanner from '../components/CTABanner';

const G = '#1A4D2E';
const ACCENT = '#C8860A';
const BG = '#F5F2ED';

const steps = [
  { num: '01', Icon: MessageSquare, title: 'Configure & Quote',
    desc: 'Use our industry-leading box configurator to specify every detail—from custom dimensions and premium materials to high-end finishes and quantities.',
    tips: ['Real-time price estimates', 'No hidden setup fees', 'All industry styles available'] },
  { num: '02', Icon: Upload, title: 'Design & Artwork',
    desc: "Upload your existing designs or collaborate with our in-house experts. We'll provide a custom dieline template perfectly matched to your box dimensions.",
    tips: ['Pro design assistance', 'Dieline creation included', 'Color matching (CMYK/PMS)'] },
  { num: '03', Icon: Eye, title: 'Review & Proofing',
    desc: "Verify your vision with high-fidelity 2D dielines and interactive 3D digital mockups. We only proceed when you're 100% satisfied with the digital proof.",
    tips: ['3D 360° interactive view', 'Unlimited design revisions', 'Physical prototype options'] },
  { num: '04', Icon: Package, title: 'Print & Ship',
    desc: 'Your order moves into our state-of-the-art production facility. After a rigorous 14-point quality inspection, your boxes are shipped tracked to your door.',
    tips: ['Rapid 8-10 day turnaround', 'Secure premium shipping', 'Quality guaranteed'] },
];

const features = [
  { icon: <ShieldCheck size={28} />, title: 'Quality Guaranteed', desc: "Every single unit undergoes a strict quality control check before it leaves our facility." },
  { icon: <Zap size={28} />, title: 'Fast Turnaround', desc: "Standard production in 8-10 business days. Priority shipping available for urgent launches." },
  { icon: <Award size={28} />, title: 'Premium Finish', desc: "Access high-end finishes like spot UV, embossing, and foil stamping to make your brand pop." },
  { icon: <Headphones size={28} />, title: 'Expert Support', desc: "Dedicated account managers to guide you from initial concept to final delivery." },
];

export default function HowItWorks() {
  return (
    <div style={{ backgroundColor: BG }}>
      {/* Dynamic Hero Section */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 24px 80px', backgroundColor: G, minHeight: 500, display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.25 }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent, ${G} 95%)` }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-100" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex items-center gap-2 text-white/50 text-xs mb-8">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={12} />
            <span className="text-white font-semibold">How It Works</span>
          </div>
          
          <div style={{ maxWidth: 800 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <SectionLabel text="Seamless Process" />
              <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', color: '#fff', fontWeight: 900, fontFamily: '"Playfair Display", serif', lineHeight: 1.1, marginTop: 12, marginBottom: 24 }}>
                From Concept to <span style={{ color: ACCENT }}>Doorstep</span>.
              </h1>
              <p style={{ fontSize: 'clamp(16px, 3vw, 20px)', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 40, maxWidth: 600 }}>
                Ordering world-class custom packaging shouldn't be complicated. We've streamlined every step to ensure your brand shines without the stress.
              </p>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <Link to="/custom-box" style={{ padding: '18px 40px', background: ACCENT, color: '#fff', borderRadius: 12, fontWeight: 700, textDecoration: 'none', boxShadow: `0 20px 40px rgba(200,134,10,0.3)` }}>Start Designing</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The 4-Step Journey */}
      <section style={{ padding: '120px 24px', background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div style={{ textAlign: 'center', marginBottom: 100 }}>
            <h2 style={{ fontSize: 42, fontFamily: '"Playfair Display", serif', fontWeight: 800, color: G, marginBottom: 16 }}>Your Project Timeline</h2>
            <p style={{ color: '#666', maxWidth: 600, margin: '0 auto' }}>We handle the heavy lifting so you can focus on growing your business. Here is what happens after you click start.</p>
          </div>

          <div style={{ position: 'relative' }}>
             {/* Background Line for desktop */}
             <div className="hidden lg:block" style={{ position: 'absolute', top: 120, left: '10%', right: '10%', height: 2, background: `linear-gradient(to right, transparent, ${G}15 20%, ${G}15 80%, transparent)`, zIndex: 0 }} />

             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40 }}>
                {steps.map((s, i) => (
                  <motion.div 
                    key={s.num} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
                  >
                    <div style={{ width: 80, height: 80, borderRadius: 24, background: G, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 20px 40px rgba(26,77,46,0.2)', transform: 'rotate(-5deg)' }}>
                       <s.Icon size={32} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Step {s.num}</span>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: G, margin: '12px 0 16px' }}>{s.title}</h3>
                    <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 24 }}>{s.desc}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                       {s.tips.map(t => (
                         <div key={t} style={{ fontSize: 12, color: G, fontWeight: 600, background: `${G}08`, padding: '6px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle2 size={12} /> {t}
                         </div>
                       ))}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section style={{ padding: '100px 24px', background: '#F8F6F2', borderTop: '1px solid #EAE6E1', borderBottom: '1px solid #EAE6E1' }}>
        <div className="max-w-7xl mx-auto">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40 }}>
             {features.map((f, i) => (
               <div key={i} style={{ display: 'flex', gap: 20 }}>
                  <div style={{ color: ACCENT, flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <h4 style={{ fontSize: 18, fontWeight: 700, color: G, marginBottom: 8 }}>{f.title}</h4>
                    <p style={{ fontSize: 14, color: '#666', lineHeight: 1.5 }}>{f.desc}</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Pro Tips Section */}
      <section style={{ padding: '120px 24px', background: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
           <div style={{ background: G, borderRadius: 32, padding: '60px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', overflow: 'hidden', position: 'relative' }} className="responsive-split">
              <div style={{ position: 'absolute', right: '-10%', top: '-10%', width: 400, height: 400, background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }} />
              
              <div>
                 <SectionLabel text="Expert Advice" light />
                 <h2 style={{ fontSize: 36, fontWeight: 800, color: '#fff', marginTop: 12, marginBottom: 24, fontFamily: '"Playfair Display", serif' }}>Dielines & Design Specs</h2>
                 <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.7, marginBottom: 32 }}>
                   Getting your artwork right is the key to perfect packaging. We provide custom dielines for every order, but if you're starting from scratch, here are a few things to keep in mind:
                 </p>
                 <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                      'Use vector formats (.AI, .EPS) for crisp logos',
                      'Maintain 300 DPI for any raster images',
                      'Ensure all text is outlined/converted to shapes',
                      'Allow 0.125" bleed for all background colors'
                    ].map(item => (
                      <li key={item} style={{ color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', gap: 12, fontWeight: 500 }}>
                         <div style={{ width: 16, height: 16, borderRadius: '50%', background: ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowRight size={10} color="white" /></div>
                         {item}
                      </li>
                    ))}
                 </ul>
              </div>
              
              <div style={{ position: 'relative', height: 400, borderRadius: 24, overflow: 'hidden', boxShadow: '0 32px 64px rgba(0,0,0,0.3)' }}>
                 <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=80" alt="Design Specs" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
              </div>
           </div>
        </div>
      </section>


      <CTABanner wave={false} />

      <style>{`
        @media (max-width: 900px) {
          .responsive-split { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        .mobile-center-text { text-align: left; }
        @media (max-width: 600px) {
          .mobile-center-text { text-align: center; }
          .mobile-center-header { justify-content: center; }
        }
      `}</style>
    </div>
  );
}
