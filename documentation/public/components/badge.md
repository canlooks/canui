# Badge 角标

## 示例

```tsx
import {Badge, Flex} from '@canlooks/can-ui'
import {faUser} from '@fortawesome/free-solid-svg-icons'

export default function Index() {
    return (
        <Flex alignItems="center" justifyContent="center" gap={24}>
            <Badge count={100}>
                <Avatar>
                    <Icon icon={faUser}/>
                </Avatar>
            </Badge>
        </Flex>
    )
}
```

## Props

| 属性        | 类型                  | 默认值        | 说明            |
|-----------|---------------------|------------|---------------|
| count     | number              | -          | 角标数值          |
| color     | string              | 'error'    | 颜色            |
| placement | string              | 'topRight' | 位置            |
| variant   | 'dot' \| 'standard' | 'standard' | 角标样式          |
| max       | number              | 99         | 最大数值，超过会显示`+` |
| showZero  | boolean             | false      | 数量为0时是否显示角标   |
| offsetX   | number              | 0          | 位置偏移量         |
| offsetY   | number              | 0          | 位置偏移量         |