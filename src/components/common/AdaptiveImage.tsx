import React, { useState } from 'react';
import { normalizeImageUrl, getAlternateDriveUrl, isGoogleDriveUrl, DEFAULT_AVATAR } from '../../utils/imageUtils';
import { User, Image as ImageIcon } from 'lucide-react';

interface AdaptiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  fit?: 'cover' | 'contain' | 'fill' | 'none';
  showPlaceholderIcon?: boolean;
}

export const AdaptiveImage: React.FC<AdaptiveImageProps> = ({
  src,
  fallbackSrc,
  alt = 'Foto',
  className = '',
  containerClassName = '',
  fit = 'cover',
  showPlaceholderIcon = true,
  ...props
}) => {
  const normalized = normalizeImageUrl(src || '');
  const [currentSrc, setCurrentSrc] = useState<string>(normalized || fallbackSrc || '');
  const [hasError, setHasError] = useState(false);
  const [triedAlternate, setTriedAlternate] = useState(false);

  // Update when src prop changes
  React.useEffect(() => {
    const nextUrl = normalizeImageUrl(src || '');
    setCurrentSrc(nextUrl || fallbackSrc || '');
    setHasError(false);
    setTriedAlternate(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!triedAlternate && src && isGoogleDriveUrl(src)) {
      setTriedAlternate(true);
      const altUrl = getAlternateDriveUrl(src);
      if (altUrl && altUrl !== currentSrc) {
        setCurrentSrc(altUrl);
        return;
      }
    }

    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }

    setHasError(true);
  };

  const fitClass =
    fit === 'contain'
      ? 'object-contain'
      : fit === 'fill'
      ? 'object-fill'
      : fit === 'none'
      ? 'object-none'
      : 'object-cover object-center';

  if (hasError || !currentSrc) {
    if (showPlaceholderIcon) {
      return (
        <div
          className={`flex items-center justify-center bg-slate-100 text-slate-400 overflow-hidden ${
            containerClassName || className || 'w-full h-full'
          }`}
          title={alt}
        >
          <User className="w-1/2 h-1/2 max-w-8 max-h-8 opacity-60" />
        </div>
      );
    }
    return (
      <img
        src={fallbackSrc || DEFAULT_AVATAR}
        alt={alt}
        className={`${fitClass} ${className}`}
        {...props}
      />
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      className={`${fitClass} ${className}`}
      loading="lazy"
      {...props}
    />
  );
};
