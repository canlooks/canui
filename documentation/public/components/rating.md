# Rating 评分

## 示例

```tsx
import {Flex, Rating} from '@canlooks/can-ui'
import React from 'react'

export default function Index() {
    const [value, setValue] = React.useState(1.5)

    return (
        <Flex gap={24}>
            <Rating value={value} onChange={setValue} allowHalf/>
            <div>{value.toFixed(1)}分</div>
        </Flex>
    )
}
```

## Props

| 属性                    | 类型                                                | 默认值       | 说明                                 |
|-----------------------|---------------------------------------------------|-----------|------------------------------------|
| color                 | string                                            | '#FFCC00' |                                    |
| size                  | 'small' \| 'medium' \| 'large'                    | 'medium'  |                                    |
| count                 | number                                            | 5         | 星星的数量                              |
| renderStar            | ReactNode \| ({index, active, half}) => ReactNode | -         | 自定义渲染星星                            |
| allowHalf             | boolean                                           | false     | 允许选中半颗星                            |
| highlightSelectedOnly | boolean                                           | false     | 是否只高亮选中的星星，默认`false`表示从第一颗星开始高亮至选中 |
| defaultValue          | number                                            | -         |                                    |
| value                 | number                                            | -         |                                    |
| onChange              | (value) => void                                   | -         |                                    |
| readOnly              | boolean                                           |           |                                    |
| disabled              | boolean                                           |           |                                    |