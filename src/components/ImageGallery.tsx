import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';

interface GalleryImage {
  label: string;
  src?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  aspect: string;
  maxWidth?: number;
}

const AUTO_PLAY_INTERVAL_MS = 4000;
const CARD_RATIO = 0.64;
const CLICK_DRAG_THRESHOLD = 6;
const SWIPE_THRESHOLD_RATIO = 0.2;

function parseAspect(aspect: string) {
  const [w, h] = aspect.split('/').map(Number);
  return w && h ? w / h : 1;
}

function shortestDiff(i: number, index: number, length: number) {
  let diff = i - index;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

export function ImageGallery({ images, aspect, maxWidth }: ImageGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startXRef = useRef(0);
  const dragXRef = useRef(0);
  const tappedIndexRef = useRef<number | null>(null);

  const hasMultiple = images.length > 1;
  const ratioNum = parseAspect(aspect);

  const goTo = (target: number) => setIndex(((target % images.length) + images.length) % images.length);

  useLayoutEffect(() => {
    const measure = () => setViewportWidth(viewportRef.current?.offsetWidth ?? 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (!hasMultiple || lightboxOpen || isDragging) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, AUTO_PLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [hasMultiple, images.length, isDragging, lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') goTo(index - 1);
      if (e.key === 'ArrowRight') goTo(index + 1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, index]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!hasMultiple) return;
    const cardEl = (e.target as HTMLElement).closest<HTMLElement>('[data-card-index]');
    tappedIndexRef.current = cardEl ? Number(cardEl.dataset.cardIndex) : null;
    pointerIdRef.current = e.pointerId;
    startXRef.current = e.clientX;
    dragXRef.current = 0;
    setIsDragging(true);
    setDragX(0);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    const dx = e.clientX - startXRef.current;
    dragXRef.current = dx;
    setDragX(dx);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (pointerIdRef.current !== e.pointerId) return;
    pointerIdRef.current = null;
    setIsDragging(false);

    const dx = dragXRef.current;
    dragXRef.current = 0;
    setDragX(0);

    if (Math.abs(dx) < CLICK_DRAG_THRESHOLD) {
      if (tappedIndexRef.current === null) return;
      if (tappedIndexRef.current === index) {
        setLightboxOpen(true);
      } else {
        goTo(tappedIndexRef.current);
      }
      return;
    }

    const step = viewportWidth * CARD_RATIO || 1;
    const progress = dx / step;
    if (Math.abs(progress) > SWIPE_THRESHOLD_RATIO) {
      goTo(index + (progress < 0 ? 1 : -1));
    }
  };

  const step = viewportWidth * CARD_RATIO;

  const carousel = (
    <div className="carousel" style={{ maxWidth, margin: maxWidth ? '0 auto' : undefined }}>
      <div
        className="carousel__viewport"
        ref={viewportRef}
        style={{ aspectRatio: ratioNum / CARD_RATIO, cursor: hasMultiple ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {images.map((image, i) => {
          const diff = shortestDiff(i, index, images.length);
          const posPx = diff * step + (isDragging ? dragX : 0);
          const norm = step ? Math.abs(posPx / step) : 0;
          const scale = Math.max(0.8, 1 - norm * 0.14);
          const opacity = Math.max(0, 1 - norm * 0.45);
          const hidden = norm > 2.2;

          return (
            <div
              key={image.label}
              data-card-index={i}
              className="carousel__card"
              style={{
                left: `calc(50% + ${posPx}px)`,
                width: `${CARD_RATIO * 100}%`,
                aspectRatio: ratioNum,
                transform: `translate(-50%, -50%) scale(${scale})`,
                opacity: hidden ? 0 : opacity,
                zIndex: 100 - Math.round(norm * 10),
                transition: isDragging ? 'none' : undefined,
                pointerEvents: hidden ? 'none' : 'auto',
              }}
            >
              <ImagePlaceholder label={image.label} shape="rounded" src={image.src} />
            </div>
          );
        })}
        <button
          type="button"
          className="carousel__expand"
          onClick={() => setLightboxOpen(true)}
          aria-label="Ampliar imagen"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      {hasMultiple && (
        <>
          <button
            type="button"
            className="carousel__arrow carousel__arrow--prev"
            onClick={() => goTo(index - 1)}
            aria-label="Imagen anterior"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="carousel__arrow carousel__arrow--next"
            onClick={() => goTo(index + 1)}
            aria-label="Siguiente imagen"
          >
            <ChevronRight size={20} />
          </button>
          <div className="carousel__dots">
            {images.map((image, i) => (
              <button
                key={image.label}
                type="button"
                className={`carousel__dot${i === index ? ' carousel__dot--active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Ir a la imagen ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {lightboxOpen && (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <button
            type="button"
            className="lightbox__close"
            onClick={() => setLightboxOpen(false)}
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
          <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
            <ImagePlaceholder label={images[index].label} shape="rounded" radius={12} src={images[index].src} />
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className="carousel__arrow carousel__arrow--prev lightbox__arrow"
                  onClick={() => goTo(index - 1)}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={26} />
                </button>
                <button
                  type="button"
                  className="carousel__arrow carousel__arrow--next lightbox__arrow"
                  onClick={() => goTo(index + 1)}
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight size={26} />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return maxWidth ? <div className="gallery__frame">{carousel}</div> : carousel;
}
