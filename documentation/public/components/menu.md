# Menu 菜单

## Menu示例

```tsx
import {Menu} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Menu
            style={{width: 300}}
            items={[
                {label: '选项1', value: 1},
                {label: '选项2', value: 2},
            ]}
        />
    )
}
```

## menuProps

| 属性               | 类型                                                  | 默认值     | 说明                               |
|------------------|-----------------------------------------------------|---------|----------------------------------|
| items            | [MenuItemProps](#menuItemProps)[]                   | -       |                                  |
| primaryKey       | string \| number                                    | 'value' | item中的主键                         |
| labelKey         | string \| number                                    | 'value' | item中作为label的键                   |
| childrenKey      | string \| number                                    | 'value' | item中作为children的键，若存在该字段，则会渲染子菜单 |
| defaultExpanded  | (string \| number)[]                                | -       |                                  |
| expanded         | (string \| number)[]                                | -       |                                  |
| onExpandedChange | (expanded) => void                                  | -       |                                  |
| multiple         | boolean                                             | false   | 是否支持多选                           |
| defaultValue     | string \| number \| (string \| number)[]            |         |                                  |
| value            | string \| number \| (string \| number)[]            |         |                                  |
| onChange         | (value) => void                                     |         |                                  |
| size             | 'small' \| 'medium'                      \| 'large' | 'large' |                                  |
| showCheckbox     | boolean                                             | false   |                                  |
| ellipsis         | boolean                                             | false   |                                  |
| indent           | number                                              | 24      |                                  |

## MenuItem可单独使用

```tsx
import {MenuItem} from '@canlooks/can-ui'
import {Icon} from '@canlooks/can-ui'
import {faUser} from '@fortawesome/free-solid-svg-icons'

export default function Index() {
    return (
        <div style={{width: 300}}>
            <MenuItem
                prefix={<Icon icon={faUser}/>}
                label="选项1"
                suffix="这是一个选项"
                selected
                defaultExpanded
            >
                <MenuItem label="选项1-1"/>
                <MenuItem label="选项1-2"/>
            </MenuItem>
        </div>
    )
}
```

## MenuItemProps

| 属性               | 类型                                                  | 默认值     | 说明                                           |
|------------------|-----------------------------------------------------|---------|----------------------------------------------|
| size             | 'small' \| 'medium'                      \| 'large' | 'large' |                                              |
| color            | string                                              | -       |                                              |
| emphasized       | boolean                                             | false   | 是否强调颜色，如果指定了`color`建议同时指定`emphasized`为`true` |
| selected         | boolean                                             | false   | 是否选中状态                                       |
| disabled         | boolean                                             | false   |                                              |
| showCheckbox     | boolean                                             | false   |                                              |
| checkboxProps    | [checkboxProps](/components/checkbox)               | -       |                                              |
| ellipsis         | boolean                                             | false   |                                              |
| prefix           | ReactNode                                           | -       |                                              |
| label            | ReactNode                                           | -       |                                              |
| suffix           | ReactNode                                           | -       |                                              |
| indent           | number                                              | 24      |                                              |
| expandIcon       | ReactNode                                           | -       |                                              |
| defaultExpanded  | boolean                                             | -       |                                              |
| expanded         | boolean                                             | -       |                                              |
| onExpandedChange | (expanded) => void                                  | -       |                                              |
