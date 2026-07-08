import { defineConfig } from 'vite'

// https://vite.dev/config/

export default defineConfig({
  server: {
    proxy: {
      "/rest": {
        target: "http://localhost:3001",
        changeOrigin: true
      }
    }
  }
});

