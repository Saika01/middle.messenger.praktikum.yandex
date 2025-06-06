import { defineConfig } from 'vite';
import path from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
    },
    plugins: [
        {
            ...handlebars(),
            apply: 'serve',
            transform(code) {
                return code;
            },
        },
    ],
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
        }
});
