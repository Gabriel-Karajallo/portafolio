import { createElement, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/** Marca el elemento como visible la primera vez que entra en pantalla. */
export function useInView<T extends Element>(margin = '0px 0px -10% 0px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView] as const;
}

/**
 * Texto corrido (frases, párrafos): entra entero, subiendo y apareciendo, al entrar en pantalla.
 * El letra a letra se reserva para textos cortos (etiquetas, nombres).
 */
export function Fade({ text, as = 'span', className = '' }: Omit<Props, 'children'>) {
  const [ref, inView] = useInView<HTMLElement>();
  return createElement(as, { ref, className: `fade ${inView ? 'is-in' : ''} ${className}` }, text);
}

type Props = {
  text: string;
  as?: keyof HTMLElementTagNameMap;
  className?: string;
  children?: ReactNode;
};

/**
 * Texto que aparece letra a letra en orden casi aleatorio cuando entra en pantalla:
 * cada letra entra en marrón y se asienta en su color.
 */
export function Typed({ text, as = 'span', className = '' }: Props) {
  const [ref, inView] = useInView<HTMLElement>();
  const delays = useMemo(() => {
    const n = text.length || 1;
    // tendencia de izquierda a derecha, con mucho desorden
    return [...text].map((_, i) => (i / n) * 0.45 + Math.random() * 0.55);
  }, [text]);

  return createElement(
    as,
    { ref, className: `typed ${inView ? 'is-in' : ''} ${className}`, 'aria-label': text },
    [...text].map((c, i) =>
      createElement(
        'span',
        { key: i, 'aria-hidden': true, style: { '--d': `${delays[i].toFixed(3)}s` } as CSSProperties },
        c,
      ),
    ),
  );
}
