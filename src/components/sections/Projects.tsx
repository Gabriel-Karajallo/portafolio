import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../Reveal';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { projects, projectDetails, projectsIntro } from '../../data/content';

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const bigint = parseInt(value, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function Projects() {
  return (
    <Reveal as="section" id="proyectos" className="section section--wide">
      <div className="projects-header">
        <h2 className="projects-title">Proyectos</h2>
        <p className="projects-subtitle">{projectsIntro}</p>
      </div>
      <div className="project-entries">
        {projects.map((project, index) => {
          const detail = projectDetails[project.id];

          return (
            <Link to={`/proyectos/${project.id}`} className="project-entry" key={project.id}>
              <div
                className="project-entry__image"
                style={{
                  background: `linear-gradient(135deg, ${hexToRgba(project.accent, 0.16)}, ${hexToRgba(project.accent, 0.04)})`,
                }}
              >
                <ImagePlaceholder label={project.imgLabel} src={project.imgSrc} />
              </div>
              <div className="project-entry__body">
                <div className="project-entry__top">
                  <span className="project-entry__category" style={{ color: project.accent }}>
                    {detail.category}
                  </span>
                  <span className="project-entry__index">{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="project-entry__name">{project.name}</h3>
                <p className="project-entry__summary">{project.summary}</p>
                <div className="project-entry__stack">{detail.stack.join(' · ')}</div>
                <span className="project-entry__link" style={{ color: project.accent }}>
                  Ver proyecto
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </Reveal>
  );
}
