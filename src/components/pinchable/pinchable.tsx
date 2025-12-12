import React, {cloneElement, ElementType, ReactElement, Ref, useImperativeHandle, useRef} from 'react'
import {OverridableProps} from '../../types'
import {cloneRef, clsx, GestureOptions, range, useControlled, useGesture} from '../../utils'
import {classes, style} from './pinchable.style'

export interface PinchableRef extends HTMLDivElement {
    zoomIn(): void
    zoomOut(): void
    zoomTo(n?: number): void
    reset(transition?: boolean): void
    rotateLeft(): void
    rotateRight(): void
    rotate(deg: number): void
}

type PinchableOwnProps = {
    ref?: Ref<PinchableRef>
    gestureOptions?: GestureOptions
    defaultScale?: number
    scale?: number
    onScaleChange?(scale: number): void
    /** 缩放限制，`scale`非受控模式下有效，默认为1-6 */
    scaleLimit?: [number, number]
    defaultTranslate?: [number, number]
    translate?: [number, number]
    onTranslateChange?(translate: [number, number]): void
    /** 平移限制，`translate`非受控模式下有效 */
    translateLimit?: (targetX: number, targetY: number, scale: number) => [number, number]
    defaultRotate?: number
    rotate?: number
    onRotateChange?(rotate: number): void
    children?: ReactElement
}

export type PinchableProps<C extends ElementType = 'div'> = OverridableProps<PinchableOwnProps, C>

