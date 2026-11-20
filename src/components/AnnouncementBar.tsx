import { PolicyType } from '../types';

interface AnnouncementBarProps {
  shippingFee: number;
  freeThreshold: number;
  onOpenPolicy: (policy: PolicyType) => void;
}

/**
 * Top announcement bar displaying shipping fee terms on the left
 * and Shipping / Privacy policy modal triggers on the right.
 */
export function AnnouncementBar({
  shippingFee,
  freeThreshold,
  onOpenPolicy,
}: AnnouncementBarProps) {
  return (
    <div
      role="region"
      aria-label="Shipping announcement and legal policies"
      className="bg-[#03070E] border-b border-white/10 text-slate-300 text-xs"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 min-h-[44px] sm:min-h-[36px] py-1 flex items-center justify-between gap-3">
        <p className="truncate font-medium">
          Standard tracked shipping{' '}
          <span className="text-white font-mono tabular-nums">${shippingFee.toFixed(2)}</span>
          <span className="hidden sm:inline text-slate-400 mx-2" aria-hidden="true">
            ·
          </span>
          <span className="hidden sm:inline">
            Complimentary insured dispatch on orders over{' '}
            <span className="text-[#1E90FF] font-mono tabular-nums">
              ${freeThreshold.toFixed(0)}
            </span>
          </span>
        </p>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            type="button"
            onClick={() => onOpenPolicy('shipping')}
            className="min-h-[44px] sm:min-h-0 px-1 inline-flex items-center text-slate-200 hover:text-white transition-colors whitespace-nowrap underline-offset-4 hover:underline rounded"
          >
            Shipping Policy
          </button>
          <span className="text-slate-500" aria-hidden="true">
            /
          </span>
          <button
            type="button"
            onClick={() => onOpenPolicy('privacy')}
            className="min-h-[44px] sm:min-h-0 px-1 inline-flex items-center text-slate-200 hover:text-white transition-colors whitespace-nowrap underline-offset-4 hover:underline rounded"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}
