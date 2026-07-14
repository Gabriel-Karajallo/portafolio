import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';

interface ImageGalleryProps {
  images: { label: string }[];
  aspect: string;
  maxWidth?: number;
}

const AUTO_PLAY_INTERVAL_MS = 3000;

export function ImageGallery({ images, aspect, maxWidth }: ImageGalleryProps) {
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const goTo = (target: number) => setIndex((target + images.length) % images.length);

  useEffect(() => {
    if (!hasMultiple) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, AUTO_PLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasMultiple, images.length, index]);

  return (
    <div className="gallery" style={{ maxWidth, margin: maxWidth ? '0 auto' : undefined }}>
      <div className="gallery__viewport" style={{ aspectRatio: aspect }}>
        {images.map((image, i) => (
          <div key={image.label} className={`gallery__slide${i === index ? ' gallery__slide--active' : ''}`}>
            <ImagePlaceholder label={image.label} shape="rounded" />
          </div>
        ))}
        {hasMultiple && (
          <>
            <button
              type="button"
              className="gallery__arrow gallery__arrow--prev"
              onClick={() => goTo(index - 1)}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="gallery__arrow gallery__arrow--next"
              onClick={() => goTo(index + 1)}
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>
      {hasMultiple && (
        <div className="gallery__dots">
          {images.map((image, i) => (
            <button
              key={image.label}
              type="button"
              className={`gallery__dot${i === index ? ' gallery__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Ir a la imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
