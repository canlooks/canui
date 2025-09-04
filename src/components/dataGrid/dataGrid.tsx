import React, {ComponentProps, createContext, memo, ReactElement, ReactNode, useCallback, useContext, useMemo, useState} from 'react'
import {classes, style} from './dataGrid.style'
import {DivProps, Id, Obj, ToRequired} from '../../types'
import {SelectionContext, SelectionContextProps, useSelectionContext} from '../selectionContext'
import {Pagination, PaginationProps} from '../pagination'
import {Table, TableContainer, TableProps} from '../table'
import {CheckboxProps} from '../checkbox'
import {RadioProps} from '../radio'
import {clsx, cloneRef, FieldPath, useControlled, useDataGridColumns, useSync, mergeComponentProps} from '../../utils'
import {Loading} from '../loading'
import {DataGridHead} from './dataGridHead'
import {Placeholder} from '../placeholder'
import {DataGridRows} from './dataGridRows'
import {ColumnResizeContext} from './columnResize'
import {Form, FormProps, FormValue} from '../form'
import {FilterControlProps, FilterOptionsProps} from './filterBubbleContent'

export type RowType = Obj

export interface ColumnType<R extends RowType = RowType> extends Omit<ComponentProps<'td'>, 'key' | 'ref' | 'title' | 'children'>,
    Omit<ComponentProps<'th'>, 'key' | 'ref' | 'title' | 'children'> {
    title?: ReactNode
    /** 若不指定key，默认使用{@link field}作为key */
    key?: string | number
    children?: ColumnType<R>[]
    /** 是否将列固定在左侧或右侧 */
    sticky?: 'left' | 'right'

    /** 指定children后，下列属性均不生效 */
    field?: FieldPath
    render?(row: R, index?: number, rows?: R[]): ReactNode
    /**
     * @enum true 使用服务端排序，组件只做样式处理，不做数据排序处理；
     * @enum function 本地排序需指定 `正序` 的排序方法，倒序会自动处理
     */
    sorter?: boolean | ((a: R, b: R) => number)
    /**
     * @enum true 不会弹出气泡框，需配合{@link DataGridBaseProps.onFilterClick}实现筛选逻辑
     * @enum FilterOptionsProps 传递至`OptionsBase`组件
     * @enum FilterControlProps 自定义渲染气泡内容
     */
    filter?: boolean | FilterOptionsProps | FilterControlProps

    /** @private 内部使用，在{@link useDataGridColumns}内赋值 */
    _key?: Id
    /** @private 内部使用，在{@link DataGridHead}内计算 */
    _negativeRowSpan?: number
}

// props与context共享的属性
type DataGridSharedProps<R extends RowType = RowType> = {
    rowProps?(row: R, index: number, rows: R[]): ComponentProps<'tr'>

    /** 数据的主键名，默认为`id` */
    primaryKey?: keyof R
    /**
     * 当数据中存在该字段，则会渲染可展开的子行，默认为`null`，表示不使用子行功能,
     * children允许的值类型：
     * @types {R[] | ReactNode | ((parent: R, expanded: boolean) => ReactNode)}
     */
    childrenKey?: keyof R | null

    /** 点击行时是否触发选中，默认为`true` */
    clickRowToSelect?: boolean

    /** 子行缩进，默认为`24` */
    indent?: number
    renderExpandIcon?(key: Id, isExpand: boolean, expanded: Id[]): ReactNode
}

export type OrderType = 'ascend' | 'descend'

export interface DataGridBaseProps<R extends RowType = RowType> extends DataGridSharedProps<R>,
    Omit<DivProps, 'defaultValue' | 'onChange'> {
    columns?: (ColumnType<R> | symbol)[]
    rows?: R[]

    filterProps?: FormProps
    initialFilterValue?: FormValue
    onFilter?(filterValue: FormValue): void
    onFilterClick?(column: Id, e: React.MouseEvent<HTMLButtonElement>): void
    /** 若需要本地筛选，必须指定该方法 */
    filterPredicate?(row: R, index: number, filterValue: FormValue): any

    defaultOrderColumn?: Id
    orderColumn?: Id
    defaultOrderType?: OrderType
    orderType?: OrderType
    onOrderChange?(orderColumn: Id, orderType: OrderType): void

    selectable?: boolean
    /**
     * 行之间的关系
     * @enum {'dependent'}：会自动判断子父行的选中关系。
     * @enum {'standalone'}：所有行相互独立
     * 默认为"dependent"
     */
    relation?: SelectionContextProps<R>['relation']
    integration?: SelectionContextProps<R>['integration']
    /** 是否允许全选，默认为true */
    allowSelectAll?: boolean

    selectorProps?(row: R, index: number, rows: R[]): CheckboxProps | RadioProps

    defaultExpanded?: Id[]
    expanded?: Id[]
    onExpandedChange?(expanded: Id[], key: Id, isExpand: boolean): void

    /** 是否内置翻页，默认为true */
    paginatable?: boolean
    paginationProps?: PaginationProps
    renderPagination?(props: PaginationProps): ReactNode

    loading?: boolean
    emptyPlaceholder?: ReactNode
    /** 是否可以拖拽调整列宽，默认为`false`，开启此功能后表头分组功能将失效 */
    columnResizable?: boolean
    /** 传递给<Table />的属性 */
    size?: TableProps['size']
    bordered?: TableProps['bordered']
    striped?: TableProps['striped']
    tableProps?: TableProps
}

