import {clsx} from '../../utils'
import {ColorPropsValue, DivProps} from '../../types'
import {classes, useStyle} from './loadingIndicator.style'
import {memo} from 'react'

export interface LoadingIndicatorProps extends DivProps {
    /** 默认为`1rem` */
    size?: number
    /** 圆环的粗细，默认为`2px` */
    borderWidth?: number
    color?: ColorPropsValue
}

export const LoadingIndicator = memo(({
    size,
    borderWidth = 2,
    color = 'primary',
    ...props
}: LoadingIndicatorProps) => {
    return (
        <div
            {...props}
            css={useStyle({color: color || 'primary', borderWidth})}
            className={clsx(classes.root, props.className)}
            style={{
                width: size ?? '1em',
                height: size ?? '1em',
                ...props.style
            }}
        >
            <div className={classes.indicator} />
        </div>
    )
})