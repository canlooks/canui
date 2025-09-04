import {ComponentProps} from 'react'
import {classes, style} from './table.style'
import {clsx} from '../../utils'
import {Size} from '../../types'
import {useTheme} from '../theme'
import {TdCell, ThCell} from './tableSticky'

export interface TableProps extends Partial<ComponentProps<'table'>> {
    size?: Size
    /**
     * 是否渲染边框，默认为`none`
     * @enum 'all' 所有单元格都渲染边框
     * @enum true 所有单元格都渲染边框
     * @enum 'out' 仅table外边缘渲染边框
     * @enum 'none' 不渲染边框
     */
    bordered?: 'all' | 'out' | 'none' | true
    /** 是否渲染斑马纹 */
    striped?: boolean
}

export function Table({
    size,
    bordered = 'none',
    striped = false,
    ...props
}: TableProps) {
    const theme = useTheme()

    size ??= theme.size

    return (
        <table
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-size={size}
            data-bordered={bordered}
            data-striped={striped}
        />
    )
}

export interface TableRowProps extends Partial<ComponentProps<'tr'>> {
    selected?: boolean
}

export function TableRow({
    selected,
    ...props
}: TableRowProps) {
    return <tr {...props} data-selected={selected}/>
}

Table.tr = TableRow
Table.th = ThCell
Table.td = TdCell