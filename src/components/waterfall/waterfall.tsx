import {Children, isValidElement, useEffect, useLayoutEffect, useRef} from 'react'
import {classes, useStyle} from './waterfall.style'
import {WaterfallItem} from './waterfallItem'
import {DivProps, ResponsiveProp} from '../../types'
import {cloneRef, clsx, toResponsiveValue, useResponsiveValue} from '../../utils'

export interface WaterfallProps extends DivProps {
    /** 布局列数，默认为`{xs: 4}` */
    columnCount?: ResponsiveProp
    gap?: ResponsiveProp
    columnGap?: ResponsiveProp
    rowGap?: ResponsiveProp
}

export const Waterfall = ({
    columnCount = {xs: 4},
    gap = 0,
    columnGap,
    rowGap,
    ...props
}: WaterfallProps) => {
    columnCount = toResponsiveValue(columnCount)
    gap = toResponsiveValue(gap)
    columnGap = toResponsiveValue(columnGap!) ?? gap
    rowGap = toResponsiveValue(rowGap!) ?? gap

    const columnCountNum = useResponsiveValue(columnCount)

    const containerRef = useRef<HTMLDivElement>(null)

    const elements = useRef<HTMLElement[]>([])
    elements.current = []

    const computeItemOrder = () => {
        const heights = Array(columnCountNum.current).fill(0)
        elements.current.forEach(el => {
            const order = heights.indexOf(Math.min(...heights))
            heights[order] += el.offsetHeight
            el.style.order = order + ''
        })
        containerRef.current!.style.height = Math.max(...heights) + 1 + 'px'
    }

    const resizeObserver = useRef<ResizeObserver>(void 0)
    resizeObserver.current ||= new ResizeObserver(computeItemOrder)

    const pendingItems: Promise<void>[] = []

    useLayoutEffect(() => {
        Promise.all(pendingItems).then(() => {
            elements.current.forEach(el => resizeObserver.current!.observe(el))
        })
    })

    const isInitialized = useRef(false)

    useEffect(() => {
        if (!isInitialized.current) {
            isInitialized.current = true
            return
        }
        computeItemOrder()
    }, [columnCountNum.current])

    useEffect(() => () => {
        resizeObserver.current!.disconnect()
    }, [])

    return (
        <div
            {...props}
            ref={cloneRef(containerRef, props.ref)}
            css={useStyle({columnCount, columnGap, rowGap})}
            className={clsx(classes.root, props.className)}
        >
            {Children.map(props.children, child => {
                if (!isValidElement(child)) {
                    throw Error('Children of <Waterfall> must be element')
                }

                let onLoad: () => void
                pendingItems.push(
                    new Promise<void>(r => onLoad = r)
                )
                return (
                    <WaterfallItem
                        ref={r => {
                            r && elements.current.push(r)
                        }}
                        child={child}
                        onLoad={onLoad!}
                    />
                )
            })}
        </div>
    )
}