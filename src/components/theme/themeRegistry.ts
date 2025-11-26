import {NamedThemeDefinition, ThemeDefinition} from './themeTypes'
import {defaultDarkTheme, defaultLightTheme} from './themeVariables'

export const themeMap = new Map<string, NamedThemeDefinition>()

export function getTheme(name: string) {
    const registeredTheme = themeMap.get(name)
    if (!registeredTheme) {
        throw Error(`Cannot find theme "${name}", call "registerTheme()" first.`)
    }
    return registeredTheme
}

export function registerTheme(name: string, theme: ThemeDefinition): void
export function registerTheme(theme: NamedThemeDefinition): void
export function registerTheme(a: any, b?: any) {
    const theme: NamedThemeDefinition = b ? {...b, name: a} : {...a}
    themeMap.set(theme.name, theme)
}

registerTheme(defaultLightTheme)
registerTheme(defaultDarkTheme)