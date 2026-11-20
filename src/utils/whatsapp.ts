import { WHATSAPP_NUMBER } from '../products.js';
import { CartItem, Product, ProductVariant } from '../types';

function getLotCode(sku: string, lotNumber?: string): string {
  return lotNumber || sku;
}

export function buildWhatsAppUrl(message: string): string {
  const cleanNumber = String(WHATSAPP_NUMBER).replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl(): string {
  return buildWhatsAppUrl('Hello, I have a question about your products.');
}

export function buildSingleProductWhatsAppUrl(params: {
  product: Product;
  variant: ProductVariant;
  quantity: number;
  country: string;
}): string {
  const { product, variant, quantity, country } = params;
  const lot = getLotCode(product.sku, product.lotNumber);
  const lineTotal = variant.price * quantity;

  const message = [
    "Hello sino_pepts, I'd like to order:",
    `- ${product.name} (Lot #${lot}, ${variant.label}) x ${quantity} - $${lineTotal.toFixed(2)}`,
    `Total: $${lineTotal.toFixed(2)}`,
    `Country: ${country}`,
    'Please confirm availability, shipping cost, and payment options.',
  ].join('\n');

  return buildWhatsAppUrl(message);
}

export function buildCartWhatsAppUrl(params: {
  items: CartItem[];
  total: number;
  country: string;
}): string {
  const { items, total, country } = params;

  const itemLines = items.map((item) => {
    const lot = getLotCode(item.sku, item.lotNumber);
    const lineTotal = item.unitPrice * item.quantity;
    return `- ${item.name} (Lot #${lot}, ${item.variantLabel}) x ${item.quantity} - $${lineTotal.toFixed(2)}`;
  });

  const message = [
    "Hello sino_pepts, I'd like to order:",
    ...itemLines,
    `Total: $${total.toFixed(2)}`,
    `Country: ${country}`,
    'Please confirm availability, shipping cost, and payment options.',
  ].join('\n');

  return buildWhatsAppUrl(message);
}
