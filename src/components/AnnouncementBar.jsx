import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const messages = [
  "Fast & Free Shipping On All Orders!",
  "Get 10% Off Your First Order!",
  "Free Ebook: Download Our Custom Packaging Buying Guide"
];

export default function AnnouncementBar() {
  return (
    <div style={{ backgroundColor: '#071810', color: '#fff' }} className="text-[11px] md:text-[13px] py-2 relative group overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          navigation={{
            prevEl: '.announce-prev',
            nextEl: '.announce-next',
          }}
          className="h-5"
        >
          {messages.map((msg, idx) => (
            <SwiperSlide key={idx} className="flex items-center justify-center text-center font-bold tracking-wide uppercase">
              {msg}
            </SwiperSlide>
          ))}
        </Swiper>

        <button className="announce-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 opacity-60 hover:opacity-100 transition-opacity">
          <ChevronLeft size={16} />
        </button>
        <button className="announce-next absolute right-4 top-1/2 -translate-y-1/2 z-10 opacity-60 hover:opacity-100 transition-opacity">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
