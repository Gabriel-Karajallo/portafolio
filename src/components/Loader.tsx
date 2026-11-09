import { useLayoutEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { Silhouette } from './Silhouette';

/** Borde rasgado: puntos con alturas aleatorias a lo largo del ancho (para clip-path). */
function tornEdge(side: 'top' | 'bottom') {
  const pts: string[] = [];
  const N = 140;
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * 100;
    // picos irregulares: la mayoría pequeños y alguno más largo
    const r = Math.random();
    const d = 4 + r * r * r * 26 + Math.random() * 6;
    pts.push(side === 'top' ? `${x.toFixed(2)}% calc(100% - ${d.toFixed(1)}px)` : `${x.toFixed(2)}% ${d.toFixed(1)}px`);
  }
  return side === 'top'
    ? `polygon(0 0, 100% 0, ${pts.reverse().join(', ')})`
    : `polygon(${pts.join(', ')}, 100% 100%, 0 100%)`;
}

/**
 * Primera carga: el dibujo se traza entre «(20 GABRIEL» y «26) KARAJALLO»,
 * se pliega y el nombre se junta; una línea marrón cruza, todo se tiñe de marrón
 * y la pantalla se rasga desde el centro dejando ver la web.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const clips = useMemo(() => ({ top: tornEdge('top'), bottom: tornEdge('bottom') }), []);

  useLayoutEffect(() => {
    const el = root.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onDone });
      if (reduce) {
        tl.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.3 });
        return;
      }
      gsap.set('.art-body', { strokeDasharray: 1, strokeDashoffset: 1, fillOpacity: 0 });

      // la silueta se traza y se rellena
      tl.to('.art-body', { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' })
        .to('.art-body', { fillOpacity: 1, strokeOpacity: 0, duration: 0.45, ease: 'power1.out' }, 0.95)
        .from('.loader-side--l', { x: 24, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.35)
        .from('.loader-side--r', { x: -24, autoAlpha: 0, duration: 0.7, ease: 'power3.out' }, 0.35)
        // el dibujo se pliega y el nombre se junta en el centro
        .to('.loader-sil', { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: 'power2.in' }, 2.0)
        .to('.loader-silwrap', { width: 0, marginLeft: 0, marginRight: 0, duration: 0.6, ease: 'power3.inOut' }, 2.15)
        // línea que cruza y fundido marrón
        .to('.loader-line', { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, 2.8)
        .to('.loader-tear', { autoAlpha: 1, duration: 0.3, ease: 'power1.in' }, 3.05)
        .set('.loader-stage, .loader-bg, .loader-line', { autoAlpha: 0 }, 3.37)
        // se rasga desde el centro
        .to('.loader-tear--top', { yPercent: -102, duration: 1, ease: 'power3.inOut' }, 3.45)
        .to('.loader-tear--bottom', { yPercent: 102, duration: 1, ease: 'power3.inOut' }, 3.45);
    }, el);
    return () => ctx.revert();
  }, [onDone]);

  return (
    <div className="loader" ref={root} aria-hidden>
      <div className="loader-bg" />
      <div className="loader-stage">
        <div className="loader-side loader-side--l">
          <span className="loader-year">(20</span>
          <span className="loader-word">Gabriel</span>
        </div>
        <div className="loader-silwrap">
          <Silhouette className="loader-sil" />
        </div>
        <div className="loader-side loader-side--r">
          <span className="loader-year">26)</span>
          <span className="loader-word">Karajallo</span>
        </div>
      </div>
      <div className="loader-line" />
      <div className="loader-tear loader-tear--top" style={{ clipPath: clips.top }} />
      <div className="loader-tear loader-tear--bottom" style={{ clipPath: clips.bottom }} />
    </div>
  );
}
