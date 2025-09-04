# BottomNavigation 底部导航

## 示例

```tsx
import {BottomNavigation, Icon} from '@canlooks/can-ui'
import {faUser} from '@fortawesome/free-solid-svg-icons'

export default function Index() {
    return (
        <div style={{
            width: '100%',
            height: 56,
            position: 'relative'
        }}>
            <BottomNavigation
                items={[
                    {value: 'index', label: '首页'},
                    {value: 'about', label: '关于'},
                    {value: 'me', label: '我的', icon: <Icon icon={faUser}/>},
                ]}
            />
        </div>
    )
}
```

## Props

| 属性                | 类型                                                                                                                          | 默认值                                   | 说明              |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------|---------------------------------------|-----------------|
| items             | {<br/>value: string,<br/>icon: ReactNode,<br/>label: ReactNode,<br/>showLabelInactive: boolean,<br/>active: boolean<br/>}[] | -                                     |                 |
| showLabelInactive | boolean                                                                                                                     | items数量小于等于3时默认为`true`<br/>否则为`false` | 未激活状态下是否显示label |
| primaryKey        | string \| number                                                                                                            | 'value'                               | 选项的主键           |
| labelKey          | string \| number                                                                                                            | 'label'                               | 作为`label`的键     |
| defaultValue      | string \| number                                                                                                            | -                                     | 默认值             |
| value             | string \| number                                                                                                            | -                                     | 受控的值            |
| onChange          | (value) => void                                                                                                             | -                                     | 值变化的回调          |

