# Descriptions 描述列表

## 示例

```tsx
import {Descriptions} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Descriptions
            items={[
                {label: '用户名', content: '张三'},
                {label: '手机号', content: '13800138000'},
                {label: '邮箱', content: 'zhangsan@example.com'},
                {label: '地址', content: '浙江省杭州市西湖区文三路 138 号'}
            ]}
        />
    )
}
```

## Props

| 属性             | 类型                                                             | 默认值             | 说明                                |
|----------------|----------------------------------------------------------------|-----------------|-----------------------------------|
| size           | 'small' \| 'medium' \| 'large'                                 |                 |                                   |
| labelWidth     | number                                                         | -               | label的宽度，`grid`模式有效               |
| colon          | ReactNode                                                      | ':'             | 自定义渲染冒号                           |
| labelPlacement | 'top'                         \| 'bottom' \| 'left' \| 'right' | 'left'          | label的位置，`table`模式仅支持`left`与`top` |
| disableMargin  | boolean                                                        | false           | `grid`模式有效                        |
| disablePadding | boolean                                                        | false           | `table`模式有效                       |
| items          | {label: ReactNode, content: ReactNode}[]                       | -               |                                   |
| itemComponent  | any                                                            | DescriptionItem | 自定义渲染Item组件                       |
| variant        | 'grid' \| 'table'                                              |                 |                                   |
| columnCount    | number                                                         | 3               |                                   |
