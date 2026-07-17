export function Nav() {
  return (
    <div className="nav">
      <div className="nav__inner">
        <a href="#top" className="nav__logo">
          <img src="/images/logo.png" alt="Gabriel Karajallo" />
        </a>
        <div className="nav__links">
          <a href="#experiencia">Experiencia</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#skills">Skills</a>
          <a href="#educacion">Educación</a>
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#contacto" className="nav__cta">
            Contacto
          </a>
        </div>
      </div>
    </div>
  );
}
