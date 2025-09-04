# 图标

## 图标库

CanUI并不内置图标，但对主流的图标库均做了样式适配，你可以使用任何你喜欢的图标库，比如
- [Font Awesome](https://fontawesome.com/)
- [Material Design Icons](https://materialdesignicons.com/)
- [Ant Design Icons](https://ant.design/components/icon/)
- [Heroicons](https://heroicons.com/)
- [Feather Icons](https://feathericons.com/)
- [Ionicons](https://ionicons.com/)

等等。

CanUI默认使用`Font Awesome`并加入依赖项可直接使用。如果你想使用其他图标库，需要额外安装。

## <Icon\/>

`<Icon/>`组件支持fontAwesome图标库，将fontAwesome导出的图标传入`icon`属性即可。

```tsx
import {Icon} from '@canlooks/can-ui'
import {faUser} from '@fortawesome/free-solid-svg-icons'

export default function Index() {
    return (
        <Icon icon={faUser}/>
    )
}
```

### Props

`<Icon/>`组件的属性继承于`FontAwesomeIconProps`，详情请查看[fontAwesome官方文档](https://fontawesome.com/)

## 其他图标库

使用其他图标库需要额外安装：

### 以Material Design Icons为例

```bash
npm i @mdi/react @mdi/js
```

然后像其官网介绍的那样使用即可：

```tsx no-preview
import Icon from '@mdi/react'
import {mdiAccount} from '@mdi/js'

export default function Index() {
    return (
        <Icon path={mdiAccount} size={1}/>
    )
}
```
