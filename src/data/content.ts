// Contenido del portafolio, en español e inglés.
// Lo marcado con  TODO(Gabriel)  es provisional: sustitúyelo por la información real.
//
// IMÁGENES: deja la foto en /public/projects/<slug>.jpg y pon su ruta en `image`
// (por ejemplo image: '/projects/gestiona.jpg'). Mientras `image` esté vacío
// se dibuja un hueco con la ruta que espera.

import { useLang, type Lang } from '../lib/i18n';

/** Datos que no cambian con el idioma. */
export const profile = {
  name: 'Gabriel Karajallo',
  short: 'Gabriel',
  timeZone: 'Europe/Madrid',
  email: 'c.gabrielkarajallo@gmail.com',
  linkedin: 'https://www.linkedin.com/in/gabrielkarajallo/',
  github: '', // TODO(Gabriel): URL de tu GitHub
  photo: '/profile.webp',
  since: 2024,
};

// FORMULARIO DE CONTACTO
// Para recibir los mensajes en tu correo sin servidor propio, crea un formulario
// gratis en https://formspree.io y pega aquí su URL (https://formspree.io/f/xxxxxxx).
// Mientras esté vacío, «Enviar» abre el programa de correo del visitante con el
// mensaje ya escrito.
export const contactEndpoint = ''; // TODO(Gabriel)

export const stack = ['React', 'TypeScript', 'Angular', 'React Native', 'C#', '.NET', 'SQL Server', 'MySQL', 'Oracle', 'Git'];

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  role: string;
  stack: string[];
  summary: string;
  body: string[];
  features?: { name: string; text: string }[];
  status?: string;
  link?: string;
  /** Capturas verticales de móvil: se muestran en fila sobre el tono del proyecto. */
  shots?: { src: string; alt: string }[];
  /**
   * Tono de marca del proyecto. No se usa tal cual: se mezcla con los neutros
   * de la paleta (fondo oscuro de las capturas, panel izquierdo claro u oscuro).
   */
  color?: string;
  image?: string;
  gallery?: (string | undefined)[];
};

// ---------- Gestiona: lo común + los textos de cada idioma ----------
const gestiona = {
  slug: 'gestiona',
  title: 'Gestiona',
  year: '2026',
  link: 'https://migestiona.es',
  // TODO(Gabriel): confirma el backend; React, Vite y PWA se ven en la web publicada.
  stack: ['React', 'TypeScript', 'Vite', 'PWA', '.NET', 'SQL Server'],
  color: '#3b5fc0', // azul de Gestiona
  shotSrc: ['/projects/gestiona-explorar.webp', '/projects/gestiona-fecha-hora.webp', '/projects/gestiona-citas.webp'],
};

const gestionaEs: Project = {
  ...gestiona,
  kind: 'App para negocios',
  status: 'En beta',
  role: 'Full-stack: producto, API e interfaz',
  summary:
    'Una app para pequeños negocios con cita: sus clientes reservan online a cualquier hora y, desde el mismo sitio, el negocio cobra, cuadra la caja, organiza al equipo y lleva sus números.',
  body: [
    'Un negocio pequeño suele llevar la agenda en el teléfono, la caja en una libreta y las cuentas en una hoja de cálculo. Gestiona lo junta todo en una sola app que funciona en el navegador y se instala en el móvil o el ordenador sin pasar por tiendas.',
    'Ahora mismo está en beta abierta y es gratis: el negocio pide acceso y se le da de alta con sus servicios y su equipo.',
  ],
  features: [
    {
      name: 'Reservas 24 h',
      text: 'Página pública con enlace y QR donde el cliente elige servicio, profesional y hueco libre. Confirmación y recordatorio por email, y las citas por teléfono entran en la misma agenda.',
    },
    {
      name: 'Caja y facturas',
      text: 'Cobro en efectivo, tarjeta o mixto, factura simplificada con IVA desglosado en PDF y cierre de caja que avisa si falta o sobra dinero.',
    },
    {
      name: 'Equipo',
      text: 'Cada persona ficha, ve su horario y pide vacaciones desde el móvil; el negocio aprueba y ve quién está trabajando.',
    },
    {
      name: 'Números',
      text: 'Ingresos, gastos fijos y una estimación de IVA e impuestos del trimestre, con informes en PDF o Excel para la gestoría.',
    },
    {
      name: 'Inventario y clientes',
      text: 'Stock que baja solo al vender, fichas de cliente con datos fiscales e historial, y varios locales en la misma cuenta.',
    },
    {
      name: 'Autónomos',
      text: 'Un espacio propio con presupuestos que pasan a factura en un clic, IVA e IRPF, gastos por categoría y lo pendiente de cobrar.',
    },
  ],
  shots: [
    { src: gestiona.shotSrc[0], alt: 'Gestiona: el cliente explora negocios de peluquería en Sevilla' },
    { src: gestiona.shotSrc[1], alt: 'Gestiona: el cliente elige día y hora para su cita' },
    { src: gestiona.shotSrc[2], alt: 'Gestiona: el cliente ve sus próximas citas' },
  ],
};

