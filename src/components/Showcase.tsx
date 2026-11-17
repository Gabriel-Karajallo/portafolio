import { useEffect, useState, type CSSProperties } from 'react';

type Props = {
  shots: { src: string; alt: string }[];
  /** Tono del proyecto: se mezcla con el carbón de la paleta. */
  hue?: string;
  className?: string;
  /** En móvil, va pasando cada captura al frente cada pocos segundos. */
  cycle?: boolean;
};

type Pos = 'l' | 'c' | 'r' | 'h';

const CYCLE_MS = 3500;
const MOBILE = '(max-width: 860px)';
const REDUCED = '(prefers-reduced-motion: reduce)';

/** Colocación inicial: la del medio al frente, sus vecinas a los lados y el resto oculto. */
function initial(n: number): Pos[] {
  const mid = Math.floor(n / 2);
  return Array.from({ length: n }, (_, i) => (i === mid ? 'c' : i === mid - 1 ? 'l' : i === mid + 1 ? 'r' : 'h'));
}

/**
 * Un paso: la captura de un lateral pasa al centro y la del centro ocupa su hueco.
 * Se alterna derecha e izquierda, así las tres pasan por delante y ninguna cruza por detrás.
 */
function swap(pos: Pos[], side: 'l' | 'r'): Pos[] {
  const from = pos.indexOf(side);
  const mid = pos.indexOf('c');
  if (from < 0 || mid < 0) return pos;
  const next = [...pos];
  next[from] = 'c';
  next[mid] = side;
  return next;
}

/** Capturas de móvil en fila sobre un fondo del color del proyecto. */
export function Showcase({ shots, hue = 'var(--accent)', className = '', cycle = false }: Props) {
  const n = shots.length;
  const [pos, setPos] = useState<Pos[]>(() => initial(n));

  useEffect(() => {
    if (!cycle || n < 2) return;
    const mobile = matchMedia(MOBILE);
    const reduced = matchMedia(REDUCED);
    let timer = 0;
    let side: 'l' | 'r' = 'r';
    const sync = () => {
      clearInterval(timer);
      if (!mobile.matches || reduced.matches) return;
      timer = window.setInterval(() => {
        const s = side; // el updater de React se ejecuta después: copiar el lado antes de alternarlo
        side = s === 'r' ? 'l' : 'r';
        setPos((p) => swap(p, p.includes(s) ? s : s === 'r' ? 'l' : 'r'));
      }, CYCLE_MS);
    };
    sync();
    mobile.addEventListener('change', sync);
    reduced.addEventListener('change', sync);
    return () => {
      clearInterval(timer);
      mobile.removeEventListener('change', sync);
      reduced.removeEventListener('change', sync);
    };
  }, [cycle, n]);

  return (
    <div
      className={`showcase ${cycle ? 'showcase--cycle' : ''} ${className}`}
      style={{ '--hue': hue } as CSSProperties}
    >
      <div className="showcase-row">
        {shots.map((s, i) => (
          <figure
            className="phone"
            key={s.src}
            style={{ '--n': i } as CSSProperties}
            data-pos={cycle ? pos[i] : undefined}
          >
            <img src={s.src} alt={s.alt} loading={i === 1 ? 'eager' : 'lazy'} decoding="async" />
          </figure>
        ))}
      </div>
    </div>
  );
}
