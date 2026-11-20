import { useMemo, useState } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
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
import { CATEGORIES, CERTIFICATES, PRODUCTS, STORE_CONFIG, TESTIMONIALS } from './products.js';
import { CartItem, PolicyType, Product, ProductVariant } from './types';

/**
 * Valence Botanicals Storefront Application
 * Runs fully client-side from local products.js catalog with in-memory cart state.
 */
export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutView, setIsCheckoutView] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>('United States');

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
    return subtotal >= STORE_CONFIG.freeShippingThreshold ? 0 : STORE_CONFIG.shippingFee;
  }, [cartItems.length, subtotal]);

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

  // Smooth section navigation (exits checkout view if active)
  const handleNavigateSection = (sectionId: string) => {
    if (isCheckoutView) {
      setIsCheckoutView(false);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
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
  };

  const handleRemoveCartItem = (variantId: string) => {
    setCartItems((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutView(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderComplete = () => {
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050B14] text-slate-200">
      {/* 1. Top Announcement Bar */}
      <AnnouncementBar
        shippingFee={STORE_CONFIG.shippingFee}
        freeThreshold={STORE_CONFIG.freeShippingThreshold}
        onOpenPolicy={setActivePolicy}
      />

      {/* 2. Sticky White Header */}
      <Navbar
        brandName={STORE_CONFIG.brandName}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        cartCount={cartCount}
        cartTotal={subtotal}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area: Storefront or Checkout */}
      <main className="flex-1">
        {isCheckoutView ? (
          <CheckoutView
            items={cartItems}
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={grandTotal}
            selectedCountry={selectedCountry}
            onCountryChange={setSelectedCountry}
            onBackToStore={() => {
              setIsCheckoutView(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOrderComplete={handleOrderComplete}
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
        brandName={STORE_CONFIG.brandName}
        contact={STORE_CONFIG.contact}
        onOpenPolicy={setActivePolicy}
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
        freeThreshold={STORE_CONFIG.freeShippingThreshold}
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
        shippingFee={STORE_CONFIG.shippingFee}
        freeThreshold={STORE_CONFIG.freeShippingThreshold}
        contactEmail={STORE_CONFIG.contact.email}
        onClose={() => setActivePolicy(null)}
      />

      {/* 11. Floating WhatsApp Chat & Dismissible Cookie Banner */}
      <WhatsAppFloatButton />
      <CookieBanner onOpenPrivacy={setActivePolicy} />
    </div>
  );
}
