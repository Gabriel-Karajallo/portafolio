import { useEffect, useState } from 'react';
import { profile } from '../data/content';
import { useUI } from '../data/ui';
import { Roll } from '../components/Roll';
import { RevealTitle } from '../components/RevealTitle';
import { Fade, Typed } from '../components/Typed';
import { tick } from '../lib/sound';

/** Contacto: solo correo directo (y redes). */
export function Contact() {
  const ui = useUI();
  const t = ui.contact;
  const [copied, setCopied] = useState(false);
  const social = [
    { name: 'LinkedIn', href: profile.linkedin },
    { name: 'GitHub', href: profile.github },
  ].filter((s) => s.href);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // navegadores sin API de portapapeles (o sin permiso): copia a la antigua
      const ta = document.createElement('textarea');
      ta.value = profile.email;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.append(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      if (!ok) return; // queda el enlace mailto
    }
    tick(1.3);
    setCopied(true);
  };

  return (
    <article className="page contact-page">
      <RevealTitle className="contact-title" lines={t.title} />

      <section className="row">
        <Typed as="h2" className="mono label" text={t.mail} />
        <div className="contact contact--direct">
          <a className="contact-mail" href={`mailto:${profile.email}`} data-cursor={ui.cursor.write}>
            <Roll text={profile.email} />
          </a>
          <Fade as="p" className="contact-note muted" text={t.note} />
          <button type="button" className="mono copy-btn" onClick={copy} aria-live="polite">
            <Roll text={copied ? t.copied : t.copy} /> {copied ? '✓' : '⧉'}
          </button>
        </div>
      </section>

      {social.length > 0 && (
        <section className="row">
          <Typed as="h2" className="mono label" text={t.elsewhere} />
          <p className="contact-social">
            {social.map((s) => (
              <a key={s.name} className="mono" href={s.href} target="_blank" rel="noreferrer">
                <Roll text={s.name} /> ↗
              </a>
            ))}
          </p>
        </section>
      )}
    </article>
  );
}
