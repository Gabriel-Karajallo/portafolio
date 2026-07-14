# Portafolio — Gabriel Karajallo

Portafolio personal, construido con React + TypeScript + Vite.

## Desarrollo

```bash
npm install
npm run dev
```

## Estructura

- `src/data/content.ts` — todo el contenido textual (experiencia, proyectos, skills, etc). Editar aquí para actualizar textos.
- `src/components/sections/` — una sección por bloque del home (Hero, Experiencia, Proyectos, Skills, Educación, Sobre mí, Contacto).
- `src/pages/ProjectDetail.tsx` — página de caso de estudio, reutilizada para `/proyectos/gestiona` y `/proyectos/gymtrack`.
- `src/components/ImagePlaceholder.tsx` — placeholder de imagen; sustituir por `<img src="..." />` cuando haya fotos/capturas reales.

## Pendiente

- Reemplazar los placeholders de imagen (foto de perfil, fotos de "Sobre mí", capturas de Gestiona y GymTrack).
- Sustituir los enlaces de LinkedIn y GitHub (`src/data/content.ts`, objeto `contact`) por las URLs reales.
- Decidir el destino real del formulario de contacto (actualmente abre un `mailto:` con lo escrito).
