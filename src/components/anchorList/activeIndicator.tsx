import {classes} from './anchorList.style'
import {useEffect, useState} from 'react'

export function ActiveIndicator({
    activeId,
    anchorRefs,
    onTransitionEnd
}: {
    activeId: string | undefined
    anchorRefs: Map<string, HTMLAnchorElement | null>
    onTransitionEnd(): void
}) {
    const [top, setTop] = useState<number>()

    useEffect(() => {
        const anchor = anchorRefs.get(activeId!)
        if (!anchor) {
            return
        }
        setTop(anchor.offsetTop + 8)
    }, [activeId])

    return (
        <div
            className={classes.indicator}
            style={{top}}
            onTransitionEnd={onTransitionEnd}
        />
    )
}