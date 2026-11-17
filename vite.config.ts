import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Emite la página ya compilada también como 404.html. Vercel la sirve con estado 404
 * en cualquier ruta que no esté en vercel.json, y la propia app pinta «no encontrada».
 */
function notFoundPage(): Plugin {
  return {
    name: 'not-found-page',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const page = bundle['index.html'];
      if (page?.type === 'asset') this.emitFile({ type: 'asset', fileName: '404.html', source: page.source });
    },
  };
}

export default defineConfig({
  plugins: [react(), notFoundPage()],
  server: { port: 8137 },
  preview: { port: 8137 },
});
