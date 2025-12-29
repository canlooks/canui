import {useEffect, useMemo} from 'react'
import {defaultBreakpoints, Theme, ThemeBackgroundColor, ThemeTextColors, useTheme} from '../components/theme'
import {Breakpoints, ColorPresets, ColorPropsValue, ResponsiveProp, ResponsiveValue} from '../types'
import {humpToSegmented, isUnset} from './utils'
import Color from 'color'
import {StatusType} from '../components/status'
import {SerializedStyles} from '@emotion/react'
import {useDerivedState, useSync} from './hooks'

/**
 * 为类名添加统一前缀，通常为内部使用
 * @param prefixName
 */
export function definePrefix(prefixName: string) {
    return (...names: string[]) => {
        return names.length
            ? names.map(name => `${prefixName}-${name}`).join(' ')
            : prefixName
    }
}

/**
 * 统一管理类名
 * @param prefixName
 */
export function defineClasses<T extends string>(prefixName: string): { root: string }
export function defineClasses<T extends string>(prefixName: string, names: T[]): { [P in T]: string } & { root: string }
export function defineClasses(prefixName: string, names?: string[]) {
    const prefix = definePrefix(humpToSegmented(prefixName))
    const ret = {root: prefix()} as any
    names?.forEach(name => {
        ret[name] = prefix(humpToSegmented(name))
    })
    return ret
}

const INNER_PREFIX = 'CanUI'

/**
 * @private 携带`CanUI`前缀，内部使用
 */
export function defineInnerClasses<T extends string>(prefixName: string): { root: string }
export function defineInnerClasses<T extends string>(prefixName: string, names: T[]): { [P in T]: string } & { root: string }
export function defineInnerClasses(prefixName: string, names?: string[]) {
    const prefix = definePrefix(`${INNER_PREFIX}-${humpToSegmented(prefixName)}`)
    const ret = {root: prefix()} as any
    names?.forEach(name => {
        ret[name] = prefix(humpToSegmented(name))
    })
    return ret
}

/**
 * 用于定义css，返回一个可调用的函数，可直接传入emotion的css属性
 * @param callback
 */
export function defineCss<T>(callback: (theme: Theme) => T): () => T {
    return () => {
        const theme = useTheme()

        return useMemo(() => callback(theme), [theme])
    }
}

/**
 * 使用css的hook，直接在组件或其他hook中调用，相当于{@link defineCss}的立即执行版本
 * @param callback
 * @param deps
 */
export function useCss<T>(callback: (theme: Theme) => T, deps?: any[]): T {
    const theme = useTheme()

    return useMemo(() => callback(theme), [...deps || [], theme])
}

/**
 * 将大多数组件的color属性转换为可用的颜色值
 * @param colorPropsValue
 * @param theme
 */
export function colorTransfer(colorPropsValue: ColorPropsValue, theme: Theme) {
    const {colors, text, background} = theme
    if (colorPropsValue in colors) {
        return colors[colorPropsValue as ColorPresets].main
    }
    if (colorPropsValue.startsWith('text')) {
        if (colorPropsValue === 'text') {
            return text.primary
        }
        const [, member] = colorPropsValue.split('.')
        if (member in text) {
            return text[member as keyof ThemeTextColors]
        }
    }
    if (colorPropsValue.startsWith('background')) {
        const [, member] = colorPropsValue.split('.')
        return background[member as keyof ThemeBackgroundColor]
    }
    return colorPropsValue
}

/**
 * 将useCss()与colorTransfer()方法结合封装
 * @param colorPropsValue
 */
export function useColor(colorPropsValue: ColorPropsValue | undefined) {
    return useCss(theme => {
        return colorPropsValue && colorTransfer(colorPropsValue, theme)
    }, [colorPropsValue])
}

/**
 * 点击的波纹效果
 * @param colorPropsValue
 */
