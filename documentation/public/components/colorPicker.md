# ColorPicker 颜色选择

## 示例

```tsx
import {ColorPicker} from '@canlooks/can-ui'

export default function Index() {
    return (
        <ColorPicker/>
    )
}
```

## Props

颜色选择器的值使用`Color`对象，详情请查看[官方文档](https://github.com/Qix-/color)。

| 属性           | 类型                             | 默认值      | 说明    |
|--------------|--------------------------------|----------|-------|
| size         | 'small' \| 'medium' \| 'large' | 'medium' |       |
| shape        | 'square' \| 'circular'         | 'square' |       |
| label        | ReactNode                      | '自定义'    |       |
| presets      | Color[]                        | -        | 预设的颜色 |
| defaultValue | Color                          | -        | 默认的颜色 |
| value        | Color                          | -        | 受控的颜色 |
| onChange     | (Color) => void                | -        | 变化回调  |
