import { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const SECTION_IDS = ['top', 'experiencia', 'proyectos', 'skills', 'educacion', 'sobre-mi', 'contacto'];

function getSections() {
  return SECTION_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
}

const SCROLLSPY_THRESHOLD = 150;

function getCurrentIndex(sections: HTMLElement[]) {
  let index = 0;
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top <= SCROLLSPY_THRESHOLD) {
      index = i;
    }
  }
  return index;
}

export function SectionNav() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const sections = getSections();
    if (!sections.length) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      setActiveIndex(getCurrentIndex(sections));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const goTo = (direction: 1 | -1) => {
    const sections = getSections();
    if (!sections.length) return;

    const currentIndex = getCurrentIndex(sections);
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    if (targetIndex === 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (targetIndex === sections.length - 1) {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      return;
    }
    sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
  };

  const canGoUp = activeIndex > 0;
  const canGoDown = activeIndex < SECTION_IDS.length - 1;

  return (
    <div className="section-nav">
      <button
        type="button"
        className="section-nav__btn"
        onClick={() => goTo(-1)}
        disabled={!canGoUp}
        aria-label="Sección anterior"
      >
        <ChevronUp size={20} />
      </button>
      <button
        type="button"
        className="section-nav__btn"
        onClick={() => goTo(1)}
        disabled={!canGoDown}
        aria-label="Sección siguiente"
      >
        <ChevronDown size={20} />
      </button>
    </div>
  );
}
