import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ImageGallery } from '../components/ImageGallery';
import { projectDetails } from '../data/content';

export function ProjectDetail() {
  const { projectId } = useParams();
  const project = projectId ? projectDetails[projectId] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="detail-page">
      <div className="detail-nav">
        <div className="detail-nav__inner">
          <Link to="/#proyectos" className="detail-nav__back">
            <ArrowLeft size={18} strokeWidth={2} />
            Volver atrás
          </Link>
        </div>
      </div>

      <div className="detail-hero">
        <div className="badge badge--detail">{project.category}</div>
        <h1 className="detail-title">{project.name}</h1>
        <p className="detail-subtitle">{project.subtitle}</p>
      </div>

      <div className="detail-overview">
        <div className="detail-overview__text">
          <div className="eyebrow">Sobre el proyecto</div>
          {project.description.map((paragraph) => (
            <p className="detail-paragraph" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
        <div className="detail-overview__gallery">
          <ImageGallery
            key={project.id}
            images={project.gallery}
            aspect={project.galleryAspect}
            maxWidth={project.galleryMaxWidth}
          />
        </div>
      </div>

      <div className="detail-role">
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
    </div>
  );
}
