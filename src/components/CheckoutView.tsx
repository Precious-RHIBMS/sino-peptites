import { FormEvent, useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Lock,
  Smartphone,
} from 'lucide-react';
import { CartItem } from '../types';
import { buildCartWhatsAppUrl } from '../utils/whatsapp';
import { SafeImage } from './SafeImage';
import { WhatsAppIcon } from './WhatsAppIcon';

export type PaymentMethod = 'card' | 'bank-transfer' | 'mobile-money';

interface CheckoutViewProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  onBackToStore: () => void;
  onOrderComplete: () => void;
}

interface OrderConfirmation {
  orderNumber: string;
  customerName: string;
  email: string;
  addressSummary: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}

/**
 * Full Checkout page with shipping address form, 3 payment method selectors
 * (Bank Transfer, Mobile Money, Card), order summary, and confirmation receipt.
 */
export function CheckoutView({
  items,
  subtotal,
  shippingFee,
  total,
  selectedCountry,
  onCountryChange,
  onBackToStore,
  onOrderComplete,
}: CheckoutViewProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const country = selectedCountry;
  const setCountry = onCountryChange;
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [mobileProvider, setMobileProvider] = useState('M-Pesa / MTN Mobile Money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [bankReference, setBankReference] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !street.trim() || !city.trim() || !postalCode.trim()) {
      setErrorMessage('Please complete all required shipping fields before placing your order.');
      return;
    }

    if (paymentMethod === 'card' && (cardNumber.replace(/\s+/g, '').length < 12 || !cardExpiry.trim() || !cardCvc.trim())) {
      setErrorMessage('Please enter valid card details or select another payment method.');
      return;
    }

    if (paymentMethod === 'mobile-money' && !mobileNumber.trim()) {
      setErrorMessage('Please provide the mobile money phone number for payment confirmation.');
      return;
    }

    const orderNum = `SP-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmation({
      orderNumber: orderNum,
      customerName: fullName.trim(),
      email: email.trim(),
      addressSummary: `${street.trim()}, ${city.trim()} ${postalCode.trim()}, ${country}`,
      paymentMethod,
      items: [...items],
      subtotal,
      shippingFee,
      total,
    });
    onOrderComplete();
  };

  if (confirmation) {
    return (
      <section className="py-12 lg:py-20 bg-[#050B14] min-h-[70vh]" role="status" aria-live="polite">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-[#0A1220] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="h-7 w-7 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs font-mono uppercase tracking-wider">Order Confirmed</p>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Order #{confirmation.orderNumber}
                </h1>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-300 leading-relaxed">
              Thank you, <span className="font-semibold text-white">{confirmation.customerName}</span>.
              Your order is queued for laboratory packing and lot documentation. A dispatch dossier
              has been prepared for <span className="text-[#1E90FF]">{confirmation.email}</span>.
            </p>

            <div className="mt-6 bg-[#050B14] border border-white/10 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Shipping Destination</span>
                <span className="text-slate-200 text-right">{confirmation.addressSummary}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Payment Method</span>
                <span className="text-slate-200 capitalize">
                  {confirmation.paymentMethod.replace('-', ' ')}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Documentation</span>
                <span className="text-emerald-400 font-medium">
                  Signed Batch Certificate Included
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
              {confirmation.items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-center justify-between text-xs text-slate-300"
                >
                  <span>
                    {item.name} ({item.variantLabel}) × {item.quantity}
                  </span>
                  <span className="font-mono text-white tabular-nums">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-sm font-bold text-white">
                <span>Total Paid</span>
                <span className="font-mono text-[#1E90FF] tabular-nums">
                  ${confirmation.total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onBackToStore}
              className="mt-7 w-full min-h-[44px] py-3.5 px-5 rounded-xl bg-[#1673D6] hover:bg-[#1E90FF] text-white text-sm font-semibold transition-colors"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 lg:py-16 bg-[#050B14] min-h-[75vh]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onBackToStore}
          className="min-h-[44px] inline-flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-[#1E90FF] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Storefront
        </button>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1E90FF]">
            Encrypted Checkout
          </p>
          <h1 className="mt-1 font-serif text-3xl sm:text-4xl font-bold text-white">
            Shipping &amp; Payment
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-[#0A1220] border border-white/10 rounded-2xl p-10 text-center">
            <h2 className="font-serif text-xl font-bold text-white">No items in your cart</h2>
            <p className="mt-2 text-sm text-slate-400">
              Add formulations from the catalog before proceeding to checkout.
            </p>
            <button
              type="button"
              onClick={onBackToStore}
              className="mt-5 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#1673D6] hover:bg-[#1E90FF] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Return to Store
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Form Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Shipping Information */}
              <div className="bg-[#0A1220] border border-white/10 rounded-2xl p-6 space-y-5">
                <h2 className="font-serif text-xl font-bold text-white">1. Shipping Destination</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="chk-name" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="chk-name"
                      type="text"
                      required
                      autoComplete="name"
                      aria-invalid={Boolean(errorMessage && !fullName.trim())}
                      aria-describedby={errorMessage ? 'checkout-error' : undefined}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Dr. Clara Bennett"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    />
                  </div>

                  <div>
                    <label htmlFor="chk-email" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="chk-email"
                      type="email"
                      required
                      autoComplete="email"
                      aria-invalid={Boolean(errorMessage && !email.trim())}
                      aria-describedby={errorMessage ? 'checkout-error' : undefined}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="clara@clinic.org"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    />
                  </div>

                  <div>
                    <label htmlFor="chk-phone" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      id="chk-phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      aria-invalid={Boolean(errorMessage && !phone.trim())}
                      aria-describedby={errorMessage ? 'checkout-error' : undefined}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (503) 555-0148"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="chk-street" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Street Address *
                    </label>
                    <input
                      id="chk-street"
                      type="text"
                      required
                      autoComplete="street-address"
                      aria-invalid={Boolean(errorMessage && !street.trim())}
                      aria-describedby={errorMessage ? 'checkout-error' : undefined}
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="742 Evergreen Terrace, Apt 4B"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    />
                  </div>

                  <div>
                    <label htmlFor="chk-city" className="block text-xs font-medium text-slate-200 mb-1.5">
                      City *
                    </label>
                    <input
                      id="chk-city"
                      type="text"
                      required
                      autoComplete="address-level2"
                      aria-invalid={Boolean(errorMessage && !city.trim())}
                      aria-describedby={errorMessage ? 'checkout-error' : undefined}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Portland"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    />
                  </div>

                  <div>
                    <label htmlFor="chk-postal" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Postal Code *
                    </label>
                    <input
                      id="chk-postal"
                      type="text"
                      required
                      autoComplete="postal-code"
                      aria-invalid={Boolean(errorMessage && !postalCode.trim())}
                      aria-describedby={errorMessage ? 'checkout-error' : undefined}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="97209"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    />
                  </div>

                  <div>
                    <label htmlFor="chk-country" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Country
                    </label>
                    <select
                      id="chk-country"
                      autoComplete="country-name"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    >
                      <option value="United States">United States</option>
                      <option value="Cameroon">Cameroon</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="chk-notes" className="block text-xs font-medium text-slate-200 mb-1.5">
                      Delivery Notes (Optional)
                    </label>
                    <input
                      id="chk-notes"
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Gate code or lab reception"
                      className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-[#0A1220] border border-white/10 rounded-2xl p-6 space-y-5">
                <h2 className="font-serif text-xl font-bold text-white">2. Payment Method</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="group" aria-label="Payment method">
                  <button
                    type="button"
                    aria-pressed={paymentMethod === 'card'}
                    onClick={() => setPaymentMethod('card')}
                    className={`min-h-[56px] p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      paymentMethod === 'card'
                        ? 'bg-[#1E90FF]/15 border-[#1E90FF] text-white'
                        : 'bg-[#050B14] border-white/10 text-slate-200 hover:border-white/30'
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-[#1E90FF] shrink-0" aria-hidden="true" />
                    <div>
                      <span className="block text-xs font-semibold">Card</span>
                      <span className="block text-[11px] text-slate-300">Visa / Mastercard</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    aria-pressed={paymentMethod === 'bank-transfer'}
                    onClick={() => setPaymentMethod('bank-transfer')}
                    className={`min-h-[56px] p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      paymentMethod === 'bank-transfer'
                        ? 'bg-[#1E90FF]/15 border-[#1E90FF] text-white'
                        : 'bg-[#050B14] border-white/10 text-slate-200 hover:border-white/30'
                    }`}
                  >
                    <Building2 className="h-5 w-5 text-[#1E90FF] shrink-0" aria-hidden="true" />
                    <div>
                      <span className="block text-xs font-semibold">Bank Transfer</span>
                      <span className="block text-[11px] text-slate-300">ACH / Wire / SEPA</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    aria-pressed={paymentMethod === 'mobile-money'}
                    onClick={() => setPaymentMethod('mobile-money')}
                    className={`min-h-[56px] p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      paymentMethod === 'mobile-money'
                        ? 'bg-[#1E90FF]/15 border-[#1E90FF] text-white'
                        : 'bg-[#050B14] border-white/10 text-slate-200 hover:border-white/30'
                    }`}
                  >
                    <Smartphone className="h-5 w-5 text-[#1E90FF] shrink-0" aria-hidden="true" />
                    <div>
                      <span className="block text-xs font-semibold">Mobile Money</span>
                      <span className="block text-[11px] text-slate-300">M-Pesa / MTN / Airtel</span>
                    </div>
                  </button>
                </div>

                {/* Method-Specific Form Panel */}
                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="card-num" className="block text-xs font-medium text-slate-200 mb-1.5">
                        Card Number *
                      </label>
                      <input
                        id="card-num"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        aria-invalid={Boolean(errorMessage && paymentMethod === 'card' && cardNumber.replace(/\s+/g, '').length < 12)}
                        aria-describedby={errorMessage ? 'checkout-error' : undefined}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm font-mono bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                      />
                    </div>
                    <div>
                      <label htmlFor="card-exp" className="block text-xs font-medium text-slate-200 mb-1.5">
                        Expiry (MM/YY) *
                      </label>
                      <input
                        id="card-exp"
                        type="text"
                        autoComplete="cc-exp"
                        aria-invalid={Boolean(errorMessage && paymentMethod === 'card' && !cardExpiry.trim())}
                        aria-describedby={errorMessage ? 'checkout-error' : undefined}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="08/29"
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm font-mono bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                      />
                    </div>
                    <div>
                      <label htmlFor="card-cvc" className="block text-xs font-medium text-slate-200 mb-1.5">
                        Security Code (CVC) *
                      </label>
                      <input
                        id="card-cvc"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        aria-invalid={Boolean(errorMessage && paymentMethod === 'card' && !cardCvc.trim())}
                        aria-describedby={errorMessage ? 'checkout-error' : undefined}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="412"
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm font-mono bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank-transfer' && (
                  <div className="bg-[#050B14] border border-white/10 rounded-xl p-4 space-y-3 text-xs">
                    <p className="text-slate-300 leading-relaxed">
                      Send your wire or ACH transfer using the settlement details below. Orders
                      are reserved for 48 hours and dispatched upon clearing.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-slate-200 pt-1">
                      <div>
                        <span className="text-slate-400 block font-sans">Beneficiary</span>
                        sino_pepts LLC
                      </div>
                      <div>
                        <span className="text-slate-400 block font-sans">Routing / SWIFT</span>
                        121000358 · SPPTUS33
                      </div>
                      <div>
                        <span className="text-slate-400 block font-sans">Account Number</span>
                        8840-2910-4418
                      </div>
                      <div>
                        <label htmlFor="bank-ref" className="text-slate-300 block font-sans mb-1">
                          Transfer Reference (Optional)
                        </label>
                        <input
                          id="bank-ref"
                          type="text"
                          value={bankReference}
                          onChange={(e) => setBankReference(e.target.value)}
                          placeholder="Your transfer ID"
                          className="w-full min-h-[44px] px-3 py-2 text-base sm:text-xs bg-[#0A1220] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile-money' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label htmlFor="mm-provider" className="block text-xs font-medium text-slate-200 mb-1.5">
                        Mobile Wallet Network
                      </label>
                      <select
                        id="mm-provider"
                        value={mobileProvider}
                        onChange={(e) => setMobileProvider(e.target.value)}
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm bg-[#050B14] text-white rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                      >
                        <option value="M-Pesa / MTN Mobile Money">M-Pesa</option>
                        <option value="MTN MoMo">MTN MoMo</option>
                        <option value="Airtel Money">Airtel Money</option>
                        <option value="Orange Money">Orange Money</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="mm-number" className="block text-xs font-medium text-slate-200 mb-1.5">
                        Registered Wallet Phone *
                      </label>
                      <input
                        id="mm-number"
                        type="tel"
                        autoComplete="tel"
                        aria-invalid={Boolean(errorMessage && paymentMethod === 'mobile-money' && !mobileNumber.trim())}
                        aria-describedby={errorMessage ? 'checkout-error' : undefined}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="+254 712 345 678"
                        className="w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm font-mono bg-[#050B14] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF]"
                      />
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div
                    id="checkout-error"
                    role="alert"
                    className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs sm:text-sm text-rose-200 font-medium"
                  >
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Right Order Summary */}
            <aside className="lg:col-span-5 bg-[#0A1220] border border-white/10 rounded-2xl p-6 lg:sticky lg:top-24 space-y-5">
              <h2 className="font-serif text-xl font-bold text-white">Order Summary</h2>

              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-lg overflow-hidden p-1 shrink-0 ${
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
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {item.variantLabel} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-semibold text-white tabular-nums">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-200 tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tracked Delivery</span>
                  <span className="font-mono text-slate-200 tabular-nums">
                    {shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Batch Documentation</span>
                  <span className="text-emerald-400 font-medium">Included</span>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between text-base font-bold text-white">
                  <span>Total Due</span>
                  <span className="font-mono text-[#1E90FF] tabular-nums">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="submit"
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1673D6] hover:bg-[#1E90FF] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#1E90FF]/20 transition-all whitespace-nowrap"
                  >
                    <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Place Order · <span className="font-mono tabular-nums">${total.toFixed(2)}</span>
                  </button>

                  <a
                    href={buildCartWhatsAppUrl({
                      items,
                      total,
                      country,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Order cart via WhatsApp (opens in a new tab)"
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#050B14] border border-[#25D366]/55 text-[#25D366] hover:bg-[#25D366]/10 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    <WhatsAppIcon className="h-4 w-4 shrink-0" />
                    Order via WhatsApp
                  </a>
                </div>

                <p className="text-xs text-slate-300">
                  Prefer to talk first? Order through WhatsApp and we&apos;ll confirm everything with you.
                </p>
              </div>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
}
