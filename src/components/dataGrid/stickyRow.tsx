import {ComponentProps, useEffect, useState} from 'react'
import {useDataGridContext} from './dataGrid'
import {mergeComponentProps} from '../../utils'

export interface StickyRowProps extends ComponentProps<'tr'> {
    sticky?: boolean
}

export function StickyRow({
    sticky,
    ...props
}: StickyRowProps) {
    const [offset, setOffset] = useState(0)

    const {theadRef} = useDataGridContext()

    useEffect(() => {
        if (!sticky || !theadRef.current) {
            return
        }
        const resizeObserver = new ResizeObserver(() => {
            setOffset(theadRef.current!.offsetHeight)
        })
        resizeObserver.observe(theadRef.current)
        return () => {
            resizeObserver.disconnect()
        }
    }, [sticky])

    return (
        <tr
            {...mergeComponentProps<'tr'>(props, {
                ...sticky && {
                    style: {top: offset}
                }
            })}
        />
    )
}