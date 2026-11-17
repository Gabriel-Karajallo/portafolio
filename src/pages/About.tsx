import { useState, type CSSProperties } from 'react';
import { profile, useContent } from '../data/content';
import { useUI } from '../data/ui';
import { AboutPanel } from '../components/AboutPanel';
import { HobbyPreview } from '../components/HobbyPreview';
import { Roll } from '../components/Roll';
import { RevealTitle } from '../components/RevealTitle';
import { Fade, Typed } from '../components/Typed';

function Label({ text }: { text: string }) {
  return <Typed as="h2" className="mono label" text={text} />;
}

/** Envuelve en <em> el fragmento destacado de la intro. */
function Highlight({ text, mark }: { text: string; mark: string }) {
  const at = text.indexOf(mark);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <em>{mark}</em>
      {text.slice(at + mark.length)}
    </>
  );
}

export function About() {
  const { hobbies, intro, introHighlight, languages, city, country } = useContent();
  const t = useUI().about;
  const [hobby, setHobby] = useState(-1);
  const social = [
    { name: 'LinkedIn', href: profile.linkedin },
    { name: 'GitHub', href: profile.github },
  ].filter((s) => s.href);

  return (
    <article className="page about">
      <RevealTitle className="about-title" lines={t.title} />

      {/* En móvil el panel izquierdo no se ve: su contenido va aquí */}
      <AboutPanel className="about-mobile" />

      <section className="row">
        <Label text={t.info} />
        <div className="about-info">
          <Fade as="p" className="about-statement" text={intro}>
            <Highlight text={intro} mark={introHighlight} />
          </Fade>
          <dl className="facts">
            <Fade as="div" style={{ '--i': 0 } as CSSProperties}>
              <dt className="mono">{t.factRole}</dt>
              <dd>{t.role}</dd>
            </Fade>
            <Fade as="div" style={{ '--i': 1 } as CSSProperties}>
              <dt className="mono">{t.factBase}</dt>
              <dd>
                {city}, {country}
              </dd>
            </Fade>
            <Fade as="div" style={{ '--i': 2 } as CSSProperties}>
              <dt className="mono">{t.languages}</dt>
              <dd>
                {languages.map((l) => (
                  <span key={l.name}>
                    {l.name} <span className="muted">{l.level}</span>
                  </span>
                ))}
              </dd>
            </Fade>
          </dl>
        </div>
      </section>

      <section className="row">
        <div className="about-aside">
          <Label text={t.hobbies} />
          <HobbyPreview items={hobbies} active={hobby} />
        </div>
        <ul className="hobbies" onPointerLeave={() => setHobby(-1)}>
          {hobbies.map((h, i) => (
            <Fade
              as="li"
              key={h.name}
              style={{ '--i': i } as CSSProperties}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setHobby(i)}
            >
              <span className="hobby-head">
                <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
                <Typed className="hobby-name" text={h.name} />
              </span>
              <span className="hobby-text muted">{h.text}</span>
            </Fade>
          ))}
        </ul>
      </section>

      <section className="row">
        <Label text={t.talk} />
        <div className="contact">
          <a className="contact-mail" href={`mailto:${profile.email}`}>
            <Roll text={profile.email} />
          </a>
          <p className="contact-social">
            {social.map((s) => (
              <a key={s.name} className="mono" href={s.href} target="_blank" rel="noreferrer">
                <Roll text={s.name} /> ↗
              </a>
            ))}
          </p>
        </div>
      </section>
    </article>
  );
}
