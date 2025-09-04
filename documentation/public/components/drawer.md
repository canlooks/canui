# Drawer 抽屉

## 示例

```tsx
import {Button, Drawer} from '@canlooks/can-ui'

export default function Index() {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>打开抽屉</Button>
            <Drawer
                title="抽屉标题"
                open={open}
                onClose={() => setOpen(false)}
            >
                这里是抽屉的内容
            </Drawer>
        </>
    )
}
```

## Props

| 属性             | 类型                                     | 默认值     | 说明                 |
|----------------|----------------------------------------|---------|--------------------|
| title          | ReactNode                              | -       |                    |
| footer         | ReactNode                              | -       |                    |
| showClose      | boolean                                | true    |                    |
| size           | string \| number                       | -       |                    |
| placement      | 'left' \| 'right' \| 'top' \| 'bottom' | 'right' |                    |
| maskClosable   | boolean                                | true    | 点击遮罩层是否可关闭对话框      |
| escapeClosable | boolean                                | true    | 点击`ESC`是否可关闭对话框    |
| defaultOpen    | boolean                                | false   |                    |
| open           | boolean                                | false   |                    |
| onClose        | (reason: string) => void               | -       |                    |
| slideProps     | [SlideProps](/components/transition)   | -       | 传递至`<Slide/>`组件的属性 |
