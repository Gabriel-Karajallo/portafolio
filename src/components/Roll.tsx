import type { CSSProperties } from 'react';

/** Texto que «rueda» letra a letra al pasar el ratón por el enlace o botón padre. */
export function Roll({ text }: { text: string }) {
  const chars = [...text];
  return (
    <span className="roll">
      <span className="sr-only">{text}</span>
      {chars.map((c, i) => {
        const ch = c === ' ' ? ' ' : c;
        return (
          <span className="roll-c" aria-hidden key={i} style={{ '--i': i } as CSSProperties}>
            <span>{ch}</span>
            <span>{ch}</span>
          </span>
        );
      })}
    </span>
  );
}
