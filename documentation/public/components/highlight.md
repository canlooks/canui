# Highlight 高亮文本

## 示例

```tsx
import {Highlight} from '@canlooks/can-ui'

export default function Index() {
    return (
        <div>
            <Highlight keywords="高亮">高亮文本</Highlight>
        </div>
    )
}
```

## Props

| 属性                 | 类型                          | 默认值 | 说明                 |
|--------------------|-----------------------------|-----|--------------------|
| keywords           | string \| string[]          | -   | 高亮的关键词             |
| highlightClassName | string                      | -   | 高亮元素的类名            |
| highlightStyle     | CSSProperties               | -   | 高亮元素的样式            |
| renderHighlight    | (text: string) => ReactNode | -   | 自定义渲染高亮元素          |
| children           | string                      | -   | 文本，`content`属性的别名  |
| content            | string                      | -   | 文本，`children`属性的别名 |
