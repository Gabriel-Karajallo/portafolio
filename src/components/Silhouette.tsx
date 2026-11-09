import { LOADER_ART } from './loaderArt';

/** Silueta de la pantalla de carga: el contorno del busto se traza y luego se rellena. */
export function Silhouette({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${LOADER_ART.w} ${LOADER_ART.h}`} aria-hidden>
      <path className="art-body" d={LOADER_ART.body} pathLength={1} />
    </svg>
  );
}
