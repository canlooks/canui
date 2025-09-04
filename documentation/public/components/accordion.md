# Accordion 手风琴

## 示例

```tsx
import {Accordion, Flex} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex width="100%" direction="column" compact>
            <Accordion title="标题1">
                内容1
            </Accordion>
            <Accordion title="标题2">
                内容2
            </Accordion>
            <Accordion title="标题3">
                内容3
            </Accordion>
        </>
    )
}
```

## Props

| 属性               | 类型                                                  | 默认值        | 说明                               |
|------------------|-----------------------------------------------------|------------|----------------------------------|
| size             | 'small' \| 'medium'                      \| 'large' | Theme.size | 组件的尺寸，默认由[Theme](/guide/theme)传递 |
| title            | ReactNode                                           | -          | 标题                               |
| prefix           | ReactNode                                           | -          | 标题的前缀                            |
| suffix           | ReactNode                                           | -          | 标题的后缀                            |
| expandIcon       | ReactNode \| ((expanded: boolean) => ReactNode)     | -          | 展开与折叠图标                          |
| defaultExpanded  | boolean                                             | false      | 默认展开状态                           |
| expanded         | boolean                                             | -          | 受控的展开状态                          |
| onExpandedChange | (expanded: boolean) => void                         | -          | 展开回调                             |
| readOnly         | boolean                                             | false      |                                  |
| disabled         | boolean                                             | false      |                                  |
