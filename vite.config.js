import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$components: resolve('./src/components'),
			$src: resolve('./src'),
			$params: resolve('./src/params')
		}
	},
	server: {
		host: true,
		port: 3000
	}
});
