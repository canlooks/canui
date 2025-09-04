import React, {useMemo, useRef, useState, CSSProperties, ElementType} from 'react'
import {ColorPropsValue, DivProps, OverridableComponent, OverridableProps, Placement, SlotsAndProps} from '../../types'
import {clsx, cloneRef, toArray, useSync, useControlled, GestureOptions, useDraggable} from '../../utils'
import {classes, handleCursors, useStyle} from './resizable.style'

type HandleAbbr =
    | 't' | 'r' | 'b' | 'l'
    | 'tl' | 'tr' | 'br' | 'bl'
    | 'lt' | 'rt' | 'lb' | 'rb'

export type Handle = Placement | HandleAbbr

export interface ResizableOwnProps extends SlotsAndProps<{
    container: DivProps
}> {
    /** 默认为`mouse` */
    variant?: 'mouse' | 'touch'
    /** 使用的拖拽把手，默认全部生效。注意：使用“角把手”会同时渲染对应的两个“边把手”。 */
    handles?: Handle | Handle[]
    /**
     * 拖拽把手的尺寸
     * @enum {@link variant}为`mouse`时，默认为`8`
     * @enum {@link variant}为`touch`时，默认为`12`
     */
    handleSize?: number
    /** 拖拽把手颜色，默认为`secondary` */
    handleColor?: ColorPropsValue
    /** {@link variant}为`touch`时生效，默认为`outside` */
    handlePosition?: 'outside' | 'inside'
    /** 是否固定长宽比例，默认为`false` */
    fixedRatio?: boolean
    onResize?(width: number, height: number): void
    onResizeEnd?(width: number, height: number): void
    gestureOptions?: GestureOptions
    /** 受控的尺寸 */
    defaultWidth?: CSSProperties['width']
    defaultHeight?: CSSProperties['height']
    width?: CSSProperties['width']
    height?: CSSProperties['height']
    /** 设定尺寸限制 */
    minWidth?: CSSProperties['minWidth']
    minHeight?: CSSProperties['minHeight']
    maxWidth?: CSSProperties['maxWidth']
    maxHeight?: CSSProperties['maxHeight']
}

export type ResizableProps<C extends ElementType = 'div'> = OverridableProps<ResizableOwnProps, C>

const handleAlias: { [P in Handle]: HandleAbbr } = {
    t: 't',
    r: 'r',
    b: 'b',
    l: 'l',

    tl: 'tl',
    lt: 'tl',

    tr: 'tr',
    rt: 'tr',

    br: 'br',
    rb: 'br',

    bl: 'bl',
    lb: 'bl',

    top: 't',
    right: 'r',
    bottom: 'b',
    left: 'l',

    topLeft: 'tl',
    leftTop: 'tl',

    topRight: 'tr',
    rightTop: 'tr',

    bottomLeft: 'bl',
    leftBottom: 'bl',

    bottomRight: 'br',
    rightBottom: 'br'
}

export const Resizable = (
    ({
        component: Component = 'div',
        slots = {},
        slotProps = {},
        variant = 'mouse',
        handles = ['t', 'r', 'b', 'l', 'tl', 'tr', 'br', 'bl'],
        handleSize = variant === 'mouse' ? 8 : 12,
        handleColor = 'secondary',
        handlePosition = 'outside',
        fixedRatio,
        onResize,
        onResizeEnd,
        gestureOptions,
        defaultWidth,
        defaultHeight,
        width,
        height,
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        ...props
    }: ResizableProps) => {
        const abbrHandles = useMemo(() => {
            return [...toArray(handles)!.map(h => handleAlias[h])]
        }, [handles])

        const innerRef = useRef<HTMLDivElement>(null)

        const [innerWidth, setInnerWidth] = useControlled(defaultWidth, width)
        const [innerHeight, setInnerHeight] = useControlled(defaultHeight, height)

        const [dragStartState, setDragStartState] = useState<{
            width: number
            height: number
            handleType: Handle
            includeL: boolean
            includeR: boolean
            includeT: boolean
            includeB: boolean
        }>()

        const syncProps = useSync({onResize, onResizeEnd})

        const draggableHandles = useDraggable({
            ...gestureOptions,
            onDragStart(e: React.PointerEvent<HTMLElement>) {
                gestureOptions?.onDragStart?.(e)
                const handleType = e.currentTarget.dataset.handle as HandleAbbr
                setDragStartState({
                    width: innerRef.current!.offsetWidth,
                    height: innerRef.current!.offsetHeight,
                    handleType,
                    includeL: handleType.includes('l'),
                    includeR: handleType.includes('r'),
                    includeT: handleType.includes('t'),
                    includeB: handleType.includes('b')
                })
                document.body.style.cursor = handleCursors[handleType] || ''
            },
            onDrag(info, e) {
                gestureOptions?.onDrag?.(info, e)
                let {diff: [dx, dy]} = info
                const {
                    width,
                    height,
                    includeT,
                    includeB,
                    includeL,
                    includeR
                } = dragStartState!
                if (includeL) {
                    dx *= -1
                }
                if (includeT) {
                    dy *= -1
                }
                if (includeL || includeR) {
                    setInnerWidth(width + dx)
                }
                if (includeT || includeB) {
                    setInnerHeight(height + dy)
                }
            },
            onDragEnd(info) {
                gestureOptions?.onDragEnd?.(info)
                setDragStartState(void 0)
                document.body.style.cursor = ''
                syncProps.current?.onResizeEnd?.(innerRef.current!.offsetWidth, innerRef.current!.offsetHeight)
            }
        })

        const {container: Container = 'div'} = slots
        const {container: containerProps} = slotProps

        return (
            <Component
                {...props}
                ref={cloneRef(innerRef, props.ref)}
                css={useStyle({variant, handleSize, handleColor: handleColor || 'secondary'})}
                className={clsx(classes.root, props.className)}
                data-dragging={!!dragStartState}
                data-handle-position={handlePosition}
                style={{
                    ...props.style,
                    minWidth,
                    maxWidth,
                    minHeight,
                    maxHeight,
                    ...typeof innerWidth.current === 'number' && {width: innerWidth.current},
                    ...typeof innerHeight.current === 'number' && {height: innerHeight.current}
                }}
            >
                <Container {...containerProps} className={clsx(classes.container, containerProps?.className)}>
                    {props.children}
                </Container>
                {abbrHandles.map(h =>
                    <div
                        key={h}
                        className={h.length === 1 ? classes.edge : classes.corner}
                        data-handle={h}
                        data-dragging={dragStartState?.handleType === h}
                        {...draggableHandles}
                    />
                )}
            </Component>
        )
    }
) as OverridableComponent<ResizableOwnProps>