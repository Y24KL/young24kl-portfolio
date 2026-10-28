import { useState } from 'react';

// Responsive photograph with a blurred placeholder that dissolves once the
// real image has decoded. Works with bundled photos (srcSet + placeholder from
// lib/media) and with plain CMS URLs.
const Photo = ({
  image,
  sizes = '100vw',
  priority = false,
  className = '',
  imgClassName = '',
  alt,
  style,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-charcoal ${className}`}
      style={{
        ...style,
        backgroundImage: image.placeholder ? `url(${image.placeholder})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img
        src={image.src}
        srcSet={image.srcSet}
        sizes={image.srcSet ? sizes : undefined}
        width={image.width}
        height={image.height}
        alt={alt ?? image.alt ?? ''}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        // Cached images can finish before React attaches onLoad.
        ref={(el) => { if (el?.complete && el.naturalWidth) setLoaded(true); }}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-[var(--ease-cinema)] ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
      />
    </div>
  );
};

export default Photo;
