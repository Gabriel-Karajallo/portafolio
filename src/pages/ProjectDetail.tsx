import { useEffect } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ImageGallery } from '../components/ImageGallery';
import { Reveal } from '../components/Reveal';
import { projectDetails } from '../data/content';

const CONTACT_PHRASE = 'ponte en contacto conmigo';

function DemoNote({ note }: { note: string }) {
  const index = note.toLowerCase().indexOf(CONTACT_PHRASE);

  if (index === -1) {
    return (
      <div className="detail-demo-note">
        <Info size={16} className="detail-demo-note__icon" />
        <span>{note}</span>
      </div>
    );
  }

  const before = note.slice(0, index);
  const phrase = note.slice(index, index + CONTACT_PHRASE.length);
  const after = note.slice(index + CONTACT_PHRASE.length);

  return (
    <div className="detail-demo-note">
      <Info size={16} className="detail-demo-note__icon" />
      <span>
        {before}
        <Link to="/#contacto" className="detail-demo-note__link">
          {phrase}
        </Link>
        {after}
      </span>
    </div>
  );
}

export function ProjectDetail() {
  const { projectId } = useParams();
  const project = projectId ? projectDetails[projectId] : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [projectId]);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="detail-page" key={project.id}>
      <div className="detail-nav">
        <div className="detail-nav__inner">
          <Link to="/#proyectos" className="detail-nav__back">
            <ArrowLeft size={18} strokeWidth={2} />
            Volver atrás
          </Link>
        </div>
      </div>

      <Reveal as="div" className="detail-hero">
        <div className="badge badge--detail">{project.category}</div>
        <h1 className="detail-title">{project.name}</h1>
        <p className="detail-subtitle">{project.subtitle}</p>
      </Reveal>

      <Reveal as="div" className="detail-overview" delayMs={100}>
        <div className="detail-overview__text">
          <div className="eyebrow">Sobre el proyecto</div>
          {project.description.map((paragraph) => (
            <p className="detail-paragraph" key={paragraph}>
              {paragraph}
            </p>
          ))}
          {project.playStoreUrl !== undefined &&
            (project.playStoreUrl ? (
              <a
                href={project.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-store-badge"
              >
                <img src="/images/google-play-badge.png" alt="Disponible en Google Play" />
              </a>
            ) : (
              <img
                className="detail-store-badge"
                src="/images/google-play-badge.png"
                alt="Disponible en Google Play"
              />
            ))}
          {project.demoNote && <DemoNote note={project.demoNote} />}
        </div>
        <div className="detail-overview__gallery">
          <ImageGallery
            key={project.id}
            images={project.gallery}
            aspect={project.galleryAspect}
            maxWidth={project.galleryMaxWidth}
          />
        </div>
      </Reveal>

      <Reveal as="div" className="detail-role" delayMs={150}>
        <div className="detail-role__text">
          <div className="eyebrow" style={{ marginBottom: 16 }}>
            Mi rol y stack
          </div>
          <p className="detail-paragraph" style={{ marginBottom: 20 }}>
            {project.role}
          </p>
          <div className="chip-row">
            {project.stack.map((tech) => (
              <div className="chip chip--stack" key={tech}>
                {tech}
              </div>
            ))}
          </div>
          <a href={project.ctaHref} target="_blank" rel="noopener noreferrer" className="btn btn--primary detail-cta">
            {project.ctaLabel}
          </a>
        </div>
      </Reveal>
    </div>
  );
}
