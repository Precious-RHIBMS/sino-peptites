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
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  imageBg?: string;
  count: number;
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
}

export interface CartItem {
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  categoryName: string;
  variantLabel: string;
  unitPrice: number;
  quantity: number;
  image: string;
  imageBg?: string;
}

export type PolicyType = 'shipping' | 'privacy' | 'terms' | null;
