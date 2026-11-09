import type { CSSProperties } from 'react';

/** Título grande cuyas líneas suben desde una máscara al entrar en la página. */
export function RevealTitle({ lines, className = '' }: { lines: string[]; className?: string }) {
  return (
    <h1 className={`display reveal ${className}`} aria-label={lines.join(' ')}>
      {lines.map((l, i) => (
        <span className="reveal-line" key={i} aria-hidden>
          <span style={{ '--i': i } as CSSProperties}>{l}</span>
        </span>
      ))}
    </h1>
  );
}
