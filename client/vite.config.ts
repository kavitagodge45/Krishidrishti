import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

/**
 * Render / Static Site SPA fallback plugin
 * Automatically copies index.html to 404.html in dist.
 * Render serves 404.html when any route (e.g. /crop-doctor, /mandi) is refreshed directly,
 * allowing React Router to take over without showing "Not Found".
 */
function spaFallbackPlugin() {
  return {
    name: 'spa-fallback-plugin',
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(outDir, 'index.html');
      const fallbackPath = path.join(outDir, '404.html');
      try {
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, fallbackPath);
          console.log('✓ Generated dist/404.html SPA fallback for Render');
        }
      } catch (err) {
        console.error('Failed to create 404.html fallback:', err);
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallbackPlugin()],
  resolve: {
    preserveSymlinks: true,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        timeout: 30000,
        configure: (proxy) => {
          proxy.on('error', (_err, _req, res) => {
            // Suppress proxy error crashes; the browser will show its own error
            if (!res.headersSent) {
              (res as any).writeHead(502, { 'Content-Type': 'application/json' });
              (res as any).end(JSON.stringify({ error: 'Backend temporarily unavailable' }));
            }
          });
        },
      },
    },
  },
});
