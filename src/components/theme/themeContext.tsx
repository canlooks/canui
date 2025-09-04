import {ReactNode, createContext, useContext, useMemo} from 'react'
import {defaultDarkTheme, defaultLightTheme, defineTheme, restoreThemeDefinition} from './themeVariables'
import {mergeDeep, useDerivedState} from '../../utils'
import {Theme, ThemeDefinition} from './themeTypes'

export const ThemeContext = createContext(
    defineTheme(defaultLightTheme) as Theme
)

export function useTheme() {
    return useContext(ThemeContext)
}

export type ThemeProviderProps = {
    theme?: ThemeDefinition
    children?: ReactNode
}

export function ThemeProvider({
    theme,
    children
}: ThemeProviderProps) {
    const parentTheme = useTheme()

    const [currentTheme, setCurrentTheme] = useDerivedState(theme)

    const mergedThemeDefinition = useMemo(() => {
        return mergeDeep(
            {},
            restoreThemeDefinition(parentTheme),
            parentTheme.mode === 'light' && currentTheme.current?.mode === 'dark' ? defaultDarkTheme : void 0,
            parentTheme.mode === 'dark' && currentTheme.current?.mode === 'light' ? defaultLightTheme : void 0,
            currentTheme.current
        )
    }, [currentTheme.current, parentTheme])

    const themeContextValue = useMemo(() => {
        const value = defineTheme(mergedThemeDefinition) as Theme
        value._sub = true
        value.update = theme => {
            const newThemeDefinition = typeof theme === 'function' ? theme(value) : theme
            setCurrentTheme(prev => {
                return mergeDeep({...prev}, newThemeDefinition)
            })
        }
        return value
    }, [mergedThemeDefinition])

    return (
        <ThemeContext value={themeContextValue}>
            {children}
        </ThemeContext>
    )
}