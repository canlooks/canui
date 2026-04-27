'use client'

// import {config} from '@fortawesome/fontawesome-svg-core'
// import '@fortawesome/fontawesome-svg-core/styles.css'
//
// config.autoAddCss = false
const worker = new Worker(new URL('./worker.ts', import.meta.url))

export default function AppPage() {
    return (
        <div>
            <button onClick={() => worker.postMessage('hello')}>button</button>
        </div>
    )
}