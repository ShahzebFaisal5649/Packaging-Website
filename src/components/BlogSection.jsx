import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const posts = [
  {
    title: '21 Box Design Ideas To Pump Up Your Packaging',
    author: 'Alex Jasin',
    date: 'August 12, 2024',
    img: 'https://images.unsplash.com/photo-1512331283953-1996720226ea?q=80&w=400&h=300&auto=format&fit=crop',
    avatar: 'https://i.pravatar.cc/100?u=1'
  },
  {
    title: 'Box Sizes: How To Measure A Box For Box Dimensions (+Top Box Styles)',
    author: 'Amanda Jane Rivera',
    date: 'August 12, 2024',
    img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&h=300&auto=format&fit=crop',
    avatar: 'https://i.pravatar.cc/100?u=2'
  },
  {
    title: 'The Ultimate Guide To Standout Product Packaging Design',
    author: 'Alex Jasin',
    date: 'August 12, 2024',
    img: 'https://images.unsplash.com/photo-1605264964528-06403738d6dc?q=80&w=400&h=300&auto=format&fit=crop',
    avatar: 'https://i.pravatar.cc/100?u=3'
  },
  {
    title: 'Sustainability Trends in Modern Packaging',
    author: 'Sarah M.',
    date: 'July 25, 2024',
    img: 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=400&h=300&auto=format&fit=crop',
    avatar: 'https://i.pravatar.cc/100?u=4'
  }
];

export default function BlogSection() {
  const swiperRef = useRef(null);

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-brand-navy mb-6 leading-tight">
            Learn About Custom Boxes from the Pros
          </h2>
          <p className="text-brand-navy/60 text-lg max-w-4xl mx-auto">
            Unpack expert insights with a range of content from our packaging wizards, featuring in-depth guides, custom packaging tips and inspiring customer stories.
          </p>
        </div>

        <div className="relative group px-10">
          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            modules={[Autoplay, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            loop={true}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            navigation={{
              prevEl: '.blog-prev',
              nextEl: '.blog-next',
            }}
          >
            {posts.map((post, idx) => (
              <SwiperSlide key={idx}>
                <div className="flex flex-col h-full rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group/card bg-white cursor-pointer">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                    <div className="absolute inset-0 bg-brand-navy/0 group-hover/card:bg-brand-navy/20 transition-all flex items-center justify-center opacity-0 group-hover/card:opacity-100">
                      <span className="px-6 py-2 bg-white text-brand-navy font-bold text-xs rounded-full uppercase tracking-widest">Read More</span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <img src={post.avatar} alt={post.author} className="w-8 h-8 rounded-full border border-gray-100" />
                      <div className="flex flex-col">
                        <span className="text-[12px] font-bold text-brand-navy leading-none">{post.author}</span>
                        <span className="text-[11px] text-gray-400 mt-1 uppercase tracking-tighter">Last Updated: {post.date}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-brand-navy mb-4 leading-snug group-hover/card:text-brand-coral transition-colors flex-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-brand-teal font-black text-xs uppercase tracking-widest pt-4 border-t border-gray-50">
                      Read Full Article <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="blog-prev absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-navy hover:bg-brand-coral hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100">
            <ChevronLeft size={20} />
          </button>
          <button className="blog-next absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-brand-navy hover:bg-brand-coral hover:text-white transition-all z-10 opacity-0 group-hover:opacity-100">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex justify-center mt-16">
          <button className="px-10 py-4 bg-brand-navy text-white font-black rounded-full hover:bg-brand-teal transition-all">
            Visit The Blog
          </button>
        </div>
      </div>
    </section>
  );
}
