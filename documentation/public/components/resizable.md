# Resizable 尺寸调整

## 示例

鼠标可拖拽`left`与`right`之间的边框调整尺寸

```tsx
import {Flex, Resizable} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex width="100%">
            <Resizable
                handlers="r"
                style={{padding: 24, background: 'pink'}}
            >
                left
            </Resizable>
            <Flex
                flex={1}
                style={{padding: 24, background: 'yellow'}}
            >
                right
            </Flex>
        </Flex>
    )
}
```

## Props

| 属性             | 类型                      | 默认值                                          | 说明                   |
|----------------|-------------------------|----------------------------------------------|----------------------|
| variant        | 'mouse' \| 'touch'      | 'mouse'                                      | 触屏端建议使用`touch`       |
| handles        | string \| string[]      | ['t', 'r', 'b', 'l', 'tl', 'tr', 'br', 'bl'] |                      |
| handleSize     | number                  |                                              |                      |
| handleColor    | string                  |                                              |                      |
| handlePosition | 'outside' \| 'inside'   | 'outside'                                    | `variant`为`touch`时生效 |
| fixedRatio     | boolean                 | false                                        | 是否固定长宽比例             |
| onResize       | (width, height) => void | -                                            |                      |
| onResizeEnd    | (width, height) => void | -                                            |                      |