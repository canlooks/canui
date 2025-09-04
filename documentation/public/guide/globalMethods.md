# 全局方法

## App.dialog

- `App.dialog.info(props, [...args])`
- `App.dialog.success(props, [...args])`
- `App.dialog.warning(props, [...args])`
- `App.dialog.error(props, [...args])`
- `App.dialog.confirm(props, [...args])`

`args`会传递至`props.onConfirm`与`props.onCancel`回调中

```tsx
import {App, Flex, Button} from '@canlooks/can-ui'

export default function Index() {
    const onClick = async (type: 'info' | 'success' | 'warning' | 'error' | 'confirm') => {
        await App.dialog[type]({
            title: '对话框',
            content: '这是一个对话框'
        })
    }

    return (
        <Flex gap={12} wrap="wrap">
            <Button onClick={() => onClick('info')}>info</Button>
            <Button onClick={() => onClick('success')}>success</Button>
            <Button onClick={() => onClick('warning')}>warning</Button>
            <Button onClick={() => onClick('error')}>error</Button>
            <Button onClick={() => onClick('confirm')}>confirm</Button>
        </Flex>
    )
}
```

### dialog props

| 属性                | 类型                                   | 默认值                                  | 说明                                                             |
|-------------------|--------------------------------------|--------------------------------------|----------------------------------------------------------------|
| icon              | ReactNode                            | [<StatusIcon\/>](/components/status) |                                                                |
| title             | ReactNode                            |                                      |                                                                |
| footer            | ReactNode                            |                                      |                                                                |
| prefix            | ReactNode                            |                                      |                                                                |
| suffix            | ReactNode                            |                                      |                                                                |
| content           | ReactNode                            |                                      |                                                                |
| width             | string \| number                     | 360                                  | 对话框的宽度                                                         |
| minWidth          | string \| number                     |                                      |                                                                |
| maxWidth          | string \| number                     | 100%                                 |                                                                |
| showClose         | boolean                              |                                      | 是否显示关闭按钮                                                       |
| closeProps        | [ButtonProps](/components/button#Props)    |                                      |                                                                |
| showConfirm       | boolean                              | true                                 | 是否显示确定按钮                                                       |
| confirmText       | ReactNode                            | '确定'                                 |                                                                |
| confirmProps      | [ButtonProps](/components/button#Props)    |                                      |                                                                |
| onConfirm         | (...args) => void                    |                                      |                                                                |
| confirmLoading    | boolean                              |                                      | 确定按钮的加载状态                                                      |
| showCancel        | boolean                              | true                                 | 取消按钮                                                           |
| cancelText        | ReactNode                            | '取消'                                 |                                                                |
| cancelProps       | [ButtonProps](/components/button#Props)    |                                      |                                                                |
| onCancel          | (...args) => void                    |                                      |                                                                |
| draggable         | boolean                              |                                      | 对话框是否可拖拽                                                       |
| maskClosable      | boolean                              | true                                 | 是否可以点击遮罩层关闭                                                    |
| onMaskClick       | MouseEventHandler                    |                                      | 点击遮罩层                                                          |
| escapeClosable    | boolean                              | false                                | 是否可以点击`ESC`关闭                                                  |
| defaultOpen       | boolean                              |                                      | 打开状态                                                           |
| open              | boolean                              |                                      | 受控的打开状态                                                        |
| onOpened          | () => void                           | 打开动画结束后                              |                                                                |
| onClose           | (closeReason: string) => void        |                                      |                                                                |
| onClosed          | () => void                           | 关闭动画结束后                              |                                                                |
| container         | Element \| () => Element             | document.body                        | 容器元素，自定义渲染在DOM树的位置                                             |
| forceRender       | boolean                              | undefined                            | `true`-强制渲染<br>`false`-关闭后销毁<br/>`undeinfed`-第一次打开时渲染，后跟随父组件销毁 |
| singleLayer       | boolean                              | true                                 | 是否只显示一层遮罩                                                      |
| removeFocusOnOpen | boolean                              | true                                 | 打开时是否移除当前焦点                                                    |
| modalProps        | [ModalProps](/components/transition) |                                      | 传递给`<Modal/>`组件属性                                              |
| maskProps         | DOMAttributes                        |                                      | 传递给遮罩层元素的属性                                                    |

---

## App.message

- `App.message.info(content|props)`
- `App.message.success(content|props)`
- `App.message.warning(content|props)`
- `App.message.error(content|props)`

```tsx
import {App, Flex, Button} from '@canlooks/can-ui'

export default function Index() {
    const onClick = async (type: 'info' | 'success' | 'warning' | 'error') => {
        await App.message[type]('这是一个消息框')
    }

    return (
        <Flex gap={12} wrap="wrap">
            <Button onClick={() => onClick('info')}>info</Button>
            <Button onClick={() => onClick('success')}>success</Button>
            <Button onClick={() => onClick('warning')}>warning</Button>
            <Button onClick={() => onClick('error')}>error</Button>
        </Flex>
    )
}
```

### message props

| 属性                 | 类型                      | 默认值        | 说明       |
|--------------------|-------------------------|------------|----------|
| variant            | 'filled' \| 'outlined'  | 'outlined' | 弹框的样式    |
| color              | string                  | 'primary'  |          |
| icon               | ReactNode               |            |          |
| title              | ReactNode               |            |          |
| content            | ReactNode               |            |          |
| showClose          | boolean                 | false      | 是否显示关闭按钮 |
| placement          | string                  | 'top'      | 弹框弹出的位置  |
| duration           | number                  | 3000       | 关闭延迟     |
| onAutoClose        | () => void              |            | 自动关闭时    |
| onCloseButtonClick | (e: MouseEvent) => void |            | 点击关闭按钮时  |

---

## App.notification

- `App.message.notification(content|props)`
- `App.message.notification(content|props)`
- `App.message.notification(content|props)`
- `App.message.notification(content|props)`

```tsx
import {App, Flex, Button} from '@canlooks/can-ui'

export default function Index() {
    const onClick = async (type: 'info' | 'success' | 'warning' | 'error') => {
        await App.notification[type]({
            title: '通知',
            content: '这是一个通知框'
        })
    }

    return (
        <Flex gap={12} wrap="wrap">
            <Button onClick={() => onClick('info')}>info</Button>
            <Button onClick={() => onClick('success')}>success</Button>
            <Button onClick={() => onClick('warning')}>warning</Button>
            <Button onClick={() => onClick('error')}>error</Button>
        </Flex>
    )
}
```

---

### notification props

notification方法接受与[message](#message%20props)方法相同的属性

---

## App.actionSheet

- `App.actionSheet.confirm(title|props, [...args])`
- `App.actionSheet.open(props, [...args])`

```tsx
import {App, Flex, Button} from '@canlooks/can-ui'

export default function Index() {
    const onClick = async (type: 'confirm' | 'open') => {
        const selected = await App.actionSheet[type]({
            title: '弹出菜单',
            actions: [
                {label: '选项1'},
                {label: '选项2'}
            ]
        })
    }

    return (
        <Flex gap={12} wrap="wrap">
            <Button onClick={() => onClick('confirm')}>confirm</Button>
            <Button onClick={() => onClick('open')}>open</Button>
        </Flex>
    )
}
```

### actionSheet props

| 属性                | 类型                                   | 默认值                                   | 说明                                                             |
|-------------------|--------------------------------------|---------------------------------------|----------------------------------------------------------------|
| title             | ReactNode                            |                                       |                                                                |
| actions           | ReactNode                            | [MenuItemProps](/components/menuItem#MenuItemProps) |                                                                |
| placement         | 'top' \| 'bottom'                    | 'bottom'                              | 菜单弹出的位置                                                        |
| maskClosable      | boolean                              | true                                  | 是否可以点击遮罩层关闭                                                    |
| escapeClosable    | boolean                              | false                                 | 是否可以点击`ESC`关闭                                                  |
| onAction          | (action) => void                     |                                       | 点击选项                                                           |
| onConfirm         | (e: MouseEvent) => void              |                                       | 点击确定                                                           |
| showConfirm       | boolean                              | true                                  | 是否显示确定选项，`actionSheet.confirm`方法有效                             |
| confirmText       | ReactNode                            | '确定'                                  |                                                                |
| confirmProps      | [ButtonProps](/components/button#Props)    |                                       |                                                                |
| showCancel        | boolean                              | true                                  | 是否显示取消选项，`actionSheet.confirm`方法有效                             |
| cancelText        | ReactNode                            | '取消'                                  |                                                                |
| cancelProps       | [ButtonProps](/components/button#Props)    |                                       |                                                                |
| onCancel          | (e: MouseEvent) => void              |                                       | 点击取消                                                           |
| defaultOpen       | boolean                              |                                       | 打开状态                                                           |
| open              | boolean                              |                                       | 受控的打开状态                                                        |
| onOpened          | () => void                           | 打开动画结束后                               |                                                                |
| onClose           | (closeReason: string) => void        |                                       |                                                                |
| onClosed          | () => void                           | 关闭动画结束后                               |                                                                |
| container         | Element \| () => Element             | document.body                         | 容器元素，自定义渲染在DOM树的位置                                             |
| forceRender       | boolean                              | undefined                             | `true`-强制渲染<br>`false`-关闭后销毁<br/>`undeinfed`-第一次打开时渲染，后跟随父组件销毁 |
| singleLayer       | boolean                              | true                                  | 是否只显示一层遮罩                                                      |
| removeFocusOnOpen | boolean                              | true                                  | 打开时是否移除当前焦点                                                    |
| slideProps        | [SlideProps](/components/transition) |                                       | 传递给`<Slide/>`的属性                                               |
| maskProps         | DOMAttributes                        |                                       | 传递给遮罩层元素的属性                                                    |

---

## useAppContext()

如果你的应用使用了多个`<App/>`（入口组件），比如定义[局部样式](theme)。

此时直接使用App全局方法，可能会导致上下文混淆，因此建议使用`useAppContext()`方法：

```tsx no-preview
import {useAppContext} from '@canlooks/can-ui'

export default function Index() {
    const {dialog, message, notification, actionSheet} = useAppContext()

    const someMethod = () => {
        dialog.confirm({
            title: '对话框'
        })
    }
    
    // ...
}
```