import {ColorPresets, ResponsiveValue, Size, TextColorPresets, ThemeEasingName} from '../../types'

export type ThemeMode = 'light' | 'dark'

export interface ColorMember extends Array<string> {
    light: string
    main: string
    dark: string
}

export type ThemeColors = { [P in ColorPresets]: ColorMember }

export type ThemeTextColors = { [P in TextColorPresets]: string }

export type ThemeBackgroundColor = {
    content: string
    body: string
    fixed: string
}

export type ThemeEasing = { [P in ThemeEasingName]: string }

/** 主题的使用对象 */
export type Theme = {
    name: string
    mode: ThemeMode
    fontSize: number
    fontFamily: string
    size: Size
    borderRadius: number
    spacing: number[]
    gap: number
    /**
     * 获取不同程度的灰色
     * @param amount 0 至 1，数值越小越靠近背景颜色，数值越大越靠近文字颜色（mode改变后数组会倒转）
     */
    gray: (amount: number) => string
    divider: string
    colors: ThemeColors
    text: ThemeTextColors
    background: ThemeBackgroundColor
    boxShadow: string[]
    easing: ThemeEasing
    breakpoints: ResponsiveValue
    zoom: number
    update: (themeDefinition: ThemeDefinition | ((currentTheme: Theme) => ThemeDefinition)) => void
    set: (name: string) => void
}

export interface PartialTheme extends Partial<Omit<Theme, 'colors' | 'text' | 'background' | 'easing' | 'breakpoints' | 'update' | 'set'>> {
    colors?: Partial<ThemeColors>
    text?: Partial<ThemeTextColors>
    background?: Partial<ThemeBackgroundColor>
    easing?: Partial<ThemeEasing>
    breakpoints?: Partial<ResponsiveValue>
}

/** 主题的定义对象 */
export interface ThemeDefinition extends Omit<PartialTheme, 'colors'> {
    colors?: { [P in ColorPresets]?: string }
}

export type NamedThemeDefinition = Omit<ThemeDefinition, 'name'> & { name: string }