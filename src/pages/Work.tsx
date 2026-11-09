import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useContent, type Project } from '../data/content';
import { useUI } from '../data/ui';
import { ImageSlot } from '../components/ImageSlot';
import { Showcase } from '../components/Showcase';
import { Roll } from '../components/Roll';
import { linkTo, navigate } from '../lib/router';
import { tick } from '../lib/sound';

const hrefOf = (it: { slug: string }) => (it.slug === 'pronto' ? '/contacto' : `/proyecto/${it.slug}`);
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Fases de la imagen del proyecto (como en la referencia):
 *  - deck: pequeña en el centro, recién llegada
 *  - list: tarjeta mediana con los proyectos vecinos arriba y abajo (también al cambiar)
 *  - full: ocupa toda la tarjeta y la rueda se lee encima
 */
type Phase = 'deck' | 'list' | 'full';

// La entrada completa (deck → list → full) solo se ve la primera vez de la sesión.
let introPlayed = false;

const SHRINK_MS = 420;
const SLIDE_MS = 760;

function Media({ p }: { p: Project }) {
  return p.shots && !p.image ? (
    <Showcase shots={p.shots} hue={p.color} />
  ) : (
    <ImageSlot src={p.image} hint={`public/projects/${p.slug}.jpg`} label={p.title} />
  );
}

/** Última diapositiva: hueco para lo que viene. */
type Soon = { slug: 'pronto'; title: string; kind: string; year: string };
type Item = Project | Soon;
const isSoon = (it: Item): it is Soon => it.slug === 'pronto';

function Soon({ label }: { label: string }) {
  return (
    <div className="soon">
      {/* marco neutro: lo que venga puede ser web, móvil o lo que sea */}
      <span className="soon-frame">
        <i />
      </span>
      <span className="soon-tag mono">{label}</span>
    </div>
  );
}

function cardStyle(offset: number, phase: Phase, i: number): CSSProperties {
  const a = Math.abs(offset);
  if (phase === 'deck') {
    const r = ((i * 7) % 5) - 2;
    return {
      top: '33%',
      left: '37%',
      width: '26%',
      height: '34%',
      transform: `translate(${r * 6}px, ${r * -4}px) rotate(${r * 2.5}deg)`,
      opacity: a > 3 ? 0 : 1,
      zIndex: 10 - a,
    };
  }
  if (phase === 'list') {
    if (offset === 0) return { top: '20%', left: '22%', width: '56%', height: '60%', zIndex: 10 };
    if (a === 1)
      return { top: offset < 0 ? '3%' : '85%', left: '42%', width: '16%', height: '12%', opacity: 1, zIndex: 9 };
    return { top: offset < 0 ? '-20%' : '110%', left: '42%', width: '16%', height: '12%', opacity: 0, zIndex: 8 };
  }
  // full
  if (offset === 0) return { top: '0%', left: '0%', width: '100%', height: '100%', borderRadius: 0, zIndex: 10 };
  return { top: offset < 0 ? '-30%' : '110%', left: '42%', width: '16%', height: '12%', opacity: 0, zIndex: 8 };
}

type Props = { active: number; setActive: (i: number) => void; ready: boolean };

