import { useState } from 'react';
import { FlaskConical } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

/**
 * Resilient image component with no-referrer policy and an atmospheric
 * laboratory-slate fallback container if an image fails to load.
 */
export function SafeImage({ src, alt, className = '', fallbackTitle }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1220] via-[#0E192D] to-[#050B14] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <FlaskConical className="h-8 w-8 text-[#1E90FF]/60 mb-2" strokeWidth={1.5} />
        {fallbackTitle && (
          <span className="text-xs font-medium text-slate-400 line-clamp-2 max-w-[160px]">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
}
