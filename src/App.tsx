import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import { profile, projectSlugs, useContent } from './data/content';
import { useUI } from './data/ui';
import { LANGS, setLang, useLang } from './lib/i18n';
import { HomePanel } from './components/HomePanel';
import { AboutPanel } from './components/AboutPanel';
import { Loader } from './components/Loader';
import { Cursor } from './components/Cursor';
import { ProjectPanel } from './components/ProjectPanel';
import { Roll } from './components/Roll';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Project } from './pages/Project';
import { Work } from './pages/Work';
import { linkTo, useRoute, type Route } from './lib/router';
import { hoverTick, setSound } from './lib/sound';

const NAV: { key: 'work' | 'about' | 'contact'; href: string; match: Route['name'][] }[] = [
  { key: 'work', href: '/', match: ['work', 'project'] },
  { key: 'about', href: '/sobre-mi', match: ['about'] },
  { key: 'contact', href: '/contacto', match: ['contact'] },
];

function readInvert() {
  try {
    return localStorage.getItem('invert') === '1';
  } catch {
    return false;
  }
}

export default function App() {
  const route = useRoute();
  const lang = useLang();
  const content = useContent();
  const { projects } = content;
  const ui = useUI();
  // El loader solo aparece en la primera visita de la sesión.
  const [loaded, setLoaded] = useState(() => {
    try {
      return sessionStorage.getItem('loaded') === '1';
    } catch {
      return false;
    }
  });
  const [active, setActive] = useState(0);
  const [inverted, setInverted] = useState(readInvert);
  const [soundOn, setSoundOn] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  // Al volver de un proyecto, la rueda se queda en ese proyecto.
  const projectIndex = route.name === 'project' ? projectSlugs.indexOf(route.slug) : -1;
  useEffect(() => {
    if (projectIndex >= 0) setActive(projectIndex);
  }, [projectIndex]);

  useEffect(() => {
    document.documentElement.dataset.theme = inverted ? 'inverted' : '';
    try {
      localStorage.setItem('invert', inverted ? '1' : '0');
    } catch {
      /* sin almacenamiento: no pasa nada */
    }
  }, [inverted]);

  useEffect(() => {
    cardRef.current?.scrollTo(0, 0);
    const titles = { ...ui.nav, project: projects[projectIndex]?.title ?? ui.nav.work };
    document.title = `${titles[route.name]} — ${profile.name}`;
  }, [route, projectIndex, ui, projects]);

  const onLoaded = useCallback(() => {
    setLoaded(true);
    try {
      sessionStorage.setItem('loaded', '1');
    } catch {
      /* sin almacenamiento: se verá el loader otra vez */
    }
  }, []);
  // Toque leve al entrar en cualquier enlace o botón (solo suena con el sonido activado).
  useEffect(() => {
    let last: Element | null = null;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const el = (e.target as Element).closest?.('a, button');
      if (el && el !== last) hoverTick();
      last = el ?? null;
    };
    document.addEventListener('pointerover', onOver);
    return () => document.removeEventListener('pointerover', onOver);
  }, []);

  // Invertir color: el tema nuevo se abre en círculo desde el botón (View Transitions).
  const toggleInvert = (e: MouseEvent<HTMLButtonElement>) => {
    const next = !inverted;
    const root = document.documentElement;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (!doc.startViewTransition || reduce) {
      setInverted(next);
      return;
    }
    const x = e.clientX || innerWidth / 2;
    const y = e.clientY || innerHeight / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.style.setProperty('--vt-x', `${x}px`);
    root.style.setProperty('--vt-y', `${y}px`);
    root.style.setProperty('--vt-r', `${r}px`);
    doc.startViewTransition(() => {
      root.dataset.theme = next ? 'inverted' : '';
      flushSync(() => setInverted(next));
    });
  };

  const toggleSound = () => {
    setSound(!soundOn);
    setSoundOn(!soundOn);
  };

  // Al cambiar de idioma la vista se vuelve a montar y repite su entrada (letras que se escriben, etc.)
  const routeKey = `${lang}-${route.name === 'project' ? `p-${route.slug}` : route.name}`;
  const project = projectIndex >= 0 ? projects[projectIndex] : null;
  const sideKey = `${lang}-${route.name === 'about' ? 'about' : project ? `p-${project.slug}` : 'clock'}`;

  return (
    <>
      {!loaded && <Loader onDone={onLoaded} />}
      <Cursor />

      <div className={`frame ${loaded ? 'is-in' : ''}`}>
        <aside
          className={`side ${project ? 'side--project' : ''}`}
          style={project?.color ? ({ '--hue': project.color } as CSSProperties) : undefined}
        >
          <p className="mono side-city">
            {content.city}, {content.country}
          </p>

          <div className="side-visual" key={sideKey}>
            {route.name === 'about' ? (
              <AboutPanel />
            ) : project ? (
              <ProjectPanel p={project} />
            ) : (
              <HomePanel ready={loaded} />
            )}
          </div>

          <div className="side-tools">
            <button type="button" className="mono tool" onClick={toggleInvert} aria-pressed={inverted}>
              <Roll text={ui.tools.invert} />
            </button>
            <div className="lang" role="group" aria-label={ui.tools.language}>
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  className={`mono tool lang-btn ${l === lang ? 'is-on' : ''}`}
                  aria-pressed={l === lang}
                  lang={l}
                  aria-label={l === 'es' ? 'Español' : 'English'}
                  onClick={() => setLang(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button type="button" className="mono tool tool--sound" onClick={toggleSound} aria-pressed={soundOn}>
              <Roll text={`${ui.tools.sound}: ${soundOn ? ui.tools.on : ui.tools.off}`} />
              <span className={`eq ${soundOn ? 'is-on' : ''}`} aria-hidden>
                <i />
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </aside>

        <main
          className={`card card--${route.name === 'work' ? 'night' : 'day'} ${project ? 'card--project' : ''}`}
          ref={cardRef}
        >
          <div className="read-progress" aria-hidden />
          <nav className="nav" aria-label={ui.nav.main}>
            <div className="nav-links">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  className={`mono ${item.match.includes(route.name) ? 'is-current' : ''}`}
                  href={item.href}
                  onClick={linkTo(item.href)}
                >
                  <Roll text={ui.nav[item.key]} />
                </a>
              ))}
            </div>
            <a className="mono nav-mail" href={`mailto:${profile.email}`} data-cursor={ui.cursor.write}>
              <Roll text={profile.email} /> ↗
            </a>
          </nav>

          <div className="view" key={routeKey}>
            {route.name === 'work' && <Work active={active} setActive={setActive} ready={loaded} />}
            {route.name === 'about' && <About />}
            {route.name === 'contact' && <Contact />}
            {route.name === 'project' && <Project slug={route.slug} />}
          </div>

          {route.name === 'work' && (
            <p className="sign">
              <span className="sign-name">{profile.name}</span>
              <span className="mono">
                {content.role} · ({new Date().getFullYear()})
              </span>
            </p>
          )}
        </main>
      </div>
    </>
  );
}
