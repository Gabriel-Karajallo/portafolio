import { Reveal } from '../Reveal';
import { ChatContact } from '../ChatContact';
import { LinkedInIcon, GitHubIcon, EmailIcon } from '../icons';
import { contact } from '../../data/content';

export function Contact() {
  return (
    <Reveal as="section" id="contacto" className="contact-wrapper">
      <div className="contact-panel">
        <div>
          <h2 className="contact-title">Hablemos</h2>
          <p className="contact-text">
            ¿Tienes un proyecto en mente o una vacante? Escríbeme por el chat o por cualquiera de estos canales.
          </p>
          <a href={`mailto:${contact.email}`} className="contact-email">
            {contact.email}
          </a>
          <div className="contact-social">
            <a href={contact.linkedinHref} title="LinkedIn" className="contact-social__icon">
              <LinkedInIcon />
            </a>
            <a href={contact.githubHref} title="GitHub" className="contact-social__icon">
              <GitHubIcon />
            </a>
            <a href={`mailto:${contact.email}`} title="Email" className="contact-social__icon">
              <EmailIcon />
            </a>
          </div>
        </div>
        <ChatContact />
      </div>
      <div className="footer">© 2026 Gabriel Karajallo</div>
    </Reveal>
  );
}
