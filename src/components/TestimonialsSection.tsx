import { CheckCircle2, Quote, Star } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

/**
 * Customer Testimonials section displaying attributable client reviews,
 * verified purchase context, and overall satisfaction rating.
 */
export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section
      id="testimonials"
      className="py-16 lg:py-20 bg-[#050B14] border-b border-white/10"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E90FF]">
              Verified Client Feedback
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-white [text-wrap:balance]">
              Trusted by Research Teams &amp; Laboratories
            </h2>
          </div>

          <div className="bg-[#0A1220] border border-white/10 rounded-xl px-5 py-3.5 flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1 text-[#1E90FF]" aria-label="4.9 out of 5 stars">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className="h-4 w-4 fill-[#1E90FF] text-[#1E90FF]" aria-hidden="true" />
              ))}
            </div>
            <div className="text-xs">
              <span className="font-mono font-bold text-white tabular-nums">4.9 / 5.0</span>
              <span className="text-slate-400 mx-1.5" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-400">99.4% Repeat Orders</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="bg-[#0A1220] border border-white/10 rounded-xl p-6 shadow-lg shadow-black/25 hover:border-[#1E90FF]/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1" aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="h-3.5 w-3.5 fill-[#1E90FF] text-[#1E90FF]"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <Quote className="h-4 w-4 text-slate-600" aria-hidden="true" />
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="font-serif text-base font-bold text-white">{item.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {item.role} · {item.organization}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">
                    {item.productPurchased} · {item.verifiedDate}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
