import type { CSSProperties } from 'react';
import { profile, stack, useContent } from '../data/content';
import { useUI } from '../data/ui';
import { ImageSlot } from './ImageSlot';
import { Fade, Typed, useInView } from './Typed';

/** La foto se abre desde el centro hacia los lados al entrar en pantalla. */
function Photo() {
  const { photoAlt } = useContent();
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <figure ref={ref} className={`apanel-photo photo-reveal ${inView ? 'is-in' : ''}`}>
      <ImageSlot
        src={profile.photo}
        alt={photoAlt}
        hint="public/profile.webp"
        label="Foto pendiente"
        className="slot--portrait"
      />
    </figure>
  );
}

/** Panel izquierdo de «Sobre mí»: foto, experiencia y stack. */
export function AboutPanel({ className = '' }: { className?: string }) {
  const { experience } = useContent();
  const ui = useUI();
  return (
    <div className={`apanel ${className}`}>
      <Photo />

      <section className="apanel-block">
        <Typed as="h2" className="mono apanel-label" text={ui.about.experience} />
        <ul className="apanel-rows">
          {experience.map((e, i) => (
            <li key={e.company} style={{ '--i': i } as CSSProperties}>
              <Typed className="mono muted" text={e.when} />
              <span>
                <Typed text={e.company} />
                <Fade className="muted apanel-role" text={e.role} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="apanel-block">
        <Typed as="h2" className="mono apanel-label" text={ui.about.stack} />
        <p className="apanel-stack">
          {stack.map((s) => (
            <Typed key={s} className="apanel-tech" text={s} />
          ))}
        </p>
      </section>
    </div>
  );
}
