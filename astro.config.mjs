import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://blog.msweelam.dev',
  output: 'static',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
