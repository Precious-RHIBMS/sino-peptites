import { useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { PolicyType } from '../types';

interface CookieBannerProps {
  onOpenPrivacy: (policy: PolicyType) => void;
}

const COOKIE_CONSENT_KEY = 'sinopepts_cookie_consent_v1';

function getInitialVisibility(): boolean {
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return stored !== 'accepted' && stored !== 'dismissed';
  } catch {
    return true;
  }
}

/**
 * Compact dismissible cookie consent banner positioned away from the floating WhatsApp launcher.
 */
export function CookieBanner({ onOpenPrivacy }: CookieBannerProps) {
  const [visible, setVisible] = useState<boolean>(getInitialVisibility);

  const handleChoice = (choice: 'accepted' | 'dismissed') => {
    try {
      window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch {
      // Ignore storage errors in restricted browsing modes
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie preferences"
      className="fixed bottom-18 sm:bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-30 bg-[#0A1220] border border-white/15 rounded-xl p-4 shadow-2xl"
    >
      <div className="flex items-start gap-3">
        <Cookie className="h-4 w-4 text-[#1E90FF] shrink-0 mt-1" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-200 leading-relaxed">
            We use essential browser storage to maintain your cart and preferences. Read our{' '}
            <button
              type="button"
              onClick={() => onOpenPrivacy('privacy')}
              className="text-[#1E90FF] hover:underline font-medium inline-flex items-center py-1"
            >
              Privacy Policy
            </button>
            .
          </p>
          <div className="mt-2.5 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleChoice('accepted')}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#1673D6] hover:bg-[#1E90FF] text-white text-xs font-semibold transition-colors"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => handleChoice('dismissed')}
              className="min-h-[44px] px-4 py-2 rounded-lg bg-[#050B14] border border-white/15 text-slate-200 hover:text-white text-xs font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => handleChoice('dismissed')}
          aria-label="Dismiss cookie notice"
          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center -mr-2 -mt-2 text-slate-300 hover:text-white transition-colors rounded-lg"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
