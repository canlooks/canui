import {ReactNode, useMemo} from 'react'
import {ColorPropsValue, DivProps, Placement} from '../../types'
import {classes, useStyle} from './badge.style'
import {clsx} from '../../utils'

export interface BadgeProps extends DivProps {
    color?: ColorPropsValue
    placement?: Placement
    variant?: 'dot' | 'standard'
    /** 角标的任容 */
    count?: ReactNode
    /** 默认为`99` */
    max?: number
    /** 数量为0时是否显示角标，默认为`false` */
    showZero?: boolean
    offsetX?: number | string
    offsetY?: number | string
}

export function Badge({
    color = 'error',
    placement = 'topRight',
    variant = 'standard',
    count = 0,
    max = 99,
    showZero,
    offsetX = 0,
    offsetY = 0,
    ...props
}: BadgeProps) {
    const renderedCount = typeof count === 'number'
        ? Math.min(count, max)
        : count

    const isOverflow = typeof count === 'number' && count > max

    const badgeStyle = useMemo(() => {
        const [, placeA, placeB] = placement.match(/^(top|bottom|left|right)(top|bottom|left|right)?/i)!
        let top = 'auto', bottom = 'auto', left = 'auto', right = 'auto'
        switch (placeA) {
            case 'top':
                top = '0'
                left = '50%'
                break
            case 'bottom':
                bottom = '0'
                left = '50%'
                break
            case 'left':
                top = '50%'
                left = '0'
                break
            case 'right':
                top = '50%'
                right = '0'
        }
        switch (placeB) {
            case 'Top':
                top = '0'
                break
            case 'Bottom':
                top = 'auto'
                bottom = '0'
                break
            case 'Left':
                left = '0'
                break
            case 'Right':
                left = 'auto'
                right = '0'
        }
        return {top, bottom, left, right}
    }, [placement])

    if (typeof offsetX === 'number') {
        (offsetX as any) += 'px'
    }

    if (typeof offsetY === 'number') {
        (offsetY as any) += 'px'
    }

    return (
        <div
            {...props}
            css={useStyle({color: color || 'error'})}
            className={clsx(classes.root, props.className)}
            data-variant={variant}
            data-zero={!showZero && !renderedCount}
        >
            {!!props.children &&
                <div className={classes.children}>
                    {props.children}
                </div>
            }
            <div
                className={classes.badge}
                style={{
                    ...badgeStyle,
                    transform: `translate(${offsetX}, ${offsetY})`
                }}
            >
                <div className={classes.badgeWrap}>
                    {variant !== 'dot' &&
                        <>
                            {renderedCount}
                            {isOverflow && '+'}
                        </>
                    }
                </div>
            </div>
        </div>
    )
}