import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@modules': path.resolve(__dirname, './src/modules'),
			'@css': path.resolve(__dirname, './public/css'),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use "src/styles/scss/variables.scss" as *;`
			},
		},
	},
	build: {
		cssCodeSplit: true,
		sourcemap: true,
	},
})
