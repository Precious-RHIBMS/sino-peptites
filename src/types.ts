/**
 * Shared TypeScript interfaces for the storefront catalog and cart.
 */

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  originalPrice?: number;
  stock: number;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  lotNumber?: string;
  name: string;
  categoryId: string;
  categoryName: string;
  image: string;
  imageBg?: string;
  purityNote: string;
  shortDescription: string;
  description: string;
  specs: ProductSpec[];
  variants: ProductVariant[];
  sortOrder?: number;
  updatedAt?: unknown;
  updatedBy?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  imageBg?: string;
  count: number;
  sortOrder?: number;
  updatedAt?: unknown;
  updatedBy?: string;
}

export interface Certificate {
  id: string;
  title: string;
  batchCode: string;
  standard: string;
  result: string;
  testedDate: string;
  summary: string;
  metrics: { label: string; value: string }[];
  sortOrder?: number;
  updatedAt?: unknown;
  updatedBy?: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  sku: string;
  lotNumber?: string;
  name: string;
  categoryName: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  image: string;
  imageBg?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  organization: string;
  productPurchased: string;
  rating: number;
  quote: string;
  verifiedDate: string;
  sortOrder?: number;
  updatedAt?: unknown;
  updatedBy?: string;
}

export type PolicyType = 'shipping' | 'privacy' | 'terms' | null;

export type CookieConsentValue = 'accepted' | 'dismissed' | 'unset';

export type SupportMessageStatus = 'open' | 'in_progress' | 'resolved';

export interface CustomerProfile {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  preferredCountry: string;
  emailVerified: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface UserPreferences {
  userId: string;
  preferredCountry: string;
  emailNotifications: boolean;
  whatsappUpdates: boolean;
  cookieConsent: CookieConsentValue;
  updatedAt?: unknown;
}

export interface WebsiteSettings {
  brandName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  announcementEnabled: boolean;
  updatedAt?: unknown;
  updatedBy: string;
}

export interface SupportMessage {
  id?: string;
  userId: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  status: SupportMessageStatus;
  createdAt?: unknown;
  updatedAt?: unknown;
}


