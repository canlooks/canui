import {Children, ReactElement, cloneElement, createContext, isValidElement, memo, useContext, useMemo} from 'react'
import {ColorPropsValue, DivProps, Obj} from '../../types'
import {classes, style} from './timeline.style'
import {clsx} from '../../utils'
import {TimelineItem, TimelineItemProps} from './timelineItem'

export interface TimelineSharedProps extends DivProps {
    variant?: 'filled' | 'outlined'
    /**标签的位置，默认为`end` */
    labelPosition?: 'start' | 'end' | 'alternate' | 'alternate-reverse'
    color?: ColorPropsValue
}

export interface TimelineProps extends TimelineSharedProps {
    items?: (TimelineItemProps & Obj)[]
    orientation?: 'horizontal' | 'vertical'
}

const TimelineContext = createContext<TimelineSharedProps & Pick<TimelineProps, 'orientation'>>({})

export function useTimelineContext() {
    return useContext(TimelineContext)
}

export const Timeline = memo(({
    items,
    // 共享属性
    variant = 'outlined',
    labelPosition = 'end',
    orientation = 'vertical',
    color = 'primary',
    ...props
}: TimelineProps) => {
    const renderItems = () => {
        if (items) {
            return items.map((p, i) => {
                return (
                    <TimelineItem
                        {...p}
                        key={p.key ?? i}
                        _index={i}
                    />
                )
            })
        }
        return Children.map(props.children as ReactElement<TimelineItemProps>[], (child, _index) => {
            if (isValidElement(child)) {
                return cloneElement(child, {_index})
            }
            return child
        })
    }

    return (
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-label-position={labelPosition}
            data-orientation={orientation}
        >
            <TimelineContext
                value={
                    useMemo(() => (
                        {variant, labelPosition, color, orientation}
                    ), [variant, labelPosition, color, orientation])
                }
            >
                {renderItems()}
            </TimelineContext>
        </div>
    )
}) as any as {
    (props: TimelineProps): ReactElement
    Item: typeof TimelineItem
}

Timeline.Item = TimelineItem