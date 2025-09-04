# Pagination 分页器

## 示例

若不指定`children`默认会开启所有功能，或者通过`children`指定功能及顺序。

```tsx
import {Flex, Pagination} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Flex direction="column" gap={24}>
            <Pagination total={50}/>

            <Pagination>
                <Pagination.Counter/>
                <Pagination.Pager/>
                <Pagination.Sizer/>
                <Pagination.Jumper/>
            </Pagination>
        </Flex>
    )
}
```

## Props

| 属性               | 类型                             | 默认值      | 说明      |
|------------------|--------------------------------|----------|---------|
| size             | 'small' \| 'medium' \| 'large' | 'medium' |         |
| total            | number                         |          | 数据的总条数  |
| defaultPage      | number                         |          | 页码，从1开始 |
| page             | number                         |          |         |
| onPageChange     | (page) => void                 |          |         |
| defaultPageSize  | number                         | 10       | 每页的条数   |
| pageSize         | number                         |          |         |
| onPageSizeChange | (pageSize) => void             |          |         |
| onChange         | (page, pageSize) => void       |          |         |