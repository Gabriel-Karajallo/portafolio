import { GraduationCap } from 'lucide-react';
import { Reveal } from '../Reveal';
import { education } from '../../data/content';

export function Education() {
  return (
    <Reveal as="section" id="educacion" className="section">
      <h2 className="section__title" style={{ marginBottom: 48 }}>
        Educación
      </h2>
      <div className="education-row">
        <div className="education-icon">
          <GraduationCap size={26} strokeWidth={2} />
        </div>
        <div>
          <div className="education-title">{education.title}</div>
          <div className="education-institution">{education.institution}</div>
        </div>
      </div>
    </Reveal>
  );
}
