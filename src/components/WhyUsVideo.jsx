import { useState } from 'react';
import { Play, X } from 'lucide-react';
import videoThumb from '../assets/video-thumb.png';

export default function WhyUsVideo() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="bg-brand-teal py-24 relative overflow-hidden">
      {/* Decorative Brush SVGs */}
      <div className="absolute top-10 left-10 opacity-20 pointer-events-none rotate-12">
         <svg width="200" height="60" viewBox="0 0 200 60" fill="white">
            <path d="M10,30 Q50,10 90,30 T170,30" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
         </svg>
      </div>
      <div className="absolute bottom-10 right-10 opacity-20 pointer-events-none -rotate-12">
         <svg width="200" height="60" viewBox="0 0 200 60" fill="white">
            <path d="M10,30 Q50,10 90,30 T170,30" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" />
         </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
          Why 1,000s of Happy Customers Trust Refine Packaging
        </h2>
        <p className="text-white/80 text-lg mb-12 max-w-3xl leading-relaxed">
          Press play to learn why thousands of businesses trust Refine Packaging as their go-to packaging manufacturer for high-quality and affordable custom printed boxes - from small startups to Fortune 500 brands alike.
        </p>

        <div 
          className="relative group cursor-pointer rounded-3xl overflow-hidden shadow-2xl max-w-4xl w-full aspect-video border-4 border-white/10"
          onClick={() => setShowModal(true)}
          data-aos="zoom-in"
        >
          <img src={videoThumb} alt="Video Testimonial" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-brand-coral rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
              <Play size={32} className="text-white fill-current ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-fade-in">
          <button 
            className="absolute top-6 right-6 text-white hover:text-brand-coral transition-colors"
            onClick={() => setShowModal(false)}
          >
            <X size={40} />
          </button>
          <div className="w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </section>
  );
}
