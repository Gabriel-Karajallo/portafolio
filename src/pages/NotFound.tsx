import { useEffect } from 'react';
import { profile } from '../data/content';
import { useUI } from '../data/ui';
import { linkTo } from '../lib/router';
import { Roll } from '../components/Roll';
import { RevealTitle } from '../components/RevealTitle';
import { Fade, Typed } from '../components/Typed';

/** Ruta desconocida o proyecto que no existe: explica qué pasa y ofrece volver. */
export function NotFound() {
  const ui = useUI();
  const t = ui.notFound;

  // Que los buscadores no indexen la página de error.
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';
    document.head.append(meta);
    return () => meta.remove();
  }, []);

  return (
    <article className="page contact-page notfound-page">
      <RevealTitle className="contact-title" lines={t.title} />

      <section className="row">
        <Typed as="h2" className="mono label" text={t.code} />
        <div className="contact contact--direct">
          <Fade as="p" className="contact-note muted" text={t.lead} />
          <p className="contact-social">
            <a className="mono" href="/" onClick={linkTo('/')}>
              <Roll text={t.back} /> ↩
            </a>
            <a className="mono" href={`mailto:${profile.email}`} data-cursor={ui.cursor.write}>
              <Roll text={t.contact} /> ↗
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
