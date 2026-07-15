import { MapPin, Mail, BadgeCheck, Coffee, Dumbbell, Goal, Plane, Gamepad2, Film, type LucideIcon } from 'lucide-react';
import { Reveal } from '../Reveal';
import { ImagePlaceholder } from '../ImagePlaceholder';
import { bio, hobbies, aboutPhotos, aboutInfo, contact } from '../../data/content';

const hobbyIcons: Record<string, LucideIcon> = {
  Boxeo: Dumbbell,
  Fútbol: Goal,
  Viajar: Plane,
  Videojuegos: Gamepad2,
  Cine: Film,
};

export function About() {
  return (
    <Reveal as="section" id="sobre-mi" className="section section--auto about">
      <div className="about-intro">
        <div className="about-intro__text">
          <h2 className="about-title">Sobre mí</h2>
          <p className="about-lead">
            {bio} <Coffee size={16} className="about-lead__icon" />
          </p>
          <div className="about-meta">
            <div className="about-meta__item">
              <MapPin size={17} className="about-meta__icon" />
              <div>
                <div className="about-meta__label">Ubicación</div>
                <div className="about-meta__value">{aboutInfo.location}</div>
              </div>
            </div>
            <div className="about-meta__item">
              <Mail size={17} className="about-meta__icon" />
              <div>
                <div className="about-meta__label">Email</div>
                <div className="about-meta__value">{contact.email}</div>
              </div>
            </div>
            <div className="about-meta__item">
              <BadgeCheck size={17} className="about-meta__icon" />
              <div>
                <div className="about-meta__label">Disponibilidad</div>
                <div className="about-meta__value">{aboutInfo.availability}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="about-intro__photo">
          <ImagePlaceholder label="Foto — perfil" shape="rounded" radius={20} />
        </div>
      </div>

      <div className="about-row">
        <div className="about-row__label">
          <h3 className="about-row__title">Hobbies</h3>
          <p className="about-row__desc">
            Algunas de las cosas que me ayudan a desconectar y seguir aprendiendo fuera del código.
          </p>
        </div>
        <div className="hobbies-row">
          {hobbies.map((hobby) => {
            const Icon = hobbyIcons[hobby.label];
            return (
              <div className="hobby-item" key={hobby.label} title={hobby.description}>
                <div className="hobby-item__icon">
                  <Icon size={20} />
                </div>
                <div className="hobby-item__label">{hobby.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="about-row">
        <div className="about-row__label">
          <h3 className="about-row__title">Algunas fotos</h3>
          <p className="about-row__desc">Momentos, lugares y experiencias que me inspiran.</p>
        </div>
        <div className="about-gallery">
          {aboutPhotos.map((label) => (
            <div className="about-gallery__item" key={label}>
              <ImagePlaceholder label={label} shape="rounded" radius={16} />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
