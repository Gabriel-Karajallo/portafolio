(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const raf = (fn) => { let q = false; return () => { if (!q) { q = true; requestAnimationFrame(() => { q = false; fn(); }); } }; };

  /* ---------- HERO: capas del stack ---------- */
  const stack = document.querySelector('.stack');
  const layers = [...stack.querySelectorAll('.layer')];
  const steps = [...stack.querySelectorAll('.stack__steps li')];
  const caption = stack.querySelector('.stack__caption');
  const capName = caption.querySelector('.stack__name');
  const capText = caption.querySelector('.stack__text');
  const captions = [
    ['En Wortach desde 2025', 'Backend en .NET y C#, frontend en React con TypeScript.'],
    ['Interfaz', 'React y TypeScript. Pantallas que se entienden a la primera.'],
    ['API', '.NET y C#. Endpoints claros que conectan cada pantalla con sus datos.'],
    ['Datos', 'SQL Server, MySQL y Oracle. Esquemas pensados antes del código.'],
    ['Sistemas', 'Donde empecé: Windows Server, Active Directory y redes.'],
  ];
  let current = 0;
  const setLayer = (i) => {
    if (i === current) return;
    current = i;
    stack.dataset.step = i;
    layers.forEach((l, k) => {
      l.classList.toggle('is-active', k === i);
      l.classList.toggle('is-past', k < i);
    });
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    capName.textContent = captions[i][0];
    capText.textContent = captions[i][1];
    caption.classList.remove('is-swap'); void caption.offsetWidth; caption.classList.add('is-swap');
  };
  const onStack = () => {
    const r = stack.getBoundingClientRect();
    const run = r.height - innerHeight;
    const p = Math.min(0.999, Math.max(0, -r.top / run));
    setLayer(Math.floor(p * layers.length));
  };

  /* barra: fondo sólido cuando sale del hero */
  const bar = document.querySelector('.bar');
  const onBar = () => bar.classList.toggle('is-solid', stack.getBoundingClientRect().bottom < 80);

  const onScroll = raf(() => { onStack(); onBar(); });
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- reveals ---------- */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
  document.querySelectorAll('[data-reveal], .build').forEach((el) => io.observe(el));
  document.querySelectorAll('.card').forEach((c, i) => c.style.setProperty('--c', i));

  /* ---------- consola: la API de Gabriel ---------- */
  const api = {
    perfil: {
      nombre: 'Gabriel Karajallo',
      rol: 'Programador full-stack',
      ubicacion: 'Sevilla',
      empresa: 'Wortach',
      desde: '2025-07',
      idiomas: { 'español': 'nativo', 'inglés': 'B1' },
    },
    experiencia: [
      { empresa: 'Wortach', puesto: 'Programador full-stack', desde: '2025-07', hasta: null, stack: ['.NET', 'C#', 'React', 'TypeScript', 'SQL Server'] },
      { empresa: 'Insinno España', puesto: 'Desarrollador front-end', desde: '2024-06', hasta: '2024-11', stack: ['Angular', 'TypeScript', 'APIs REST', 'Git'] },
      { centro: 'I.E.S. Antonio Machado', titulo: 'CFGS ASIR', desde: 2022, hasta: 2024 },
    ],
    stack: {
      frontend: ['React', 'React Native', 'Angular', 'TypeScript', 'CSS'],
      backend: ['C#', '.NET', 'Java', 'PHP'],
      datos: ['SQL Server', 'MySQL', 'Oracle'],
      sistemas: ['Windows Server', 'Active Directory', 'Redes', 'Virtualización'],
      herramientas: ['Visual Studio', 'VS Code', 'SSMS', 'Postman', 'Git'],
    },
    contacto: {
      email: 'c.gabrielkarajallo@gmail.com',
      telefono: '+34 610 97 04 64',
      linkedin: 'linkedin.com/in/gabrielkarajallo',
      disponible: true,
    },
  };
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const paint = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json.split('\n').map((line, n) => {
      const html = esc(line)
        .replace(/"([^"]+)":/g, '<span class="jk">"$1"</span>:')
        .replace(/: "([^"]*)"/g, ': <span class="js">"$1"</span>')
        .replace(/^(\s*)"([^"]*)"(,?)$/g, '$1<span class="js">"$2"</span>$3')
        .replace(/: (true|false|null|-?\d+)/g, ': <span class="jn">$1</span>');
      return `<span class="jl" style="--n:${n}">${html || ' '}</span>`;
    }).join('');
  };
  const out = document.querySelector('[data-out]');
  const pre = out.parentElement;
  const path = document.querySelector('[data-path]');
  const tabs = [...document.querySelectorAll('[data-ep]')];
  const show = (ep, focus) => {
    tabs.forEach((t) => { const on = t.dataset.ep === ep; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    path.textContent = `api.karajallo.dev/${ep}`;
    out.innerHTML = paint(api[ep]);
    pre.classList.remove('is-swap'); void pre.offsetWidth; pre.classList.add('is-swap');
  };
  tabs.forEach((t, i) => {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', () => show(t.dataset.ep));
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (d) { e.preventDefault(); show(tabs[(i + d + tabs.length) % tabs.length].dataset.ep, true); }
    });
  });
  out.innerHTML = paint(api.perfil);

  /* ---------- experiencia ---------- */
  const roles = [...document.querySelectorAll('.role')];
  const figs = [...document.querySelectorAll('.career__fig')];
  const credit = document.querySelector('[data-credit]');
  const openRole = (i) => {
    roles.forEach((r, k) => {
      const on = k === i;
      r.classList.toggle('is-on', on);
      r.querySelector('.role__row').setAttribute('aria-expanded', on);
    });
    figs.forEach((f, k) => f.classList.toggle('is-on', k === i));
    credit.textContent = roles[i].dataset.credit;
  };
  roles.forEach((r, i) => {
    const row = r.querySelector('.role__row');
    row.addEventListener('click', () => openRole(i));
    row.addEventListener('focus', () => openRole(i));
  });

  /* ---------- qué construyo: fila lateral fijada en pantallas anchas ---------- */
  (() => {
    const root = document.querySelector('.build');
    const track = root.querySelector('.build__track');
    const wide = matchMedia('(min-width: 900px) and (prefers-reduced-motion: no-preference)');
    let dx = 0;
    const place = () => {
      if (!root.classList.contains('is-pinned')) return;
      const p = Math.min(1, Math.max(0, -root.getBoundingClientRect().top / dx));
      track.style.transform = `translate3d(${(-p * dx).toFixed(1)}px, 0, 0)`;
    };
    const measure = () => {
      root.classList.add('is-pinned');
      track.style.transform = '';
      dx = track.scrollWidth - track.clientWidth;
      const pin = wide.matches && dx > 0 && dx < innerHeight * 3;
      root.classList.toggle('is-pinned', pin);
      root.style.height = pin ? `${innerHeight + dx}px` : '';
      place();
    };
    track.addEventListener('focusin', (e) => {
      if (!root.classList.contains('is-pinned')) return;
      const item = e.target.closest('.card');
      if (!item) return;
      const x = Math.min(dx, Math.max(0, item.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft)));
      scrollTo({ top: root.getBoundingClientRect().top + scrollY + x, behavior: 'instant' });
    });
    addEventListener('scroll', raf(place), { passive: true });
    addEventListener('resize', measure);
    addEventListener('load', measure);
    wide.addEventListener('change', measure);
    measure();
  })();

  /* ---------- herramientas ---------- */
  const tools = document.querySelector('.tools');
  const names = [...tools.querySelectorAll('.tools__list li')];
  const factL = tools.querySelector('[data-fact-l]');
  const factR = tools.querySelector('[data-fact-r]');
  const setTool = (li) => {
    names.forEach((n) => n.classList.toggle('is-current', n === li));
    tools.dataset.k = li.dataset.k;
    if (factL.textContent !== li.dataset.l) { factL.textContent = li.dataset.l; factL.classList.remove('is-swap'); void factL.offsetWidth; factL.classList.add('is-swap'); }
    if (factR.textContent !== li.dataset.r) { factR.textContent = li.dataset.r; factR.classList.remove('is-swap'); void factR.offsetWidth; factR.classList.add('is-swap'); }
  };
  const tio = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) setTool(e.target);
  }, { rootMargin: '-49% 0px -49% 0px' });
  names.forEach((n) => tio.observe(n));
  setTool(names[0]);
})();
