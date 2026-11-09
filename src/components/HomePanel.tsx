import type { CSSProperties } from 'react';
import { profile, useContent } from '../data/content';
import { Clock } from './Clock';

/** Panel izquierdo de portada y contacto: el nombre en grande y, debajo, el reloj. */
export function HomePanel({ ready }: { ready: boolean }) {
  const { role } = useContent();
  const [first, ...rest] = profile.name.split(' ');
  const lines = [first, rest.join(' ')];

  return (
    <div className="hpanel">
      <div className="hpanel-head">
        <h1 className="hpanel-name" aria-label={profile.name}>
          {lines.map((l, i) => (
            <span className="reveal-line" key={i} aria-hidden>
              <span style={{ '--i': i } as CSSProperties}>{l}</span>
            </span>
          ))}
        </h1>
        <p className="mono hpanel-role">{role}</p>
      </div>
      <Clock ready={ready} />
    </div>
  );
}
