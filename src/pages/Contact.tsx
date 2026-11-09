import { useState, type FormEvent } from 'react';
import { contactEndpoint, profile, useContent } from '../data/content';
import { useUI } from '../data/ui';
import { Roll } from '../components/Roll';
import { RevealTitle } from '../components/RevealTitle';
import { tick } from '../lib/sound';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact() {
  const { contactTopics } = useContent();
  const ui = useUI();
  const t = ui.contact;
  const [topicIndex, setTopicIndex] = useState(0);
  const topic = contactTopics[topicIndex];
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('_gotcha')) return; // bot
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    // Sin servicio configurado: abre el correo del visitante con todo rellenado.
    if (!contactEndpoint) {
      const subject = `${topic} — ${name}`;
      const body = `${message}\n\n— ${name} (${email})`;
      location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('sent');
      return;
    }

    setStatus('sending');
    try {
      const res = await fetch(contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      tick(1.3);
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <article className="page contact-page">
        <RevealTitle className="contact-title" lines={t.sentTitle} />
        <section className="row">
          <h2 className="mono label">{t.sent}</h2>
          <div className="prose">
            <p>
              {contactEndpoint
                ? t.sentOk
                : t.sentMail}
            </p>
            <button type="button" className="mono link-btn" onClick={() => setStatus('idle')}>
              <Roll text={t.again} /> ↺
            </button>
          </div>
        </section>
      </article>
    );
  }

  return (
    <article className="page contact-page">
      <RevealTitle className="contact-title" lines={t.title} />

      <form className="form" onSubmit={onSubmit}>
        <section className="row">
          <h2 className="mono label">{t.topic}</h2>
          <div className="chips" role="radiogroup" aria-label={t.topicAria}>
            {contactTopics.map((label, i) => (
              <button
                key={i}
                type="button"
                role="radio"
                aria-checked={i === topicIndex}
                className={`chip ${i === topicIndex ? 'is-on' : ''}`}
                onClick={() => setTopicIndex(i)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="row">
          <h2 className="mono label">{t.you}</h2>
          <div className="fields">
            <label className="field">
              <span className="mono">{t.name}</span>
              <input name="name" type="text" autoComplete="name" required placeholder={t.namePh} />
            </label>
            <label className="field">
              <span className="mono">{t.email}</span>
              <input name="email" type="email" autoComplete="email" required placeholder={t.emailPh} />
            </label>
          </div>
        </section>

        <section className="row">
          <h2 className="mono label">{t.message}</h2>
          <div className="fields">
            <label className="field">
              <span className="mono">{t.message}</span>
              <textarea
                name="message"
                required
                minLength={10}
                rows={5}
                placeholder={t.messagePh}
              />
            </label>
            {/* trampa para bots: invisible para personas */}
            <input className="hp" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden />

            <div className="form-foot">
              <button type="submit" className="submit" disabled={status === 'sending'} data-cursor={ui.cursor.send}>
                <span>{status === 'sending' ? t.sending : t.send}</span>
                <span aria-hidden>→</span>
              </button>
              {status === 'error' && (
                <p className="form-error" role="alert">
                  {t.error}{' '}
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                </p>
              )}
            </div>
          </div>
        </section>
      </form>

      <section className="row">
        <h2 className="mono label">{t.direct}</h2>
        <div className="contact">
          <a className="contact-mail" href={`mailto:${profile.email}`}>
            <Roll text={profile.email} />
          </a>
          <p className="contact-social">
            <a className="mono" href={profile.linkedin} target="_blank" rel="noreferrer">
              <Roll text="LinkedIn" /> ↗
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
