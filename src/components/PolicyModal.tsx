import { useRef } from 'react';
import { X } from 'lucide-react';
import { PolicyType } from '../types';
import { useDialogAccessibility } from '../utils/useDialogAccessibility';

interface PolicyModalProps {
  policy: PolicyType;
  shippingFee: number;
  freeThreshold: number;
  contactEmail: string;
  onClose: () => void;
}

/**
 * Displays Shipping Policy, Privacy Policy, or Terms of Service in an accessible modal.
 */
export function PolicyModal({
  policy,
  shippingFee,
  freeThreshold,
  contactEmail,
  onClose,
}: PolicyModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useDialogAccessibility(Boolean(policy), dialogRef, closeButtonRef, onClose);

  if (!policy) return null;

  const contentMap = {
    shipping: {
      title: 'Shipping & Dispatch Policy',
      updated: 'Effective November 2026',
      sections: [
        {
          heading: 'Flat-Rate & Complimentary Dispatch',
          body: `All orders ship with insured, end-to-end carrier tracking at a flat rate of $${shippingFee.toFixed(
            2
          )}. Orders totaling $${freeThreshold.toFixed(
            2
          )} or more qualify automatically for complimentary insured delivery.`,
        },
        {
          heading: 'Temperature-Buffered Packaging',
          body: 'Lyophilized peptide vials and temperature-sensitive formulations are packed in insulated sleeves alongside lot-matched Certificates of Analysis. Parcels leave our Portland facility within 24–48 business hours.',
        },
        {
          heading: 'International Customs & Documentation',
          body: 'Each international shipment includes full commercial laboratory nomenclature and purity certificates to facilitate smooth customs clearance.',
        },
      ],
    },
    privacy: {
      title: 'Privacy & Data Protection Policy',
      updated: 'Effective November 2026',
      sections: [
        {
          heading: 'Minimal Data Collection',
          body: 'We collect only the contact and shipping details required to fulfill your formulation order and issue batch documentation.',
        },
        {
          heading: 'Payment Security',
          body: 'Card credentials, bank transfer references, and payment processor settlement confirmations are processed solely to verify orders and are never sold or shared with third-party data brokers.',
        },
        {
          heading: 'Your Rights',
          body: `You may request access, correction, or deletion of your order contact records at any time by writing to ${contactEmail}.`,
        },
      ],
    },
    terms: {
      title: 'Terms of Sale & Laboratory Guarantee',
      updated: 'Effective November 2026',
      sections: [
        {
          heading: 'Analytical Guarantee',
          body: 'Every product lot sold on sino_pepts is warranted to match the active assay and purity ranges published on its accompanying Certificate of Analysis.',
        },
        {
          heading: '30-Day Unopened Return Window',
          body: 'Unopened, tamper-sealed vessels may be returned within 30 days of delivery for a full refund or replacement.',
        },
      ],
    },
  };

  const active = contentMap[policy];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg bg-[#0A1220] border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-[#1E90FF]">{active.updated}</span>
            <h2 id="policy-modal-title" className="mt-1 font-serif text-2xl font-bold text-white">
              {active.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close policy dialog"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {active.sections.map((section) => (
            <div key={section.heading} className="border-t border-white/10 pt-3.5">
              <h3 className="text-sm font-semibold text-white">{section.heading}</h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#1673D6] hover:bg-[#1E90FF] text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
