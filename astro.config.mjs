// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'

import tailwindcss from '@tailwindcss/vite'

import icon from 'astro-icon'

import sitemap from '@astrojs/sitemap'
import svgr from 'vite-plugin-svgr'

// https://astro.build/config
export default defineConfig({
	site: 'https://marcoaround.com',
	integrations: [
		react(),
		icon({
			iconDir: 'src/assets/icons',
		}),
		sitemap(),
	],
	vite: {
		plugins: [tailwindcss(), svgr()],
	},
})
