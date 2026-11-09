import { useSyncExternalStore } from 'react';

export type Lang = 'es' | 'en';
export const LANGS: Lang[] = ['es', 'en'];

/** Idioma guardado; si no hay, el del navegador (español si lo es, inglés si no). */
function initial(): Lang {
  try {
    const saved = localStorage.getItem('lang');
    if (saved === 'es' || saved === 'en') return saved;
  } catch {
    /* sin almacenamiento */
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

let current: Lang = initial();
document.documentElement.lang = current;
const listeners = new Set<() => void>();

export function setLang(next: Lang) {
  if (next === current) return;
  current = next;
  document.documentElement.lang = next;
  try {
    localStorage.setItem('lang', next);
  } catch {
    /* sin almacenamiento: dura hasta recargar */
  }
  listeners.forEach((l) => l());
}

export function useLang() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
  );
}
