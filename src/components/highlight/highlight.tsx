import {CSSProperties, Fragment, ReactNode, memo} from 'react'
import {Typography} from '../typography'
import {useTheme} from '../theme'

export type HighlightProps = {
    keywords?: string | string[]
    highlightClassName?: string
    highlightStyle?: CSSProperties
    renderHighlight?: (text: string) => ReactNode
    children?: string
    /** @alias {@link children} */
    content?: string
}

export const Highlight = memo(({
    keywords,
    highlightClassName,
    highlightStyle,
    renderHighlight,
    content,
    children = content,
}: HighlightProps) => {
    const {colors} = useTheme()

    if (!children) {
        return children
    }

    const keywordsSet = new Set(Array.isArray(keywords) ? keywords : [keywords])

    if (!keywordsSet.size) {
        return children
    }

    const ranges: [number, number][] = []

    for (const w of keywordsSet) {
        if (!w) {
            return
        }
        const iterator = children.matchAll(new RegExp(w, 'ig'))
        for (const match of iterator) {
            const start = match.index!
            ranges.push([start, start + w.length])
        }
    }

    const ret: ReactNode[] = []

    let offset = 0

    ranges.sort((a, b) => a[0] - b[0]).forEach(([start, end], i) => {
        if (start > offset) {
            ret.push(children.substring(offset, start))
        }
        const highlightText = children.substring(start, offset = end)
        ret.push(
            <Fragment key={i}>
                {renderHighlight?.(highlightText) ||
                    <Typography.mark
                        className={highlightClassName}
                        style={{
                            color: colors.error.main,
                            ...highlightStyle
                        }}>
                        {highlightText}
                    </Typography.mark>
                }
            </Fragment>
        )
    })

    ret.push(children.substring(offset))

    return ret
})
