import { Reveal } from '../Reveal';
import { skills } from '../../data/content';

const technicalCategories = [
  { key: 'frontend', title: 'Frontend', items: skills.frontend },
  { key: 'backend', title: 'Backend', items: skills.backend },
  { key: 'tools', title: 'Herramientas', items: skills.tools },
  { key: 'it', title: 'IT', items: skills.it },
] as const;

export function Skills() {
  return (
    <Reveal as="section" id="skills" className="section">
      <div className="skills-header">
        <h2 className="section__title">Skills</h2>
        <p className="skills-subtitle">Algunas tecnologías con las que he trabajado y estudiado.</p>
      </div>
      <div className="skills-grid">
        {technicalCategories.map((category) => (
          <div className="skills-category" key={category.key}>
            <h3 className="skills-category__title">{category.title}</h3>
            <div className="skills-badges">
              {category.items.map((skill) => (
                <span className="skills-badge" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="skills-category skills-category--soft">
        <h3 className="skills-category__title">Habilidades blandas</h3>
        <div className="skills-badges">
          {skills.soft.map((skill) => (
            <span className="skills-badge" key={skill}>
              {skill}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
