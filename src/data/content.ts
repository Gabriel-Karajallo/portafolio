export const profilePhoto = '/images/profile.png';

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface ProjectSummary {
  id: string;
  name: string;
  summary: string;
  imgLabel: string;
  imgSrc?: string;
  accent: string;
}

export interface ProjectDetailContent {
  id: string;
  category: string;
  name: string;
  subtitle: string;
  description: string[];
  role: string;
  stack: string[];
  gallery: { label: string; src?: string }[];
  galleryAspect: string;
  galleryMaxWidth?: number;
  ctaLabel: string;
  ctaHref: string;
  demoNote?: string;
  playStoreUrl?: string;
}

export const experience: ExperienceItem[] = [
  {
    role: 'Programador Full Stack',
    company: 'Wortach',
    period: 'Jul 2025 — Actualidad',
    description:
      'Desarrollo full stack de productos internos y de cliente, cubriendo backend en .NET/C# y frontend en React con TypeScript.',
    highlights: [
      'Desarrollo y mantengo aplicaciones web empresariales, participando en todo el ciclo de desarrollo, desde la implementación de nuevas funcionalidades hasta la optimización del rendimiento y la resolución de incidencias.',
      'Trabajo principalmente con .NET/C# en el backend y React con TypeScript en el frontend, además de colaborar en el diseño y mantenimiento de bases de datos. Formo parte del equipo responsable de construir soluciones escalables, mantener la calidad del software y mejorar continuamente la experiencia de los usuarios.',
    ],
  },
  {
    role: 'Desarrollador Independiente',
    company: 'Freelance',
    period: 'Nov 2024 — Jul 2025',
    description:
      'Periodo dedicado a perfeccionar mis habilidades como desarrollador, familiarizarme con el uso de IA y trabajar en proyectos personales y reales.',
    highlights: [
      'Estuve perfeccionando mis habilidades técnicas y familiarizándome con el uso de la inteligencia artificial aplicada al desarrollo de software.',
      'Desarrollé proyectos personales para seguir aprendiendo y también trabajé en proyectos reales para distintos clientes.',
    ],
  },
  {
    role: 'Programador Frontend',
    company: 'Insinno España',
    period: 'Jun 2024 — Nov 2024',
    description:
      'Desarrollo de interfaces con Angular y TypeScript, integración con APIs y colaboración con equipo de diseño.',
    highlights: [
      'Desarrollé interfaces web modernas, responsivas e intuitivas utilizando Angular y TypeScript, colaborando estrechamente con el equipo de diseño para transformar prototipos en aplicaciones funcionales.',
      'Integré APIs REST para conectar el frontend con los servicios backend, implementé pruebas para garantizar la calidad del código y participé en un entorno de desarrollo ágil, colaborando en la planificación de sprints, revisiones de código y control de versiones mediante Git.'
    ],
  },
];

export const projectsIntro =
  'Una selección de proyectos en los que he trabajado, con foco en construir productos completos y bien pensados de punta a punta.';

export const projects: ProjectSummary[] = [
  {
    id: 'gestiona',
    name: 'Gestiona',
    summary:
      'ERP multiusuario para empresas y autónomos: ingresos, gastos, facturación, inventario y equipo, todo en un solo lugar.',
    imgLabel: 'Captura de Gestiona',
    imgSrc: '/images/gestiona-cover.png',
    accent: '#33418c',
  },
  {
    id: 'gymtrack',
    name: 'GymTrack',
    summary:
      'App móvil para entrenar y comer mejor: rutinas personalizadas por músculo y control nutricional con escáner de código de barras.',
    imgLabel: 'Captura de GymTrack',
    imgSrc: '/images/gymtrack-cover.jpg',
    accent: '#e8622c',
  },
];

export const skills = {
  frontend: ['React', 'Angular', 'React Native', 'JavaScript', 'TypeScript', 'CSS'],
  backend: ['C#', '.NET', 'PHP', 'Java'],
  tools: ['SQL Server Management Studio', 'Visual Studio', 'Postman', 'Git'],
  it: ['Máquinas virtuales', 'Windows Server', 'Active Directory', 'Administración de sistemas', 'Redes'],
  soft: [
    'Trabajo en equipo',
    'Comunicación',
    'Resolución de problemas',
    'Adaptabilidad',
    'Proactividad',
    'Gestión del tiempo',
    'Aprendizaje continuo',
  ],
};

export const education = {
  title: 'Técnico Superior en Administración de Sistemas Informáticos en Red (ASIR)',
  institution: 'I.E.S. Antonio Machado',
};

export interface EducationSkill {
  title: string;
  description: string;
}

