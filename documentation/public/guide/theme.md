# 自定义主题

## <ThemeProvider\/>

如果你使用了[<App\/>](appComponent)（入口组件），则入口组件也包含了themeProvider的功能：

```tsx no-preview
import {App, ThemeDefinition} from '@canlooks/can-ui'

export default function Index() {
    const theme: ThemeDefinition = {
        colors: {
            primary: '#1E71EC'
        }
    }

    return (
        <App theme={theme}>
            {/* ... */}
        </App>
    )
}
```

## ThemeDefinition

| 属性           | 类型                         |
|--------------|----------------------------|
| mode         | 'light' \| 'dark'          |
| fontSize     | number                     |
| fontFamily   | string                     |
| size         | string                     |
| borderRadius | number                     |
| spacing      | number[]                   |
| gap          | number[]                   |
| gray         | (amount: number) => string |
| divider      | string                     |
| colors       | Object                     |
| text         | Object                     |
| background   | Object                     |
| easing       | Object                     |
| breakpoints  | Object                     |
| boxShadow    | string[]                   |
| zoom         | number                     |

## 默认主题定义

### light

```tsx no-preview
const defaultLightTheme: ThemeDefinition = {
    mode: 'light',
    fontSize: 14,
    fontFamily: defaultFontFamily,
    size: 'medium',
    borderRadius: 6,
    spacing: defaultSpacing,
    gap: defaultSpacing[6],
    gray,
    /* divider: gray(.1), */
    divider: '#e6e6e6',
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
```

### dark

`dark`模式定义对象除以下属性外，其余属性继承于`light`模式

```tsx no-preview
const defaultDarkTheme: ThemeDefinition = {
    mode: 'dark',
    background: {
        content: '#333333',
        body: '#252525',
        fixed: 'rgba(255, 255, 255, .06)'
    },
    gray: rGray,
    divider: '#5c5c5c',
    colors: {
        primary: '#3780EE',
        secondary: '#9A68C6',
        success: '#14CD40',
        warning: '#EE9830',
        error: '#E04D4D',
        info: '#5AB2E0'
    },
    text: {
        primary: '#e6e6e6',
        secondary: '#b3b3b3',
        disabled: '#808080',
        placeholder: '#737373',
        inverse: '#000000'
    }
}
```

## 使用主题

### useTheme()

CanUI提供`useTheme()`hook，获取当前主题对象，

**注意：使用时的`colors`对象与定义时不同**

### Theme.Colors

使用时，`colors`对象中的每个属性均支持数字`0-10`的索引，也支持`light`、`main`、`dark`3种预设：

```tsx
import {Flex, useTheme} from '@canlooks/can-ui'

const height = 40
const color = '#fff'

export default function Index() {
    const {colors: {primary}} = useTheme()
    
    return (
        <Flex width="100%" direction="column" gap={12}>
            <Flex gap={12}>
                <Flex flex={1} style={{background: primary.light, height}}>light</Flex>
                <Flex flex={1} style={{background: primary.main, height, color}}>main</Flex>
                <Flex flex={1} style={{background: primary.dark, height, color}}>dark</Flex>
            </Flex>
            <Flex>
                <Flex flex={1} style={{background: primary[0], height}}>[0]</Flex>
                <Flex flex={1} style={{background: primary[1], height}}>[1]</Flex>
                <Flex flex={1} style={{background: primary[2], height}}>[2]</Flex>
                <Flex flex={1} style={{background: primary[3], height}}>[3]</Flex>
                <Flex flex={1} style={{background: primary[4], height}}>[4]</Flex>
                <Flex flex={1} style={{background: primary[5], height, color}}>[5]</Flex>
                <Flex flex={1} style={{background: primary[6], height, color}}>[6]</Flex>
                <Flex flex={1} style={{background: primary[7], height, color}}>[7]</Flex>
                <Flex flex={1} style={{background: primary[8], height, color}}>[8]</Flex>
                <Flex flex={1} style={{background: primary[9], height, color}}>[9]</Flex>
                <Flex flex={1} style={{background: primary[10], height, color}}>[10]</Flex>
            </Flex>
        </Flex>
    )
}
```

## 动态更改主题

### 使用useState()

将[ThemeDefinition](#ThemeDefinition)使用`useState`控制即可

```tsx
import {Button, Card, ThemeDefinition, ThemeProvider} from '@canlooks/can-ui'

const lightTheme = {
    mode: 'light',
    colors: {
        primary: '#1E71EC'
    }
}

const darkTheme = {
    mode: 'dark',
    colors: {
        primary: '#9A68C6'
    }
}

export default function Index() {
    const [theme, setTheme] = React.useState<ThemeDefinition>(lightTheme)

    const toggleHandler = () => {
        setTheme(theme.mode === 'light' ? darkTheme : lightTheme)
    }
    
    return (
        <ThemeProvider theme={theme}>
            <Card elevation={5}>
                <Button onClick={toggleHandler}>Toggle</Button>
            </Card>
        </ThemeProvider>
    )
}
```

### 使用theme.update()

`theme`对象内置`update()`方法

```tsx no-preview
export default function Index() {
    const {update} = useTheme()

    const changeTheme = () => {
        update({
            colors: {
                primary: '#9A68C6'
            }
        })
    }

    // ...
}
```