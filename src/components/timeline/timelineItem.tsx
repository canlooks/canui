import {ReactNode, memo} from 'react'
import {clsx} from '../../utils'
import {classes, useTimelineItemStyle} from './timeline.style'
import {TimelineSharedProps, useTimelineContext} from './timeline'

export interface TimelineItemProps extends Omit<TimelineSharedProps, 'content'> {
    dot?: ReactNode
    content?: ReactNode
    /** 相对{@link content}，另外一侧的内容 */
    oppositeContent?: ReactNode
    loading?: boolean

    /** @private 内部使用，用于alternate模式下判断标签位置 */
    _index?: number
}

export const TimelineItem = memo(({
    dot,
    content,
    oppositeContent,
    loading,
    _index = 0,
    // 共享属性，从TimelineSharedProps继承
    variant,
    labelPosition,
    color,
    ...props
}: TimelineItemProps) => {
    const context = useTimelineContext()

    variant ??= context.variant ?? 'outlined'
    labelPosition ??= context.labelPosition ?? 'end'
    color ??= context.color ?? 'primary'

    return (
        <div
            {...props}
            css={useTimelineItemStyle({color})}
            className={clsx(classes.item, props.className)}
            data-variant={variant}
            data-reverse={
                (labelPosition === 'alternate' && _index % 2 !== 0) ||
                (labelPosition === 'alternate-reverse' && _index % 2 === 0)
            }
            data-orientation={context.orientation}
        >
            <div
                className={classes.opposite}
                data-show={!!oppositeContent}
            >
                {oppositeContent}
            </div>
            <div className={classes.dotArea}>
                <div className={classes.dot}></div>
            </div>
            <div className={classes.content}>{content}</div>
        </div>
    )
})