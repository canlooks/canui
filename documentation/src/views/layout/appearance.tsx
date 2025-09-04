import {memo, useEffect, useRef, useState} from 'react'
import {Bubble, Button, ColorPicker, Form, FormItem, Icon, MarkItem, Segmented, Slider, ThemeMode, useTheme} from '@'
import {faCircleHalfStroke, faPalette} from '@fortawesome/free-solid-svg-icons'
import {classes, style} from './appearance.style'
import {faMoon, faSun} from '@fortawesome/free-regular-svg-icons'
import Color from 'color'
import {autoThemeMode, getThemeMode, presetColors, presetDarkColors, setThemeColor, setThemeFontSize, setThemeMode} from '../../stores/preference'

export const Appearance = memo(() => {
    return (
        <Bubble
            placement="bottomRight"
            content={
                <div css={style}>
                    <div className={classes.title}>外观</div>
                    <Form>
                        <ThemeMode/>
                        <ThemeColor/>
                        <ThemeFontSize/>
                    </Form>
                </div>
            }
            forceRender
        >
            <Button variant="plain" color="text.disabled">
                <Icon icon={faPalette}/>
            </Button>
        </Bubble>
    )
})

function ThemeMode() {
    const [innerMode, setInnerMode] = useState(() => getThemeMode())

    const theme = useTheme()

    const onChange = (mode: 'auto' | ThemeMode) => {
        setInnerMode(mode)
        theme.update({mode: mode === 'auto' ? autoThemeMode() : mode})
        setThemeMode(mode)
    }

    return (
        <FormItem label="主题">
            <Segmented
                options={[
                    {
                        prefix: <Icon icon={faCircleHalfStroke}/>,
                        label: '自动',
                        value: 'auto'
                    },
                    {
                        prefix: <Icon icon={faSun}/>,
                        label: '明亮',
                        value: 'light'
                    },
                    {
                        prefix: <Icon icon={faMoon}/>,
                        label: '暗黑',
                        value: 'dark'
                    }
                ]}
                value={innerMode}
                onChange={onChange}
            />
        </FormItem>
    )
}

function ThemeColor() {
    const theme = useTheme()

    const isInitial = useRef(true)

    const currentPresets = theme.mode === 'light' ? presetColors : presetDarkColors

    useEffect(() => {
        if (isInitial.current) {
            isInitial.current = false
            return
        }
        const prevPresets = theme.mode === 'light' ? presetDarkColors : presetColors
        const presetIndex = prevPresets.indexOf(theme.colors.primary.main)
        presetIndex > -1 && onChange(currentPresets[presetIndex])
    }, [theme.mode])

    const onChange = (hex: string) => {
        theme.update({
            colors: {primary: hex}
        })
        setThemeColor(hex)
    }

    return (
        <FormItem label="颜色">
            <ColorPicker
                presets={currentPresets}
                value={Color(theme.colors.primary.main)}
                onChange={color => onChange(color.hex())}
            />
        </FormItem>
    )
}

const min = 12
const max = 18

const fontSizeMarks = (() => {
    const marks: MarkItem[] = []
    for (let i = min; i <= max; i++) {
        marks.push({
            value: i,
            label: i === 14 && i
        })
    }
    return marks
})()

function ThemeFontSize() {
    const theme = useTheme()

    const onChange = (fontSize: number) => {
        theme.update({fontSize})
        setThemeFontSize(fontSize)
    }

    return (
        <FormItem label="字号">
            <Slider
                min={min}
                max={max}
                marks={fontSizeMarks}
                value={theme.fontSize}
                onChange={onChange}
            />
        </FormItem>
    )
}