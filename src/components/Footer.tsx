import { Building2, CreditCard, Globe, Mail, MapPin, Phone, Smartphone } from 'lucide-react';
import { PolicyType } from '../types';

interface FooterProps {
  brandName: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    hours: string;
  };
  onOpenPolicy: (policy: PolicyType) => void;
  onOpenAbout: () => void;
  onNavigateSection: (sectionId: string) => void;
}

/**
 * Storefront footer housing Payment Options overview, Contact details,
 * Policy links, and social channels.
 */
export function Footer({
  brandName,
  contact,
  onOpenPolicy,
  onOpenAbout,
  onNavigateSection,
}: FooterProps) {
  return (
    <footer className="bg-[#03070E] text-slate-300 border-t border-white/10">
      {/* Payment Options & Contact Strip */}
      <div
        id="payment-options"
        className="border-b border-white/10 bg-[#050B14] py-12 scroll-mt-20"
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#0A1220] border border-white/10 rounded-xl p-5 flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-[#1E90FF]/10 border border-[#1E90FF]/20 flex items-center justify-center shrink-0">
              <CreditCard className="h-5 w-5 text-[#1E90FF]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">Credit &amp; Debit Cards</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Instant settlement via Visa, Mastercard, and corporate procurement cards.
              </p>
            </div>
          </div>

          <div className="bg-[#0A1220] border border-white/10 rounded-xl p-5 flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-[#1E90FF]/10 border border-[#1E90FF]/20 flex items-center justify-center shrink-0">
              <Building2 className="h-5 w-5 text-[#1E90FF]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">Direct Bank Transfer</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                ACH, SEPA, and international wire transfers with 48-hour batch reservation.
              </p>
            </div>
          </div>

          <div className="bg-[#0A1220] border border-white/10 rounded-xl p-5 flex items-start gap-4">
            <div className="h-10 w-10 rounded-lg bg-[#1E90FF]/10 border border-[#1E90FF]/20 flex items-center justify-center shrink-0">
              <Smartphone className="h-5 w-5 text-[#1E90FF]" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white">Mobile Money Wallets</h3>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Seamless checkout via M-Pesa, MTN MoMo, Airtel Money, and Orange Money.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div
        id="contact"
        className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 scroll-mt-20"
      >
        <div>
          <h2 className="font-serif text-xl font-bold text-white">{brandName}</h2>
          <p className="mt-3 text-xs text-slate-400 leading-relaxed">
            Lyophilized research peptides, NAD+ coenzymes, and sterile reconstitution diluents
            independently tested for active potency and purity.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram (opens in a new tab)"
              className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-lg bg-[#0A1220] border border-white/15 text-xs text-slate-200 hover:text-white hover:border-[#1E90FF] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
              className="min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-lg bg-[#0A1220] border border-white/15 text-xs text-slate-200 hover:text-white hover:border-[#1E90FF] transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
            Navigation
          </h3>
          <ul className="space-y-1 text-xs">
            {[
              { label: 'Store Catalog', id: 'store' },
              { label: 'Shop by Category', id: 'categories' },
              { label: 'About Us', id: 'about' },
              { label: 'Our Story', id: 'our-story' },
              { label: 'Lab Certificates', id: 'certificates' },
            ].map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (link.id === 'about') {
                      onOpenAbout();
                    } else {
                      onNavigateSection(link.id);
                    }
                  }}
                  className="min-h-[40px] inline-flex items-center text-slate-300 hover:text-[#1E90FF] transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
            Policies &amp; Compliance
          </h3>
          <ul className="space-y-1 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onOpenPolicy('shipping')}
                className="min-h-[40px] inline-flex items-center text-slate-300 hover:text-[#1E90FF] transition-colors"
              >
                Shipping &amp; Dispatch Policy
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenPolicy('privacy')}
                className="min-h-[40px] inline-flex items-center text-slate-300 hover:text-[#1E90FF] transition-colors"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenPolicy('terms')}
                className="min-h-[40px] inline-flex items-center text-slate-300 hover:text-[#1E90FF] transition-colors"
              >
                Terms of Sale
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
            Laboratory &amp; Contact
          </h3>
          <ul className="space-y-3 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <Mail className="h-4 w-4 text-[#1E90FF] shrink-0 mt-0.5" aria-hidden="true" />
              <a href={`mailto:${contact.email}`} className="hover:text-white transition-colors">
                {contact.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="h-4 w-4 text-[#1E90FF] shrink-0 mt-0.5" aria-hidden="true" />
              <span className="font-mono tabular-nums">{contact.phone}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#1E90FF] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{contact.address}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Globe className="h-4 w-4 text-[#1E90FF] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{contact.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <p>Batch-traceable peptide &amp; laboratory formulations.</p>
        </div>
      </div>
    </footer>
  );
}
