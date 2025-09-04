# ContextMenu 右键菜单

## 示例

```tsx
import {ContextMenu} from '@canlooks/can-ui'

export default function Index() {
    return (
        <ContextMenu items={[
            {label: '菜单1', onClick: () => console.log('菜单1')},
            {label: '菜单2', onClick: () => console.log('菜单2')},
            {label: '菜单3', onClick: () => console.log('菜单3'), color: 'error', emphasized: true}
        ]}>
            <Card elevation={2}>请点击右键</Card>
        </ContextMenu>
    )
}
```

## Props

`<ContextMenu/>`继承了`<Popper/>`组件的所有属性，除此之外还有：

| 属性    | 类型                                                     | 默认值 | 说明 |
|-------|--------------------------------------------------------|-----|----|
| items | ([MenuItemProps](/components/menuItem#MenuItemProps) \| ReactNode)[] | -   |    |
