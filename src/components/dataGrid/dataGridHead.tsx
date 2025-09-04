import React, {memo, ReactElement, useMemo} from 'react'
import {classes} from './dataGrid.style'
import {ColumnType, DataGrid, DataGridProps, RowType} from './dataGrid'
import {Id} from '../../types'
import {useRenderHead} from './columnResize'
import {Checkbox} from '../checkbox'
import {Icon} from '../icon'
import {useSelectionContext} from '../selectionContext'
import {Tooltip} from '../tooltip'
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown'
import {Button} from '../button'
import {faFilter} from '@fortawesome/free-solid-svg-icons/faFilter'
import {Bubble} from '../bubble'
import {FilterBubbleContent} from './filterBubbleContent'

interface DataGridHeadProps<R extends RowType, V extends Id = Id> extends Required<Pick<DataGridProps<R, V>,
    | 'primaryKey' | 'orderType' | 'onOrderChange'
    | 'allowSelectAll' | 'columnResizable'
>> {
    rows: R[] | undefined
    orderColumn: Id | undefined
    flattedColumns: (symbol | ColumnType<R>)[] | undefined
    completedColumns: (symbol | ColumnType<R>)[] | undefined

    onFilterClick: DataGridProps<R, V>['onFilterClick']
}

export const DataGridHead = memo(<R extends RowType, V extends Id = Id>({
    allowSelectAll,
    columnResizable,
    flattedColumns,
    completedColumns,
    rows,
    primaryKey,

    orderColumn,
    orderType,
    onOrderChange,

    onFilterClick
}: DataGridHeadProps<R, V>) => {
    const {multiple, setValue, selectionStatus} = useSelectionContext()

    const allSelectionStatus = useMemo(() => {
        if (multiple && allowSelectAll) {
            const sum = rows?.reduce((prev, row) => {
                const status = selectionStatus.get(row[primaryKey!]) || 0
                return prev + status
            }, 0) || 0
            return sum === 0 ? 0 : sum < rows!.length * 2 ? 1 : 2
        }
        return 0
    }, [selectionStatus, multiple, allowSelectAll])

    const selectAllChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.checked
            ? setValue(rows?.flatMap(r => r[primaryKey!] ?? []) || [])
            : setValue([])
    }

    const renderedHead = useRenderHead(Column => {
        const columnDefinitions = columnResizable ? flattedColumns : completedColumns
        if (!columnDefinitions) {
            return
        }

        let headRows: (ColumnType<R> | symbol)[][] = []
        if (columnResizable) {
            headRows = [columnDefinitions]
        } else {
            // 处理表头分组情况
            const fn = (cols?: (ColumnType<R> | symbol)[], depth = 0) => {
                let colSpan = 0
                cols?.forEach(col => {
                    if (typeof col !== 'symbol') {
                        if (col.children?.length) {
                            col.colSpan = fn(col.children, depth + 1)
                            colSpan += col.colSpan
                            col.rowSpan = 1
                            ;(col as any)['data-grouped'] = 'true'
                        } else {
                            col._negativeRowSpan = depth
                            colSpan++
                        }
                    }
                    headRows[depth] ||= []
                    headRows[depth].push(col)
                })
                return colSpan
            }
            fn(columnDefinitions)
        }

        return headRows.map((cols, i) =>
            <tr key={i}>
                {cols.flatMap((col, j) => {
                    if (typeof col === 'symbol') {
                        if (col === DataGrid.EXPAND_COLUMN) {
                            return []
                        }
                        // col === DataGrid.SELECT_COLUMN
                        return [
                            <Column
                                key={j + '_selectable'}
                                className={classes.selectable}
                                rowSpan={headRows.length}
                                sticky={j === 0 ? 'left' : void 0}
                            >
                                {multiple && allowSelectAll &&
                                    <Checkbox
                                        checked={allSelectionStatus === 2}
                                        indeterminate={allSelectionStatus === 1}
                                        onChange={selectAllChangeHandler}
                                    />
                                }
                            </Column>
                        ]
                    }
                    const {
                        // 排除无需加入dom节点的属性
                        title, key, children, sticky, field, render, sorter, filter,
                        _key, _negativeRowSpan = 0,
                        ...colProps
                    } = col
                    const sortable = sorter && !children?.length
                    const isOrderingColumn = orderColumn === _key
                    const currentOrderType = isOrderingColumn ? orderType : 'descend'

                    const filterButton = (
                        <Button
                            className={classes.filterButton}
                            variant="plain"
                            color="text.placeholder"
                            onClick={e => {
                                e.stopPropagation()
                                onFilterClick?.(_key!, e)
                            }}
                        >
                            <Icon icon={faFilter}/>
                        </Button>
                    )

                    return [
                        <Column
                            rowSpan={headRows.length - _negativeRowSpan}
                            {...colProps}
                            key={_key}
                            sticky={sticky}
                            data-sortable={!!sortable}
                            data-ordering={isOrderingColumn}
                            data-order-type={currentOrderType}
                            onClick={e => {
                                colProps.onClick?.(e)
                                sortable && onOrderChange?.(_key!, currentOrderType === 'descend' ? 'ascend' : 'descend')
                            }}
                        >
                            {sortable || filter
                                ? <div className={classes.functionalCell}>
                                    {sortable
                                        ? <>
                                            <Tooltip
                                                title={currentOrderType === 'descend'
                                                    ? '点击升序'
                                                    : '点击降序'
                                                }
                                            >
                                                <div className={classes.title}>{title}</div>
                                            </Tooltip>
                                            <Icon icon={faCaretDown} className={classes.sortIcon}/>
                                        </>
                                        : <div className={classes.title}>{title}</div>
                                    }
                                    {filter &&
                                        <Tooltip
                                            title="筛选"
                                            placement="top"
                                            clickToClose
                                        >
                                            {filter === true
                                                ? filterButton
                                                : <Bubble
                                                    style={{maxWidth: 360}}
                                                    trigger="click"
                                                    placement="bottomRight"
                                                    autoClose={false}
                                                    content={
                                                        <FilterBubbleContent
                                                            columnKey={_key!}
                                                            columnFilterProps={filter}
                                                        />
                                                    }
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    {filterButton}
                                                </Bubble>
                                            }
                                        </Tooltip>
                                    }
                                </div>
                                : title
                            }
                        </Column>
                    ]
                })}
            </tr>
        )
    })

    return <thead>{renderedHead}</thead>
}) as <R extends RowType, V extends Id = Id>(props: DataGridHeadProps<R, V>) => ReactElement