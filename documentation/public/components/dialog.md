_# Dialog 对话框

## 示例

```tsx
import {Button, Dialog} from '@canlooks/can-ui'

export default function Index() {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>打开对话框</Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                icon={<Icon icon={faUser}/>}
                title="这是标题"
            >
                这里是对话框的内容
            </Dialog>
        </>
    )
}
```

## Props

| 属性             | 类型                                | 默认值   | 说明              |
|----------------|-----------------------------------|-------|-----------------|
| icon           | ReactNode                         | -     |                 |
| title          | ReactNode                         | -     |                 |
| footer         | ReactNode                         | -     |                 |
| suffix         | ReactNode                         | -     |                 |
| prefix         | ReactNode                         | -     |                 |
| width          | number                            | -     |                 |
| minWidth       | number                            | -     |                 |
| maxWidth       | number                            | -     |                 |
| showClose      | boolean                           | true  |                 |_
| closeProps     | [ButtonProps](/components/button#Props) | -     |                 |_
| showConfirm    | boolean                           | true  |                 |
| confirmText    | ReactNode                         | '确定'  |                 |
| confirmProps   | [ButtonProps](/components/button#Props) | -     |                 |
| onConfirm      | (e) => void                       | -     |                 |
| confirmLoading | boolean                           | false | 确定按钮的loading状态  |
| showCancel     | boolean                           | true  |                 |
| cancelText     | ReactNode                         | '确定'  |                 |
| cancelProps    | [ButtonProps](/components/button#Props) | -     |                 |
| onCancel       | (e) => void                       | -     |                 |
| draggable      | boolean                           | true  | 对话框是否可拖拽        |
| maskClosable   | boolean                           | true  | 点击遮罩层是否可关闭对话框   |
| escapeClosable | boolean                           | true  | 点击`ESC`是否可关闭对话框 |
| defaultOpen    | boolean                           | false |                 |
| open           | boolean                           | false |                 |
| onClose        | (reason: string) => void          | -     |                 |
