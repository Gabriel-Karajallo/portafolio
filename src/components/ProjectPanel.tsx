import type { CSSProperties } from 'react';
import type { Project } from '../data/content';
import { Roll } from './Roll';
import { linkTo } from '../lib/router';
import { useUI } from '../data/ui';

/** Ficha del proyecto en el panel izquierdo: título letra a letra y datos en filas. */
export function ProjectPanel({ p }: { p: Project }) {
  const ui = useUI();
  const t = ui.project;
  const rows = [
    { k: t.year, v: p.status ? `${p.year} · ${p.status}` : p.year },
    { k: t.type, v: p.kind },
    { k: t.role, v: p.role },
    { k: t.stack, v: p.stack.join(', ') },
  ];
  return (
    <div className="ppanel">
      <a className="mono back" href="/" onClick={linkTo('/')}>
        ← <Roll text={t.back} />
      </a>
      <h1 className="ppanel-title" aria-label={p.title}>
        {[...p.title].map((c, i) => (
          <span key={i} aria-hidden style={{ '--i': i } as CSSProperties}>
            {c}
          </span>
        ))}
      </h1>
      <p className="ppanel-summary">{p.summary}</p>
      <dl className="ppanel-rows">
        {rows.map((r, i) => (
          <div key={r.k} style={{ '--i': i } as CSSProperties}>
            <dt className="mono">{r.k}</dt>
            <dd>{r.v}</dd>
          </div>
        ))}
        {p.link && (
          <div style={{ '--i': rows.length } as CSSProperties}>
            <dt className="mono">{t.web}</dt>
            <dd>
              <a href={p.link} target="_blank" rel="noreferrer" data-cursor={ui.cursor.visit}>
                <Roll text={p.link.replace(/^https?:\/\//, '')} /> ↗
              </a>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
