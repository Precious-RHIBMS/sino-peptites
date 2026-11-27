import { useEffect, useMemo, useState } from 'react';
import { AboutPage } from './components/AboutPage';
import { AnnouncementBar } from './components/AnnouncementBar';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CategoryGrid } from './components/CategoryGrid';
import { CheckoutView } from './components/CheckoutView';
import { CookieBanner } from './components/CookieBanner';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { PolicyModal } from './components/PolicyModal';
import { ProductGrid, SortOption } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { StoryAndCertificates } from './components/StoryAndCertificates';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WhatsAppFloatButton } from './components/WhatsAppFloatButton';
import { useAuth } from './context/AuthContext';
import { CATEGORIES, CERTIFICATES, PRODUCTS, STORE_CONFIG, TESTIMONIALS } from './products.js';
import { CartItem, PolicyType, Product, ProductVariant } from './types';

const CART_STORAGE_KEY = 'sinopepts_cart_v1';
const COUNTRY_STORAGE_KEY = 'sinopepts_country_v1';

function loadStoredCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item) &&
        typeof item.productId === 'string' &&
        typeof item.variantId === 'string' &&
        typeof item.name === 'string' &&
        typeof item.unitPrice === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

function loadStoredCountry(): string {
  try {
    const stored = window.localStorage.getItem(COUNTRY_STORAGE_KEY);
    return stored && stored.trim().length > 0 ? stored : 'United States';
  } catch {
    return 'United States';
  }
}

/**
 * sino_pepts Storefront Application
 * Runs fully client-side from local products.js catalog with safe localStorage UI persistence.
 */
