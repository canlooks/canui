# DataGrid 数据表格

## 示例

```tsx
import {DataGrid} from '@canlooks/can-ui'

export default function Index() {
    const columns = [
        {
            title: '姓名',
            field: 'name'
        },
        {
            title: '年龄',
            field: 'age',
            sorter: (a: any, b: any) => a.age - b.age
        },
        {
            title: '住址',
            children: [
                {
                    title: '城市',
                    field: 'city'
                },
                {
                    title: '街道',
                    field: 'address'
                }
            ]
        },
    ]

    const rows = [
        {
            id: 1,
            name: '胡彦斌',
            age: 32,
            city: '杭州',
            address: '西湖区湖底公园1号',
        },
        {
            id: 2,
            name: '胡彦祖',
            age: 42,
            city: '杭州',
            address: '西湖区湖底公园2号',
        },
    ]

    return (
        <DataGrid
            columns={columns}
            rows={rows}
            selectable
            bordered
        />
    )
}
```

## DataGrid Props

`<DataGrid/>` 组件继承了[<Table\/>](/components/table)组件的所有属性，除此之外还有以下属性：

| 属性                 | 类型                                                                          | 默认值                                     | 说明                               |
|--------------------|-----------------------------------------------------------------------------|-----------------------------------------|----------------------------------|
| columns            | [ColumnType](#ColumnType)[]                                                 | -                                       | 列的定义                             |
| rows               | Array                                                                       | -                                       | 行数据                              |
| primaryKey         | Id                                                                          | 'id'                                    | 数据的主键                            |
| childrenKey        | Id                                                                          | 'children'                              | 当数据中存在该字段，则会渲染可展开的子行             |
| indent             | number                                                                      | 24                                      | 子行的缩进                            |
| renderExpandIcon   | (key: Id, isExpand: boolean, expanded: Id[]) => void                        | -                                       | 自定义渲染展开按钮                        |
| defaultExpanded    | Id[]                                                                        | []                                      | 默认展开的行                           |
| expanded           | Id[]                                                                        | -                                       | 受控的展开行                           |
| onExpandedChange   | (expanded: Id[], key: Id, isExpand: boolean) => void                        | -                                       | 展开行变化的回调                         |
| rowProps           | (row: R, index: number, rows: R[]) => RowProps                              | -                                       | 传递给`<tr/>`标签的属性                  |
| selectable         | boolean                                                                     | false                                   | 行是否可选择                           |
| clickRowToSelect   | boolean                                                                     | true                                    | 点击行时是否触发选中                       |
| selectorProps      | (row: R, index: number, rows: R[]) => CheckboxProps  \| RadioProps          | -                                       | 传递给`<Checkbox/>`或`<Radiu/>`组件的属性 |
| relation           | 'dependent' \| 'standalone'                                                 | 'dependent'                             | 选中行之间的关系                         |
| integration        | 'shallowest' \| 'deepest'                                          \| 'all' | 'shallowest'                            | 所选值的归集方式                         |
| allowSelectAll     | boolean                                                                     | true                                    |                                  |
| defaultOrderColumn | Id                                                                          | -                                       | 默认排序的列                           |
| orderColumn        | Id                                                                          | -                                       | 受控的排序的列                          |
| defaultOrderType   | 'ascend' \| 'descend'                                                       | 'descend'                               | 默认排序方法                           |
| orderType          | 'ascend' \| 'descend'                                                       | -                                       | 受控的排序方法排序方法                      |
| onOrderChange      | (orderColumn, orderType) => void                                            | -                                       | 排序变化回调                           |
| loading            | boolean                                                                     | false                                   |                                  |
| emptyPlaceholder   | ReactNode                                                                   | [Placeholder/](/components/placeholder) | 空行占位符                            |
| paginatable        | boolean                                                                     | true                                    | 是否使用内置分页                         |
| paginationProps    | [PaginationProps](/components/pagination)                                   | -                                       | 传递给`<Pagination/>`组件的属性          |
| renderPagination   | (paginationProps) => ReactNode                                              | -                                       | 自定义渲染分页器                         |
| multiple           | boolean                                                                     | false                                   | `selectable`指定为`true`时有效         |
| defaultValue       | Id \| Id[]                                                                  | -                                       | `selectable`指定为`true`时有效         |
| value              | Id \| Id[]                                                                  | -                                       | `selectable`指定为`true`时有效         |
| onChange           | (Id \| Id[]) => void                                                        | -                                       | `selectable`指定为`true`时有效         |
| columnResizable    | boolean                                                                     | false                                   | 是否可以拖拽调整列宽，开启该功能后，表头分组将失效        |

## ColumnType

`ColumnType`继承了`<td/>`的所有属性，除此之外还有以下属性：

| 属性       | 类型                                                | 默认值 | 说明                                                                    |
|----------|---------------------------------------------------|-----|-----------------------------------------------------------------------|
| title    | ReactNode                                         | -   | 列标题                                                                   |
| key      | Id                                                | -   | 若不指定，则使用`field`作为key                                                  |
| field    | Id \| Id[]                                        | -   | 该列在数据中对应的字段名                                                          |
| sorter   | boolean \| ((a, b) => number)                     | -   | 指定为`true`时表示使用服务端排序，组件只做样式处理，不做数据排序处理；<br/>本地排序需指定 “正序” 的排序方法，倒序会自动处理 |
| sticky   | 'left' \| 'right'                                 | -   | 是否将列固定在左侧或右侧                                                          |
| children | ColumnType[]                                      | -   | 使用组合的表头                                                               |
| render   | (row: R, index?: number, rows?: R[]) => ReactNode | -   | 单元格内容的渲染方法                                                            |
