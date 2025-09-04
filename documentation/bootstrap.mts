#!/usr/bin/env node

import {preview} from 'vite'
import inlineConfig from './vite.config.mjs'

(async () => {
    const server = await preview(inlineConfig)
    server.printUrls()
    server.bindCLIShortcuts({print: true})
})()