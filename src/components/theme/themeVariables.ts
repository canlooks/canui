import Color from 'color'
import {ResponsiveValue} from '../../types'
import {NamedThemeDefinition} from './themeTypes'

/**
 * ---------------------------------------------------------------------
 * 获取不同程度的灰色
 * @param amount 0 至 1，数值越小越靠近背景颜色，数值越大越靠近文字颜色（mode改变后数组会倒转）
 */
function gray(amount: number) {
    return Color().hue(0).saturationl(0).lightness(100 - amount * 100).hex()
}

function rGray(amount: number) {
    return gray(1 - amount)
}

/**
 * ---------------------------------------------------------------------
 * 以3的倍数统一处理间距
 */

const defaultSpacing = generateSpacing()

function generateSpacing(): number[] {
    const spacing = []
    for (let i = 0; i <= 10; i++) {
        spacing[i] = i * 3
    }
    return spacing
}

/**
 * ---------------------------------------------------------------------
 * 统一全局zIndex
 */

export const zIndex = {
    touchRipple: 900,
    overlay: 1000,
    popper: 1100,
    dropdown: 1200,
    bubbleConfirm: 1300,
    snackbar: 1400,
    tooltip: 1500
}

export const defaultBreakpoints: ResponsiveValue = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1500
}

export const defaultFontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji', 'Microsoft YaHei UI', sans-serif`

export const defaultMonospaceFontFamily = `'Consolas', 'SF Mono', 'Cascadia Code', 'Menlo',
    'DejaVu Sans Mono', 'Ubuntu Mono', monospace`

/**
 * ---------------------------------------------------------------------
 * 默认的明亮主题配置
 */
export const DEFAULT_LIGHT = 'default-light' as const

export const defaultLightTheme: NamedThemeDefinition = {
    name: DEFAULT_LIGHT,
    mode: 'light',
    fontSize: 14,
    fontFamily: defaultFontFamily,
    size: 'medium',
    borderRadius: 6,
    spacing: defaultSpacing,
    gap: defaultSpacing[6],
    gray,
    /* divider: gray(.15), */
    divider: '#d9d9d9',
    colors: {
        primary: '#1E71EC',
        secondary: '#925CC1',
        success: '#13C13C',
        warning: '#ED9121',
        error: '#DD3F3F',
        info: '#52AEDF',
    },
    text: {
        /* primary: gray(.9), */
        primary: '#191919',
        /* secondary: gray(.6), */
        secondary: '#666666',
        /* disabled: gray(.4), */
        disabled: '#999999',
        /* placeholder: gray(.3), */
        placeholder: '#b3b3b3',
        /* inverse: gray(0) */
        inverse: '#ffffff'
    },
    background: {
        content: '#ffffff',
        /* body: gray(.04), */
        body: '#f5f5f5',
        fixed: 'rgba(0, 0, 0, .02)'
    },
    boxShadow: [
        /* 通常用于弹框，气泡等 */
        '3px 6px 18px rgba(0, 0, 0, .2)',
        /* 通常用于抽屉等 */
        '0 0 24px rgba(0, 0, 0, .2)',
        '1px 2px 3px rgba(0, 0, 0, .2)',
        '2px 4px 6px rgba(0, 0, 0, .2)',
        '3px 6px 9px rgba(0, 0, 0, .2)',
        '3px 6px 18px rgba(0, 0, 0, .2)',
        '4px 8px 24px rgba(0, 0, 0, .2)'
    ],
    easing: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'cubic-bezier(.3, 0, .6, 0)',
        easeOut: 'cubic-bezier(.4, 1, .7, 1)',
        easeInOut: 'cubic-bezier(.65, 0, .35, 1)',
        bounce: 'cubic-bezier(.5, 2, .5, .7)',
        swing: 'cubic-bezier(.5, 3, .5, .1)'
    },
    breakpoints: defaultBreakpoints,
    zoom: 1
}

/**
 * ---------------------------------------------------------------------
 * 默认的黑暗主题配置
 */
export const DEFAULT_DARK = 'default-dark' as const

export const defaultDarkTheme: NamedThemeDefinition = {
    name: DEFAULT_DARK,
    mode: 'dark',
    background: {
        /* content: rGray(.14), */
        content: '#242424',
        /* body: rGray(.1), */
        body: '#1a1a1a',
        fixed: 'rgba(255, 255, 255, .06)'
    },
    gray: rGray,
    /* divider: rGray(.28), */
    divider: '#474747',
    colors: {
        /* primary: Color(defaultLightTheme.colors!.primary).lighten(.1).hex(), */
        primary: '#3780EE',
        /* secondary: Color(defaultLightTheme.colors!.secondary).lighten(.06).hex(), */
        secondary: '#9A68C6',
        /* success: Color(defaultLightTheme.colors!.success).lighten(.06).hex(), */
        success: '#14CD40',
        /* warning: Color(defaultLightTheme.colors!.warning).lighten(.06).hex(), */
        warning: '#EE9830',
        /* error: Color(defaultLightTheme.colors!.error).lighten(.06).hex(), */
        error: '#E04D4D',
        /* info: Color(defaultLightTheme.colors!.info).lighten(.03).hex() */
        info: '#5AB2E0'
    },
    text: {
        /* primary: rGray(.9), */
        primary: '#e6e6e6',
        /* secondary: rGray(.7), */
        secondary: '#b3b3b3',
        /* disabled: rGray(.5), */
        disabled: '#808080',
        /* placeholder: rGray(.45), */
        placeholder: '#737373',
        /* inverse: rGray(0) */
        inverse: '#000000'
    }
}
