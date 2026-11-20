import { ArrowUpRight } from 'lucide-react';
import { Category } from '../types';
import { SafeImage } from './SafeImage';

interface CategoryGridProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

/**
 * Shop by Category section allowing direct catalog filtering from visual category cards.
 */
export function CategoryGrid({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryGridProps) {
  return (
    <section
      id="categories"
      className="py-14 lg:py-18 bg-[#050B14] border-b border-white/10"
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1E90FF]">
              Curated Formulations
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-white">
              Shop by Category
            </h2>
          </div>

          <button
            type="button"
            aria-pressed={activeCategory === 'all'}
            onClick={() => onSelectCategory('all')}
            className={`self-start sm:self-auto min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-[#1673D6] text-white'
                : 'bg-[#0A1220] text-slate-200 border border-white/10 hover:border-[#1E90FF]/50 hover:text-white'
            }`}
          >
            View All Formulations
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((category) => {
            const isSelected = activeCategory === category.id;
            const frameBg = category.imageBg === 'dark' ? 'bg-[#080C12]' : 'bg-white';
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectCategory(category.id)}
                className={`group text-left bg-[#0A1220] rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-black/25 flex flex-col ${
                  isSelected
                    ? 'border-[#1E90FF] ring-1 ring-[#1E90FF]/40'
                    : 'border-white/10 hover:border-white/25'
                }`}
              >
                <div className={`aspect-[4/3] w-full overflow-hidden p-3 ${frameBg}`}>
                  <SafeImage
                    src={category.image}
                    alt={category.name}
                    fallbackTitle={category.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-serif text-sm sm:text-base font-bold text-white group-hover:text-[#1E90FF] transition-colors">
                        {category.name}
                      </h3>
                      <ArrowUpRight
                        className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#1E90FF] shrink-0 transition-colors"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                  <span className="mt-3 text-[11px] font-mono text-slate-400 tabular-nums">
                    {category.count} {category.count === 1 ? 'product' : 'products'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
