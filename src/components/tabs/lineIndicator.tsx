import {CSSProperties, memo, useEffect, useState} from 'react'
import {classes, indicatorWidth} from './tabs.style'
import {colorTransfer} from '../../utils'
import {useTheme} from '../theme'
import {useTabsContext} from './tabs'
import {Id} from '../../types'

export const LineIndicator = memo(({
    value,
    position,
    getActiveTab
}: {
    value: Id | undefined
    position: 'top' | 'bottom' | 'left' | 'right'
    getActiveTab(): HTMLElement | undefined
})=> {
    const context = useTabsContext()

    const [color, setColor] = useState<string>(context.color!)

    const [boundingRect, setBoundingRect] = useState<CSSProperties>()

    const {setAnimating} = useTabsContext()

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

    const onTransitionEnd = () => {
        setAnimating(false)
    }

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
})