const gestionaEn: Project = {
  ...gestiona,
  kind: 'App for businesses',
  status: 'In beta',
  role: 'Full-stack: product, API and interface',
  summary:
    'An app for small appointment-based businesses: customers book online at any hour and, from the same place, the business takes payments, balances the till, organises the team and keeps track of its numbers.',
  body: [
    'A small business usually keeps its diary on the phone, its till in a notebook and its accounts in a spreadsheet. Gestiona brings it all together in one app that runs in the browser and installs on a phone or computer without going through an app store.',
    'It is currently in open beta and free: the business requests access and gets set up with its services and its team.',
  ],
  features: [
    {
      name: '24/7 booking',
      text: 'A public page with a link and QR code where customers pick a service, a professional and a free slot. Email confirmation and reminder, and phone bookings go into the same diary.',
    },
    {
      name: 'Till and invoices',
      text: 'Cash, card or split payments, simplified invoices with itemised VAT as PDF, and a till close that flags when money is missing or over.',
    },
    {
      name: 'Team',
      text: 'Everyone clocks in, checks their schedule and requests time off from their phone; the business approves and sees who is working.',
    },
    {
      name: 'Numbers',
      text: 'Income, fixed costs and an estimate of the quarter’s VAT and taxes, with PDF or Excel reports for the accountant.',
    },
    {
      name: 'Stock and customers',
      text: 'Stock that goes down on each sale, customer records with tax details and history, and several locations in one account.',
    },
    {
      name: 'Freelancers',
      text: 'A dedicated space with quotes that become invoices in one click, VAT and income tax, expenses by category and what is still to be paid.',
    },
  ],
  shots: [
    { src: gestiona.shotSrc[0], alt: 'Gestiona: a customer browses hair salons in Seville' },
    { src: gestiona.shotSrc[1], alt: 'Gestiona: a customer picks a day and time for the appointment' },
    { src: gestiona.shotSrc[2], alt: 'Gestiona: a customer sees upcoming appointments' },
  ],
};

// ---------- Textos por idioma ----------
const es = {
  city: 'Sevilla',
  country: 'España',
  role: 'Programador full-stack',
  photoAlt: 'Gabriel Karajallo en Edimburgo',
  contactTopics: ['Un proyecto', 'Una oferta de trabajo', 'Otra cosa'],
  projects: [gestionaEs],
  experience: [
    { when: '2025 — hoy', company: 'Wortach', role: 'Programador full-stack' },
    { when: '2024', company: 'Insinno España', role: 'Desarrollador front-end' },
    { when: '2022 — 2024', company: 'I.E.S. Antonio Machado', role: 'CFGS Administración de Sistemas en Red' },
  ],
  languages: [
    { name: 'Español', level: 'Nativo' },
    { name: 'Inglés', level: 'B1' },
  ],
  intro:
    'Hola, soy Gabriel. Empecé montando servidores y redes; hoy construyo las aplicaciones que corren encima, del esquema en SQL a la última animación de la interfaz.',
  motto: 'Más allá del código',
  hobbiesIntro: 'En resumen: vivir experiencias especiales que me dejen un buen recuerdo.',
  hobbies: [
    { name: 'Viajar', text: 'Conocer sitios nuevos y volver con historias que contar.' },
    { name: 'Deporte', text: 'Moverme, desconectar y volver con la cabeza despejada.' },
    { name: 'Cine y videojuegos', text: 'Buenas historias, en la pantalla grande o con el mando en la mano.' },
    { name: 'Perros', text: 'La mejor compañía para cualquier plan.' },
  ],
};

type Content = typeof es;

const en: Content = {
  city: 'Seville',
  country: 'Spain',
  role: 'Full-stack developer',
  photoAlt: 'Gabriel Karajallo in Edinburgh',
  contactTopics: ['A project', 'A job offer', 'Something else'],
  projects: [gestionaEn],
  experience: [
    { when: '2025 — now', company: 'Wortach', role: 'Full-stack developer' },
    { when: '2024', company: 'Insinno España', role: 'Front-end developer' },
    {
      when: '2022 — 2024',
      company: 'I.E.S. Antonio Machado',
      role: 'Higher Diploma in Network Systems Administration',
    },
  ],
  languages: [
    { name: 'Spanish', level: 'Native' },
    { name: 'English', level: 'B1' },
  ],
  intro:
    'Hi, I’m Gabriel. I started out setting up servers and networks; today I build the applications that run on top of them, from the SQL schema to the last animation in the interface.',
  motto: 'Beyond the code',
  hobbiesIntro: 'In short: living special experiences that leave me with good memories.',
  hobbies: [
    { name: 'Travel', text: 'Discovering new places and coming back with stories to tell.' },
    { name: 'Sport', text: 'Moving, switching off and coming back with a clear head.' },
    { name: 'Film and video games', text: 'Good stories, on the big screen or controller in hand.' },
    { name: 'Dogs', text: 'The best company for any plan.' },
  ],
};

const CONTENT: Record<Lang, Content> = { es, en };

/** Contenido en el idioma actual. */
export function useContent() {
  return CONTENT[useLang()];
}

/** Los proyectos son los mismos en los dos idiomas: sirve para buscar por slug. */
export const projectSlugs = es.projects.map((p) => p.slug);
