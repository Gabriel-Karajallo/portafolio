import { useContent } from '../data/content';
import { useUI } from '../data/ui';
import { ImageSlot } from '../components/ImageSlot';
import { Showcase } from '../components/Showcase';
import { ProjectPanel } from '../components/ProjectPanel';
import { linkTo } from '../lib/router';

export function Project({ slug }: { slug: string }) {
  const { projects } = useContent();
  const t = useUI().project;
  const index = Math.max(0, projects.findIndex((p) => p.slug === slug));
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="project">
      {/* La imagen sigue ocupando toda la tarjeta, como venía de «Trabajo» */}
      <div className="project-hero">
        {p.shots && !p.image ? (
          <Showcase shots={p.shots} hue={p.color} />
        ) : (
          <ImageSlot src={p.image} hint={`public/projects/${p.slug}.jpg`} />
        )}
        <span className="mono project-scroll">{t.scroll}</span>
      </div>

      <div className="page project-body">
        {/* En móvil el panel izquierdo no cabe: la ficha va aquí */}
        <div className="project-mobile">
          <ProjectPanel p={p} />
        </div>

        <section className="row">
          <h2 className="mono label">{t.about}</h2>
          <div className="prose">
            {p.body.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
        </section>

        {p.features && (
          <section className="row">
            <h2 className="mono label">{t.features}</h2>
            <ul className="features">
              {p.features.map((f, i) => (
                <li key={f.name}>
                  <span className="mono muted">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{f.name}</h3>
                  <p className="muted">{f.text}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {p.gallery && p.gallery.length > 0 && (
          <div className="gallery">
            {p.gallery.map((src, i) => (
              <ImageSlot key={i} src={src} hint={`public/projects/${p.slug}-${i + 1}.jpg`} />
            ))}
          </div>
        )}

        {projects.length > 1 ? (
          <a className="next" href={`/proyecto/${next.slug}`} onClick={linkTo(`/proyecto/${next.slug}`)}>
            <span className="mono muted">{t.next}</span>
            <span className="display next-title">{next.title} →</span>
          </a>
        ) : (
          <a className="next" href="/contacto" onClick={linkTo('/contacto')}>
            <span className="mono muted">{t.moreSoon}</span>
            <span className="display next-title">{t.talk} →</span>
          </a>
        )}
      </div>
    </article>
  );
}
