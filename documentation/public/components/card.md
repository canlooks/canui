# Card 卡片

## 示例

```tsx
import {Card, Flex} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex gap={12} wrap="wrap">
            <Card>Card</Card>
            <Card bordered>Card</Card>
            <Card elevation={1}>Card</Card>
            <Card elevation={2}>Card</Card>
            <Card elevation={3}>Card</Card>
            <Card elevation={4}>Card</Card>
            <Card elevation={5}>Card</Card>
        </Flex>
    )
}
```

## Props

| 属性           | 类型      | 默认值                                | 说明             |
|--------------|---------|------------------------------------|----------------|
| flexable     | boolean | false                              | 卡片内容是否使用flex布局 |
| bordered     | boolean | false                              | 是否渲染边框         |
| elevation    | number  | 0                                  | 支持0-5          |
| borderRadius | number  | [Theme.borderRadius](/guide/theme) | 圆角             |
