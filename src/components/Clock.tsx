import { useEffect, useRef, useState } from 'react';
import { profile, useContent } from '../data/content';
import { useUI } from '../data/ui';

const fmt = new Intl.DateTimeFormat('es-ES', {
  timeZone: profile.timeZone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

type Time = { hm: string; s: number };

function now(): Time {
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  return { hm: get('hour') + get('minute'), s: Number(get('second')) };
}

/** Hora de Sevilla, actualizada justo al cambiar cada segundo. */
export function useClock() {
  const [t, setT] = useState(now);
  useEffect(() => {
    let id: number;
    const loop = () => {
      setT(now());
      id = window.setTimeout(loop, 1000 - (Date.now() % 1000) + 5);
    };
    id = window.setTimeout(loop, 1000 - (Date.now() % 1000) + 5);
    return () => clearTimeout(id);
  }, []);
  return t;
}

function Digits({ value }: { value: string }) {
  return (
    <>
      {[...value].map((d, i) => (
        // la key cambia con el dígito: cada cambio entra rodando
        <span className="clock-d" key={`${i}-${d}`}>
          {d}
        </span>
      ))}
    </>
  );
}

/* ---------- Hilos: uno por segundo, en arco alrededor del reloj ---------- */

type Thread = { sec: number; born: number; angle: number; dying: number | null };

const DEG = Math.PI / 180;
const NEWEST_ANGLE = 184 * DEG; // la más reciente nace a la izquierda, algo por debajo
const STEP = 6 * DEG; // 360° / 60 s: el minuto completo cierra el círculo
const DRAW_MS = 900; // lo que tarda el hilo en tenderse
const FADE_MS = 700; // al cambiar de minuto los hilos se desvanecen

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Curvatura propia de cada hilo (estable por segundo): unos se doblan a un lado, otros al otro. */
const bendOf = (sec: number) => {
  const r = Math.sin(sec * 12.9898 + 78.233) * 43758.5453;
  return ((r - Math.floor(r)) * 2 - 1) * 0.26;
};

function rgba(hex: string, a: number) {
  const h = hex.trim().replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function ThreadCanvas({
  second,
  anchorRef,
  ready,
}: {
  second: number;
  anchorRef: React.RefObject<HTMLElement | null>;
  ready: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const threads = useRef<Thread[]>([]);
  const lastSec = useRef<number | null>(null);

  // Cada segundo: añade un hilo (o, al empezar minuto, deshace los anteriores).
  useEffect(() => {
    if (!ready) return; // esperamos a que se vaya el loader
    const t = performance.now();
    const list = threads.current;
    const prev = lastSec.current;
    lastSec.current = second;

    if (prev === null) {
      // primera vez: los segundos transcurridos se despliegan en abanico, uno tras otro
      for (let s = 0; s <= second; s++) list.push({ sec: s, born: t + s * 28, angle: NEWEST_ANGLE, dying: null });
      return;
    }
    if (second < prev) list.forEach((th) => th.dying ??= t);
    if (!list.some((th) => th.sec === second && th.dying === null))
      list.push({ sec: second, born: t, angle: NEWEST_ANGLE, dying: null });
  }, [second, ready]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let colors = { ink: '#1b1815', muted: '#8d867b' };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const readColors = () => {
      const cs = getComputedStyle(canvas);
      colors = { ink: cs.getPropertyValue('--ink') || colors.ink, muted: cs.getPropertyValue('--muted') || colors.muted };
    };
    resize();
    readColors();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, w, h);

      // Punto de convergencia: base del separador «:» del reloj.
      const anchor = anchorRef.current;
      if (!anchor) return;
      const cr = canvas.getBoundingClientRect();
      const ar = anchor.getBoundingClientRect();
      const ax = ar.left + ar.width / 2 - cr.left;
      const ay = ar.top + ar.height * 0.62 - cr.top;
      const cx = ax;
      const cy = ay - 4;
      const R = Math.max(80, Math.min(w / 2 - 30, h / 2 - 24, 150));

      // Quitar los que ya se desvanecieron.
      threads.current = threads.current.filter((th) => th.dying === null || t - th.dying < FADE_MS);
      const alive = threads.current.filter((th) => th.dying === null);
      const n = alive.length;

      ctx.font = '11px "Geist Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 1;

      for (const th of threads.current) {
        // Ángulo objetivo según su antigüedad; se desliza suavemente hacia él.
        if (th.dying === null) {
          const age = alive.length - 1 - alive.indexOf(th);
          const target = NEWEST_ANGLE - age * STEP;
          th.angle = reduce ? target : th.angle + (target - th.angle) * 0.09;
        }
        const life = Math.max(0, t - th.born);
        const p = reduce ? 1 : easeOut(Math.min(1, life / DRAW_MS));
        const fade = th.dying === null ? 1 : 1 - Math.min(1, (t - th.dying) / FADE_MS);
        const isNew = th.dying === null && alive[n - 1] === th;

        const cos = Math.cos(th.angle);
        const sin = Math.sin(th.angle);
        const lx = cx + cos * R;
        const ly = cy - sin * R;
        const ex = cx + cos * (R - 14);
        const ey = cy - sin * (R - 14);

        // Curva cuadrática con un balanceo amortiguado al nacer: un hilo que se tensa.
        const dx = ex - ax;
        const dy = ey - ay;
        const len = Math.hypot(dx, dy) || 1;
        const sway = reduce ? 0 : Math.exp(-life / 520) * Math.sin(life / 85) * 0.22;
        const bend = bendOf(th.sec) + sway;
        const qx = ax + dx * 0.5 + (-dy / len) * len * bend;
        const qy = ay + dy * 0.5 + (dx / len) * len * bend;

        // Se tiende desde el reloj hacia la etiqueta.
        const alpha = (isNew ? 0.5 : 0.17) * fade;
        ctx.strokeStyle = rgba(colors.ink, alpha);
        ctx.beginPath();
        const SEG = 36;
        for (let i = 0; i <= SEG * p; i++) {
          const u = i / SEG;
          const x = (1 - u) * (1 - u) * ax + 2 * (1 - u) * u * qx + u * u * ex;
          const y = (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * qy + u * u * ey;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // La etiqueta aparece cuando el hilo llega.
        const la = Math.max(0, (p - 0.6) / 0.4) * fade;
        if (la > 0) {
          ctx.fillStyle = rgba(isNew ? colors.ink : colors.muted, la);
          ctx.fillText(String(th.sec).padStart(2, '0'), lx, ly);
        }
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [anchorRef]);

  return <canvas className="clock-canvas" ref={canvasRef} aria-hidden />;
}

/** Reloj grande; cada segundo tiende un hilo nuevo hacia él. */
export function Clock({ ready = true }: { ready?: boolean }) {
  const t = useClock();
  const { city } = useContent();
  const ui = useUI();
  const sepRef = useRef<HTMLSpanElement>(null);

  return (
    <div className="clock">
      <ThreadCanvas second={t.s} anchorRef={sepRef} ready={ready} />
      <time className="clock-time" aria-label={ui.clock(city, `${t.hm.slice(0, 2)}:${t.hm.slice(2)}`)}>
        <Digits value={t.hm.slice(0, 2)} />
        <span className="clock-sep" ref={sepRef}>
          :
        </span>
        <Digits value={t.hm.slice(2)} />
      </time>
    </div>
  );
}
