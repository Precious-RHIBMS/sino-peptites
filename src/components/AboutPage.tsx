import { ArrowLeft, Award, FlaskConical, Mail, MessageCircle, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';
import { SafeImage } from './SafeImage';

interface AboutPageProps {
  brandName: string;
  products: Product[];
  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  onBackToStore: () => void;
  onNavigateSection: (sectionId: string) => void;
  onSelectProduct: (product: Product) => void;
}

function getCompactPriceDisplay(product: Product) {
  const firstOriginal = product.variants[0]?.originalPrice;
  const prices = product.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (firstOriginal) {
    return {
      original: `$${firstOriginal.toFixed(0)}`,
      current: `$${product.variants[0].price.toFixed(0)}`,
    };
  }

  return {
    original: null,
    current: min === max ? `$${min.toFixed(0)}` : `$${min.toFixed(0)} – $${max.toFixed(0)}`,
  };
}

/**
 * Dedicated About Page featuring sino_pepts laboratory overview paired with
 * the 3-column Products, Main Menu, and Need Assistance support directory.
 */
export function AboutPage({
  brandName,
  products,
  contact,
  onBackToStore,
  onNavigateSection,
  onSelectProduct,
}: AboutPageProps) {
  // Feature 5 representative catalog formulations (including discounted/peptide items)
  const featuredProducts = products.slice(0, 5);

  const menuLinks = [
    { label: 'HOME', id: 'home' },
    { label: 'OUR STORY', id: 'our-story' },
    { label: 'COA', id: 'certificates' },
    { label: `${brandName.toUpperCase()} STORE`, id: 'store' },
    { label: 'CATEGORIES', id: 'categories' },
    { label: 'PAYMENT OPTION', id: 'payment-options' },
    { label: 'CONTACT US', id: 'contact' },
  ];

  return (
    <section
      id="about-page"
      aria-labelledby="about-page-heading"
      className="py-10 lg:py-16 bg-[#050B14] min-h-[75vh]"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackToStore}
          className="min-h-[44px] inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 hover:text-[#1E90FF] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Storefront
        </button>

        {/* Brand Overview Intro */}
        <div className="bg-[#0A1220] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-10 mb-8 shadow-xl shadow-black/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1E90FF]">
                About {brandName}
              </p>
              <h1
                id="about-page-heading"
                className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight [text-wrap:balance]"
              >
                Analytical Precision for Every Research Protocol
              </h1>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {brandName} supplies independently verified lyophilized peptides, coenzymes, and
                reconstitution diluents from our Portland fulfillment hub. Every synthesis lot is
                quarantined for third-party RP-HPLC purity and LC-MS mass identity testing before
                dispatch, with printed lot certificates enclosed in every parcel.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              {[
                {
                  icon: FlaskConical,
                  title: '>99% HPLC Purity',
                  detail: 'Independent lot verification',
                },
                {
                  icon: Award,
                  title: 'Included COA',
                  detail: 'Lot-matched batch reports',
                },
                {
                  icon: ShieldCheck,
                  title: 'Cold-Chain Sealed',
                  detail: 'Nitrogen-flushed Type I vials',
                },
                {
                  icon: Truck,
                  title: 'Tracked Dispatch',
                  detail: 'Insured domestic & global',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-[#050B14] border border-white/10 rounded-xl p-4"
                  >
                    <Icon className="h-4 w-4 text-[#1E90FF]" aria-hidden="true" />
                    <p className="mt-2.5 text-xs sm:text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-300 leading-snug">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3-Column Directory & Support Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Column 1: PRODUCTS */}
          <div className="bg-[#0A1220] border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/30 flex flex-col">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Products</h2>
              <div className="w-8 h-0.5 bg-white/30 mt-2.5 mb-5" aria-hidden="true" />
            </div>

            <ul className="divide-y divide-white/10 flex-1">
              {featuredProducts.map((product) => {
                const price = getCompactPriceDisplay(product);
                const frameBg = product.imageBg === 'dark' ? 'bg-[#080C12]' : 'bg-white';

                return (
                  <li key={product.id}>
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="w-full min-h-[68px] py-3.5 flex items-center gap-4 text-left group hover:bg-white/[0.03] rounded-lg px-2 -mx-2 transition-colors"
                    >
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden p-1.5 shrink-0 border border-white/10 ${frameBg}`}
                      >
                        <SafeImage
                          src={product.image}
                          alt={product.name}
                          fallbackTitle={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white group-hover:text-[#1E90FF] transition-colors line-clamp-2 leading-snug">
                          {product.name}
                        </p>
                        <p className="mt-1 text-sm font-mono tabular-nums flex items-center gap-2">
                          {price.original && (
                            <span className="text-slate-400 line-through">{price.original}</span>
                          )}
                          <span className="text-white font-bold">{price.current}</span>
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 2: MAIN MENU */}
          <div className="bg-[#0A1220] border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/30 flex flex-col">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white">Main Menu</h2>
              <div className="w-8 h-0.5 bg-white/30 mt-2.5 mb-5" aria-hidden="true" />
            </div>

            <nav aria-label="About Page Directory Navigation" className="flex-1">
              <ul className="divide-y divide-white/10">
                {menuLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => onNavigateSection(link.id)}
                      className="w-full min-h-[48px] py-3 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-slate-200 hover:text-[#1E90FF] hover:pl-1.5 transition-all flex items-center justify-between"
                    >
                      <span>{link.label}</span>
                      <span className="text-slate-500 text-xs" aria-hidden="true">
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 3: Need Assistance? */}
          <div className="bg-[#0A1220] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/30 flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Need Assistance?
              </h2>
              <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
                Our support team is available to help with product inquiries, order updates, shipping
                information, and general questions. Contact us anytime using the options below.
              </p>

              <div className="mt-7 space-y-3.5 max-w-xs">
                <a
                  href={`mailto:${contact.email}`}
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-white text-[#050B14] hover:bg-[#1E90FF] hover:text-white text-sm font-semibold shadow-md transition-colors"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Email Us</span>
                </a>

                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Contact support on Telegram (opens in a new tab)"
                  className="w-full min-h-[48px] inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-full bg-white text-[#050B14] hover:bg-[#1E90FF] hover:text-white text-sm font-semibold shadow-md transition-colors"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-white/10 text-xs sm:text-sm text-slate-300">
              <p>
                © {new Date().getFullYear()}{' '}
                <span className="font-bold text-white uppercase">{brandName}</span>. All Rights
                Reserved.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {contact.address} · {contact.hours}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
