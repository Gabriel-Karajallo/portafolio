// Textos de la interfaz en cada idioma.
import { useLang, type Lang } from '../lib/i18n';

const es = {
  nav: { work: 'Trabajo', about: 'Sobre mí', personal: 'Espacio personal', contact: 'Contacto', notfound: 'Página no encontrada', main: 'Principal', menu: 'Menú', close: 'Cerrar' },
  tools: { invert: 'Invertir color', sound: 'Sonido', on: 'sí', off: 'no', language: 'Idioma' },
  clock: (city: string, time: string) => `Hora en ${city}: ${time}`,
  cursor: { write: 'Escríbeme', view: 'Ver proyecto', send: 'Enviar', visit: 'Visitar web', download: 'Descargar' },
  cv: { download: 'Descargar CV', label: 'Currículum', file: 'Gabriel-Karajallo-CV.pdf' },
  work: {
    aria: 'Proyectos',
    soonKind: 'Próximamente',
    soonTitle: 'Más proyectos',
    building: 'En construcción',
    hint: 'Rueda o ↑ ↓ para navegar',
    soonHint: 'Pronto más proyectos · mientras tanto, hablemos',
    open: 'Ver proyecto',
    contact: 'Contacto',
  },
  project: {
    scroll: 'Desliza para leer ↓',
    about: 'El proyecto',
    features: 'Qué hace',
    next: 'Siguiente proyecto',
    moreSoon: 'Más proyectos en camino',
    talk: '¿Hablamos?',
    back: 'Trabajo',
    year: 'Año',
    type: 'Tipo',
    role: 'Rol',
    stack: 'Stack',
    web: 'Web',
  },
  about: {
    title: ['Un poco más', 'sobre mí'],
    info: 'Info',
    role: 'Desarrollador full-stack',
    factRole: 'Rol',
    factBase: 'Base',
    hobbies: 'Fuera de la pantalla',
    languages: 'Idiomas',
    talk: 'Hablemos',
    experience: 'Experiencia',
    stack: 'Stack',
  },
  personal: {
    title: ['Espacio', 'personal'],
    lead: 'Aquí actualizo lo que voy haciendo o publico las cosas que me gustan, desde mi rutina hasta las fotos que tienen un significado para mí.',
    routine: {
      label: 'Rutina',
      title: 'Cómo trabajo',
      lead: 'Un día normal, más o menos.',
      day: 'Un día cualquiera',
    },
    photos: {
      label: 'Fotografía',
      title: 'Algunas de mis fotos favoritas',
      lead: 'Hechas en mis viajes, sobre todo por Escocia e Italia.',
    },
    events: {
      label: 'Eventos',
      title: 'Donde he estado',
      lead: 'Conferencias, conciertos y planes que me han dejado algo.',
    },
    open: 'Ampliar',
    draft: 'Borrador',
  },
  notFound: {
    code: 'Error 404',
    title: ['Esta página', 'no existe'],
    lead: 'Puede que el enlace esté mal escrito o que la página se haya movido.',
    back: 'Volver al trabajo',
    contact: 'Escríbeme',
  },
  contact: {
    title: ['Cuéntame', 'qué tienes', 'en mente'],
    mail: 'Escríbeme',
    note: 'Para proyectos, ofertas de trabajo o cualquier otra cosa.',
    copy: 'Copiar correo',
    copied: 'Copiado',
    elsewhere: 'También en',
  },
};

type UI = typeof es;

const en: UI = {
  nav: { work: 'Work', about: 'About', personal: 'Personal space', contact: 'Contact', notfound: 'Page not found', main: 'Main', menu: 'Menu', close: 'Close' },
  tools: { invert: 'Invert colours', sound: 'Sound', on: 'on', off: 'off', language: 'Language' },
  clock: (city: string, time: string) => `Time in ${city}: ${time}`,
  cursor: { write: 'Write to me', view: 'View project', send: 'Send', visit: 'Visit site', download: 'Download' },
  cv: { download: 'Download CV', label: 'Résumé', file: 'Gabriel-Karajallo-CV.pdf' },
  work: {
    aria: 'Projects',
    soonKind: 'Coming soon',
    soonTitle: 'More projects',
    building: 'Under construction',
    hint: 'Scroll or ↑ ↓ to browse',
    soonHint: 'More projects soon · meanwhile, let’s talk',
    open: 'View project',
    contact: 'Contact',
  },
  project: {
    scroll: 'Scroll to read ↓',
    about: 'The project',
    features: 'What it does',
    next: 'Next project',
    moreSoon: 'More projects on the way',
    talk: 'Let’s talk',
    back: 'Work',
    year: 'Year',
    type: 'Type',
    role: 'Role',
    stack: 'Stack',
    web: 'Website',
  },
  about: {
    title: ['A little more', 'about me'],
    info: 'Info',
    role: 'Full-stack developer',
    factRole: 'Role',
    factBase: 'Based in',
    hobbies: 'Away from the screen',
    languages: 'Languages',
    talk: 'Let’s talk',
    experience: 'Experience',
    stack: 'Stack',
  },
  personal: {
    title: ['Personal', 'space'],
    lead: 'This is where I share what I’m up to and the things I like, from my routine to the photos that mean something to me.',
    routine: {
      label: 'Routine',
      title: 'How I work',
      lead: 'A normal day, more or less.',
      day: 'Any given day',
    },
    photos: {
      label: 'Photography',
      title: 'Some of my favourite photos',
      lead: 'Taken on my travels, mostly around Scotland and Italy.',
    },
    events: {
      label: 'Events',
      title: 'Where I’ve been',
      lead: 'Conferences, concerts and plans that stayed with me.',
    },
    open: 'Enlarge',
    draft: 'Draft',
  },
  notFound: {
    code: 'Error 404',
    title: ['This page', "doesn't exist"],
    lead: 'The link may be mistyped or the page may have moved.',
    back: 'Back to work',
    contact: 'Write to me',
  },
  contact: {
    title: ['Tell me', 'what you have', 'in mind'],
    mail: 'Write to me',
    note: 'For projects, job offers or anything else.',
    copy: 'Copy email',
    copied: 'Copied',
    elsewhere: 'Also on',
  },
};

const UI_BY_LANG: Record<Lang, UI> = { es, en };

export function useUI() {
  return UI_BY_LANG[useLang()];
}
