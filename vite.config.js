import { defineConfig } from 'vite'
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
            }
        }
    ],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@import "./src/styles/vars.scss";`,
            },
        },
    },
    server: {
        port: 3000
    }
})
