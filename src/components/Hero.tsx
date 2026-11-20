import { ArrowRight, FileCheck2, FlaskConical, ShieldCheck, Truck } from 'lucide-react';

interface HeroProps {
  productCount: number;
  onExploreStore: () => void;
  onViewCertificates: () => void;
}

const TRUST_CARDS = [
  {
    title: 'Quality Tested',
    description:
      'Every peptide lot undergoes independent RP-HPLC and ESI-MS purity screening (>99%) before dispatch.',
    icon: FlaskConical,
  },
  {
    title: 'Documentation Included',
    description:
      'A signed batch Certificate of Analysis and analytical dossier accompanies every physical order.',
    icon: FileCheck2,
  },
  {
    title: 'Secure Checkout',
    description:
      'Protected payments supporting direct bank transfer, mobile money wallets, and major cards.',
    icon: ShieldCheck,
  },
  {
    title: 'Tracked Delivery',
    description:
      'Insured, temperature-buffered parcels dispatched within 24 hours with live carrier tracking.',
    icon: Truck,
  },
];

const HERO_STATS = [
  { value: '13', label: 'Verified Formulations' },
  { value: '99.4%', label: 'Client Satisfaction' },
  { value: '24–48h', label: 'Express Dispatch' },
  { value: '100%', label: 'Batch-Traceable Lots' },
];

/**
 * Storefront hero featuring pill badge, two-line Playfair Display headline,
 * 2x2 grid of trust assurance cards, and a clean bottom statistics strip.
 */
export function Hero({ productCount, onExploreStore, onViewCertificates }: HeroProps) {
  return (
    <section
      id="home"
      className="relative bg-[#050B14] pt-12 pb-14 lg:pt-20 lg:pb-20 border-b border-white/10"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Headline & Primary Route to Store */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="mb-5">
              <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#1E90FF]/10 text-[#1E90FF] border border-[#1E90FF]/25">
                ISO-17025 Lab Verified · Batch Traceable
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl xl:text-[56px] font-bold leading-[1.1] tracking-tight text-white [text-wrap:balance]">
              Pure Research Peptides
              <span className="block text-[#1E90FF] mt-1.5">Verified by Batch Science</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
              Lyophilized laboratory peptides, NAD+ coenzymes, and sterile reconstitution diluents—
              synthesized to &gt;99% purity and documented to the exact lot.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreStore}
                className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1673D6] hover:bg-[#1E90FF] text-white text-sm font-semibold shadow-lg shadow-[#1E90FF]/20 transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                Explore the Store
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onViewCertificates}
                className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0A1220] hover:bg-[#101C30] text-slate-200 border border-white/15 text-sm font-semibold transition-all hover:-translate-y-0.5 whitespace-nowrap"
              >
                Inspect Lab Certificates
              </button>
            </div>
          </div>

          {/* Right Column: 2x2 Grid of Trust Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TRUST_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-[#0A1220] border border-white/10 rounded-xl p-6 shadow-lg shadow-black/25 hover:border-[#1E90FF]/40 hover:-translate-y-0.5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="h-10 w-10 rounded-lg bg-[#1E90FF]/10 border border-[#1E90FF]/20 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-[#1E90FF]" aria-hidden="true" />
                    </div>
                    <h2 className="font-serif text-lg font-bold text-white">{card.title}</h2>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {HERO_STATS.map((stat, index) => (
            <div key={stat.label} className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-white tabular-nums">
                {index === 0 ? `${productCount}` : stat.value}
              </span>
              <span className="mt-1 text-xs sm:text-sm text-slate-400 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
