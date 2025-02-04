import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { remarkReadingTime } from './src/utils/readTime.ts'
import { siteConfig } from './src/data/site.config'

import react from '@astrojs/react';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site,

  markdown: {
      remarkPlugins: [remarkReadingTime],
      drafts: true,
      shikiConfig: {
          theme: 'material-theme-palenight',
          wrap: true
      }
  },

  integrations: [mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
          experimentalThemes: {
              light: 'vitesse-light',
              dark: 'material-theme-palenight'
          },
          wrap: true
      },
      drafts: true
      }), sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
      ssr: {
          external: ['node:path', 'node:stream', 'node:util', 'node:buffer', 'node:fs', 'node:os']
      }
  },
  output: 'server',
  adapter: cloudflare()
})