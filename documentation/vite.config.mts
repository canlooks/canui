import {UserConfig} from 'vite'
import path from 'path'
import {fileURLToPath} from 'url'

const _dirname = dirname()

export default {
    root: _dirname,
    envDir: path.join(_dirname, 'env'),
    resolve: {
        alias: {
            '@': path.join(_dirname, '../src')
        }
    },
    build: {
        emptyOutDir: true
    },
    preview: {
        open: true
    }
} as UserConfig

function dirname() {
    return typeof __dirname === 'string' ? __dirname
        : import.meta.dirname || path.dirname(fileURLToPath(import.meta.url))
}