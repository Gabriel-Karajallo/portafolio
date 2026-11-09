import { useEffect, useState } from 'react';

const TAIL = 3; // mientras se escribe, las últimas letras quedan más claras
const STEP_MS = 60;

/**
 * Frase grande sobre una curva (panel izquierdo de «Sobre mí»).
 * Solo se anima al entrar: se escribe letra a letra en marrón y se asienta en tinta.
 */
export function CurvedText({ text }: { text: string }) {
  const chars = [...text];
  const [typed, setTyped] = useState(() =>
    matchMedia('(prefers-reduced-motion: reduce)').matches ? chars.length : 0,
  );

  useEffect(() => {
    if (typed >= chars.length) return;
    const id = window.setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 350 : STEP_MS);
    return () => clearTimeout(id);
  }, [typed, chars.length]);

  const done = typed >= chars.length;

  return (
    <svg className="curve" viewBox="0 0 400 400" role="img" aria-label={text}>
      <path id="curve-path" d="M 36 350 C 86 250, 170 192, 396 170" fill="none" />
      <text aria-hidden>
        <textPath href="#curve-path">
          {chars.map((c, i) => {
            const from = typed - i; // 1 = la última escrita
            const cls = i >= typed ? '' : !done && from <= TAIL ? `on tail-${from}` : 'on';
            return (
              <tspan key={i} className={cls}>
                {c}
              </tspan>
            );
          })}
        </textPath>
      </text>
    </svg>
  );
}
