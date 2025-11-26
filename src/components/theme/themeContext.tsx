import {ReactNode, createContext, useContext, useMemo} from 'react'
import {defaultDarkTheme, defaultLightTheme} from './themeVariables'
import {mergeDeep, useDerivedState} from '../../utils'
import {Theme, ThemeDefinition} from './themeTypes'
import {defineTheme, restoreThemeDefinition} from './themeMethods'
import {getTheme} from './themeRegistry'

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

    const resolvedThemeDefinition = useMemo(() => {
        return theme?.name
            ? mergeDeep({}, getTheme(theme.name), theme)
            : theme
    }, [theme])

    const [currentTheme, setCurrentTheme] = useDerivedState(resolvedThemeDefinition)

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
        value.update = theme => {
            setCurrentTheme(typeof theme === 'function' ? theme(value) : theme)
        }
        value.set = name => {
            value.update(getTheme(name))
        }
        return value
    }, [mergedThemeDefinition])

    return (
        <ThemeContext value={themeContextValue}>
            {children}
        </ThemeContext>
    )
}