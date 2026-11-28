interface BitcoinIconProps {
  className?: string;
}

/**
 * Bitcoin (BTC) vector emblem for checkout payment selection and footer overview.
 */
export function BitcoinIcon({ className = 'h-5 w-5' }: BitcoinIconProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        d="M21.97 13.78c.31-2.08-1.27-3.2-3.44-3.95l.7-2.82-1.72-.43-.68 2.75c-.45-.11-.92-.22-1.38-.32l.69-2.77-1.72-.43-.7 2.82c-.37-.09-.74-.17-1.1-.26l-2.37-.59-.46 1.83s1.27.29 1.25.31c.7.17.82.63.8.99l-.8 3.22c.05.01.11.03.18.06l-.18-.05-1.12 4.51c-.09.21-.3.53-.79.41.02.02-1.25-.31-1.25-.31l-.85 1.97 2.24.56c.42.1.82.21 1.22.31l-.71 2.85 1.72.43.7-2.82c.47.13.93.25 1.37.36l-.7 2.8 1.72.43.71-2.85c2.93.55 5.13.33 6.06-2.32.75-2.14-.04-3.37-1.58-4.17 1.12-.26 1.97-1 2.2-2.53Zm-3.94 5.52c-.53 2.14-4.13.98-5.3.69l.95-3.79c1.17.29 4.91.87 4.35 3.1Zm.53-5.55c-.49 1.95-3.48.96-4.45.72l.86-3.44c.97.24 4.1.69 3.59 2.72Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}
