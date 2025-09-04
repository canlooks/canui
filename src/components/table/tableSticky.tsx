import {ComponentProps, useEffect, useRef, useState} from 'react'
import {clsx, cloneRef} from '../../utils'
import {classes} from './table.style'
import {OverridableComponent, OverridableProps} from '../../types'
import {style} from './tableSticky.style'
import {SerializedStyles} from '@emotion/react'

export const TableContainer = (
    ({
        component: Component = 'div',
        ...props
    }: OverridableProps<{}, 'div'>) => {
        const [scrolledLeft, setScrolledLeft] = useState(false)
        const [scrolledRight, setScrolledRight] = useState(false)

        const innerRef = useRef<HTMLDivElement>(null)

        useEffect(() => {
            const el = innerRef.current!
            const scroll = () => {
                setScrolledLeft(!!el.scrollLeft)
                setScrolledRight(!!(el.scrollWidth - el.clientWidth - el.scrollLeft))
            }
            scroll()
            el.addEventListener('scroll', scroll)
            return () => {
                el.removeEventListener('scroll', scroll)
            }
        }, [])

        return (
            <Component
                {...props}
                ref={cloneRef(props.ref, innerRef)}
                css={style}
                className={clsx(classes.container, props.className)}
                data-scrolled-left={scrolledLeft}
                data-scrolled-right={scrolledRight}
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
    ref,
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

    return {
        ...props,
        ref: cloneRef(ref, innerRef),
        css: style,
        className: clsx(classes.cell, props.className),
        'data-sticky': sticky,
        style: {
            ...sticky && {[sticky]: offset},
            ...props.style
        }
    } as ComponentProps<'td'> & {
        css(): SerializedStyles
        'data-sticky'?: 'left' | 'right'
    }
}