import type { CSSProperties } from 'react';

type Props = {
  shots: { src: string; alt: string }[];
  /** Tono del proyecto: se mezcla con el carbón de la paleta. */
  hue?: string;
  className?: string;
};

/** Capturas de móvil en fila sobre un fondo del color del proyecto. */
export function Showcase({ shots, hue = 'var(--accent)', className = '' }: Props) {
  return (
    <div className={`showcase ${className}`} style={{ '--hue': hue } as CSSProperties}>
      <div className="showcase-row">
        {shots.map((s, i) => (
          <figure className="phone" key={s.src} style={{ '--n': i } as CSSProperties}>
            <img src={s.src} alt={s.alt} loading={i === 1 ? 'eager' : 'lazy'} decoding="async" />
          </figure>
        ))}
      </div>
    </div>
  );
}
