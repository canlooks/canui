import {ColorMember, PartialTheme, ThemeColors, ThemeDefinition} from './themeTypes'
import Color from 'color'
import {ColorPresets} from '../../types'

/**
 * ---------------------------------------------------------------------
 * 生成单个颜色的其他明亮度配色，0 至 10，数字越小颜色越淡（亮），数字越大颜色越深（暗）
 */
function defineColorMembers(color: string): ColorMember {
    const member = Array() as ColorMember
    member.toString = () => color

    const colorObj = Color(color)

    for (let i = 0; i <= 4; i++) {
        Object.defineProperty(member, i, {
            get: () => colorObj.lighten(1 - (i + 1) / 6).hex()
        })
    }

    member[5] = color

    for (let i = 6; i <= 10; i++) {
        Object.defineProperty(member, i, {
            get: () => colorObj.darken((i - 5) / 6).hex()
        })
    }

    member.main = member[5]

    Object.defineProperties(member, {
        light: {
            get: () => member[3]
        },
        dark: {
            get: () => member[7]
        }
    })

    return member
}

/**
 * 将主题定义对象转换成使用对象
 * @param themeDefinition
 */
export function defineTheme(themeDefinition: ThemeDefinition): PartialTheme {
    if (!themeDefinition.colors) {
        return themeDefinition as PartialTheme
    }
    const colors: Partial<ThemeColors> = {}
    for (const k in themeDefinition.colors) {
        const color = themeDefinition.colors[k as ColorPresets]
        if (color) {
            colors[k as ColorPresets] = defineColorMembers(color)
        }
    }
    return {...themeDefinition, colors}
}

/**
 * 将主题使用对象还原成定义对象
 * @param theme
 */
export function restoreThemeDefinition(theme: PartialTheme): ThemeDefinition {
    if (!theme.colors) {
        return theme as ThemeDefinition
    }
    const colors: ThemeDefinition['colors'] = {}
    for (const k in theme.colors) {
        const colorMembers = theme.colors[k as ColorPresets]
        if (colorMembers) {
            colors[k as ColorPresets] = colorMembers.main
        }
    }
    return {...theme, colors}
}