# Skeleton 骨架屏

## 示例

```tsx
import {Flex, Skeleton} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex width="100%" direction="column" gap={24}>
            <Skeleton/>
            <Skeleton.Card/>
            <Skeleton.Table/>
        </Flex>
    )
}
```

## Props

| 属性        | 类型                                       | 默认值       | 说明              |
|-----------|------------------------------------------|-----------|-----------------|
| variant   | 'circular' \| 'rectangular' \| 'rounded' | 'rounded' |                 |
| animation | boolean                                  | true      | 是否播放动画          |
| width     | string \| number                         | -         | 同`style.width`  |
| height    | string \| number                         | -         | 同`style.height` |