import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const links = [
  { href: '#experiencia', label: 'Experiencia' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#skills', label: 'Skills' },
  { href: '#educacion', label: 'Educación' },
  { href: '#sobre-mi', label: 'Sobre mí' },
];

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <div className="nav">
        <div className="nav__inner">
          <a href="#top" className="nav__logo" onClick={close}>
            <img src="/images/logo.png" alt="Gabriel Karajallo" />
          </a>
          <div className="nav__links">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href="#contacto" className="nav__cta">
              Contacto
            </a>
          </div>
          <button
            type="button"
            className="nav__toggle"
            aria-label="Abrir menú"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      <div className={`nav__overlay${isOpen ? ' nav__overlay--open' : ''}`} onClick={close} aria-hidden="true" />
      <div className={`nav__drawer${isOpen ? ' nav__drawer--open' : ''}`}>
        <button type="button" className="nav__drawer-close" aria-label="Cerrar menú" onClick={close}>
          <X size={22} />
        </button>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
        <a href="#contacto" className="nav__cta" onClick={close}>
          Contacto
        </a>
      </div>
    </>
  );
}
