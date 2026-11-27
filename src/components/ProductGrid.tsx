import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Category, Product } from '../types';
import { buildSingleProductWhatsAppUrl } from '../utils/whatsapp';
import { SafeImage } from './SafeImage';
import { WhatsAppIcon } from './WhatsAppIcon';

export type SortOption = 'featured' | 'price-asc' | 'price-desc';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  selectedCountry: string;
  onSelectProduct: (product: Product) => void;
  onResetFilters: () => void;
}

function getPriceDisplay(product: Product) {
  const prices = product.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const firstOriginal = product.variants[0]?.originalPrice;

  if (min === max || product.variants.length === 1 || firstOriginal) {
    return {
      rangeText: min === max ? `$${min.toFixed(0)}` : `$${min.toFixed(0)} – $${max.toFixed(0)}`,
      saleOriginal: firstOriginal ? `$${firstOriginal.toFixed(0)}` : null,
      saleCurrent: firstOriginal ? `$${product.variants[0].price.toFixed(0)}` : null,
    };
  }
  return {
    rangeText: `$${min.toFixed(0)} – $${max.toFixed(0)}`,
    saleOriginal: null,
    saleCurrent: null,
  };
}

/**
 * Main Store Catalog displaying 5 cards per row on desktop and 2 on mobile,
 * paired with live category tabs, search input, and price sorting.
 */
export function ProductGrid({
  products,
  categories,
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedCountry,
  onSelectProduct,
  onResetFilters,
}: ProductGridProps) {
  const hasFilters = activeCategory !== 'all' || searchQuery.trim().length > 0;

  return (
    <section id="store" className="py-16 lg:py-20 bg-[#050B14] border-b border-white/10">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E90FF]">
              Laboratory Catalog
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-white">
              Research Peptides &amp; Solutions
            </h2>
            <p className="mt-2 text-sm text-slate-300" aria-live="polite">
              Showing{' '}
              <span className="text-white font-mono tabular-nums font-medium">
                {products.length}
              </span>{' '}
              {products.length === 1 ? 'formulation' : 'formulations'} ready for batch dispatch.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 sm:flex-initial">
              <label htmlFor="store-search" className="sr-only">
                Filter store products
              </label>
              <Search
                className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="store-search"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name or SKU..."
                className="w-full sm:w-56 min-h-[44px] pl-9 pr-3 py-2 text-base sm:text-xs bg-[#0A1220] text-white placeholder:text-slate-400 rounded-lg border border-white/15 focus:outline-none focus:border-[#1E90FF] transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#0A1220] border border-white/15 rounded-lg px-3 min-h-[44px]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-300" aria-hidden="true" />
              <label htmlFor="sort-select" className="sr-only">
                Sort products
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="min-h-[44px] bg-transparent text-base sm:text-xs font-medium text-slate-200 focus:outline-none cursor-pointer py-2"
              >
                <option value="featured" className="bg-[#0A1220] text-white">
                  Sort: Featured
                </option>
                <option value="price-asc" className="bg-[#0A1220] text-white">
                  Price: Low to High
                </option>
                <option value="price-desc" className="bg-[#0A1220] text-white">
                  Price: High to Low
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="group"
          aria-label="Filter products by category"
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-white/10"
        >
          <button
            type="button"
            aria-pressed={activeCategory === 'all'}
            onClick={() => onCategoryChange('all')}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'all'
                ? 'bg-[#1673D6] text-white'
                : 'bg-[#0A1220] text-slate-200 border border-white/10 hover:text-white hover:border-white/25'
            }`}
          >
            All Products
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={activeCategory === cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#1673D6] text-white'
                  : 'bg-[#0A1220] text-slate-200 border border-white/10 hover:text-white hover:border-white/25'
              }`}
            >
              {cat.name}
            </button>
          ))}

          {hasFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="ml-auto inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-white/5 hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Product Grid: 5 per row on desktop (lg:grid-cols-5), 2 on mobile (grid-cols-2) */}
        {products.length === 0 ? (
          <div className="bg-[#0A1220] border border-white/10 rounded-xl p-12 text-center">
            <h3 className="font-serif text-xl font-bold text-white">
              No matching formulations found
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto">
              No products matched your current search term or category selection. Reset filters to
              browse all lab-verified items.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-6 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#1673D6] hover:bg-[#1E90FF] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {products.map((product) => {
              const priceInfo = getPriceDisplay(product);
              const frameBg = product.imageBg === 'dark' ? 'bg-[#080C12]' : 'bg-white';

              return (
                <article
                  key={product.id}
                  className="group bg-[#0A1220] border border-white/10 rounded-xl overflow-hidden shadow-lg shadow-black/25 hover:border-[#1E90FF]/45 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className={`block w-full aspect-[4/3] overflow-hidden p-2.5 ${frameBg} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E90FF]`}
                      aria-label={`Inspect ${product.name}`}
                    >
                      <SafeImage
                        src={product.image}
                        alt={product.name}
                        fallbackTitle={product.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>

                    {/* Category + Title */}
                    <div className="p-3.5 sm:p-4 pb-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#1E90FF] truncate">
                        {product.categoryName}
                      </span>
                      <h3 className="mt-1.5 font-serif text-sm sm:text-[15px] font-bold text-white leading-snug line-clamp-2 min-h-[2.6em]">
                        <button
                          type="button"
                          onClick={() => onSelectProduct(product)}
                          className="text-left hover:text-[#1E90FF] transition-colors rounded"
                        >
                          {product.name}
                        </button>
                      </h3>
                    </div>
                  </div>

                  {/* Price Range + Select Options & WhatsApp CTAs */}
                  <div className="p-3.5 sm:p-4 pt-3 flex flex-col gap-2.5">
                    {priceInfo.saleOriginal ? (
                      <p className="text-sm font-mono font-medium tabular-nums flex items-center gap-2">
                        <span className="text-slate-400 line-through">{priceInfo.saleOriginal}</span>
                        <span className="text-white font-semibold">{priceInfo.saleCurrent}</span>
                      </p>
                    ) : (
                      <p className="text-sm font-mono font-medium text-slate-200 tabular-nums">
                        {priceInfo.rangeText}
                      </p>
                    )}

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="w-full min-h-[44px] py-2.5 px-2.5 rounded-lg bg-[#1673D6] hover:bg-[#1E90FF] text-white text-xs font-semibold transition-colors text-center"
                      >
                        Select Options
                      </button>
                      <a
                        href={buildSingleProductWhatsAppUrl({
                          product,
                          variant: product.variants[0],
                          quantity: 1,
                          country: selectedCountry,
                        })}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Order ${product.name} via WhatsApp (opens in a new tab)`}
                        className="w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-[#050B14] border border-[#25D366]/55 text-[#25D366] hover:bg-[#25D366]/10 text-[11px] sm:text-xs font-semibold transition-colors text-center"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                        <span>Order via WhatsApp</span>
                      </a>
                      <p className="text-[11px] text-slate-300 leading-snug">
                        Prefer to talk first? Order through WhatsApp and we&apos;ll confirm everything with you.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
