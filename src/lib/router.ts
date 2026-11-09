import { useSyncExternalStore } from 'react';

export type Route =
  | { name: 'work' }
  | { name: 'about' }
  | { name: 'contact' }
  | { name: 'project'; slug: string };

function parse(path: string): Route {
  const p = path.replace(/\/+$/, '') || '/';
  if (p === '/sobre-mi') return { name: 'about' };
  if (p === '/contacto') return { name: 'contact' };
  const m = p.match(/^\/proyecto\/([\w-]+)$/);
  if (m) return { name: 'project', slug: m[1] };
  return { name: 'work' }; // la portada es «Trabajo»
}

const listeners = new Set<() => void>();
let current = parse(location.pathname);

window.addEventListener('popstate', () => {
  current = parse(location.pathname);
  listeners.forEach((l) => l());
});

export function navigate(to: string) {
  if (to === location.pathname) return;
  history.pushState(null, '', to);
  current = parse(to);
  listeners.forEach((l) => l());
}

export function useRoute() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
}

/** onClick para <a href> internos: navega sin recargar. */
export function linkTo(to: string) {
  return (e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  };
}
