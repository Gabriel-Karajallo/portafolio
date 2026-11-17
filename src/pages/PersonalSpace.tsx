import { useState, type CSSProperties } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MasonryPhotoAlbum, type Photo } from 'react-photo-album';
import 'react-photo-album/masonry.css';
import Lightbox from 'yet-another-react-lightbox';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import { publishedEvents, publishedPhotos, routine, type PersonalPhoto } from '../data/personal';
import { useUI } from '../data/ui';
import { useLang } from '../lib/i18n';
import { RevealTitle } from '../components/RevealTitle';
import { Fade, Typed, useInView } from '../components/Typed';

/** Cabecera de cada bloque: número y nombre en la columna izquierda, título y texto a la derecha. */
function SectionHead({ n, label, title, lead }: { n: number; label: string; title: string; lead: string }) {
  return (
    <>
      <div className="ps-label">
        <Typed as="h2" className="mono label" text={`${String(n).padStart(2, '0')} — ${label}`} />
      </div>
      <div className="ps-head">
        <Typed as="h3" className="ps-title" text={title} />
        <Fade as="p" className="ps-lead muted" text={lead} />
      </div>
    </>
  );
}

// ---------- Rutina: el día como una barra horaria ----------

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const duration = (from: string, to: string, lang: 'es' | 'en') => {
  const d = toMin(to) - toMin(from);
  const h = Math.floor(d / 60);
  const m = d % 60;
  return [h ? `${h} h` : '', m ? `${m} min` : ''].filter(Boolean).join(lang === 'es' ? ' y ' : ' ');
};

function Routine() {
  const lang = useLang();
  const t = useUI().personal.routine;
  const [active, setActive] = useState(0);
  const [ref, inView] = useInView<HTMLDivElement>();

  const start = Math.floor(toMin(routine[0].from) / 60) * 60;
  const end = Math.ceil(toMin(routine[routine.length - 1].to) / 60) * 60;
  const span = end - start;
  const pct = (hhmm: string) => ((toMin(hhmm) - start) / span) * 100;
  const ticks: number[] = [];
  for (let h = start / 60; h <= end / 60; h += 2) ticks.push(h);
  const step = routine[active];

  return (
    <div ref={ref} className={`routine ${inView ? 'is-in' : ''}`}>
      {/* detalle de la parte activa */}
      <div className="rt-detail" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <p className="mono rt-time">
              {step.from} — {step.to} · {duration(step.from, step.to, lang)}
            </p>
            <p className="rt-name">{step.title[lang]}</p>
            <p className="rt-text muted">{step.text[lang]}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* la barra del día: cada tramo ocupa su franja horaria */}
      <div className="rt-bar">
        <p className="mono rt-day muted">{t.day}</p>
        <div className="rt-track">
          {routine.map((s, i) => (
            <button
              key={s.from}
              type="button"
              className={`rt-seg ${i === active ? 'is-on' : ''}`}
              style={
                {
                  left: `${pct(s.from)}%`,
                  width: `${pct(s.to) - pct(s.from)}%`,
                  '--i': i,
                } as CSSProperties
              }
              aria-label={`${s.title[lang]}, ${s.from}–${s.to}`}
              aria-pressed={i === active}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
        <div className="rt-ticks" aria-hidden>
          {ticks.map((h) => (
            <span key={h} className="mono" style={{ left: `${((h * 60 - start) / span) * 100}%` }}>
              {String(h % 24).padStart(2, '0')}
            </span>
          ))}
        </div>
      </div>

      {/* leyenda: las mismas partes en lista, también seleccionables */}
      <ol className="rt-legend">
        {routine.map((s, i) => (
          <li key={s.from}>
            <button
              type="button"
              className={i === active ? 'is-on' : ''}
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
            >
              <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
              <span className="rt-legend-name">{s.title[lang]}</span>
              <span className="mono muted">{s.from}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ---------- Página ----------

type AlbumPhoto = Photo & { item: PersonalPhoto };

const MONTHS = {
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export function PersonalSpace() {
  const t = useUI().personal;
  const lang = useLang();
  const [open, setOpen] = useState(-1);

  const album: AlbumPhoto[] = publishedPhotos.map((p) => ({
    key: p.src,
    src: p.src,
    width: p.w * 100,
    height: p.h * 100,
    alt: p.alt[lang],
    title: p.title[lang],
    item: p,
  }));
  const slides = album.map((p) => ({ src: p.src, alt: p.alt, title: p.item.title[lang], description: p.item.when }));

  let n = 0;
  return (
    <article className="page personal">
      <RevealTitle className="about-title" lines={t.title} />
      <Fade as="p" className="ps-intro" text={t.lead} />

      <section className="row ps-section">
        <SectionHead n={++n} {...t.routine} />
        <div className="ps-body">
          <Routine />
        </div>
      </section>

      {album.length > 0 && (
        <section className="row ps-section ps-section--wide">
          <SectionHead n={++n} {...t.photos} />
          <div className="ps-album">
            <MasonryPhotoAlbum
              photos={album}
              columns={(w) => (w < 520 ? 2 : 3)}
              spacing={(w) => (w < 520 ? 8 : 12)}
              sizes={{ size: '640px', sizes: [{ viewport: '(max-width: 860px)', size: '50vw' }] }}
              onClick={({ index }) => setOpen(index)}
              render={{
                button: ({ style, ...rest }, { index }) => (
                  <button {...rest} data-cursor={t.open} style={{ ...style, '--i': index } as CSSProperties} />
                ),
                extras: (_, { photo }) => (
                  <span className="pg-caption">
                    <span>{photo.item.title[lang]}</span>
                    {photo.item.draft && <span className="mono pg-draft">{t.draft}</span>}
                  </span>
                ),
              }}
            />
          </div>
        </section>
      )}

      {publishedEvents.length > 0 && (
        <section className="row ps-section">
          <SectionHead n={++n} {...t.events} />
          <ul className="pg-events ps-body">
            {publishedEvents.map((e, i) => {
              const [y, m] = e.date.split('-');
              const when = m ? `${MONTHS[lang][Number(m) - 1]} ${y}` : y;
              const body = (
                <>
                  <span className="mono muted">{when}</span>
                  <span className="pg-event-name">
                    {e.name[lang]}
                    {e.draft && <span className="mono pg-draft">{t.draft}</span>}
                  </span>
                  <span className="muted">
                    {e.kind[lang]} · {e.place[lang]}
                  </span>
                </>
              );
              return (
                <Fade as="li" key={`${e.date}-${e.name.es}`} style={{ '--i': i } as CSSProperties}>
                  {e.link ? (
                    <a href={e.link} target="_blank" rel="noreferrer">
                      {body}
                    </a>
                  ) : (
                    <div>{body}</div>
                  )}
                </Fade>
              );
            })}
          </ul>
        </section>
      )}

      <Lightbox
        open={open >= 0}
        index={Math.max(open, 0)}
        close={() => setOpen(-1)}
        slides={slides}
        plugins={[Captions, Counter]}
        captions={{ descriptionTextAlign: 'center' }}
        counter={{ container: { style: { top: 'unset', bottom: 0 } } }}
        controller={{ closeOnBackdropClick: true }}
        animation={{ fade: 250, swipe: 350 }}
        styles={{ container: { backgroundColor: 'rgba(12, 11, 10, 0.94)' } }}
      />
    </article>
  );
}
