import {ReactElement, cloneElement, createContext, isValidElement, memo, useContext, useMemo, useRef, useState} from 'react'
import {ClickAway} from '../clickAway'
import {classes, style} from './slidableActions.style'
import {DivProps} from '../../types'
import {cubicBezier, clsx, useSyncState, range, toArray, GestureOptions, useDraggable} from '../../utils'
import {SlidableActionsAction, SlidableActionsActionProps} from './slidableActionsAction'

const bounceBezier = cubicBezier(0, 0, 0, 1)

const SlidableActionsContext = createContext<{
    actionsContainer?: (HTMLElement | null)[]
    translate?: number
    resetTranslate?(): void
    maxDistance?: number
    autoReturn?: boolean
}>({})

export function useSlidableActionsContext() {
    return useContext(SlidableActionsContext)
}

type ActionType = SlidableActionsActionProps | ReactElement

export interface SlidableActionsProps extends DivProps {
    /** 元素弹性移动距离，默认为24 */
    bounceElementTranslate?: number
    /** 手指弹性拖拽距离，默认为240 */
    bounceDragDistance?: number
    /** 滑动生效的速度，默认为450 (px/s) */
    effectiveSpeed?: number
    leftActions?: ActionType | ActionType[]
    rightActions?: ActionType | ActionType[]
    /** 点击action后是否自动归位，默认为`true` */
    autoReturn?: boolean
    disabled?: boolean

    gestureOptions?: GestureOptions
}

export const SlidableActions = memo(({
    bounceElementTranslate = 12,
    bounceDragDistance = 240,
    effectiveSpeed = 450,
    leftActions,
    rightActions,
    autoReturn = true,
    disabled,
    gestureOptions,
    ...props
}: SlidableActionsProps) => {
    const leftActionsContainer = useRef<(HTMLButtonElement | null)[]>([])
    const rightActionsContainer = useRef<(HTMLButtonElement | null)[]>([])

    const [distanceRange, setDistanceRange] = useSyncState([0, 0])

    const getDistanceRange = () => {
        const fn = (container: (HTMLButtonElement | null)[]) => {
            return container.reduce((prev, el) => {
                return prev + (el?.offsetWidth || 0)
            }, 0)
        }
        setDistanceRange([
            -fn(rightActionsContainer.current),
            fn(leftActionsContainer.current)
        ])
    }

    const [translate, setTranslate] = useState(0)

    const [dragging, setDragging] = useState(false)

    const startTranslate = useRef(0)

    const draggableHandles = useDraggable({
        ...gestureOptions,
        disabled,
        preventNativeTouchMove: true,
        onDragStart(e) {
            gestureOptions?.onDragStart?.(e)
            setDragging(true)
            startTranslate.current = translate
            getDistanceRange()
        },
        onDrag(info, e) {
            gestureOptions?.onDrag?.(info, e)
            const [min, max] = distanceRange.current
            const bounceMin = min < 0 ? min - bounceDragDistance : min
            const bounceMax = max > 0 ? max + bounceDragDistance : max
            let newTranslate = range(startTranslate.current + info.diff[0], bounceMin, bounceMax)
            // 拖拽超过正常距离，模拟弹性
            if (newTranslate < min) {
                newTranslate = min - bounceBezier(-(newTranslate - min) / bounceDragDistance) * bounceElementTranslate
            } else if (newTranslate > max) {
                newTranslate = max + bounceBezier((newTranslate - max) / bounceDragDistance) * bounceElementTranslate
            }
            setTranslate(newTranslate)
        },
        onDragEnd(info) {
            gestureOptions?.onDragEnd?.(info)
            setDragging(false)
            const start = startTranslate.current
            const [min, max] = distanceRange.current
            const isSpeedSatisfied = () => effectiveSpeed && info.speed[0] * 1000 >= effectiveSpeed
            // 拖拽距离达到一半，或者满足速度要求
            if (start < 0) {
                if (translate > start && (translate >= min / 2 || isSpeedSatisfied())) {
                    return translate <= max / 2
                        // 原本在左边，右划满足条件，还原为0
                        ? setTranslate(0)
                        // 直接从最左边滑动至最右边
                        : setTranslate(max)
                }
            } else if (start > 0) {
                if (translate < start && (translate <= max / 2 || isSpeedSatisfied())) {
                    return translate >= min / 2
                        ? setTranslate(0)
                        : setTranslate(min)
                }
            } else {
                // 原本在中间
                if (translate < min / 2 || translate > max / 2 || isSpeedSatisfied()) {
                    return setTranslate(info.diff[0] > 0 ? max : min)
                }
            }
            // 未满足条件，返回原位
            setTranslate(startTranslate.current)
        },
        onDragCancel(info) {
            gestureOptions?.onDragCancel?.(info)
            setDragging(false)
            const [min, max] = distanceRange.current
            translate < min / 2 && translate > max / 2
                ? setTranslate(translate > 0 ? max : min)
                : setTranslate(0)
        }
    })

    const resetTranslate = () => {
        translate && setTranslate(0)
    }

    const renderActions = (actions: ActionType | ActionType[]) => {
        return toArray(actions)?.map((child, _index) => {
            return isValidElement(child)
                ? cloneElement(child as any, {
                    key: child.key || _index,
                    _index
                })
                : typeof child === 'object' && child
                    ? <SlidableActionsAction
                        key={_index}
                        {...child}
                        _index={_index}
                    />
                    : child
        })
    }

    return (
        <ClickAway
            eventType="pointerdown"
            onClickAway={resetTranslate}
        >
            <div
                {...props}
                css={style}
                className={clsx(classes.root, props.className)}
                data-dragging={dragging}
            >
                <div
                    className={classes.content}
                    {...draggableHandles}
                    style={{translate: `${translate}px 0`}}
                >
                    {props.children}
                </div>
                <div className={classes.actions}>
                    <SlidableActionsContext
                        value={
                            useMemo(() => ({
                                actionsContainer: leftActionsContainer.current,
                                translate, resetTranslate, autoReturn,
                                maxDistance: distanceRange.current[1]
                            }), [translate, distanceRange.current, autoReturn])
                        }
                    >
                        <div className={classes.actionsLeft}>
                            {!!leftActions &&
                                renderActions(leftActions)
                            }
                        </div>
                    </SlidableActionsContext>
                    <SlidableActionsContext
                        value={
                            useMemo(() => ({
                                actionsContainer: rightActionsContainer.current,
                                translate, resetTranslate, autoReturn,
                                maxDistance: -distanceRange.current[0]
                            }), [translate, distanceRange.current, autoReturn])
                        }
                    >
                        <div className={classes.actionsRight}>
                            {!!rightActions &&
                                renderActions(rightActions)
                            }
                        </div>
                    </SlidableActionsContext>
                </div>
            </div>
        </ClickAway>
    )
}) as any as {
    (props: SlidableActionsProps): ReactElement
    Action: typeof SlidableActionsAction
}

SlidableActions.Action = SlidableActionsAction