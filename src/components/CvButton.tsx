import { profile } from '../data/content';
import { useUI } from '../data/ui';
import { Roll } from './Roll';

/** Botón de píldora que descarga el currículum en PDF. */
export function CvButton({ className = '' }: { className?: string }) {
  const ui = useUI();
  return (
    <a
      className={`mono cv-btn ${className}`}
      href={profile.cv}
      download={ui.cv.file}
      data-cursor={ui.cursor.download}
    >
      <Roll text={ui.cv.download} /> ↓
    </a>
  );
}
