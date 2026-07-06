import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks so the main bundle stays small
          react: ['react', 'react-dom'],
          amplify: ['aws-amplify', '@aws-amplify/ui-react'],
          markdown: ['react-markdown', 'react-syntax-highlighter'],
        },
      },
    },
  },
})
