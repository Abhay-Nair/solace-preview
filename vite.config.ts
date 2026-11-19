import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Leave local development at /; GitHub Actions sets GITHUB_PAGES=true.
  base: process.env.GITHUB_PAGES === 'true' ? '/solace-preview/' : '/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: true,
  },
});
