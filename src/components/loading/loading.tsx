import {memo} from 'react'
import {DivProps} from '../../types'
import {clsx} from '../../utils'
import {classes, style} from './loading.style'
import {LoadingMask, LoadingMaskProps} from '../loadingMask'

export interface LoadingProps extends Omit<LoadingMaskProps, 'children'>, DivProps {
    containerProps?: DivProps
    /** 是否占满父元素，默认为`true` */
    fill?: boolean
}

export const Loading = memo(({
    containerProps,
    fill = true,
    open = false,
    text = '加载中...',
    progress,
    color,
    indicatorProps,
    progressProps,
    ...props
}: LoadingProps) => {
    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-fill={fill}
        >
            <div
                {...containerProps}
                className={clsx(classes.container, containerProps?.className)}
            >
                {props.children}
            </div>
            <LoadingMask
                {...{open, text, progress, color, indicatorProps, progressProps}}
                className={classes.mask}
            />
        </div>
    )
})