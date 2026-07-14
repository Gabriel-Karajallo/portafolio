import { useState } from 'react';
import { Reveal } from '../Reveal';
import { experience } from '../../data/content';

export function Experience() {
  const [openCompany, setOpenCompany] = useState<string | null>(null);

  return (
    <Reveal as="section" id="experiencia" className="section">
      <div className="section__header">
        <h2 className="section__title">Experiencia</h2>
        <span className="section__count">{experience.length} posiciones</span>
      </div>
      <div className="experience-list">
        {experience.map((job) => {
          const isOpen = openCompany === job.company;

          return (
            <div className="experience-item" key={job.company}>
              <div className="experience-item__period">{job.period}</div>
              <div className="experience-item__body">
                <button
                  type="button"
                  className="experience-item__toggle"
                  aria-expanded={isOpen}
                  onClick={() => setOpenCompany(isOpen ? null : job.company)}
                >
                  <span>
                    <span className="experience-item__role">{job.role}</span>
                    <span className="experience-item__company">{job.company}</span>
                  </span>
                  <svg
                    className={`experience-item__chevron${isOpen ? ' experience-item__chevron--open' : ''}`}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div className="experience-item__description">{job.description}</div>
                <div className={`experience-item__highlights-wrap${isOpen ? ' experience-item__highlights-wrap--open' : ''}`}>
                  <ul className="experience-item__highlights">
                    {job.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
