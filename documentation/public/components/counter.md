# Counter 数量输入框

## 示例

```tsx
import {Counter} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Counter/>
    )
}
```

## Props

| 属性            | 类型                                      | 默认值      | 说明              |
|---------------|-----------------------------------------|----------|-----------------|
| size          | 'small' \| 'medium' \| 'large'          | 'medium' |                 |
| min           | number                                  | -        |                 |
| max           | number                                  | -        |                 |
| step          | number                                  | 1        | 每次减少或增加的步长      |
| precision     | number                                  | 0        | 数值精度            |
| defaultValue  | number                                  | -        |                 |
| value         | number                                  | -        |                 |
| onChange      | (value) => void                         | -        |                 |
| decreaseProps | [ButtonProps](/components/button#Props) | -        | 减少按钮的属性         |
| increaseProps | [ButtonProps](/components/button#Props) | -        | 增加按钮的属性         |
| inputProps    | [InputProps](/components/input#Props)   | -        | `<Input/>`组件的属性 |