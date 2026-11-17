// ---------- Espacio personal: se va actualizando ----------
//
// Rutina: cada parte del día con su hora de inicio y fin (HH:MM, de 06:00 a 24:00).
//   El esquema se dibuja solo a partir de estas horas.
//
// Fotos:
//   1. Deja la imagen en public/personal/ (mejor .webp, unos 1400 px en el lado largo).
//   2. Añade una entrada arriba del todo en `photos` (lo nuevo primero).
//      `w` y `h` son el ancho y alto de la imagen (o solo su proporción: 3/4 → w: 3, h: 4).
//
// Eventos: una entrada en `events` (se ordenan solos por fecha, lo nuevo primero).
//
// Las entradas con `draft: true` solo se ven en local (npm run dev), nunca en la web publicada.

type Text = { es: string; en: string };

export type RoutineStep = {
  from: string;
  to: string;
  title: Text;
  text: Text;
};

export type PersonalPhoto = {
  src: string;
  w: number;
  h: number;
  alt: Text;
  /** Pie de foto: lugar o título corto. */
  title: Text;
  /** Fecha libre: «2025», «Ago 2024»… Opcional. */
  when?: string;
  draft?: boolean;
};

export type PersonalEvent = {
  /** Fecha para ordenar y mostrar, formato AAAA-MM. */
  date: string;
  name: Text;
  place: Text;
  /** Qué tipo de evento: concierto, conferencia, partido… */
  kind: Text;
  link?: string;
  draft?: boolean;
};

// TODO(Gabriel): ajusta horas y textos a tu día real.
export const routine: RoutineStep[] = [
  {
    from: '07:30',
    to: '08:15',
    title: { es: 'Café', en: 'Coffee' },
    text: {
      es: 'Arranco despacio: café y un repaso rápido de lo que toca hoy.',
      en: 'A slow start: coffee and a quick look at what’s on today.',
    },
  },
  {
    from: '08:15',
    to: '14:00',
    title: { es: 'Foco', en: 'Focus' },
    text: {
      es: 'Las horas de más concentración. Código sin notificaciones y una tarea cada vez.',
      en: 'My sharpest hours. Code with notifications off and one task at a time.',
    },
  },
  {
    from: '14:00',
    to: '15:00',
    title: { es: 'Comida', en: 'Lunch' },
    text: {
      es: 'Desconectar de la pantalla de verdad, aunque sea un rato.',
      en: 'Properly stepping away from the screen, even if only for a while.',
    },
  },
  {
    from: '15:00',
    to: '17:30',
    title: { es: 'Pulir', en: 'Polish' },
    text: {
      es: 'Revisiones, pruebas y detalles: lo que convierte algo que funciona en algo que se siente bien.',
      en: 'Reviews, testing and details: what turns something that works into something that feels right.',
    },
  },
  {
    from: '18:30',
    to: '20:00',
    title: { es: 'Deporte', en: 'Sport' },
    text: {
      es: 'Boxeo o gimnasio. Es donde se ordenan las ideas que no salían delante del ordenador.',
      en: 'Boxing or the gym. It’s where the ideas that wouldn’t come at the desk fall into place.',
    },
  },
  {
    from: '21:30',
    to: '23:30',
    title: { es: 'Desconectar', en: 'Switch off' },
    text: {
      es: 'Una película, una partida o un proyecto propio si la idea no me deja dormir.',
      en: 'A film, a game, or a side project if an idea won’t let me sleep.',
    },
  },
];

export const photos: PersonalPhoto[] = [
  {
    src: '/personal/edimburgo-castillo.webp',
    w: 1067,
    h: 1600,
    alt: {
      es: 'El castillo de Edimburgo sobre la roca, visto desde unas escaleras de piedra',
      en: 'Edinburgh Castle on its rock, seen from a stone stairway',
    },
    title: { es: 'Edimburgo', en: 'Edinburgh' },
  },
  {
    src: '/personal/glenfinnan-tren.webp',
    w: 914,
    h: 1600,
    alt: {
      es: 'Tren de vapor cruzando el viaducto curvo de Glenfinnan entre montañas',
      en: 'Steam train crossing the curved Glenfinnan Viaduct between mountains',
    },
    title: { es: 'Glenfinnan, Escocia', en: 'Glenfinnan, Scotland' },
  },
  {
    src: '/personal/venecia-canal.webp',
    w: 1200,
    h: 1600,
    alt: {
      es: 'Canal estrecho de Venecia con una góndola y un campanario al fondo',
      en: 'Narrow Venice canal with a gondola and a bell tower behind',
    },
    title: { es: 'Venecia', en: 'Venice' },
  },
  {
    src: '/personal/edimburgo-dean-village.webp',
    w: 1080,
    h: 1440,
    alt: {
      es: 'Casas de piedra junto al río en Dean Village',
      en: 'Stone houses by the river in Dean Village',
    },
    title: { es: 'Dean Village, Edimburgo', en: 'Dean Village, Edinburgh' },
  },
  {
    src: '/personal/edimburgo-fuente-ross.webp',
    w: 1080,
    h: 1440,
    alt: {
      es: 'La fuente Ross con el castillo de Edimburgo detrás',
      en: 'The Ross Fountain with Edinburgh Castle behind',
    },
    title: { es: 'Fuente Ross, Edimburgo', en: 'Ross Fountain, Edinburgh' },
  },
  {
    src: '/personal/escaleras.webp',
    w: 1125,
    h: 1500,
    alt: {
      es: 'Escalinata de piedra entre árboles con luz de tarde',
      en: 'Stone stairway between trees in afternoon light',
    },
    // TODO(Gabriel): pon el sitio exacto en el título si quieres
    title: { es: 'Escaleras al sol', en: 'Stairs in the sun' },
  },
  {
    src: '/personal/glenfinnan-viaducto.webp',
    w: 1080,
    h: 1440,
    alt: {
      es: 'Arcos del viaducto de Glenfinnan bajo un cielo con nubes',
      en: 'Arches of the Glenfinnan Viaduct under a cloudy sky',
    },
    title: { es: 'Viaducto de Glenfinnan', en: 'Glenfinnan Viaduct' },
  },
];

export const events: PersonalEvent[] = [
  // Ejemplo: solo se ve en local. Cámbialo por un evento real y borra `draft`.
  {
    date: '2025-06',
    name: { es: 'Nombre del evento', en: 'Event name' },
    place: { es: 'Sevilla', en: 'Seville' },
    kind: { es: 'Conferencia', en: 'Conference' },
    draft: true,
  },
];

const visible = <T extends { draft?: boolean }>(list: T[]) => list.filter((x) => import.meta.env.DEV || !x.draft);

export const publishedPhotos = visible(photos);
export const publishedEvents = visible(events).sort((a, b) => b.date.localeCompare(a.date));