export const Pinchable = (({
    component: Component = 'div',
    ref,
    gestureOptions,
    defaultScale = 1,
    scale,
    onScaleChange,
    scaleLimit = [1, 6],
    defaultTranslate = [0, 0],
    translate,
    onTranslateChange,
    translateLimit,
    defaultRotate = 0,
    rotate,
    onRotateChange,
    children,
    ...props
}: PinchableProps) => {
    useImperativeHandle(ref, () => {
        if (wrapperRef.current) {
            wrapperRef.current.zoomIn = () => {
                zoomFn(innerScale.current * 1.5)
            }
            wrapperRef.current.zoomOut = () => {
                zoomFn(innerScale.current * .5)
            }
            wrapperRef.current.zoomTo = zoomFn
            wrapperRef.current.rotate = rotateFn
            wrapperRef.current.rotateLeft = () => {
                rotateFn(innerRotate.current - 90)
            }
            wrapperRef.current.rotateRight = () => {
                rotateFn(innerRotate.current - 90)
            }
            wrapperRef.current.reset = resetAll
        }
        return wrapperRef.current!
    })

    const wrapperRef = useRef<PinchableRef>(null)
    const contentRef = useRef<HTMLElement>(null)

    const [innerScale, setInnerScale] = useControlled(defaultScale, scale, onScaleChange)
    const [innerTranslate, setInnerTranslate] = useControlled(defaultTranslate, translate, onTranslateChange)
    const [innerRotate, setInnerRotate] = useControlled(defaultRotate, rotate, onRotateChange)

    const {draggableHandles, pinchableHandles} = useGesture({
        ...gestureOptions,
        pinchable: true,
        onDragStart(info) {
            gestureOptions?.onDragStart?.(info)
            return [...innerTranslate.current]
        },
        onDrag(info, e) {
            gestureOptions?.onDrag?.(info, e)
            const {diff: [dx, dy], data: [startX, startY]} = info
            setInnerTranslate(translateLimitFn(startX + dx, startY + dy))
        },
        onPinchStart(info) {
            gestureOptions?.onPinchStart?.(info)
            const {startSpacing, startMiddle: [sx, sy]} = info
            const {x, y, width, height} = contentRef.current!.getBoundingClientRect()
            const startDiagonal = Math.sqrt(width ** 2 + height ** 2)

            return {
                startScale: innerScale.current,
                startTranslate: [...innerTranslate.current],
                middlePosition: [
                    (sx - x - width / 2) / width,
                    (sy - y - height / 2) / height
                ],
                startDiagonal,
                rectRatio: width / height,
                spacingRatio: startSpacing / startDiagonal
            }
        },
        onPinch(info) {
            gestureOptions?.onPinch?.(info)
            const {
                currentSpacing, diffSpacing, diffMiddle: [dx, dy],
                data: {spacingRatio, startDiagonal, startScale, rectRatio, startTranslate, middlePosition}
            } = info
            const targetDiagonal = currentSpacing / spacingRatio
            const targetScale = targetDiagonal / startDiagonal
            const newScale = range(startScale * targetScale, ...scaleLimit)
            setInnerScale(newScale)

            const diffDiagonal = diffSpacing / spacingRatio
            const diffH = diffDiagonal / Math.sqrt(rectRatio ** 2 + 1)
            const diffW = diffH * rectRatio
            const newX = startTranslate[0] - diffW * middlePosition[0] + dx
            const newY = startTranslate[1] - diffH * middlePosition[1] + dy
            setInnerTranslate(translateLimitFn(newX, newY, newScale))
        }
    })

    if (!children) {
        return
    }

    const translateLimitFn = (x: number, y: number, scale = innerScale.current, deg = innerRotate.current): [number, number] => {
        if (translateLimit) {
            return translateLimit(x, y, scale)
        }

        const {clientWidth: wrapperWidth, clientHeight: wrapperHeight} = wrapperRef.current!
        const {offsetWidth, offsetHeight} = contentRef.current!
        const isRotated = deg % 180 !== 0
        const contentWidth = (isRotated ? offsetHeight : offsetWidth) * scale
        const contentHeight = (isRotated ? offsetWidth : offsetHeight) * scale
        const limitX = contentWidth > wrapperWidth ? (contentWidth - wrapperWidth) / 2 : 0
        const limitY = contentHeight > wrapperHeight ? (contentHeight - wrapperHeight) / 2 : 0

        return [
            range(x, -limitX, limitX),
            range(y, -limitY, limitY)
        ]
    }

    const childrenProps = children.props as any

    const allowTransition = () => {
        contentRef.current && (contentRef.current.dataset.transition = 'true')
    }

    const zoomFn = (targetScale: number, originX?: number, originY?: number) => {
        allowTransition()
        const content = contentRef.current!
        const newScale = range(targetScale, ...scaleLimit)
        const newWidth = content.offsetWidth * newScale
        const newHeight = content.offsetHeight * newScale
        if (typeof originX === 'undefined' || typeof originY === 'undefined') {
            const {x, y, width, height} = wrapperRef.current!.getBoundingClientRect()
            originX = x + (width / 2)
            originY = y + (height / 2)
        }
        const {x, y, width, height} = contentRef.current!.getBoundingClientRect()
        const diffW = newWidth - width
        const diffH = newHeight - height
        const positionX = (originX - x - width / 2) / width
        const positionY = (originY - y - height / 2) / height
        const newX = innerTranslate.current[0] - diffW * positionX
        const newY = innerTranslate.current[1] - diffH * positionY
        setInnerScale(newScale)
        setInnerTranslate(translateLimitFn(newX, newY, newScale))
    }

    const resetZoom = (transition = true) => {
        transition && allowTransition()
        setInnerScale(range(1, ...scaleLimit))
        setInnerTranslate([0, 0])
    }

    const rotateFn = (deg: number) => {
        allowTransition()
        setInnerRotate(deg)
        setInnerTranslate(translateLimitFn(...innerTranslate.current, innerScale.current, deg))
    }

    const resetAll = (transition = true) => {
        transition && allowTransition()
        resetZoom(false)
        setInnerRotate(0)
    }

    const onDoubleClick = (e: React.MouseEvent) => {
        childrenProps.onDoubleClick?.(e)
        if (innerScale.current < 1.5) {
            zoomFn(3, e.clientX, e.clientY)
        } else {
            resetZoom()
        }
    }

    const onWheel = (e: React.WheelEvent) => {
        childrenProps.onMouseWheel?.(e)
        e.deltaY > 0
            ? zoomFn(innerScale.current * .8, e.clientX, e.clientY)
            : zoomFn(innerScale.current * 1.2, e.clientX, e.clientY)
    }

    const onTransitionEnd = (e: React.TransitionEvent<HTMLElement>) => {
        e.currentTarget.dataset.transition = 'false'
        setInnerRotate(innerRotate.current % 360)
    }

    return (
        <Component
            {...props}
            ref={wrapperRef}
            css={style}
            className={clsx(classes.root, props.className)}
            {...pinchableHandles}
        >
            {cloneElement(children as any, {
                ref: cloneRef(contentRef, childrenProps.ref),
                className: clsx(classes.content, childrenProps.className),
                style: {
                    ...childrenProps?.style,
                    scale: innerScale.current,
                    translate: `${innerTranslate.current[0]}px ${innerTranslate.current[1]}px`,
                    rotate: innerRotate.current + 'deg',
                    transformOrigin: 'center'
                },
                ...draggableHandles,
                onDoubleClick,
                onWheel,
                onTransitionEnd
            })}
        </Component>
    )
}) as <C extends ElementType = 'div'>(props: PinchableProps<C>) => ReactElement