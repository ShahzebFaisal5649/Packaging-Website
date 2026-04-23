import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export default function FAQAccordion({ items = [] }) {
  const [open, setOpen] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((faq, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left bg-white hover:bg-[#EEF4FB] transition-colors"
          >
            <span className="font-semibold text-[#1B3F6A] text-sm sm:text-base leading-snug">
              {faq.q}
            </span>
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EEF4FB] flex items-center justify-center text-[#F47920]">
              {open === i ? <Minus size={13} /> : <Plus size={13} />}
            </span>
          </button>
          {open === i && (
            <div className="px-6 pb-5 bg-white border-t border-gray-100 animate-fade-in">
              <p className="text-[#6B7280] text-sm leading-relaxed pt-3">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
