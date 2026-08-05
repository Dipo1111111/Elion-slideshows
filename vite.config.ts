import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Web dev server: Vite on 5173, API proxied to the Express server on 8787.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8787',
      // Trailing slash is load-bearing: '/s' would prefix-match '/src/*' and
      // proxy source modules to the API. '/s/' matches share URLs only.
      '/s/': 'http://localhost:8787',
    },
  },
})
