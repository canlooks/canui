import {cloneElement, isValidElement, ReactElement, useMemo, useRef} from 'react'
import {CurdColumn, CurdFormItemProps, CurdProps} from '../components/curd'
import {renderCell, setDefaultColumnKey, useColumnMap} from './dataGrid'
import {ColumnType, RowType} from '../components/dataGrid'
import {Id, Obj} from '../types'
import {useControlled} from './hooks'
import {isUnset} from './utils'
import {FormValue} from '../components/form'

/**
 * 将Curd的Columns转换为FilterItem
 * @param columns
 */
export function columnsToFilterItem(columns?: (CurdColumn<any> | symbol)[]) {
    return columnsTransfer(columns, 'filter')
}

/**
 * 将Curd的Columns转换为FormItem
 * @param columns
 * @param row
 */
export function columnsToFormItem(columns?: (CurdColumn<any> | symbol)[], row?: Obj) {
    return columnsTransfer(columns, 'form', row)
}

function columnsTransfer(columns?: (CurdColumn<any> | symbol)[], type: 'filter' | 'form' = 'filter', row?: any): (CurdFormItemProps | ReactElement)[] | undefined {
    return columns
        ?.flatMap((col, i) => {
            if (typeof col === 'symbol') {
                return []
            }
            let item = typeof col[type] === 'function' ? (col[type] as any)(row) : col[type]
            if (isUnset(item)) {
                return []
            }
            const key = setDefaultColumnKey(col, i)
            if (isValidElement(item)) {
                return item.key ? item : cloneElement(item, {key})
            }
            if (item === true) {
                // item为true当作空对象处理
                item = {}
            }
            if (typeof item === 'object') {
                return {
                    field: col.field,
                    label: col.title,
                    ...item,
                    ...type === 'form' && {
                        children: item.children ?? (
                            row
                                ? renderCell(col, row)
                                : null
                        )
                    },
                    key
                }
            }
            // filter为ReactNode直接原样返回
            return item
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0))
}

/**
 * 统一处理Columns
 */
export function useCurdColumns<R extends RowType, V extends Id = Id>({
    columns,
    columnConfigurable
}: Pick<CurdProps<R, FormValue, V>, 'columns' | 'columnConfigurable'>) {
    const columnMapByKey = useColumnMap(columns)

    if (typeof columnConfigurable !== 'object') {
        columnConfigurable = {}
    }

    let {
        defaultVisible, visible, onVisibleChange,
        defaultOrder, order, onOrderChange
    } = columnConfigurable

    if (!defaultVisible || !defaultOrder) {
        const defaultKeys = columns?.flatMap((col: any) => col.hideInTable ? [] : (col._key ?? [])) || []
        defaultVisible ||= defaultKeys
        defaultOrder ||= defaultKeys
    }

    const [innerOrder, setInnerOrder] = useControlled(defaultOrder, order, onOrderChange)
    const [innerVisible, setInnerVisible] = useControlled(defaultVisible, visible, onVisibleChange)

    const symbolBoundToNext = useRef(new WeakMap<CurdColumn<R>, symbol[]>())

    // 移除symbol，并将其与后一列绑定
    const pureColumns = useMemo(() => {
        const ret: CurdColumn<R>[] = []
        let symbolArr: symbol[] = []
        columns?.forEach(col => {
            if (typeof col === 'symbol') {
                symbolArr.push(col)
                return
            }
            if (col.hideInTable) {
                return
            }
            ret.push(col)
            if (symbolArr.length) {
                symbolBoundToNext.current.set(col, symbolArr)
                symbolArr = []
            }
        })
        return ret
    }, [columns])

    // 只排序不筛选，用于设置项
    const orderedColumns = useMemo(() => {
        if (!innerOrder.current.length) {
            return pureColumns
        }
        const set = new Set(pureColumns)
        return [
            ...innerOrder.current.flatMap(k => {
                const col = columnMapByKey.get(k)
                if (col) {
                    set.delete(col)
                    return col
                }
                return []
            }),
            ...set
        ]
    }, [innerOrder.current, pureColumns])

    const visibleSet = useMemo(() => {
        return new Set(innerVisible.current)
    }, [innerVisible.current])

    // 筛选表格上可见的列，并将symbol回填
    const actualColumns = useMemo(() => {
        return orderedColumns!.flatMap(col => {
            if (!isUnset(col._key) && visibleSet.has(col._key)) {
                const symbolArr = symbolBoundToNext.current.get(col) || []
                // 移除DataGrid不需要的属性
                const {
                    filterInline,
                    filter,
                    form,
                    ...c
                } = col
                return [
                    ...symbolArr,
                    {...c, filter: filterInline} as ColumnType<R>
                ]
            }
            return []
        })
    }, [innerVisible.current, orderedColumns])

    return {orderedColumns, actualColumns, innerVisible, setInnerVisible, setInnerOrder}
}