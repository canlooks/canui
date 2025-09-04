import {cloneElement, ReactElement, Ref, useCallback, useEffect, useRef} from 'react'
import {classes} from './waterfall.style'
import {cloneRef, clsx} from '../../utils'

export type WaterfallItemProps = {
    ref: Ref<HTMLElement>
    onLoad(): void
    child: ReactElement<any>
}

export const WaterfallItem = ({
    ref,
    onLoad,
    child
}: WaterfallItemProps) => {
    const innerRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const el = innerRef.current
        if (!el) {
            throw Error(`Children of <Waterfall> must expose 'ref' prop`)
        }

        const imgTags = el.querySelectorAll('img')
        if (!imgTags.length) {
            onLoad()
            return
        }

        Promise.all(
            [...imgTags].map(img => {
                if (!img.complete) {
                    return new Promise<Event>(resolve => {
                        img.addEventListener('load', resolve, {once: true})
                    })
                }
            })
        ).then(() => onLoad())
    })

    const clonedRef = useCallback(
        cloneRef(child.props.ref, innerRef, ref),
        [child.props.ref, ref]
    )

    return cloneElement(child, {
        ref: clonedRef,
        className: clsx(classes.item, child.props.className),
        style: {
            width: 'calc((100% - var(--waterfall-column-gap) * (var(--waterfall-columnCount) - 1)) / var(--waterfall-columnCount))',
            paddingBottom: 'var(--waterfall-row-gap)',
            ...child.props.style
        }
    })
}