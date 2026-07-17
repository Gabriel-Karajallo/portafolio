import { useLayoutEffect, useRef, useState } from 'react';
import { Box, Code2, Database, GraduationCap, SquareTerminal } from 'lucide-react';
import { Reveal } from '../Reveal';
import { education, educationSkills } from '../../data/content';

const ICONS = [Code2, Database, SquareTerminal, Box];

const CONNECTOR_WIDTH = 64;
const CORNER_RADIUS = 20;

function buildConnectorPath(mid: number, cy: number) {
  const diff = cy - mid;
  if (Math.abs(diff) < 1) {
    return `M0 ${mid} H${CONNECTOR_WIDTH}`;
  }
  const radius = Math.min(CORNER_RADIUS, Math.abs(diff));
  const sweep = diff > 0 ? 1 : 0;
  const bendStartY = diff > 0 ? cy - radius : cy + radius;
  return `M0 ${mid} V${bendStartY} A${radius} ${radius} 0 0 ${sweep} ${radius} ${cy} H${CONNECTOR_WIDTH}`;
}

function EducationTree() {
  const cardsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<string[]>([]);
  const [dotY, setDotY] = useState(0);

  useLayoutEffect(() => {
    const cardsWrap = cardsRef.current;
    if (!cardsWrap) return;

    const measure = () => {
      const wrapRect = cardsWrap.getBoundingClientRect();
      const centers = itemRefs.current.map((el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.top - wrapRect.top + rect.height / 2;
      });
      if (!centers.length) return;
      const mid = (centers[0] + centers[centers.length - 1]) / 2;
      setDotY(mid);
      setPaths(centers.map((cy) => buildConnectorPath(mid, cy)));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(cardsWrap);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return (
    <div className="education-tree">
      <svg className="education-tree__lines" width={CONNECTOR_WIDTH} aria-hidden="true">
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
        {paths.length > 0 && (
          <>
            <circle className="education-tree__dot-halo" cx={0} cy={dotY} r={9} />
            <circle className="education-tree__dot" cx={0} cy={dotY} r={4} />
          </>
        )}
      </svg>
      <div className="education-tree__cards" ref={cardsRef}>
        {educationSkills.map((skill, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <div
              className="education-card"
              key={skill.title}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
            >
              <div className="education-card__icon">
                <Icon size={22} strokeWidth={1.75} />
              </div>
              <div>
                <div className="education-card__title">{skill.title}</div>
                <div className="education-card__desc">{skill.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Education() {
  return (
    <Reveal as="section" id="educacion" className="section">
      <div className="education-map">
        <div className="education-info">
          <div className="education-info__header">
            <h2 className="section__title">Educación</h2>
          </div>
          <div className="education-icon">
            <GraduationCap size={26} strokeWidth={2} />
          </div>
          <div className="education-institution">{education.institution}</div>
          <div className="education-title">{education.title}</div>
        </div>
        <EducationTree />
      </div>
    </Reveal>
  );
}
