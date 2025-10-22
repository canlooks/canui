import {ComponentProps, useEffect, useRef, useState} from 'react'
import {mergeComponentProps} from '../../utils'
import {classes} from './table.style'
import {OverridableComponent, OverridableProps} from '../../types'
import {style} from './tableSticky.style'

export const TableContainer = (
    ({
        component: Component = 'div',
        ...props
    }: OverridableProps<{}, 'div'>) => {
        const innerRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
            const el = innerRef.current!
            const scroll = () => {
                el.dataset.scrolledLeft = (el.scrollLeft > 0).toString()
                el.dataset.scrolledRight = (el.scrollWidth - el.clientWidth > el.scrollLeft).toString()
            }
            scroll()

            el.addEventListener('scroll', scroll)

            const table = el.getElementsByTagName('table')[0]
            const resizeObserver = new ResizeObserver(scroll)
            resizeObserver.observe(el)
            table && resizeObserver.observe(table)
            return () => {
                el.removeEventListener('scroll', scroll)
                resizeObserver.disconnect()
            }
        }, [])

        return (
            <Component
                {...mergeComponentProps(
                    props,
                    {
                        ref: innerRef,
                        css: style,
                        className: classes.container
                    }
                )}
            />
        )
    }
) as OverridableComponent<{}>

type CellProps = {
    sticky?: 'left' | 'right'
}

export interface TdCellProps extends Partial<ComponentProps<'td'>>, CellProps {
}

export interface ThCellProps extends Partial<ComponentProps<'th'>>, CellProps {
}

export function TdCell(props: TdCellProps) {
    return <td {...useStickyCellProps(props)}/>
}

export function ThCell(props: ThCellProps) {
    return <th {...useStickyCellProps(props)}/>
}

function useStickyCellProps({
    sticky,
    ...props
}: TdCellProps | ThCellProps) {
    const innerRef = useRef<HTMLTableCellElement>(null)

    const [offset, setOffset] = useState(0)

    useEffect(() => {
        if (!sticky) {
            return
        }
        const siblings: HTMLTableCellElement[] = []
        const resizeObserver = new ResizeObserver(() => {
            setOffset(
                siblings.reduce((acc, el) => {
                    return acc + el.offsetWidth
                }, 0)
            )
        })
        const recurve = (currentEl: HTMLTableCellElement = innerRef.current!) => {
            const sibling = sticky === 'left'
                ? currentEl.previousElementSibling as HTMLTableCellElement
                : currentEl.nextElementSibling as HTMLTableCellElement
            if (sibling) {
                if (sibling.dataset.sticky === sticky) {
                    siblings.push(sibling)
                    resizeObserver.observe(sibling)
                }
                recurve(sibling)
            }
        }
        recurve()

        return () => {
            resizeObserver.disconnect()
        }
    })

    return mergeComponentProps<'td' | 'th'>(
        props,
        {
            ref: innerRef,
            css: style,
            className: classes.cell,
            style: sticky && {[sticky]: offset},
            'data-sticky': sticky
        }
    )
}