export default function App() {
  const { user, profile, preferences, websiteSettings } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(loadStoredCart);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<'store' | 'about' | 'checkout'>('store');
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>(loadStoredCountry);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  const effectiveBrandName = websiteSettings?.brandName || STORE_CONFIG.brandName;
  const effectiveTagline = websiteSettings?.tagline || STORE_CONFIG.tagline;
  const effectiveShippingFee = STORE_CONFIG.shippingFee;
  const effectiveFreeThreshold = STORE_CONFIG.freeShippingThreshold;
  const effectiveContact = useMemo(
    () => ({
      ...STORE_CONFIG.contact,
      email: websiteSettings?.supportEmail || STORE_CONFIG.contact.email,
      phone: websiteSettings?.supportPhone || STORE_CONFIG.contact.phone,
    }),
    [websiteSettings]
  );

  useEffect(() => {
    const syncedCountry = preferences?.preferredCountry || profile?.preferredCountry;
    if (syncedCountry && syncedCountry.trim().length >= 2) {
      setSelectedCountry(syncedCountry);
    }
  }, [preferences?.preferredCountry, profile?.preferredCountry]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage errors when localStorage is unavailable
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(COUNTRY_STORAGE_KEY, selectedCountry);
    } catch {
      // Ignore storage errors when localStorage is unavailable
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (currentView === 'about') {
      document.title = `About — ${effectiveBrandName}`;
    } else if (currentView === 'checkout') {
      document.title = `Checkout — ${effectiveBrandName}`;
    } else {
      document.title = `${effectiveBrandName} — ${effectiveTagline}`;
    }
  }, [currentView, effectiveBrandName, effectiveTagline]);

  // Derived cart totals recalculated on every state update
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cartItems]
  );

  const shippingFee = useMemo(() => {
    if (cartItems.length === 0) return 0;
    return subtotal >= effectiveFreeThreshold ? 0 : effectiveShippingFee;
  }, [cartItems.length, subtotal, effectiveFreeThreshold, effectiveShippingFee]);

  const grandTotal = useMemo(() => subtotal + shippingFee, [subtotal, shippingFee]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const matched = (PRODUCTS as Product[]).filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.categoryId === activeCategory;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.shortDescription.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...matched].sort(
        (a, b) =>
          Math.min(...a.variants.map((v) => v.price)) -
          Math.min(...b.variants.map((v) => v.price))
      );
    }

    if (sortBy === 'price-desc') {
      return [...matched].sort(
        (a, b) =>
          Math.min(...b.variants.map((v) => v.price)) -
          Math.min(...a.variants.map((v) => v.price))
      );
    }

    return matched;
  }, [activeCategory, searchQuery, sortBy]);

  // Smooth section navigation (exits about/checkout views if active)
  const handleNavigateSection = (sectionId: string) => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAbout = () => {
    setCurrentView('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    handleNavigateSection('store');
  };

  const handleSearchSubmit = () => {
    handleNavigateSection('store');
  };

  const handleResetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.variantId === variant.id);
      if (existing) {
        return prev.map((item) =>
          item.variantId === variant.id
            ? { ...item, quantity: Math.min(variant.stock, item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: variant.id,
          sku: product.sku,
          lotNumber: product.lotNumber,
          name: product.name,
          categoryName: product.categoryName,
          variantLabel: variant.label,
          unitPrice: variant.price,
          quantity,
          image: product.image,
          imageBg: product.imageBg,
        },
      ];
    });
    setLiveAnnouncement(`Added ${quantity} ${product.name} (${variant.label}) to your cart.`);
  };

  const handleUpdateCartQuantity = (variantId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.variantId === variantId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
    setLiveAnnouncement('Cart quantity updated.');
  };

  const handleRemoveCartItem = (variantId: string) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
    setLiveAnnouncement('Item removed from cart.');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14] text-slate-200">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-lg focus:bg-[#1673D6] focus:text-white focus:text-xs focus:font-semibold focus:shadow-xl"
      >
        Skip to main content
      </a>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {liveAnnouncement}
      </div>

      {/* 1. Top Announcement Bar */}
      {(websiteSettings?.announcementEnabled ?? true) && (
        <AnnouncementBar
          shippingFee={effectiveShippingFee}
          freeThreshold={effectiveFreeThreshold}
          onOpenPolicy={setActivePolicy}
        />
      )}

      {/* 2. Sticky White Header */}
      <Navbar
        brandName={effectiveBrandName}
        activeView={currentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        cartCount={cartCount}
        cartTotal={subtotal}
        userLabel={user ? profile?.displayName || user.displayName || 'Account' : null}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAbout={handleOpenAbout}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area: Storefront, About, or Checkout */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {currentView === 'checkout' ? (
          <CheckoutView
            items={cartItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={grandTotal}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            onBackToStore={() => {
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderComplete={handleOrderComplete}
          />
        ) : currentView === 'about' ? (
          <AboutPage
            brandName={effectiveBrandName}
            products={PRODUCTS as Product[]}
            contact={effectiveContact}
            onBackToStore={() => {
              setCurrentView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateSection={handleNavigateSection}
            onSelectProduct={setSelectedProduct}
          />
        ) : (
          <>
            {/* 3. Hero Section */}
            <Hero
              productCount={PRODUCTS.length}
              onExploreStore={() => handleNavigateSection('store')}
              onViewCertificates={() => handleNavigateSection('certificates')}
            />

            {/* 4. Shop by Category Grid */}
            <CategoryGrid
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* 5. 5-Column Desktop / 2-Column Mobile Product Grid */}
            <ProductGrid
              products={filteredProducts}
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              selectedCountry={selectedCountry}
              onSelectProduct={setSelectedProduct}
              onResetFilters={handleResetFilters}
            />

            {/* 6. Our Story & Batch Certificates */}
            <StoryAndCertificates certificates={CERTIFICATES} />

            {/* 7. Customer Testimonials */}
            <TestimonialsSection testimonials={TESTIMONIALS} />
          </>
        )}
      </main>

      {/* 7. Footer (Payment Options + Contact + Policies + Socials) */}
      <Footer
        brandName={effectiveBrandName}
        contact={effectiveContact}
        onOpenPolicy={setActivePolicy}
        onOpenAbout={handleOpenAbout}
        onNavigateSection={handleNavigateSection}
      />

      {/* 8. Product Detail Modal */}
      <ProductModal
        product={selectedProduct}
        selectedCountry={selectedCountry}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 9. Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        subtotal={subtotal}
        shippingFee={shippingFee}
        freeThreshold={effectiveFreeThreshold}
        total={grandTotal}
        selectedCountry={selectedCountry}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* 10. Policy Modal */}
      <PolicyModal
        policy={activePolicy}
        shippingFee={effectiveShippingFee}
        freeThreshold={effectiveFreeThreshold}
        contactEmail={effectiveContact.email}
        onClose={() => setActivePolicy(null)}
      />

      {/* 11. Customer Account, Auth, Preferences & Support Modal */}
      <AuthModal
        isOpen={isAccountOpen}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        onClose={() => setIsAccountOpen(false)}
      />

      {/* 12. Floating WhatsApp Chat & Dismissible Cookie Banner */}
      <WhatsAppFloatButton />
      <CookieBanner onOpenPrivacy={setActivePolicy} />
    </div>
  );
}
