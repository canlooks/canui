import {App as CanUI} from '@'
import {Global} from '@emotion/react'
import {style} from './app.style'
import {Router, Routes} from '@canlooks/react-router'
import {routes} from './routes'
import {autoThemeMode, getThemeColor, getThemeFontSize, getThemeMode} from '../stores/preference'

export function App() {
    const mode = getThemeMode()

    return (
        <CanUI theme={{
            mode: mode === 'auto' ? autoThemeMode() : mode,
            colors: {
                primary: getThemeColor()
            },
            fontSize: getThemeFontSize()
        }}>
            <AppContent/>
        </CanUI>
    )
}

function AppContent() {
    return (
        <>
            <Global styles={style}/>
            <Router>
                <Routes routes={routes}/>
            </Router>
        </>
    )
}