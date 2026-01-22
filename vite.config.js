import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    port: 5173,
  },
  test: {
    coverage: {
      provider: 'v8',  // can use istanbul provider as well
    },
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
  }
})
