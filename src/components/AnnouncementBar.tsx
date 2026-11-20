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
    <div className="bg-[#03070E] border-b border-white/10 text-slate-300 text-xs">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
        <p className="truncate font-medium">
          Standard tracked shipping{' '}
          <span className="text-white font-mono tabular-nums">${shippingFee.toFixed(2)}</span>
          <span className="hidden sm:inline text-slate-500 mx-2" aria-hidden="true">
            ·
          </span>
          <span className="hidden sm:inline">
            Complimentary insured dispatch on orders over{' '}
            <span className="text-[#1E90FF] font-mono tabular-nums">
              ${freeThreshold.toFixed(0)}
            </span>
          </span>
        </p>

        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => onOpenPolicy('shipping')}
            className="text-slate-300 hover:text-white transition-colors whitespace-nowrap underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E90FF] rounded"
          >
            Shipping Policy
          </button>
          <span className="text-slate-600" aria-hidden="true">
            /
          </span>
          <button
            type="button"
            onClick={() => onOpenPolicy('privacy')}
            className="text-slate-300 hover:text-white transition-colors whitespace-nowrap underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E90FF] rounded"
          >
            Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
}