export function useTouchSpread(colorPropsValue: ColorPropsValue) {
    const theme = useTheme()

    const outlineColor = useMemo(() => {
        return Color(colorTransfer(colorPropsValue, theme)).alpha(.6).string()
    }, [colorPropsValue, theme])

    return (element: Animatable) => {
        element.animate([
            {
                outlineWidth: '0',
                outlineStyle: 'solid',
                outlineColor
            },
            {
                outlineWidth: '6px',
                outlineStyle: 'solid',
                outlineColor: 'transparent'
            },
        ], {
            duration: 400,
            easing: theme.easing.easeOut
        })
    }
}

/**
 * 生成响应式样式，与{@link responsiveStyles}的区别在于，本方法会遍历所有`breakpoints`，触发回调函数
 * @param breakpoints 传入{@link Theme}中的断点，或自定义断点
 * @param callback 每个断点触发一次回调
 */
export function responsiveVariables(breakpoints: ResponsiveValue, callback: (key: Breakpoints, px: number) => string | SerializedStyles): string {
    let ret = ''
    for (const k in breakpoints) {
        const px = breakpoints[k]
        if (px) {
            ret += `
                @media (min-width: ${px}px) {
                    ${callback(k, px) || ''}
                }                
            `
        } else {
            ret += `${callback(k, px) || ''}`
        }
    }
    return ret
}

/**
 * 生成响应式样式，与{@link responsiveVariables}的区别在于，本方法只会生成给定的断点所对应的样式
 * @param styles 样式定义，对象类型，键名可为断点也可为具体的宽度
 * @param breakpoints 定义断点，默认使用{@link defaultBreakpoints}
 * @example
 * responsiveStyles({
 *   sm: 'color: red;',
 *   '500px': 'color: pink;'
 * })
 */
export function responsiveStyles(styles: { [P in Breakpoints]?: string | SerializedStyles }, breakpoints: ResponsiveValue = defaultBreakpoints): string {
    let ret = ''
    for (const k in styles) {
        let px = breakpoints[k] ?? k
        let style = styles[k]
        if (typeof style === 'object' && style.styles) {
            style = style.styles
        }
        if (px && (px as number | string) !== '0') {
            if (typeof px === 'number') {
                (px as number | string) += 'px'
            }
            ret += `
                @media (max-width: ${px}) {
                    ${style}
                }                
            `
        } else {
            ret += style
        }
    }
    return ret
}

/**
 * 将响应式的值统一转换为对象格式
 */
export function toResponsiveValue(prop?: undefined): undefined
export function toResponsiveValue<T = number>(prop: ResponsiveProp<T>): ResponsiveValue<T>
export function toResponsiveValue<T = number>(prop?: ResponsiveProp<T>): ResponsiveValue<T> | undefined {
    if (isUnset(prop)) {
        return
    }
    return typeof prop === 'object' ? prop as ResponsiveValue<T> : {xs: prop}
}

/**
 * 使用hooks监听响应式值的变化，通常用于css不能满足需求的情况
 * @param prop
 * @param disabled
 */
export function useResponsiveValue<T = number>(prop: ResponsiveProp<T>, disabled = false) {
    const responsiveObj = toResponsiveValue(prop)

    const {breakpoints} = useTheme()

    const syncBreakpoints = useSync(breakpoints)

    const fn = () => {
        let maxBreakpoint: Breakpoints = 'xs'
        for (const k in syncBreakpoints.current) {
            if (window.innerWidth < syncBreakpoints.current[k as Breakpoints]) {
                break
            }
            if (k in responsiveObj) {
                maxBreakpoint = k as Breakpoints
            }
        }
        return responsiveObj[maxBreakpoint]!
    }

    const [value, setValue] = useDerivedState(fn, [breakpoints])

    useEffect(() => {
        if (disabled) {
            return
        }
        const resize = () => {
            setValue(fn())
        }
        addEventListener('resize', resize)
        return () => {
            removeEventListener('resize', resize)
        }
    }, [disabled])

    return value
}

/**
 * 使用状态对应的颜色
 * @param status
 */
export function useStatusColor(status: StatusType = 'unknown') {
    const {colors, text} = useTheme()

    if (status === 'unknown') {
        return text.disabled
    }

    if (status === 'confirm') {
        status = 'warning'
    }
    return colors[status].main
}