import {defineConfig} from 'vite'
import path from 'path'

export default defineConfig(() => ({
    root: path.resolve('test'),
    server: {
        host: true,
        port: 7000
    }
}))