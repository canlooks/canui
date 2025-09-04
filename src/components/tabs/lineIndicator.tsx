import {CSSProperties, useEffect, useState} from 'react'
import {classes, indicatorWidth} from './tabs.style'
import {colorTransfer} from '../../utils'
import {useTheme} from '../theme'
import {useTabsContext} from './tabs'
import {Id} from '../../types'

export function LineIndicator({
    value,
    position,
    getActiveTab,
    onTransitionEnd
}: {
    value?: Id
    position: 'top' | 'bottom' | 'left' | 'right'
    getActiveTab(): HTMLDivElement | undefined
    onTransitionEnd(): void
}) {
    const context = useTabsContext()

    const [color, setColor] = useState<string>(context.color!)

    const [boundingRect, setBoundingRect] = useState<CSSProperties>()

    useEffect(() => {
        const activeTab = getActiveTab()
        if (!activeTab) {
            return
        }
        if (position === 'top' || position === 'bottom') {
            setBoundingRect({
                width: activeTab.offsetWidth,
                height: indicatorWidth,
                left: activeTab.offsetLeft,
                ...position === 'top'
                    ? {bottom: 0}
                    : {top: 0}
            })
        } else {
            // position === 'left' || position === 'right'
            setBoundingRect({
                width: indicatorWidth,
                height: activeTab.offsetHeight,
                top: activeTab.offsetTop,
                ...position === 'left'
                    ? {right: 0}
                    : {left: 0}
            })
        }
        activeTab.dataset.color && setColor(activeTab.dataset.color)
    }, [value])

    const theme = useTheme()

    return (
        <div
            className={classes.indicator}
            onTransitionEnd={onTransitionEnd}
            style={{
                ...boundingRect,
                backgroundColor: colorTransfer(color, theme)
            }}
        />
    )
}