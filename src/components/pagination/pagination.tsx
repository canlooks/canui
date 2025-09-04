import {ReactElement, createContext, memo, useContext} from 'react'
import {DivProps, Size} from '../../types'
import {classes, style} from './pagination.style'
import {clsx, useControlled} from '../../utils'
import {PaginationPager} from './pager'
import {PaginationSizer} from './sizer'
import {PaginationJumper} from './jumper'
import {PaginationCounter} from './counter'

export interface PaginationProps extends Omit<DivProps, 'onChange'> {
    size?: Size
    total?: number

    defaultPage?: number
    page?: number
    onPageChange?(page: number): void

    defaultPageSize?: number
    pageSize?: number
    onPageSizeChange?(pageSize: number): void

    onChange?(page: number, pageSize: number): void
}

const PaginationContext = createContext({
    size: 'small' as Size,
    total: 0,
    pageCount: 1,
    page: 1,
    onPageChange(page: number) {},
    pageSize: 10,
    onPageSizeChange(pageSize: number) {}
})

export function usePaginationContext() {
    return useContext(PaginationContext)
}

export const Pagination = memo(({
    size = 'small',
    total = 0,

    defaultPage = 1,
    page,
    onPageChange,

    defaultPageSize = 10,
    pageSize,
    onPageSizeChange,

    onChange,
    ...props
}: PaginationProps) => {
    const [innerPage, setInnerPage] = useControlled(defaultPage, page, onPageChange)
    const [innerPageSize, setInnerPageSize] = useControlled(defaultPageSize, pageSize, onPageSizeChange)

    const pageChangeHandler = (page: number) => {
        setInnerPage(page)
        onChange?.(page, innerPageSize.current)
    }

    const pageSizeChangeHandler = (pageSize: number) => {
        setInnerPageSize(pageSize)
        onChange?.(innerPage.current, pageSize)
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            <PaginationContext value={{
                size,
                total,
                pageCount: Math.max(Math.ceil(total / innerPageSize.current), 1),
                page: innerPage.current,
                onPageChange: pageChangeHandler,
                pageSize: innerPageSize.current,
                onPageSizeChange: pageSizeChangeHandler
            }}>
                {props.children ||
                    <>
                        <PaginationCounter />
                        <PaginationPager />
                        <PaginationSizer />
                        <PaginationJumper />
                    </>
                }
            </PaginationContext>

        </div>
    )
}) as any as {
    (props: PaginationProps): ReactElement
    Counter: typeof PaginationCounter,
    Pager: typeof PaginationPager,
    Sizer: typeof PaginationSizer,
    Jumper: typeof PaginationJumper
}

Pagination.Counter = PaginationCounter
Pagination.Pager = PaginationPager
Pagination.Sizer = PaginationSizer
Pagination.Jumper = PaginationJumper