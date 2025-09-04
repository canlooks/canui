import {ReactNode} from 'react'
import {Popper, PopperProps} from '../popper'
import {ColorPropsValue} from '../../types'
import {classes, useStyle} from './tooltip.style'
import {clsx} from '../../utils'
import {useTheme} from '../theme'

export interface TooltipProps extends Omit<PopperProps, 'title' | 'content'> {
    title?: ReactNode
    color?: ColorPropsValue
    showArrow?: boolean
}

export function Tooltip({
    title,
    color,
    showArrow = true,
    offset,
    ...props
}: TooltipProps) {
    const {spacing} = useTheme()

    offset ??= showArrow ? spacing[3] : spacing[2]

    return (
        <Popper
            {...props}
            css={useStyle({color: color || '#000000'})}
            className={clsx(classes.root, props.className)}
            offset={offset}
            content={
                <div
                    className={classes.title}
                    data-show-arrow={showArrow}
                >
                    {title}
                </div>
            }
        />
    )
}