import {UserConfig} from 'vite'
import path from 'path'
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
    root: __dirname,
    envDir: path.join(__dirname, 'env'),
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src')
        }
    },
    build: {
        emptyOutDir: true
    },
    preview: {
        open: true
    }
} as UserConfig