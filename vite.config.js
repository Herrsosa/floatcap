import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        article1: resolve(__dirname, 'article-working-capital-problem.html'),
        article2: resolve(__dirname, 'article-marketplace-distribution.html'),
      },
    },
  },
});
