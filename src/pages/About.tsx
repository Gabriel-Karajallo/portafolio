import { profile, useContent } from '../data/content';
import { useUI } from '../data/ui';
import { AboutPanel } from '../components/AboutPanel';
import { Roll } from '../components/Roll';
import { RevealTitle } from '../components/RevealTitle';
import { Fade, Typed } from '../components/Typed';
import { linkTo } from '../lib/router';

function Label({ text }: { text: string }) {
  return <Typed as="h2" className="mono label" text={text} />;
}

export function About() {
  const { hobbies, hobbiesIntro, intro, languages, city } = useContent();
  const t = useUI().about;
  const years = new Date().getFullYear() - profile.since;
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
        <div className="prose">
          <Fade as="p" text={intro} />
          <Fade as="p" text={t.years(years, city)} />
        </div>
      </section>

      <section className="row">
        <Label text={t.hobbies} />
        <div className="hobbies-wrap">
          <Fade as="p" className="lead hobbies-intro" text={hobbiesIntro} />
          <ul className="hobbies">
            {hobbies.map((h, i) => (
              <li key={h.name}>
                <Typed className="mono muted" text={String(i + 1).padStart(2, '0')} />
                <Typed className="hobby-name" text={h.name} />
                <Fade className="hobby-text muted" text={h.text} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="row">
        <Label text={t.languages} />
        <ul className="list">
          {languages.map((l) => (
            <li key={l.name}>
              <Typed text={l.name} />
              <Typed className="muted" text={l.level} />
            </li>
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
            <a className="mono" href="/contacto" onClick={linkTo('/contacto')}>
              <Roll text={t.form} /> →
            </a>
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
