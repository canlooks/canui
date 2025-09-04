import React, {HTMLAttributes, MouseEventHandler, useCallback, useRef} from 'react'
import {useTheme} from '../components/theme'
import {useSync} from './hooks'

type Point = [number, number]

export type DragInfo<D = any> = {
    /** 开始位置 */
    start: Point
    /** 当前位置 */
    current: Point
    /** 拖拽距离，往右下拖拽为正数，往左上拖拽为负数 */
    diff: Point
    /** {@link GestureOptions.onDragStart}的返回值 */
    data: D
}

export interface DragEndInfo<D = any> extends DragInfo<D> {
    /** 从按下到抬起经过的时长（ms） */
    duration: number
    /** 拖拽速度（px/ms） */
    speed: Point
}

export type PinchStartInfo = {
    /** 两指中点 */
    startMiddle: Point
    /** 两指间距 */
    startSpacing: number
    /** TODO 旋转角度 */
    // startDegree: number
}

export interface PinchInfo<P = any> extends PinchStartInfo {
    currentMiddle: Point
    diffMiddle: Point

    currentSpacing: number
    diffSpacing: number

    // currentDegree: number
    // diffDegree: number
    data: P
}

type SharedGestureOptions = {
    disabled?: boolean
    /** 通常无需使用，若元素受zoom样式的影响，可传入zoom值修正 */
    zoom?: number
    /** 托管点击事件 */
    onClick?: MouseEventHandler
}

export interface DraggableGestureOptions<D = any> extends SharedGestureOptions {
    /** 按下后经过一段时间才触发拖拽事件，单位ms */
    delay?: number
    /** 拖拽一段距离后才触发拖拽事件，单位px */
    distance?: number
    onDragStart?(e: React.PointerEvent): D
    onDrag?(info: DragInfo<D>, e: PointerEvent): void
    onDragEnd?(info: DragEndInfo<D>): void
    onDragCancel?(info: DragEndInfo<D>): void
    /** 若设为true，则会禁用浏览器默认拖拽行为，通常在触屏端使用，默认为`true` */
    preventNativeTouchMove?: boolean
}

export interface PinchableGestureOptions<P = any> extends SharedGestureOptions {
    onPinchStart?(info: PinchStartInfo): P
    onPinch?(info: PinchInfo<P>): void
    onPinchEnd?(info: PinchInfo<P>): void
}

export function useDraggable<D = any>({disabled, ...options}: DraggableGestureOptions<D>) {
    return useGesture({draggable: !disabled, ...options}).draggableHandles
}

export function usePinchable<P = any>({disabled, ...options}: PinchableGestureOptions<P>) {
    return useGesture({draggable: false, pinchable: !disabled, ...options}).pinchableHandles
}

export interface GestureOptions<D = any, P = any>
    extends Omit<DraggableGestureOptions<D>, 'disabled'>,
        Omit<PinchableGestureOptions<P>, 'disabled'> {
    /** 是否可拖拽，默认为`true` */
    draggable?: boolean
    /** 是否可捏合缩放，默认为`false` */
    pinchable?: boolean
}


export type HandleProps = Required<Pick<HTMLAttributes<Element>, 'onPointerDown'>> & Pick<HTMLAttributes<Element>, 'onTouchStart' | 'onClick'>