export function Work({ active, setActive, ready }: Props) {
  const { projects } = useContent();
  const ui = useUI();
  const t = ui.work;
  const items: Item[] = [...projects, { slug: 'pronto', title: t.soonTitle, kind: t.soonKind, year: '…' }];
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const quick =
    introPlayed ||
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    matchMedia('(max-width: 860px)').matches;
  const [phase, setPhase] = useState<Phase>(quick ? 'full' : 'deck');
  const activeRef = useRef(active);
  activeRef.current = active;
  const busy = useRef(!quick);

  // Entrada: deck → list → full (cuando el loader ya se ha ido).
  useEffect(() => {
    if (quick || !ready) return;
    const t1 = window.setTimeout(() => setPhase('list'), 700);
    const t2 = window.setTimeout(() => {
      setPhase('full');
      introPlayed = true;
      busy.current = false;
    }, 1600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [quick, ready]);

  // Rueda, teclado y gesto táctil: encoge, desliza al siguiente y vuelve a crecer.
  useEffect(() => {
    let acc = 0;
    let touchY: number | null = null;
    const timers: number[] = [];

    const goTo = (next: number) => {
      if (busy.current || next === activeRef.current || next < 0 || next >= itemsRef.current.length) return;
      busy.current = true;
      tick(next > activeRef.current ? 1 : 1.12);
      setPhase('list');
      timers.push(
        window.setTimeout(() => setActive(next), SHRINK_MS),
        window.setTimeout(() => setPhase('full'), SHRINK_MS + SLIDE_MS),
        window.setTimeout(() => (busy.current = false), SHRINK_MS + SLIDE_MS + 500),
      );
    };
    const step = (dir: 1 | -1) => goTo(activeRef.current + dir);

    const onWheel = (e: WheelEvent) => {
      acc += e.deltaY;
      if (Math.abs(acc) > 30) {
        step(acc > 0 ? 1 : -1);
        acc = 0;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') step(1);
      else if (e.key === 'ArrowUp' || e.key === 'k') step(-1);
      else if (e.key === 'Enter' && document.activeElement === document.body)
        navigate(hrefOf(itemsRef.current[activeRef.current]));
    };
    const onTouchStart = (e: TouchEvent) => (touchY = e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null) return;
      const dy = touchY - e.touches[0].clientY;
      if (Math.abs(dy) > 40) {
        step(dy > 0 ? 1 : -1);
        touchY = null;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [setActive]);

  const p = items[active];
  const soon = isSoon(p);
  const shift = { '--a': active } as CSSProperties;

  return (
    <section className="work" data-phase={phase} aria-label={t.aria}>
      <div className="work-stage" aria-hidden>
        {items.map((proj, i) => (
          <div key={proj.slug} className="work-card" style={cardStyle(i - active, phase, i)}>
            {isSoon(proj) ? <Soon label={t.building} /> : <Media p={proj} />}
          </div>
        ))}
        <div className="work-shade" />
      </div>

      <div className="wheel" style={shift}>
        <div className="wheel-side wheel-side--l">
          <span className="wheel-num" key={`n${active}`}>{pad(active + 1)}</span>
        </div>

        <div className="wheel-col wheel-col--l">
          <ul className="wheel-track">
            {items.map((proj, i) => (
              <li key={proj.slug} data-d={Math.min(Math.abs(i - active), 3)}>
                <span>{proj.kind}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="wheel-ruler" aria-hidden>
          <span className="wheel-ruler-ticks" />
          <span className="wheel-ruler-mark" />
        </div>

        <div className="wheel-col wheel-col--r">
          <ul className="wheel-track">
            {items.map((proj, i) => (
              <li key={proj.slug} data-d={Math.min(Math.abs(i - active), 3)}>
                {i === active ? (
                  <a
                    href={hrefOf(proj)}
                    onClick={linkTo(hrefOf(proj))}
                    data-cursor={isSoon(proj) ? ui.cursor.write : ui.cursor.view}
                  >
                    {proj.title}
                  </a>
                ) : (
                  <span>{proj.title}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="wheel-side wheel-side--r">
          <span className="wheel-num" key={`y${active}`}>{p.year}</span>
        </div>
      </div>

      <footer className="work-foot">
        <span className="mono">
          {pad(active + 1)} / {pad(items.length)}
        </span>
        <span className="mono work-hint">
          {soon ? t.soonHint : t.hint}
        </span>
        <a
          className="mono work-open"
          key={soon ? 'soon' : 'open'}
          href={hrefOf(p)}
          onClick={linkTo(hrefOf(p))}
          data-cursor={soon ? ui.cursor.write : ui.cursor.view}
        >
          <Roll text={soon ? t.contact : t.open} /> ↗
        </a>
      </footer>
    </section>
  );
}
