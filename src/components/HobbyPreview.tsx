import { useRef, type CSSProperties } from 'react';

type Item = { img: string };

/** Inclinación de cada foto: como fotos dejadas sobre la mesa sin cuidado. */
const TILTS = [-3, 2.2, -1.4, 2.8];

/**
 * Foto de la afición con el ratón encima, en la columna de la etiqueta para no tapar el texto.
 * Al cambiar de fila, la foto cambia directamente y gira a su ángulo.
 * Solo con ratón: en táctil no se muestra (CSS).
 */
export function HobbyPreview({ items, active }: { items: Item[]; active: number }) {
  // al salir conserva la última foto y su ángulo mientras se desvanece
  const last = useRef(0);
  if (active >= 0) last.current = active;
  const shown = last.current;

  return (
    <figure
      className={`hobby-preview ${active >= 0 ? 'is-on' : ''}`}
      style={{ '--tilt': `${TILTS[shown % TILTS.length]}deg` } as CSSProperties}
      aria-hidden
    >
      {items.map((it, i) => (
        <img key={it.img} src={it.img} alt="" decoding="async" className={i === shown ? 'is-active' : ''} />
      ))}
    </figure>
  );
}
