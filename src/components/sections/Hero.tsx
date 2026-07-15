import { ArrowRight, Send, Calendar, Code2, FolderGit2, Atom, Download } from 'lucide-react';
import { Reveal } from '../Reveal';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { profilePhoto } from '../../data/content';

const stats = [
  { icon: Calendar, value: '+1', label: 'Año de experiencia' },
  { icon: Code2, value: '5+', label: 'Tecnologías' },
  { icon: FolderGit2, value: '2', label: 'Proyectos publicados' },
];

export function Hero() {
  return (
    <div id="top" className="hero">
      <Reveal className="hero__content">
        <div className="badge badge--available">
          <span className="badge__dot" />
          Disponible para nuevos proyectos
        </div>
        <h1 className="hero__title">
          Gabriel <span className="hero__title-accent">Karajallo</span>
        </h1>
        <p className="hero__subtitle">Desarrollador Full Stack.</p>
        <p className="hero__description">
          Construyo aplicaciones web modernas y escalables enfocadas en la experiencia de usuario y el rendimiento.
        </p>
        <div className="hero__actions">
          <a href="#proyectos" className="learn-more">
            <span className="circle" aria-hidden="true">
              <ArrowRight className="icon" size={18} strokeWidth={2.5} color="#ffffff" />
            </span>
            <span className="button-text">Ver proyectos</span>
          </a>
          <a href="#contacto" className="btn btn--outline">
            <Send size={16} strokeWidth={2.25} />
            Contactar
          </a>
        </div>
        <div className="hero__stats">
          {stats.map((stat) => (
            <div className="hero__stat" key={stat.label}>
              <span className="hero__stat-icon">
                <stat.icon size={18} strokeWidth={2} />
              </span>
              <span className="hero__stat-text">
                <span className="hero__stat-value">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </span>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delayMs={150} className="hero__photo-wrap">
        <span className="hero__photo-ring" aria-hidden="true" />
        <div className="hero__photo">
          <ImagePlaceholder label="Foto de perfil" shape="circle" src={profilePhoto} />
        </div>
        <div className="hero__chip hero__chip--react">
          <span className="hero__chip-icon hero__chip-icon--react">
            <Atom size={14} strokeWidth={2.5} />
          </span>
          React
        </div>
        <div className="hero__chip hero__chip--ts">
          <span className="hero__chip-icon hero__chip-icon--ts">TS</span>
          TypeScript
        </div>
        <div className="hero__chip hero__chip--dotnet">
          <span className="hero__chip-icon hero__chip-icon--dotnet">C#</span>
          .NET C#
        </div>
        <div className="hero__note">
          <svg className="hero__note-arrow" width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <path d="M23 24C16 19 9 11 5 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 4.5L5 3L6 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <a href="/cv-gabriel-karajallo.pdf" download className="hero__note-link">
            <Download size={14} strokeWidth={2.25} />
            Descargar CV
          </a>
        </div>
      </Reveal>
    </div>
  );
}
