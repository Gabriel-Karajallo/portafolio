import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { Silhouette } from './Silhouette';

/**
 * Telón de una sola pieza (viewBox 100×100, estirado a pantalla). El borde de abajo
 * se curva hacia arriba al subir, como una tela, y acaba plano y fuera de la vista.
 * Los tres caminos tienen los mismos comandos para que GSAP pueda interpolarlos.
 */
const CURTAIN = {
  full: 'M0 0 H100 V100 Q50 100 0 100 Z',
  bend: 'M0 0 H100 V58 Q50 8 0 58 Z',
  gone: 'M0 0 H100 V0 Q50 0 0 0 Z',
};
/** Curva base: arranca con peso y frena al llegar (cubic-bezier(0.22,1,0.36,1)). */
const EASE_OUT = 'expo.out';
const EASE_SWEEP = 'expo.inOut';

/**
 * Primera carga: el dibujo se traza entre «(20 GABRIEL» y «26) KARAJALLO» mientras
 * una barra fina mide el avance; el dibujo se recoge, el nombre se junta y sale
 * hacia arriba, y un único telón se levanta curvándose por el centro dejando ver la web.
 * Solo se animan transform y opacity.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onDone });
      if (reduce) {
        tl.to(el, { autoAlpha: 0, duration: 0.4, delay: 0.3 });
        return;
      }
      const sil = el.querySelector<HTMLElement>('.loader-silwrap')!;
      // lo que tiene que recorrer cada mitad del nombre para tocarse en el centro
      const half = () => sil.getBoundingClientRect().width / 2 + parseFloat(getComputedStyle(sil).marginLeft);

      gsap.set('.art-body', { strokeDasharray: 1, strokeDashoffset: 1, fillOpacity: 0 });

      tl
        // entrada: textos desde la máscara y la silueta que se traza
        .from('.loader-mask > span', { yPercent: 110, duration: 0.9, ease: EASE_OUT, stagger: 0.06 }, 0.2)
        .to('.art-body', { strokeDashoffset: 0, duration: 1.3, ease: 'power2.inOut' }, 0)
        .to('.art-body', { fillOpacity: 1, strokeOpacity: 0, duration: 0.5, ease: 'power1.out' }, 1.0)
        .to('.loader-bar', { scaleX: 1, duration: 2.1, ease: 'power2.inOut' }, 0)
        .to('.loader-count', { textContent: 100, snap: { textContent: 1 }, duration: 2.1, ease: 'power2.inOut' }, 0)
        // la silueta se recoge y el nombre se junta
        .to('.loader-sil', { autoAlpha: 0, scale: 0.8, duration: 0.45, ease: 'power2.in' }, 2.0)
        .to('.loader-side--l', { x: half, duration: 0.8, ease: EASE_SWEEP }, 2.2)
        .to('.loader-side--r', { x: () => -half(), duration: 0.8, ease: EASE_SWEEP }, 2.2)
        .to('.loader-foot', { autoAlpha: 0, duration: 0.3, ease: 'power1.out' }, 2.3)
        // el nombre sube con el telón, un poco más rápido, y se desvanece
        .to('.loader-stage', { yPercent: -18, autoAlpha: 0, duration: 0.9, ease: 'power2.in' }, 3.0)
        // el telón se levanta de una pieza: primero se curva, luego se recoge plano
        .to('.loader-curtain path', { attr: { d: CURTAIN.bend }, duration: 0.55, ease: 'power2.in' }, 3.15)
        .to('.loader-curtain path', { attr: { d: CURTAIN.gone }, duration: 0.6, ease: 'power3.out' }, 3.7);
    }, el);
    return () => ctx.revert();
  }, [onDone]);

  return (
    <div className="loader" ref={root} aria-hidden>
      <svg className="loader-curtain" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={CURTAIN.full} />
      </svg>
      <div className="loader-stage">
        <div className="loader-side loader-side--l">
          <span className="loader-mask">
            <span className="loader-year">(20</span>
          </span>
          <span className="loader-mask">
            <span className="loader-word">Gabriel</span>
          </span>
        </div>
        <div className="loader-silwrap">
          <Silhouette className="loader-sil" />
        </div>
        <div className="loader-side loader-side--r">
          <span className="loader-mask">
            <span className="loader-year">26)</span>
          </span>
          <span className="loader-mask">
            <span className="loader-word">Karajallo</span>
          </span>
        </div>
      </div>
      <div className="loader-foot">
        <span className="loader-count">0</span>
        <span className="loader-track">
          <span className="loader-bar" />
        </span>
      </div>
    </div>
  );
}
