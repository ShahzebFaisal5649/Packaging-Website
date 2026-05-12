import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('error', (err) => {
            // Suppress noisy proxy errors in dev — API server may not be running yet
            if (err.code !== 'ECONNREFUSED') console.log('[vite] proxy error:', err.message);
          });
          proxy.on('proxyReq', (_proxyReq, req) => {
            if (process.env.NODE_ENV === 'development') {
              console.log('[proxy →]', req.method, req.url);
            }
          });
        },
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react';
            if (id.includes('react-router')) return 'vendor-router';
            if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-icons';
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('three') || id.includes('@react-three')) return 'vendor-three';
            return 'vendor';
          }
        },
      },
    },
  },
})
