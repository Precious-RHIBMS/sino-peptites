import { FormEvent, useEffect, useState } from 'react';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';

interface NavbarProps {
  brandName: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onNavigateSection: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { label: 'Home', id: 'home' },
  { label: 'Our Story', id: 'our-story' },
  { label: 'Certificates', id: 'certificates' },
  { label: 'Store', id: 'store' },
  { label: 'Categories', id: 'categories' },
  { label: 'Payment Options', id: 'payment-options' },
  { label: 'Contact', id: 'contact' },
];

/**
 * Sticky crisp-white navigation bar with single-line brand wordmark,
 * concise section links, live search input, and cart total button.
 */
export function Navbar({
  brandName,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  cartCount,
  cartTotal,
  onOpenCart,
  onNavigateSection,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
    setMobileMenuOpen(false);
  };

  const handleNavClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white text-[#050B14] border-b border-slate-200 shadow-sm">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 xl:gap-6">
        {/* Brand Mark */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#050B14] whitespace-nowrap shrink-0 min-h-[44px] inline-flex items-center rounded"
        >
          {brandName}
        </a>

        {/* Primary Desktop Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-4 xl:gap-5 text-[13px] font-medium text-slate-700"
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.id);
              }}
              className="hover:text-[#1673D6] transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 border-transparent hover:border-[#1E90FF] rounded-t"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Controls: Search + Cart Total + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <form onSubmit={handleFormSubmit} role="search" className="hidden md:flex items-center relative">
            <label htmlFor="header-search" className="sr-only">
              Search products
            </label>
            <Search
              className="h-4 w-4 text-slate-500 absolute left-3 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="header-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-40 xl:w-48 min-h-[40px] pl-9 pr-3 py-1.5 text-sm md:text-xs bg-slate-100 text-[#050B14] placeholder:text-slate-600 rounded-lg border border-slate-300 focus:outline-none focus:bg-white focus:border-[#1E90FF] transition-colors"
            />
          </form>

          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping cart with ${cartCount} ${cartCount === 1 ? 'item' : 'items'}, subtotal $${cartTotal.toFixed(2)}`}
            className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-lg bg-[#050B14] text-white hover:bg-[#0E1B30] transition-colors text-xs font-semibold whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="h-4 w-4 text-[#1E90FF]" aria-hidden="true" />
            <span className="font-mono tabular-nums">${cartTotal.toFixed(2)}</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-[#1673D6] text-white text-[11px] font-mono tabular-nums leading-none">
                {cartCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center min-h-[44px] min-w-[44px] p-2 rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-4 shadow-lg"
        >
          <form onSubmit={handleFormSubmit} role="search" className="relative">
            <label htmlFor="mobile-search" className="sr-only">
              Search formulations
            </label>
            <Search
              className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="mobile-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, SKUs..."
              className="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-base sm:text-sm bg-slate-100 text-[#050B14] placeholder:text-slate-600 rounded-lg border border-slate-300 focus:outline-none focus:bg-white focus:border-[#1E90FF]"
            />
          </form>

          <nav aria-label="Mobile Navigation" className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.id);
                }}
                className="min-h-[44px] flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-100 hover:text-[#1673D6] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
