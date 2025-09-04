import {memo, ReactElement, ReactNode} from 'react'
import {classes, style} from './loadingMask.style'
import {LoadingIndicator, LoadingIndicatorProps} from '../loadingIndicator'
import {Progress, ProgressProps} from '../progress'
import {ColorPropsValue} from '../../types'
import {clsx, useDerivedState} from '../../utils'
import {Backdrop, BackdropProps} from '../backdrop'

export interface LoadingMaskProps<T extends HTMLElement = HTMLElement> extends BackdropProps<T> {
    text?: ReactNode
    /** 传入progress字段会显示进度条 */
    progress?: number
    color?: ColorPropsValue
    indicatorProps?: LoadingIndicatorProps
    progressProps?: ProgressProps
}

export const LoadingMask = memo(<T extends HTMLElement>({
    open = false,
    text = '加载中...',
    progress,
    color,
    indicatorProps,
    progressProps,
    ...props
}: LoadingMaskProps<T>) => {
    const [visible, setVisible] = useDerivedState<boolean>((prevLoading) => {
        // 只有第一次需要原样返回loading，之后visible不会立即变为false，交由onTransitionEnd()处理
        return typeof prevLoading === 'undefined' ? open : true
    }, [open])

    const onExited = () => {
        // 动画结束后，loading为false才需要改变visible
        setVisible(false)
    }

    const showProgress = typeof progress === 'number'

    return open || visible.current
        ? <Backdrop
            variant="light"
            {...props}
            css={style}
            open={open}
            className={clsx(classes.root, props.className)}
            onExited={onExited}
            data-show-progress={showProgress}
        >
            <div className={classes.indicator}>
                <LoadingIndicator
                    size={showProgress ? 14 : 30}
                    borderWidth={showProgress ? 2 : 3}
                    color={color}
                    {...indicatorProps}
                />
                <div className={classes.text}>{text}</div>
            </div>
            {showProgress &&
                <Progress
                    className={classes.progress}
                    value={progress}
                    {...progressProps}
                />
            }
        </Backdrop>
        : null
}) as <T extends HTMLElement = HTMLElement>(props: LoadingMaskProps<T>) => ReactElement