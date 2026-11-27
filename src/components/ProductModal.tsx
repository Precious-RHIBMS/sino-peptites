import { useEffect, useRef, useState } from 'react';
import { Check, Minus, Plus, ShieldCheck, ShoppingBag, X } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { buildSingleProductWhatsAppUrl } from '../utils/whatsapp';
import { useDialogAccessibility } from '../utils/useDialogAccessibility';
import { SafeImage } from './SafeImage';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductModalProps {
  product: Product | null;
  selectedCountry: string;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
}

/**
 * Product Detail Modal featuring variant size/quantity selection, live price updates,
 * quantity stepper, batch purity metadata, and Add to Cart action.
 */
export function ProductModal({ product, selectedCountry, onClose, onAddToCart }: ProductModalProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedVariantId(product.variants[0].id);
      setQuantity(1);
      setJustAdded(false);
    }
    return () => {
      if (addedTimerRef.current) {
        clearTimeout(addedTimerRef.current);
        addedTimerRef.current = null;
      }
    };
  }, [product]);

  useDialogAccessibility(Boolean(product), dialogRef, closeButtonRef, onClose);

  if (!product) return null;

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0];
  const lineTotal = activeVariant.price * quantity;
  const frameBg = product.imageBg === 'dark' ? 'bg-[#080C12]' : 'bg-white';

  const handleAdd = () => {
    onAddToCart(product, activeVariant, quantity);
    setJustAdded(true);
    if (addedTimerRef.current) {
      clearTimeout(addedTimerRef.current);
    }
    addedTimerRef.current = setTimeout(() => {
      setJustAdded(false);
      addedTimerRef.current = null;
    }, 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#0A1220] border border-white/15 rounded-2xl shadow-2xl"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="absolute top-3 right-3 z-10 min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-lg bg-[#050B14]/90 text-slate-200 hover:text-white border border-white/15 transition-colors"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Image Panel */}
          <div className="md:col-span-5 bg-[#070E1A] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10">
            <div className={`aspect-[4/3] md:aspect-auto md:h-72 w-full overflow-hidden p-5 ${frameBg}`}>
              <SafeImage
                src={product.image}
                alt={product.name}
                fallbackTitle={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-5 space-y-2.5 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-[#1E90FF] font-semibold">
                <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{product.purityNote}</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {product.specs.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between gap-3 text-xs border-b border-white/5 pb-1.5 last:border-b-0"
                  >
                    <span className="text-slate-400">{spec.label}</span>
                    <span className="text-slate-200 font-medium text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Purchase Module */}
          <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="uppercase tracking-wider text-[#1E90FF] font-semibold">
                  {product.categoryName}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{product.sku}</span>
              </div>

              <h2
                id="product-modal-title"
                className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-white leading-tight"
              >
                {product.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-3">
                {activeVariant.originalPrice && (
                  <span className="text-base font-mono text-slate-400 line-through tabular-nums">
                    ${activeVariant.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-mono font-bold text-white tabular-nums">
                  ${activeVariant.price.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  {activeVariant.stock} units ready in lot
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-300 leading-relaxed">{product.description}</p>

              {/* Variant Selector */}
              <div className="mt-6">
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2.5">
                  Select Vial Size / Pack Quantity
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5" role="group" aria-label="Product size and pack options">
                  {product.variants.map((variant) => {
                    const isSelected = variant.id === activeVariant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => {
                          setSelectedVariantId(variant.id);
                          setJustAdded(false);
                        }}
                        className={`min-h-[48px] p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#1E90FF]/15 border-[#1E90FF] text-white'
                            : 'bg-[#050B14] border-white/10 text-slate-200 hover:border-white/30'
                        }`}
                      >
                        <span className="block text-xs font-semibold leading-snug">
                          {variant.label}
                        </span>
                        <span className="mt-1 block text-xs font-mono text-[#1E90FF] tabular-nums">
                          ${variant.price.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quantity Picker + Add to Cart & Order via WhatsApp */}
            <div className="mt-7 pt-5 border-t border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="inline-flex items-center justify-between bg-[#050B14] border border-white/15 rounded-xl px-1.5 py-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <span
                    className="w-10 text-center font-mono text-sm font-semibold text-white tabular-nums"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(activeVariant.stock, q + 1))}
                    aria-label="Increase quantity"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1673D6] hover:bg-[#1E90FF] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#1E90FF]/20 transition-all whitespace-nowrap"
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Added · ${lineTotal.toFixed(2)}
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Add to Cart ·{' '}
                        <span className="font-mono tabular-nums">${lineTotal.toFixed(2)}</span>
                      </>
                    )}
                  </button>

                  <a
                    href={buildSingleProductWhatsAppUrl({
                      product,
                      variant: activeVariant,
                      quantity,
                      country: selectedCountry,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Order ${product.name} via WhatsApp (opens in a new tab)`}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#050B14] border border-[#25D366]/55 text-[#25D366] hover:bg-[#25D366]/10 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    <WhatsAppIcon className="h-4 w-4 shrink-0" />
                    Order via WhatsApp
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Prefer to talk first? Order through WhatsApp and we&apos;ll confirm everything with you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
