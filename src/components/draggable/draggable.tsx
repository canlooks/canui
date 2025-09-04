import React, {ReactElement, cloneElement, isValidElement, useMemo, useState, ReactNode, Ref, useImperativeHandle, CSSProperties} from 'react'
import {DraggableGestureOptions, HandleProps, range, useDraggable} from '../../utils'
import {DefineElement} from '../../types'
import {useTheme} from '../theme'

export type DraggableTargetProps = {
    onTransitionEnd(e: React.TransitionEvent): void
    style: {
        translate: string
    },
    'data-dragging': 'true' | 'false'
}

export type DraggableRef = {
    restore(transition?: boolean): void
}

export interface DraggableProps extends DraggableGestureOptions {
    ref?: Ref<DraggableRef>
    translateLimit?(targetTranslate: [number, number]): [number, number]
    /** 拖拽结束后是否恢复原来的位置，默认为`false` */
    restoreOnDragEnd?: boolean
    /** 恢复时是否播放过度动画，默认为`true` */
    restoreTransition?: boolean

    container?: DefineElement
    children: ReactElement | ((targetProps: DraggableTargetProps, handleProps: HandleProps) => ReactNode)
}

export function Draggable({
    ref,
    translateLimit,
    restoreOnDragEnd,
    restoreTransition = true,
    container,
    children,
    ...draggableOptions
}: DraggableProps) {
    useImperativeHandle(ref, () => ({
        restore
    }))

    const [transiting, setTransiting] = useState(false)

    const restore = (transition = restoreTransition) => {
        transition && setTransiting(true)
        setTranslate([0, 0])
    }

    const onTransitionEnd = () => {
        setTransiting(false)
    }

    const [translate, setTranslate] = useState([0, 0])

    const [isDragging, setIsDragging] = useState(false)

    const props = (children as any).props

    const draggableHandles = useDraggable({
        ...draggableOptions,
        onDragStart(e) {
            draggableOptions.onDragStart?.(e)
            setIsDragging(true)
            return [...translate]
        },
        onDrag(info, e) {
            draggableOptions.onDrag?.(info, e)
            const {diff: [dx, dy], data: [startX, startY]} = info
            let newX = startX + dx
            let newY = startY + dy
            if (translateLimit) {
                [newX, newY] = translateLimit([newX, newY])
            } else {
                const containerEl = typeof container === 'function' ? container() : container
                if (containerEl) {
                    const {clientWidth, clientHeight} = containerEl
                    newX = range(startX + dx, -clientWidth / 2, clientWidth / 2)
                    newY = range(startY + dy, -clientHeight / 2, clientHeight / 2)
                }
            }
            setTranslate([newX, newY])
        },
        onDragEnd(info) {
            draggableOptions.onDragEnd?.(info)
            setIsDragging(false)
            restoreOnDragEnd && restore()
        },
        onClick: props?.onClick
    })

    const theme = useTheme()

    const style = useMemo<CSSProperties>(() => ({
        translate: `${translate[0]}px ${translate[1]}px`,
        ...transiting && {transition: `translate .3s ${theme.easing.bounce}`},
        ...props?.style
    }), [translate, transiting, theme, props?.style])

    if (isValidElement(children)) {
        return cloneElement(children as any, {
            style,
            'data-dragging': String(isDragging),
            onTransitionEnd,
            ...draggableHandles,
        })
    }

    if (typeof children === 'function') {
        return children({
            style: {
                translate: `${translate[0]}px ${translate[1]}px`,
                ...transiting && {transition: `translate .3s ${theme.easing.bounce}`},
            },
            'data-dragging': String(isDragging) as 'true' | 'false',
            onTransitionEnd
        }, draggableHandles)
    }

    return children
}