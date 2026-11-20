import { useEffect } from 'react';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem } from '../types';
import { buildCartWhatsAppUrl } from '../utils/whatsapp';
import { SafeImage } from './SafeImage';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  freeThreshold: number;
  total: number;
  selectedCountry: string;
  onClose: () => void;
  onUpdateQuantity: (variantId: string, delta: number) => void;
  onRemoveItem: (variantId: string) => void;
  onProceedToCheckout: () => void;
}

/**
 * Slide-out shopping cart drawer with live quantity steppers, free-shipping
 * progress indicator, itemized subtotal/shipping/total, and checkout trigger.
 */
export function CartDrawer({
  isOpen,
  items,
  subtotal,
  shippingFee,
  freeThreshold,
  total,
  selectedCountry,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeThreshold) * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-[#0A1220] border-l border-white/10 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#1E90FF]" aria-hidden="true" />
            <h2 className="font-serif text-xl font-bold text-white">Your Cart</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart drawer"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E90FF]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && (
          <div className="px-6 py-3.5 bg-[#050B14] border-b border-white/10">
            <p className="text-xs text-slate-300">
              {remainingForFree === 0 ? (
                <span className="text-emerald-400 font-semibold">
                  Complimentary insured delivery unlocked.
                </span>
              ) : (
                <>
                  Add{' '}
                  <span className="text-white font-mono font-semibold tabular-nums">
                    ${remainingForFree.toFixed(2)}
                  </span>{' '}
                  more for complimentary shipping.
                </>
              )}
            </p>
            <div className="mt-2 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1E90FF] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="h-14 w-14 rounded-2xl bg-[#050B14] border border-white/10 flex items-center justify-center mb-4">
                <ShoppingBag className="h-6 w-6 text-slate-500" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Your cart is empty</h3>
              <p className="mt-1.5 text-xs text-slate-400 max-w-[240px] leading-relaxed">
                Select any formulation from our catalog to choose your preferred volume or format.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 px-5 py-2.5 rounded-lg bg-[#1E90FF] hover:bg-[#197FE6] text-white text-xs font-semibold transition-colors"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.variantId}
                className="bg-[#050B14] border border-white/10 rounded-xl p-3.5 flex gap-3.5"
              >
                <div
                  className={`w-20 h-20 rounded-lg overflow-hidden p-1.5 shrink-0 ${
                    item.imageBg === 'dark' ? 'bg-[#080C12]' : 'bg-white'
                  }`}
                >
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    fallbackTitle={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{item.variantLabel}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.variantId)}
                      aria-label={`Remove ${item.name}`}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="inline-flex items-center bg-[#0A1220] border border-white/10 rounded-lg">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.variantId, -1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="p-1.5 text-slate-300 hover:text-white transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-mono font-semibold text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.variantId, 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="p-1.5 text-slate-300 hover:text-white transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-mono font-semibold text-white tabular-nums">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary & Checkout CTA */}
        {items.length > 0 && (
          <div className="px-6 py-5 bg-[#050B14] border-t border-white/10 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Tracked Shipping</span>
                <span className="font-mono text-slate-200 tabular-nums">
                  {shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm font-semibold text-white">
                <span>Estimated Total</span>
                <span className="font-mono text-base text-[#1E90FF] tabular-nums">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={onProceedToCheckout}
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#1E90FF] hover:bg-[#197FE6] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#1E90FF]/20 transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E90FF]"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>

                <a
                  href={buildCartWhatsAppUrl({
                    items,
                    total,
                    country: selectedCountry,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#0A1220] border border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
                >
                  <WhatsAppIcon className="h-4 w-4 shrink-0" />
                  Order via WhatsApp
                </a>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug">
                Prefer to talk first? Order through WhatsApp and we&apos;ll confirm everything with you.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