export interface DataGridSingleProps<R extends RowType = RowType, V extends Id = Id> extends DataGridBaseProps<R> {
    multiple?: false
    defaultValue?: V
    value?: V
    onChange?(value: V): void
}

export interface DataGridMultipleProps<R extends RowType = RowType, V extends Id = Id> extends DataGridBaseProps<R> {
    multiple: true
    defaultValue?: V[]
    value?: V[]
    onChange?(value: V[]): void
}

export type DataGridProps<R extends RowType = RowType, V extends Id = Id> = DataGridSingleProps<R, V> | DataGridMultipleProps<R, V>

interface IDataGridContext<R extends RowType = RowType> extends ToRequired<DataGridSharedProps<R>, 'primaryKey' | 'childrenKey' | 'clickRowToSelect' | 'indent'> {
    expandedSet: Set<Id>
    flattedColumns: (symbol | ColumnType<R>)[] | undefined
    toggleExpanded(key: Id): void
}

const DataGridContext = createContext({} as IDataGridContext<any>)

export function useDataGridContext<R extends RowType>(): IDataGridContext<R> {
    return useContext(DataGridContext)
}

export const DataGrid = memo(<R extends RowType = RowType, V extends Id = Id>({
    columns,
    rows,
    rowProps,
    primaryKey = 'id',
    childrenKey = null,

    filterProps,
    initialFilterValue,
    onFilter,
    onFilterClick,
    filterPredicate,

    defaultOrderColumn,
    orderColumn,
    defaultOrderType = 'descend',
    orderType,
    onOrderChange,

    selectable,
    relation = 'dependent',
    integration = 'shallowest',
    allowSelectAll = true,
    clickRowToSelect = true,
    selectorProps,

    indent = 24,
    renderExpandIcon,
    defaultExpanded,
    expanded,
    onExpandedChange,

    paginatable = true,
    paginationProps,
    renderPagination,

    loading,
    emptyPlaceholder,
    columnResizable = false,
    size,
    bordered,
    striped,
    tableProps,

    multiple,
    defaultValue,
    value,
    onChange,
    ...props
}: DataGridProps<R, V>) => {
    /**
     * ---------------------------------------------------------------
     * 选择行
     */

    const {inSelection, disabled} = useSelectionContext()
    // 在SelectionContext内，且未disabled，需要默认打开selectable
    selectable ??= inSelection && !disabled

    /**
     * ---------------------------------------------------------------
     * 处理列
     */

    const {completedColumns, columnMapByKey, flattedColumns} = useDataGridColumns({
        columns, selectable, childrenKey
    })

    /**
     * ---------------------------------------------------------------
     * 筛选
     */

    const [innerFilterValue, setInnerFilterValue] = useState(initialFilterValue || {})

    const filterHandler = (value: FormValue) => {
        onFilter?.(value)
        filterPredicate && setInnerFilterValue(value)
    }

    const filteredRows = useMemo(() => {
        if (!filterPredicate) {
            return rows
        }
        return rows?.filter((row, index) => {
            return filterPredicate(row, index, innerFilterValue)
        })
    }, [rows, innerFilterValue, filterPredicate])

    /**
     * ---------------------------------------------------------------
     * 排序
     */

    const [innerOrderColumn, setInnerOrderColumn] = useControlled(() => {
        return defaultOrderColumn ?? (flattedColumns
            ?.find(col => typeof col !== 'symbol' && typeof col.sorter === 'function') as ColumnType<R>)
            ?._key
    }, orderColumn)

    const [innerOrderType, setInnerOrderType] = useControlled(defaultOrderType, orderType)

    const syncOnOrderChange = useSync(onOrderChange)

    const orderChangeHandler = useCallback((orderColumn: string, orderType: OrderType) => {
        syncOnOrderChange.current?.(orderColumn, orderType)
        setInnerOrderColumn(orderColumn)
        setInnerOrderType(orderType)
    }, [])

    const orderedRows = useMemo(() => {
        if (!innerOrderColumn.current) {
            return filteredRows
        }
        const orderingColumn = columnMapByKey.get(innerOrderColumn.current)
        if (!orderingColumn?.sorter || typeof orderingColumn.sorter !== 'function') {
            return filteredRows
        }
        return filteredRows?.toSorted((a, b) => {
            const ret = (orderingColumn.sorter as any)(a, b)
            return innerOrderType.current === 'ascend' ? ret : -ret
        })
    }, [filteredRows, innerOrderColumn.current, innerOrderType.current, columnMapByKey])

    /**
     * ---------------------------------------------------------------
     * 展开行
     */

    const [innerExpanded, setInnerExpanded] = useControlled(defaultExpanded || [], expanded)

    const expandedSet = useMemo(() => {
        return new Set(innerExpanded.current)
    }, [innerExpanded.current])

    const syncOnExpandedChange = useSync(onExpandedChange)

    const toggleExpanded = useCallback((key: Id) => {
        const currentExpanded = expandedSet.has(key)
        setInnerExpanded(o => {
            const newExpanded = currentExpanded
                ? o.filter(v => v !== key)
                : [...o, key]
            syncOnExpandedChange.current?.(newExpanded, key, !currentExpanded)
            return newExpanded
        })
    }, [])

    /**
     * ---------------------------------------------------------------
     * 分页
     */

    paginationProps ||= {}
    const [innerPage, setInnerPage] = useControlled(paginationProps.defaultPage ?? 1, paginationProps.page, paginationProps.onPageChange)
    const [innerPageSize, setInnerPageSize] = useControlled(paginationProps.defaultPageSize ?? 10, paginationProps.pageSize, paginationProps.onPageSizeChange)

    const pageChangeHandler = (page: number, pageSize: number) => {
        paginationProps.onChange?.(page, pageSize)
        setInnerPage(page)
        setInnerPageSize(pageSize)
    }

    const _paginationProps: PaginationProps = {
        total: rows?.length,
        ...paginationProps,
        page: innerPage.current,
        pageSize: innerPageSize.current,
        onChange: pageChangeHandler
    }

    const renderPaginationFn = () => {
        return renderPagination
            ? renderPagination(_paginationProps)
            : <Pagination {..._paginationProps}/>
    }

    const paginatedRows = useMemo(() => {
        if (!paginatable) {
            return orderedRows
        }
        const {page, pageSize} = _paginationProps
        return orderedRows?.slice((page! - 1) * pageSize!, page! * pageSize!)
    }, [orderedRows, _paginationProps.page, _paginationProps.pageSize, paginatable])

    return (
        <Loading
            fill={false}
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            open={loading}
            data-column-resizable={columnResizable}
        >
            <Form
                {...mergeComponentProps<FormProps>(
                    {
                        variant: 'plain',
                        initialValue: innerFilterValue
                    },
                    filterProps,
                    {
                        className: classes.filterForm,
                        onFinish: filterHandler
                    }
                )}
            >
                <ColumnResizeContext columnResizable={columnResizable}>
                    {({scrollerRef, tableRef}) =>
                        <TableContainer ref={scrollerRef} className={classes.container}>
                            <Table
                                size={size}
                                bordered={bordered}
                                striped={striped}
                                {...tableProps}
                                ref={cloneRef(tableProps?.ref, tableRef)}
                            >
                                <SelectionContext
                                    options={rows}
                                    primaryKey={primaryKey}
                                    childrenKey={childrenKey !== null ? childrenKey : void 0}
                                    relation={relation}
                                    integration={integration}
                                    disabled={!selectable}
                                    multiple={multiple}
                                    defaultValue={defaultValue as any}
                                    value={value as any}
                                    onChange={onChange as any}
                                >
                                    <DataGridHead
                                        rows={rows}
                                        flattedColumns={flattedColumns}
                                        completedColumns={completedColumns}

                                        primaryKey={primaryKey}
                                        allowSelectAll={allowSelectAll}
                                        columnResizable={columnResizable}

                                        orderColumn={innerOrderColumn.current}
                                        orderType={innerOrderType.current}
                                        onOrderChange={orderChangeHandler}

                                        onFilterClick={onFilterClick}
                                    />
                                    <tbody>
                                    <DataGridContext value={
                                        useMemo(() => ({
                                            rowProps, primaryKey, childrenKey, clickRowToSelect, indent, renderExpandIcon,
                                            expandedSet, flattedColumns, toggleExpanded
                                        }), [
                                            rowProps, primaryKey, childrenKey, clickRowToSelect, indent, renderExpandIcon,
                                            expandedSet, flattedColumns
                                        ])
                                    }>
                                        {!!paginatedRows?.length &&
                                            <DataGridRows rows={paginatedRows}/>
                                        }
                                    </DataGridContext>
                                    </tbody>
                                </SelectionContext>
                            </Table>
                            {!paginatedRows?.length && (
                                emptyPlaceholder ?? <Placeholder className={classes.empty}/>
                            )}
                        </TableContainer>
                    }
                </ColumnResizeContext>
            </Form>
            {renderPaginationFn()}
        </Loading>
    )
}) as any as {
    <R extends RowType, V extends Id = Id>(props: DataGridProps<R, V>): ReactElement
    EXPAND_COLUMN: symbol
    SELECT_COLUMN: symbol
}

DataGrid.EXPAND_COLUMN = Symbol('expand-column')
DataGrid.SELECT_COLUMN = Symbol('select-column')