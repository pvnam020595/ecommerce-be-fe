import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
			'@modules': path.resolve(__dirname, './src/modules'),
			'@router': path.resolve(__dirname, './src/router'),
			'@interfaces': path.resolve(__dirname, './src/interfaces'),
			'@redux': path.resolve(__dirname, './src/redux'),
			'@assets': path.resolve(__dirname, './src/assets'),
			'@mock': path.resolve(__dirname, './src/mock'),
			'@mocks': path.resolve(__dirname, './src/mocks'),
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
