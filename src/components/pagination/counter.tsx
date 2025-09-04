import {memo} from 'react'
import {clsx} from '../../utils'
import {classes} from './pagination.style'
import {usePaginationContext} from './pagination'
import {DivProps} from '../../types'

export interface PaginationCounterProps extends DivProps {}

export const PaginationCounter = memo((props: PaginationCounterProps) => {
    const {total, page, pageSize} = usePaginationContext()

    const start = (page - 1) * pageSize + 1
    const end = Math.min(start + pageSize - 1, total)

    return (
        <div
            {...props}
            className={clsx(classes.counter, props.className)}
        >
            第 {start}-{end} 条/共 {total} 条
        </div>
    )
})