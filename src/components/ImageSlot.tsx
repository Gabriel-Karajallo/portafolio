type Props = {
  src?: string;
  alt?: string;
  /** Ruta donde se espera la imagen, se muestra en el hueco. */
  hint: string;
  label?: string;
  className?: string;
};

/** Imagen o, si aún no hay, un hueco marcado con la ruta donde dejarla. */
export function ImageSlot({ src, alt = '', hint, label = 'Imagen pendiente', className = '' }: Props) {
  if (src) {
    return (
      <div className={`slot ${className}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    );
  }
  return (
    <div className={`slot slot--empty ${className}`} role="img" aria-label={`${label}: ${hint}`}>
      <svg className="slot-x" preserveAspectRatio="none" viewBox="0 0 100 100" aria-hidden>
        <line x1="0" y1="0" x2="100" y2="100" />
        <line x1="100" y1="0" x2="0" y2="100" />
      </svg>
      <span className="slot-corner slot-corner--tl" />
      <span className="slot-corner slot-corner--tr" />
      <span className="slot-corner slot-corner--bl" />
      <span className="slot-corner slot-corner--br" />
      <span className="slot-label">
        <span>{label}</span>
        <span className="slot-hint">{hint}</span>
      </span>
    </div>
  );
}
