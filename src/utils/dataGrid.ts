import {useMemo} from 'react'
import {Id, Obj} from '../types'
import {ColumnType, DataGrid, DataGridProps, RowType} from '../components/dataGrid'
import {stringifyField} from './form'
import {isUnset, queryDeep} from './utils'
import {CurdColumn} from '../components/curd'

/**
 * 为列添加key
 * @param col
 * @param index
 */
export function setDefaultColumnKey<R extends Obj>(col: Pick<ColumnType<R>, 'key' | 'field'>, index: number) {
    return (col as ColumnType<R>)._key ??= col.key ?? (col.field ? stringifyField(col.field) : index)
}

/**
 * 索引列
 * @param columns 
 */
export function useColumnMap<C extends ColumnType<any> | CurdColumn<any>>(columns?: (C | symbol)[]): Map<Id, C> {
    return useMemo(() => {
        const map = new Map<Id, C>()
        columns?.forEach((col, i) => {
            if (typeof col !== 'symbol') {
                const _key = setDefaultColumnKey(col, i)
                if (!isUnset(_key)) {
                    if (map.has(_key)) {
                        console.warn(`[@canlooks/can-ui/<DataGrid/>] column key "${_key}" was duplicated`)
                    }
                    map.set(_key, col)
                }
            }
        })
        return map
    }, [columns])
}

/**
 * 统一处理DataGrid列
 * @param param0 
 */
export function useDataGridColumns<R extends RowType, V extends Id = Id>({
    columns,
    selectable,
    childrenKey
}: Pick<DataGridProps<R, V>, 'columns' | 'selectable' | 'childrenKey'>) {
    // 补全选择列与展开列
    const completedColumns = useMemo(() => {
        if (!columns) {
            return
        }
        let ret = columns
        if (selectable && !columns.includes(DataGrid.SELECT_COLUMN)) {
            ret = [DataGrid.SELECT_COLUMN, ...ret]
        }
        if (childrenKey && !columns.includes(DataGrid.EXPAND_COLUMN)) {
            ret = [DataGrid.EXPAND_COLUMN, ...ret]
        }
        return ret
    }, [columns, selectable, childrenKey])

    const flattedColumns = useMemo(() => {
        const flatted: (ColumnType<R> | symbol)[] = []
        const fn = (arr?: (ColumnType<R> | symbol)[]) => {
            arr?.forEach(col => {
                if (typeof col !== 'symbol' && col.children?.length) {
                    fn(col.children)
                } else {
                    flatted.push(col)
                }
            })
        }
        fn(completedColumns)
        return flatted
    }, [completedColumns])

    const columnMapByKey = useColumnMap(flattedColumns)

    return {completedColumns, columnMapByKey, flattedColumns}
}

/**
 * 渲染单元格内容
 * @param column 
 * @param row 
 * @param rowIndex 
 * @param rows 
 */
export function renderCell<R extends RowType>({render, field}: Pick<ColumnType<R>, 'render' | 'field'>, row: R, rowIndex?: number, rows?: R[]) {
    if (render) {
        return render(row, rowIndex, rows)
    }
    if (typeof field === 'undefined') {
        return null
    }
    const data = queryDeep(row, field)
    if (typeof data === 'object' || typeof data === 'function' || typeof data === 'symbol') {
        return null
    }
    return data
}