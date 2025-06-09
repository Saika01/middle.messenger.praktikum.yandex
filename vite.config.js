import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "./src/styles/vars.scss";',
            },
        },
    },
    preview: {
        port: 3000,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    assetsInclude: ['**/*.hbs'],
});
