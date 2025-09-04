import {defineInnerClasses, ThemeMode} from '@'
import dayjs from 'dayjs'
import Color from 'color'

const keyNames = defineInnerClasses('theme', [
    'mode',
    'color',
    'fontSize'
])

export const presetColors = [
    '#1E71EC',
    '#52B788',
    '#EF233C',
    '#FF85A1',
    '#C36F09',
    '#9D4EDD'
]

export const presetDarkColors = presetColors.map(color => Color(color).lighten(.1).hex())

export function getThemeMode() {
    return localStorage.getItem(keyNames.mode) as ThemeMode | 'auto' || 'auto'
}

export function autoThemeMode() {
    const hour = dayjs().hour()
    return hour < 7 || hour >= 19 ? 'dark' : 'light'
}

export function setThemeMode(mode: ThemeMode | 'auto') {
    localStorage.setItem(keyNames.mode, mode)
}

export function getThemeColor() {
    return localStorage.getItem(keyNames.color) || presetColors[0]
}

export function setThemeColor(color: string) {
    localStorage.setItem(keyNames.color, color)
}

export function getThemeFontSize() {
    const fontSize = localStorage.getItem(keyNames.fontSize)
    return fontSize === null ? 14 : +fontSize
}

export function setThemeFontSize(fontSize: number) {
    localStorage.setItem(keyNames.fontSize, fontSize + '')
}