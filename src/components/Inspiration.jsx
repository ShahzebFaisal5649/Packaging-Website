const inspirationImages = [
  'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&h=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605264964528-06403738d6dc?q=80&w=400&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?q=80&w=400&h=550&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1512331283953-1996720226ea?q=80&w=400&h=500&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&h=650&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1549465220-1d8c9d9c4701?q=80&w=400&h=450&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=400&h=550&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&h=500&auto=format&fit=crop',
];

export default function Inspiration() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-brand-navy mb-6">Inspiration</h2>
          <p className="text-brand-navy/60 text-lg max-w-3xl mx-auto mb-4">
            Need some #PackagingInspo? Take a look at some of our past and recent projects and get inspired by brands who turned their branded boxes into marketing powerhouses.
          </p>
          <a href="#" className="text-brand-coral font-black hover:underline tracking-wide">
            Follow Us On Instagram: @RefinePackaging
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <img src={inspirationImages[0]} alt="Inspire 1" className="w-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1" />
            <img src={inspirationImages[1]} alt="Inspire 2" className="w-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1" />
          </div>
          {/* Column 2 - Staggered */}
          <div className="flex flex-col gap-6 pt-12">
            <img src={inspirationImages[2]} alt="Inspire 3" className="w-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1" />
            <img src={inspirationImages[3]} alt="Inspire 4" className="w-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1" />
          </div>
          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <img src={inspirationImages[4]} alt="Inspire 5" className="w-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1" />
            <img src={inspirationImages[5]} alt="Inspire 6" className="w-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1" />
          </div>
          {/* Column 4 - Staggered - Hidden on Mobile */}
          <div className="hidden lg:flex flex-col gap-6 pt-12">
            <img src={inspirationImages[6]} alt="Inspire 7" className="w-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1" />
            <img src={inspirationImages[7]} alt="Inspire 8" className="w-full rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1" />
          </div>
        </div>
      </div>
    </section>
  );
}
