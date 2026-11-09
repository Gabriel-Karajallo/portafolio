import { useEffect, useRef } from 'react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+';

/**
 * Cursor acompañante: un cuadrado marrón que sigue al ratón con algo de retraso.
 * Sobre elementos con data-cursor="…" muestra esa etiqueta, que se descifra letra a letra.
 * Solo con ratón y sin «reducir movimiento».
 */
export function Cursor() {
  const box = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = matchMedia('(pointer: fine)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    const el = box.current!;
    const lab = label.current!;
    let x = -100, y = -100, tx = -100, ty = -100;
    let raf = 0;
    let current = '';
    let scramble = 0;

    const setLabel = (text: string) => {
      if (text === current) return;
      current = text;
      cancelAnimationFrame(scramble);
      if (!text) {
        lab.textContent = '';
        el.classList.remove('has-label');
        return;
      }
      el.classList.add('has-label');
      const start = performance.now();
      const run = (t: number) => {
        const k = Math.min(1, (t - start) / 420);
        const shown = Math.floor(k * text.length);
        let out = text.slice(0, shown);
        for (let i = shown; i < text.length; i++)
          out += text[i] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        lab.textContent = out;
        if (k < 1) scramble = requestAnimationFrame(run);
      };
      scramble = requestAnimationFrame(run);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX;
      ty = e.clientY;
      el.classList.add('is-on');
      const target = (e.target as Element).closest?.('[data-cursor]');
      setLabel(target?.getAttribute('data-cursor') ?? '');
    };
    const onLeave = () => el.classList.remove('is-on');
    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x + 14}px, ${y - 6}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener('pointermove', onMove);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(scramble);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div className="cursor" ref={box} aria-hidden>
      <i />
      <span ref={label} />
    </div>
  );
}
