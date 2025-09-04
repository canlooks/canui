# Flex 弹性布局

## 示例

```tsx
import {Flex} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex width="100%">
            <Flex flex={1}>1</Flex>
            <Flex flex={1}>2</Flex>
        </Flex>
    )
}
```

## Props

`<Flex/>`組件的属性继承于`CSSProperties`