# Autocomplete 自动填充

## 基础示例

```tsx
import {Autocomplete} from '@canlooks/can-ui'

export default function Index() {
    const options = [
        {label: 'Apple', value: 'apple'},
        {label: 'Banana', value: 'banana'},
        {label: 'Cherry', value: 'cherry'}
    ]

    return (
        <Autocomplete
            style={{width: 300}}
            options={options}
        />
    )
}
```

## 动态数据

```tsx
import {Autocomplete} from '@canlooks/can-ui'

export default function Index() {
    const [options, setOptions] = React.useState([])

    const loadOptions = (inputValue: string) => {
        return new Promise((resolve) => {
            inputValue
                ? setTimeout(() => {
                    resolve([
                        {label: 'Apple', value: 'apple'},
                        {label: 'Banana', value: 'banana'},
                        {label: 'Cherry', value: 'cherry'}
                    ])
                }, 1000)
                : resolve([])
        })
    }

    return (
        <Autocomplete
            style={{width: 300}}
            loadOptions={loadOptions}
        />
    )
}
```

## Props

`<Autocomplete/>`组件继承了`<Input/>`组件的所有属性外，还有如下属性：

| 属性          | 类型                                                    | 默认值     | 说明               |
|-------------|-------------------------------------------------------|---------|------------------|
| options     | [MenuItemProps](/components/menuItem#MenuItemProps)[] | -       | 选项               |
| loadOptions | (inputValue) => options \| Promise\<options>          | -       | 动态加载的选项          |
| primaryKey  | string \| number                                      | 'value' | 指定选项中的主键名        |
| labelKey    | string \| number                                      | 'label' | 指定选项中用于当作label的键 |
| onSelect    | (selectedValue, option) => void                       | -       | 选中回调             |
| renderInput | (inputProps) => ReactElement                          | -       | 自定义渲染输入框         |
| popperProps | [PopperProps](/components/popper)                     | -       | 传递给`Popper`组件的属性 |
| popperRef   | [PopperRef](/components/popper)                       | -       |                  |
