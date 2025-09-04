# BubbleConfirm 气泡确认框

## 示例

```tsx
import {BubbleConfirm, Button} from '@canlooks/can-ui'

export default function Index() {
    const onConfirm = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return (
        <BubbleConfirm
            title="这里是标题"
            content="这里是气泡确认框的内容"
            onConfirm={onConfirm}
        >
            <Button>确认</Button>
        </BubbleConfirm>
    )
}
```

## Props

| 属性        | 类型          | 默认值   | 说明                                |
|-----------|-------------|-------|-----------------------------------|
| icon      | ReactNode   | -     |                                   |
| title     | ReactNode   | -     |                                   |
| footer    | ReactNode   | -     | 自定以渲染footer，若不指定则使用默认的`取消`与`确定`按钮 |
| showArrow | boolean     | true  | 是否显示气泡的箭头                         |
| loading   | boolean     | false |                                   |
| onConfirm | (e) => void | -     | 确认回调                              |
