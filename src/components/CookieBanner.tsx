import { useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { PolicyType } from '../types';

interface CookieBannerProps {
  onOpenPrivacy: (policy: PolicyType) => void;
}

/**
 * Compact dismissible cookie consent banner positioned away from the live chat launcher.
 */
export function CookieBanner({ onOpenPrivacy }: CookieBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="fixed bottom-4 left-4 right-20 sm:right-auto sm:max-w-md z-30 bg-[#0A1220] border border-white/15 rounded-xl p-4 shadow-2xl"
    >
      <div className="flex items-start gap-3">
        <Cookie className="h-4 w-4 text-[#1E90FF] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-300 leading-relaxed">
            We use essential session storage to maintain your cart and preferences. Read our{' '}
            <button
              type="button"
              onClick={() => onOpenPrivacy('privacy')}
              className="text-[#1E90FF] hover:underline font-medium"
            >
              Privacy Policy
            </button>
            .
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="px-3 py-1.5 rounded-lg bg-[#1E90FF] hover:bg-[#197FE6] text-white text-xs font-semibold transition-colors"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="px-3 py-1.5 rounded-lg bg-[#050B14] border border-white/10 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss cookie notice"
          className="p-1 text-slate-500 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
