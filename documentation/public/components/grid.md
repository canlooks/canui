# Grid 网格布局

## 示例

```tsx
import {Grid} from '@canlooks/can-ui'

export default function Index() {
    return (
        <Grid style={{width: '100%'}}>
            <Grid.Item span={3}>3</Grid.Item>
            <Grid.Item span={7}>7</Grid.Item>
            <Grid.Item span={2}>2</Grid.Item>
        </Grid>
    )
}
```

## GridProps

| 属性          | 类型      | 默认值   | 说明                                   |
|-------------|---------|-------|--------------------------------------|
| inline      | boolean | false | 若指定为`true`，相当于`display: inline-flex` |
| columnCount | number  | 12    |                                      |
| gap         | number  | -     |                                      |
| columnGap   | number  | -     |                                      |
| rowGap      | number  | -     |                                      |

## GridItemProps

| 属性     | 类型     | 默认值 | 说明    |
|--------|--------|-----|-------|
| span   | number | -   | 横跨的列数 |
| offset | number | -   | 偏移的列数 |
