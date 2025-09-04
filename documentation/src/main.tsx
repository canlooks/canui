import {createRoot} from 'react-dom/client'
import {App} from './app/app'

createRoot(document.getElementById('app') as HTMLElement).render(<App/>)