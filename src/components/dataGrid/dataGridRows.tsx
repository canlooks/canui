import {memo} from 'react'
import {Id} from '../../types'
import {DataGrid, DataGridProps, RowType, useDataGridContext} from './dataGrid'
import {useSelectionContext} from '../selectionContext'
import {clsx, isUnset, renderCell} from '../../utils'
import {Checkbox} from '../checkbox'
import {Radio} from '../radio'
import {TdCell} from '../table'
import {Button} from '../button'
import {Collapse} from '../transitionBase'
import {Icon} from '../icon'
import {faMinusSquare} from '@fortawesome/free-regular-svg-icons/faMinusSquare'
import {faPlusSquare} from '@fortawesome/free-regular-svg-icons/faPlusSquare'
import {classes} from './dataGrid.style'

type DataGridRowsProps<R extends RowType, V extends Id = Id> = {
    rows: DataGridProps<R, V>['rows'] | undefined
    /** @private 内部使用，用于缩进子行 */
    _level?: number
}

export const DataGridRows = memo(<R extends RowType, V extends Id = Id>({
    rows,
    _level = 0
}: DataGridRowsProps<R, V>) => {
    const {multiple, toggleSelected, selectionStatus} = useSelectionContext()

    const {
        rowProps, primaryKey, childrenKey, clickRowToSelect, indent, renderExpandIcon,
        expandedSet, flattedColumns, toggleExpanded
    } = useDataGridContext()

    return rows?.flatMap((row, i, arr) => {
        const trKey = row[primaryKey]
        if (isUnset(trKey)) {
            console.warn(`[@canlooks/can-ui/<DataGrid/>] primaryKey not found in row "${i}"`)
        }
        const _rowProps = rowProps?.(row, i, arr)
        const status = selectionStatus?.get(trKey)
        const children = childrenKey !== null ? row[childrenKey] : void 0
        const expandable = !isUnset(children) && typeof children !== 'boolean'
        const currentExpanded = expandable && expandedSet.has(trKey)
        let expandableIndex = -2

        const ret = [
            <tr
                {..._rowProps}
                key={trKey}
                className={clsx(_rowProps, _level > 0 && classes.sub)}
                onClick={e => {
                    _rowProps?.onClick?.(e)
                    clickRowToSelect && toggleSelected!(trKey, row)
                }}
                data-selected={status === 2}
            >
                {flattedColumns?.flatMap((col, j) => {
                    if (typeof col === 'symbol') {
                        if (col === DataGrid.EXPAND_COLUMN) {
                            expandableIndex = j
                            return []
                        }
                        // col === DataGrid.SELECT_COLUMN
                        if (expandableIndex === j - 1) {
                            // select column紧跟在expand column后面，需要顺延expandableIndex
                            expandableIndex = j
                        }
                        const Component = multiple ? Checkbox : Radio
                        return (
                            <TdCell
                                key={j + '_selectable'}
                                className={classes.selectable}
                                sticky={j === 0 ? 'left' : void 0}
                            >
                                <Component
                                    checked={status === 2}
                                    indeterminate={status === 1}
                                    onChange={() => {
                                        toggleSelected!(trKey, row)
                                    }}
                                    onClick={e => e.stopPropagation()}
                                />
                            </TdCell>
                        )
                    }

                    const {
                        // 排除无需加入dom节点的属性
                        // width属性只需加入thead列中，普通列需排除
                        // rowSpan与colSpan需排除
                        title, key, children, sticky, field, render, sorter, filter,
                        width,
                        _key, _negativeRowSpan, rowSpan, colSpan,
                        ..._colProps
                    } = col
                    const renderedContent = renderCell({render, field}, row, i, arr)
                    const shouldRenderExpand = expandableIndex === j - 1

                    return (
                        <TdCell
                            {..._colProps}
                            key={_key}
                            className={shouldRenderExpand ? classes.expandable : void 0}
                            sticky={sticky}
                        >
                            {shouldRenderExpand
                                ? <div className={classes.expandableWrap} style={{paddingLeft: _level * indent}}>
                                    <Button
                                        variant="text"
                                        shape="circular"
                                        color="text.disabled"
                                        onClick={() => toggleExpanded(trKey)}
                                        style={expandable ? void 0 : {visibility: 'hidden'}}
                                    >
                                        {renderExpandIcon
                                            ? renderExpandIcon(trKey, currentExpanded, [...expandedSet])
                                            : currentExpanded
                                                ? <Icon icon={faMinusSquare}/>
                                                : <Icon icon={faPlusSquare}/>
                                        }
                                    </Button>
                                    {renderedContent}
                                </div>
                                : renderedContent
                            }
                        </TdCell>
                    )
                })}
            </tr>
        ]

        if (Array.isArray(children)) {
            currentExpanded && ret.push(
                <DataGridRows
                    key={trKey + '_children'}
                    rows={children}
                    _level={_level + 1}
                />
            )
        } else if (expandable) {
            ret.push(
                <tr
                    key={trKey + '_children'}
                    className={classes.sub}
                >
                    <td className={classes.subTd} colSpan={flattedColumns?.length || 1}>
                        <Collapse in={currentExpanded}>
                            <div className={classes.children}>
                                {typeof children === 'function'
                                    ? children(row, currentExpanded)
                                    : children
                                }
                            </div>
                        </Collapse>
                    </td>
                </tr>
            )
        }
        return ret
    })
})