export function useGesture<D = any, P = any>(options: GestureOptions<D, P>): {
    draggableHandles: HandleProps
    pinchableHandles: HandleProps
} {
    const {zoom} = useTheme()

    const syncOptions = useSync({
        zoom,
        draggable: true,
        distance: 0,
        preventNativeTouchMove: true,
        ...options
    })

    const pointerEventMap = useRef(new Map<number, React.PointerEvent>())

    const isDragged = useRef(false)
    const dragStartPosition = useRef<Point>([0, 0])
    const dragStartTime = useRef(0)
    const delayTimeout = useRef<any>(void 0)
    const data = useRef<any>(void 0)

    const isPinching = useRef(false)
    const pinchStartMiddle = useRef<Point>([0, 0])
    const pinchStartSpacing = useRef(0)

    const isRollback = useRef(false)

    /**
     * --------------------------------------------------------------------------------
     * Drag 部分
     */

    const dragStartFn = (e: React.PointerEvent) => {
        isDragged.current = false
        dragStartPosition.current = [e.clientX, e.clientY]
        dragStartTime.current = Date.now()
        data.current = syncOptions.current.onDragStart?.(e)
        document.documentElement.style.userSelect = 'none'
    }

    const draggingPointerDown = useCallback((e: React.PointerEvent) => {
        const {draggable, delay} = syncOptions.current
        if (!draggable || pointerEventMap.current.size >= 1) {
            return
        }

        if (delay) {
            delayTimeout.current = setTimeout(() => {
                delayTimeout.current = void 0
                dragStartFn(e)
            }, delay)
        } else {
            dragStartFn(e)
        }

        addEventListener('pointermove', draggingPointerMove)
        addEventListener('pointerup', draggingPointerUp)
        addEventListener('pointercancel', draggingPointerCancel)
    }, [])

    const settleDragInfo = ({clientX, clientY}: PointerEvent): DragInfo<D> => {
        const diffX = (clientX - dragStartPosition.current[0]) / syncOptions.current.zoom
        const diffY = (clientY - dragStartPosition.current[1]) / syncOptions.current.zoom

        return {
            start: dragStartPosition.current,
            current: [clientX, clientY],
            diff: [diffX, diffY],
            data: data.current!
        }
    }

    const draggingPointerMove = useCallback((e: PointerEvent) => {
        e.preventDefault()
        const dragInfo = settleDragInfo(e)
        if (!isRollback.current) {
            const absDiffX = Math.abs(dragInfo.diff[0])
            const absDiffY = Math.abs(dragInfo.diff[1])

            if (delayTimeout.current) {
                if (absDiffX > 5 || absDiffY > 5) {
                    // 延时尚未结束，但偏移量过大，取消拖拽
                    draggingPointerCancel(e)
                }
                return
            }
            const {distance} = syncOptions.current
            if (absDiffX < distance || absDiffY < distance) {
                // 拖拽距离未达到起步距离
                return
            }
        }
        isDragged.current = true
        syncOptions.current.onDrag?.(dragInfo, e)
    }, [])

    const cancelDragFn = () => {
        delayTimeout.current && clearTimeout(delayTimeout.current)
        delayTimeout.current = void 0
        document.documentElement.style.userSelect = ''
        removeEventListener('pointermove', draggingPointerMove)
        removeEventListener('pointerup', draggingPointerUp)
        removeEventListener('pointercancel', draggingPointerCancel)
        preventFn.current && removeEventListener('touchmove', preventFn.current)
    }

    const settleDragEndInfo = (e: PointerEvent) => {
        const dragInfo = settleDragInfo(e)
        const duration = Date.now() - dragStartTime.current
        return {
            ...dragInfo,
            duration,
            speed: [
                Math.abs(dragInfo.diff[0] / duration),
                Math.abs(dragInfo.diff[1] / duration)
            ] as Point
        }
    }

    const draggingPointerCancel = useCallback((e: PointerEvent) => {
        cancelDragFn()
        const callback = syncOptions.current.onDragCancel || syncOptions.current.onDragEnd
        callback?.(settleDragEndInfo(e))
    }, [])

    const draggingPointerUp = useCallback((e: PointerEvent) => {
        cancelDragFn()
        syncOptions.current.onDragEnd?.(settleDragEndInfo(e))
    }, [])

    /**
     * --------------------------------------------------------------------------------
     * Pinch 部分
     */

    const calPinchInfo = () => {
        const [{clientX: x1, clientY: y1}, {clientX: x2, clientY: y2}] = pointerEventMap.current.values()
        const a = Math.abs(x2 - x1)
        const b = Math.abs(y2 - y1)
        return {
            middle: [(x1 + x2) / 2, (y1 + y2) / 2] as Point,
            spacing: Math.sqrt(a * a + b * b)
        }
    }

    const pinchingCancelListened = useRef(false)

    const pinchingPointerDown = useCallback((e: React.PointerEvent) => {
        if (!syncOptions.current.pinchable || pointerEventMap.current.size >= 2) {
            return
        }
        pointerEventMap.current.set(e.pointerId, e)

        if (pointerEventMap.current.size === 2) {
            draggingPointerCancel(e.nativeEvent)
            isPinching.current = true
            document.documentElement.style.userSelect = 'none'
            const {middle: startMiddle, spacing: startSpacing} = calPinchInfo()
            pinchStartMiddle.current = startMiddle
            pinchStartSpacing.current = startSpacing
            data.current = syncOptions.current.onPinchStart?.({startMiddle, startSpacing})
            addEventListener('pointermove', pinchingPointerMove)
        }

        if (pinchingCancelListened.current) {
            return
        }
        pinchingCancelListened.current = true
        addEventListener('pointerup', pinchingPointerUp)
        addEventListener('pointercancel', pinchingPointerCancel)
    }, [])

    const settlePinchInfo = (): PinchInfo<P> => {
        const {middle: currentMiddle, spacing: currentSpacing} = calPinchInfo()
        const diffMiddleX = (currentMiddle[0] - pinchStartMiddle.current[0]) / syncOptions.current.zoom
        const diffMiddleY = (currentMiddle[1] - pinchStartMiddle.current[1]) / syncOptions.current.zoom

        return {
            startMiddle: pinchStartMiddle.current,
            currentMiddle,
            diffMiddle: [diffMiddleX, diffMiddleY],
            startSpacing: pinchStartSpacing.current,
            currentSpacing,
            diffSpacing: currentSpacing - pinchStartSpacing.current,
            data: data.current!
        }
    }

    const pinchingPointerMove = useCallback((e: PointerEvent) => {
        const event = pointerEventMap.current.get(e.pointerId)
        if (!event) {
            return
        }
        e.preventDefault()
        event.clientX = e.clientX
        event.clientY = e.clientY
        syncOptions.current.onPinch?.(settlePinchInfo())
    }, [])

    const debounce = useRef<any>(void 0)

    const pinchingPointerCancel = useCallback((e: PointerEvent) => {
        isPinching.current = false
        pointerEventMap.current.delete(e.pointerId)

        if (!pointerEventMap.current.size) {
            pinchingCancelListened.current = false
            removeEventListener('pointermove', pinchingPointerMove)
            removeEventListener('pointerup', pinchingPointerUp)
            removeEventListener('pointercancel', pinchingPointerCancel)
        }
    }, [])

    const pinchingPointerUp = useCallback((e: PointerEvent) => {
        if (isPinching.current) {
            if (debounce.current) {
                clearTimeout(debounce.current)
                debounce.current = void 0
                isRollback.current
                    = pinchingCancelListened.current
                    = false
                document.documentElement.style.userSelect = ''
                syncOptions.current.onPinchEnd?.(settlePinchInfo())
            } else {
                debounce.current = setTimeout(() => {
                    isRollback.current = true
                    dragStartFn(pointerEventMap.current.values().next().value!)
                }, 50)
            }
        }
        pinchingPointerCancel(e)
    }, [])

    /**
     * --------------------------------------------------------------------------------
     * 托管touch与click事件
     */

    const preventFn = useRef<(e: TouchEvent) => void>(void 0)

    const onTouchStart = useCallback(() => {
        preventFn.current = (e: TouchEvent) => {
            e.cancelable && e.preventDefault()
        }
        addEventListener('touchmove', preventFn.current, {passive: false})
    }, [])

    const onClick = useCallback((e: React.MouseEvent) => {
        if (isDragged.current || isPinching.current) {
            // 已经触发了拖拽或捏合，避免触发点击事件
            e.preventDefault()
            e.stopPropagation()
        } else {
            syncOptions.current.onClick?.(e)
        }
    }, [])

    const {preventNativeTouchMove, pinchable} = syncOptions.current

    return {
        draggableHandles: {
            onPointerDown: draggingPointerDown,
            onClick,
            ...preventNativeTouchMove && !pinchable && {onTouchStart}
        },
        pinchableHandles: {
            onPointerDown: pinchingPointerDown,
            onClick,
            ...preventNativeTouchMove && pinchable && {onTouchStart}
        }
    }
}