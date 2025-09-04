# ActionSheet 上拉菜单

## 示例

```tsx
import {ActionSheet} from '@canlooks/can-ui'

export default function Index() {
    const [open, setOpen] = React.useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)}>打开上拉菜单</Button>
            <ActionSheet
                open={open}
                onClose={() => setOpen(false)}
                title="标题"
                actions={[
                    {label: '选项1', onClick: () => console.log('选项1')},
                    {label: '选项2', onClick: () => console.log('选项2')}
                ]}
            />
        </>
    )
}
```

## Props

| 属性             | 类型                                      | 默认值   | 说明                  |
|----------------|-----------------------------------------|-------|---------------------|
| title          | ReactNode                               | -     | 标题                  |
| actions        | [MenuItemProps](/components/menuItem#MenuItemProps)[] | -     | 菜单                  |
| placement      | 'top' \| 'bottom'                       | -     | 弹出菜单的位置             |
| maskClosable   | boolean                                 | false | 是否可通过点击遮罩层关闭对话框     |
| escapeClosable | boolean                                 | true  | 是否可通过键盘的【ESC】键关闭对话框 |
| onAction       | (action) => void                        | -     | 点击选项                |
| onConfirm      | (e) => void                             | -     | 点击确定                |
| onCancel       | (e) => void                             | -     | 点击取消                |
| defaultOpen    | boolean                                 | false | 默认打开状态              |
| open           | boolean                                 | -     | 受控的打开状态             |
| onClose        | (reason) => void                        | -     | 关闭回调                |
| showConfirm    | boolean                                 | false | 是否显示确定选项            |
| confirmText    | ReactNode                               | '确定'  |                     |
| confirmProps   | [MenuItemProps](/components/menuItem#MenuItemProps)   | -     |                     |
| showCancel     | boolean                                 | true  | 是否显示取消选项            |
| cancelText     | ReactNode                               | '取消'  |                     |
| cancelProps    | [MenuItemProps](/components/menuItem#MenuItemProps)   | -     |                     |
| slideProps     | TransitionBaseProps                     | -     | 传递给<Slide/>动画组件的属性  |
