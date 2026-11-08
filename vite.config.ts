import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    return {
      base: '/',
      server: {
        port,
        host: '0.0.0.0',
        allowedHosts: true,
        hmr: {
          overlay: false,
        },
      },
      preview: {
        port,
        host: '0.0.0.0',
        allowedHosts: true,
      },
      plugins: [
        react(),
        {
          name: 'public-rewrite-middleware',
          configureServer(server) {
            server.middlewares.use((req, _res, next) => {
              if (req.url && req.url.startsWith('/public/')) {
                req.url = req.url.replace(/^\/public/, '');
              }
              next();
            });
          },
          configurePreviewServer(server) {
            server.middlewares.use((req, _res, next) => {
              if (req.url && req.url.startsWith('/public/')) {
                req.url = req.url.replace(/^\/public/, '');
              }
              next();
            });
          },
        },
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || ''),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || '')
      },
            build: {
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom'],
              'vendor-icons': ['lucide-react']
            }
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
        dedupe: ['react', 'react-dom']
      },
      optimizeDeps: {
        include: ['react', 'react-dom']
      }
    };
});