export const educationSkills: EducationSkill[] = [
  {
    title: 'Desarrollo y Programación Web',
    description:
      'Conocimientos de lenguajes de programación y desarrollo de aplicaciones web dinámicas y estables.',
  },
  {
    title: 'Administración de Bases de Datos',
    description:
      'Conocimientos en la instalación y administración de sistemas gestores de bases de datos como MySQL y Oracle.',
  },
  {
    title: 'Administración de Sistemas Operativos',
    description:
      'Experiencia en la instalación, configuración y administración de sistemas operativos, incluyendo Windows Server y entornos Linux, así como en el uso de la línea de comandos en ambos sistemas.',
  },
  {
    title: 'Virtualización',
    description:
      'Manejo de tecnologías de virtualización como VirtualBox, con capacidad para crear y administrar máquinas virtuales.',
  },
];

export const bio =
  'Vivo en Sevilla, España. Fuera del código me encontrarás realizando mis actividades favoritas como viajar o disfrutar de un buen cafe';

export const aboutInfo = {
  location: 'Sevilla, España',
  availability: 'Abierto a nuevas oportunidades',
};

export interface Hobby {
  label: string;
  description: string;
}

export const hobbies: Hobby[] = [
  { label: 'Boxeo', description: 'Me ayuda a mantener la disciplina y a superarme cada día.' },
  { label: 'Fútbol', description: 'Uno de mis deportes de cabecera, dentro y fuera de la cancha.' },
  { label: 'Viajar', description: 'Descubrir nuevos lugares, culturas y perspectivas me inspira.' },
  { label: 'Videojuegos', description: 'Una de mis formas favoritas de desconectar.' },
  { label: 'Cine', description: 'Buenas películas para inspirarme y desconectar.' },
];

export const aboutPhotos = ['Foto — boxeo', 'Foto — fútbol', 'Foto — viajes', 'Foto — cine', 'Foto — café'];

export const contact = {
  email: 'c.gabrielkarajallo@gmail.com',
  linkedinHref: '#',
  githubHref: '#',
};

export const projectDetails: Record<string, ProjectDetailContent> = {
  gestiona: {
    id: 'gestiona',
    category: 'ERP · Web',
    name: 'Gestiona',
    subtitle:
      'ERP multiusuario para empresas y autónomos que centraliza la gestión de ingresos, gastos, clientes y equipo en una sola plataforma.',
    description: [
      'Empresas y autónomos suelen depender de hojas de cálculo y herramientas sueltas para llevar su administración, lo que dificulta tener una visión unificada del negocio.',
      'Gestiona se adapta a cada perfil de usuario: las empresas controlan caja diaria, inventario, clientes, servicios, empleados, horarios y vacaciones, además de generar los informes necesarios para la declaración a Hacienda. Los autónomos gestionan sus ingresos y gastos, presupuestos, clientes y facturación, con sus propios informes.',
      'Los empleados, por su parte, pueden fichar su jornada laboral, consultar su horario y solicitar vacaciones desde la plataforma, mientras que los clientes reservan citas con la empresa de forma directa.',
    ],
    role: 'Desarrollo full stack del producto: diseño de la base de datos, API backend y la interfaz web.',
    stack: ['C#', '.NET', 'React', 'TypeScript', 'PostgreSQL'],
    gallery: [
      { label: 'Captura — Panel principal' },
      { label: 'Captura — Facturación' },
      { label: 'Captura — Inventario' },
    ],
    galleryAspect: '16/10',
    ctaLabel: 'Ver demo',
    ctaHref: 'https://appgestiona.netlify.app/',
    demoNote: 'Si necesitas ver una demo, ponte en contacto conmigo: la aplicación requiere iniciar sesión.',
  },
  gymtrack: {
    id: 'gymtrack',
    category: 'App móvil',
    name: 'GymTrack',
    subtitle:
      'App móvil que centraliza tus entrenamientos y tu alimentación, con seguimiento personalizado hasta alcanzar tu objetivo.',
    description: [
      'Llevar el registro de entrenamientos y comidas suele quedar repartido entre varias apps o notas sueltas, dificultando el seguimiento del progreso.',
      'GymTrack permite personalizar cada entrenamiento por músculo, editando peso, duración, descanso y cualquier otro detalle del ejercicio.',
      'En alimentación, puedes registrar tus comidas manualmente o escaneando el código de barras del producto. La app calcula las calorías, proteínas y grasas que necesitas según tu objetivo (definición, ganancia de masa, etc.) y te muestra en todo momento cuánto te falta para alcanzarlo.',
    ],
    role: 'Desarrollo full stack de la app: modelo de datos, API y cliente móvil.',
    stack: ['C#', '.NET', 'React Native', 'TypeScript', 'SQL Server'],
    gallery: [
      { label: 'Pantalla — Rutinas' },
      { label: 'Pantalla — Alimentación' },
      { label: 'Pantalla — Progreso' },
    ],
    galleryAspect: '9/16',
    galleryMaxWidth: 420,
    ctaLabel: 'Ver demo',
    ctaHref: '#',
    playStoreUrl: '',
  },
};
