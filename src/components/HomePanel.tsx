import type { CSSProperties } from 'react';
import { profile, useContent } from '../data/content';
import { Clock } from './Clock';
import { CvButton } from './CvButton';

/**
 * Panel izquierdo de portada y contacto: el nombre en grande y, debajo, el reloj.
 * `cv` muestra el botón del currículum (en Contacto ya está en la página).
 */
export function HomePanel({ ready, cv = true }: { ready: boolean; cv?: boolean }) {
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
        {cv && <CvButton className="hpanel-cv" />}
      </div>
      <Clock ready={ready} />
    </div>
  );
}
