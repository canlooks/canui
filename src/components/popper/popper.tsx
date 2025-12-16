import React, {CSSProperties, ReactElement, ReactNode, Ref, SetStateAction, cloneElement, isValidElement, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {DivProps, DefineElement, Placement} from '../../types'
import {createPortal} from 'react-dom'
import {clsx, cloneRef, listenAllPredecessorsScroll, toArray, useControlled, useDerivedState, useForceUpdate, useSync, useSyncState, useUnmounted, useContainer, isElementOverflowed, OverflowEdge, isChildOf} from '../../utils'
import {ClickAway} from '../clickAway'
import {classes, style} from './popper.style'
import {PopperContext, usePopperContext} from './popperContext'
import {useTheme} from '../theme'

export type Trigger = 'click' | 'hover' | 'focus' | 'enter' | 'contextMenu'

const getAttemptOrder = (placement: Placement) => {
    const order: Placement[] = ['top', 'bottom', 'left', 'right', 'topLeft', 'topRight', 'rightTop', 'rightBottom', 'bottomRight', 'bottomLeft', 'leftBottom', 'leftTop']
    const index = order.indexOf(placement)
    if (index > -1) {
        return [
            placement,
            ...order.slice(index + 1),
            ...order.slice(0, index),
            placement
        ]
    }
    return order
}

export interface PopperProps extends Omit<DivProps, 'content' | 'children'> {
    /** 默认的ref会传递至`children` */
    popperRef?: Ref<PopperRef | null>

    /** 若不指定anchorElement，默认使用{@link children}作为目标锚点元素 */
    anchorElement?: DefineElement<HTMLElement>
    /** 弹框渲染的容器元素，默认为{@link document.body} */
    container?: DefineElement<HTMLElement>
    /** 同{@link container}，但会在useEffect后取值，且只会执行一次 */
    effectContainer?: DefineElement<HTMLElement>
    /** 汽泡里的内容 */
    content?: ReactNode
    /** 弹框偏离元素的距离 */
    offset?: number
    /** 自动打开弹框的触发方法，默认为`hover` */
    trigger?: Trigger | Trigger[] | false
    /** 点击元素时关闭，主要用于某元素同时存在tooltip与其他popper的情况，点击时打开popper同时关闭tooltip */
    clickToClose?: boolean
    placement?: Placement
    variant?: 'zoom' | 'collapse'
    /**
     * 限制弹框的宽度或高度与children的一致
     * @enum {@link variant}为`zoom`时，默认为`false`
     * @enum {@link variant}为`collapse`时，默认为`true`
     */
    sizeAdaptable?: boolean
    /** trigger{@link trigger}包含"hover"时，鼠标移入移的延迟时间，默认为`150(ms)` */
    mouseEnterDelay?: number
    /**默认为`150(ms)` */
    mouseLeaveDelay?: number

    defaultOpen?: boolean
    open?: boolean
    onOpenChange?(open: boolean): void
    onOpenChangeEnd?(open: boolean): void
    disabled?: boolean
    /** 点击内部选项是否自动关闭popper */
    autoClose?: boolean
    /**
     * @enum {true} 跟随父组件强制渲染；
     * @enum {false} 只有打开状态渲染，关闭后销毁；
     * @enum {undefined} 第一次打开时渲染，跟随父组件销毁。
     */
    forceRender?: boolean

    children?: ReactElement<any>
}

export interface PopperRef extends HTMLDivElement {
    // 重新计算弹框的位置与尺寸
    fit(options?: {
        forcePlacement?: Placement
        openAnimation?: boolean
    }, beforeOpen?: () => void): void
}

export function Popper({
    ref,
    popperRef,
    anchorElement,
    container = document.body,
    effectContainer,
    content,
    offset,
    trigger = 'hover',
    clickToClose,
    placement = 'top',
    variant = 'zoom',
    sizeAdaptable = variant === 'collapse',
    mouseEnterDelay = 150,
    mouseLeaveDelay = 150,
    defaultOpen = false,
    open,
    onOpenChange,
    onOpenChangeEnd,
    disabled,
    autoClose = false,
    forceRender,
    children,
    ...props
}: PopperProps) {
    const {spacing} = useTheme()

    offset ??= spacing[2]

    useImperativeHandle(popperRef, () => {
        if (innerPopperRef.current) {
            innerPopperRef.current.fit = fitPosition
        }
        return innerPopperRef.current!
    })

    /**
     * --------------------------------------------------------------
     * 打开关闭
     */

    const unmounted = useUnmounted()

    const openHolding = useRef(0)
    const hold = (open: boolean) => {
        return open ? ++openHolding.current
            : openHolding.current > 0 ? --openHolding.current
                : 0
    }

    const [innerOpen, _setInnerOpen] = useControlled(defaultOpen, open, onOpenChange)

    const setInnerOpen = (open: SetStateAction<boolean>) => {
        if (disabled || unmounted.current) {
            return
        }
        const newOpen = typeof open === 'function' ? open(innerOpen.current) : open
        if (newOpen === innerOpen.current) {
            return
        }
        // 打开时无需判断，关闭时需要判断openHolding.current是否归0
        if (newOpen || openHolding.current === 0) {
            _setInnerOpen(newOpen)
        }
    }

    const {onChildrenOpenChange: tellParentOpenChange} = usePopperContext()

    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            return
        }
        tellParentOpenChange(innerOpen.current)
    }, [innerOpen.current])

    const onChildrenOpenChange = (childrenOpen: boolean) => {
        hold(childrenOpen) === 0 && setInnerOpen(false)
    }

    const setOpenForce = (open: SetStateAction<boolean>) => {
        if (!open) {
            openHolding.current = 0
        }
        setInnerOpen(open)
    }

    const openAndHold = (open: boolean) => {
        hold(open)
        setInnerOpen(open)
    }

    /**
     * --------------------------------------------------------------
     * 渲染条件
     */

    const renderedOnce = useRef(!!forceRender)
    if (innerOpen.current) {
        renderedOnce.current = true
    }

    const forceUpdate = useForceUpdate()

    const animating = useRef(false)

    const onTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
        props.onTransitionEnd?.(e)
        onOpenChangeEnd?.(innerOpen.current)
        if (forceRender === false && !innerOpen.current) {
            renderedOnce.current = false
            forceUpdate()
        }
        animating.current = false
    }

    /**
     * --------------------------------------------------------------
     * 计算弹框位置
     */

    const anchorRef = useRef<HTMLElement>(null)

    const syncAnchorElement = useSync(anchorElement)

    const getAnchorElement = () => {
        return anchorRef.current || (typeof syncAnchorElement.current === 'function' ? syncAnchorElement.current() : syncAnchorElement.current)
    }

    const containerEl = useContainer(container, effectContainer)

    const innerPopperRef = useRef<PopperRef>(null)

    const [popperBounding, setPopperBounding] = useState<CSSProperties>()

    const [contextMenuEvent, setContextMenuEvent] = useSyncState<MouseEvent>()

    const [openNextFrame, setOpenNextFrame] = useDerivedState(!innerOpen.current, [innerOpen.current, contextMenuEvent.current])

    const placeA = useRef<string>(void 0)
    const placeB = useRef<string>(void 0)

    const fitPosition = (options?: {
        forcePlacement?: Placement
        openAnimation?: boolean
    }, beforeOpen?: () => void) => {
        const containerRect = containerEl.current!.getBoundingClientRect()

        const popperEl = innerPopperRef.current!
        let {offsetWidth: popperWidth, offsetHeight: popperHeight} = popperEl

        let pA: string, pB: string
        let left: number, top: number
        let width: number | undefined, height: number | undefined
        let originX: string, originY: string

        let attempt: (placement: Placement) => OverflowEdge | false

        if (contextMenuEvent.current) {
            // 右键菜单
            const mouseX = contextMenuEvent.current.clientX - containerRect.left
            const mouseY = contextMenuEvent.current.clientY - containerRect.top
            attempt = placement => {
                [, pA, pB] = placement.match(/^(top|bottom|left|right)(Top|Bottom|Left|Right)?/)!
                if (pB) {
                    switch (placement) {
                        case 'topLeft':
                        case 'leftTop':
                            left = mouseX - popperWidth
                            top = mouseY - popperHeight
                            originX = '100%'
                            originY = '100%'
                            break
                        case 'topRight':
                        case 'rightTop':
                            left = mouseX
                            top = mouseY - popperHeight
                            originX = '0%'
                            originY = '100%'
                            break
                        case 'bottomLeft':
                        case 'leftBottom':
                            left = mouseX - popperWidth
                            top = mouseY
                            originX = '100%'
                            originY = '0%'
                            break
                        case 'bottomRight':
                        case 'rightBottom':
                            left = mouseX
                            top = mouseY
                            originX = '0%'
                            originY = '0%'
                            break
                    }
                } else {
                    switch (pA) {
                        case 'top':
                            top = mouseY - popperHeight
                            originY = '100%'
                            break
                        case 'bottom':
                            top = mouseY
                            originY = '0%'
                            break
                        case 'left':
                            left = mouseX - popperWidth
                            originX = '100%'
                            break
                        case 'right':
                            left = mouseX
                            originX = '0%'
                            break
                    }
                    if (pA === 'top' || pA === 'bottom') {
                        left = mouseX - popperWidth / 2
                        originX = '50%'
                    } else {
                        top = mouseY - popperHeight / 2
                        originY = '50%'
                    }
                }
                popperEl.style.left = left + 'px'
                popperEl.style.top = top + 'px'
                return isElementOverflowed(popperEl, containerEl.current! === document.body ? void 0 : containerEl.current!)
            }
        } else {
            // 非右键菜单
            const anchorRect = getAnchorElement()!.getBoundingClientRect()
            const topEdge = anchorRect.top - containerRect.top
            const leftEdge = anchorRect.left - containerRect.left

            attempt = placement => {
                [, pA, pB] = placement.match(/^(top|bottom|left|right)(Top|Bottom|Left|Right)?/)!

                if (sizeAdaptable) {
                    if (pA === 'top' || pA === 'bottom') {
                        width = popperWidth = anchorRect.width
                        height = void 0
                        popperHeight = popperEl.offsetHeight
                    } else {
                        width = void 0
                        height = popperHeight = anchorRect.height
                        popperWidth = popperEl.offsetWidth
                    }
                } else {
                    width = height = void 0
                }

                switch (pA) {
                    case 'top':
                        top = topEdge - popperHeight - offset
                        originY = '100%'
                        break
                    case 'bottom':
                        top = topEdge + anchorRect.height + offset
                        originY = '0%'
                        break
                    case 'left':
                        left = leftEdge - popperWidth - offset
                        originX = '100%'
                        break
                    case 'right':
                        left = leftEdge + anchorRect.width + offset
                        originX = '0%'
                }
                switch (pB) {
                    case 'Left':
                        left = leftEdge
                        originX = '0%'
                        break
                    case 'Right':
                        left = leftEdge - popperWidth + anchorRect.width
                        originX = '100%'
                        break
                    case 'Top':
                        top = topEdge
                        originY = '0%'
                        break
                    case 'Bottom':
                        top = topEdge - popperHeight + anchorRect.height
                        originY = '100%'
                        break
                    default:
                        if (pA === 'top' || pA === 'bottom') {
                            left = leftEdge + (anchorRect.width - popperWidth) / 2
                            originX = '50%'
                        } else {
                            top = topEdge + (anchorRect.height - popperHeight) / 2
                            originY = '50%'
                        }
                }
                popperEl.style.left = left + 'px'
                popperEl.style.top = top + 'px'
                return isElementOverflowed(popperEl, containerEl.current! === document.body ? void 0 : containerEl.current!)
            }
        }

        if (options?.forcePlacement) {
            attempt(options.forcePlacement)
        } else {
            const attemptOrder = getAttemptOrder(placement)
            for (let i = 0; i < attemptOrder.length; i++) {
                if (attempt(attemptOrder[i]) === false) {
                    break
                }
            }
        }

        const settle = () => {
            setPopperBounding({
                left, top, width, height,
                transformOrigin: `${originX!} ${originY!}`
            })
            placeA.current = pA!
            placeB.current = pB!
        }

        if (beforeOpen) {
            if (sizeAdaptable) {
                // 自适应尺寸需要在打开前设置
                popperEl.style.width = width ? width + 'px' : ''
                popperEl.style.height = height ? height + 'px' : ''
            }
            beforeOpen()
        }

        if (options?.openAnimation) {
            popperEl.style.transform = variant === 'collapse'
                ? pA! === 'top' || pA! === 'bottom' ? 'scaleY(0)' : 'scaleX(0)'
                : 'scale(0)'
            animating.current = true
            requestAnimationFrame(() => {
                settle()
                setOpenNextFrame(true)
            })
        } else {
            settle()
        }
    }

    useLayoutEffect(() => {
        if (innerOpen.current) {
            fitPosition({openAnimation: true}, triggerBeforeOpen)
        }
    }, [innerOpen.current, contextMenuEvent.current])

    /**
     * --------------------------------------------------------------
     * 滚动跟随
     */

    useEffect(() => {
        if (innerOpen.current) {
            // 子元素尺寸变化，重新计算位置
            const resizeObserver = new ResizeObserver(() => {
                !animating.current && fitPosition()
            })
            resizeObserver.observe(getAnchorElement()!)

            // 弹框超出视口范围，重新计算位置
            const intersectionObserver = new IntersectionObserver(([{isIntersecting}]) => {
                !isIntersecting && !animating.current && fitPosition()
            }, {threshold: 1})
            intersectionObserver.observe(innerPopperRef.current!)

            // 窗口尺寸变化，尝试关闭弹框
            const windowResize = () => {
                setOpenForce(false)
            }
            addEventListener('resize', windowResize)

            const scroll = () => {
                contextMenuEvent.current
                    ? setOpenForce(false)
                    : fitPosition({forcePlacement: placeA.current! + placeB.current! as Placement})
            }
            // 为所有父元素添加滚动事件
            const scrollDisposer = listenAllPredecessorsScroll(getAnchorElement()!, scroll)

            return () => {
                resizeObserver.disconnect()
                intersectionObserver.disconnect()
                removeEventListener('resize', windowResize)
                scrollDisposer()
            }
        }
        return
    }, [innerOpen.current])

    /**
     * ----------------------------------------------------------------
     * 绑定事件
     */

    const triggersSet = useMemo(() => {
        return new Set<Trigger | false>(toArray(trigger)!)
    }, [trigger])

    /**
     * hover相关
     */

    const hoverable = triggersSet.has('hover')
    const enterTimeout = useRef<any>(void 0)
    const leaveTimeout = useRef<any>(void 0)
    const isOvering = useRef(false)

    const pointerEnterFn = useCallback(() => {
        clearTimeout(leaveTimeout.current)
        mouseEnterDelay
            ? enterTimeout.current = setTimeout(() => setInnerOpen(true), mouseEnterDelay)
            : setInnerOpen(true)
    }, [mouseEnterDelay])

    const pointerLeaveFn = useCallback(() => {
        clearTimeout(enterTimeout.current)
        mouseLeaveDelay
            ? leaveTimeout.current = setTimeout(() => setInnerOpen(false), mouseLeaveDelay)
            : setInnerOpen(false)
    }, [mouseLeaveDelay])

    useEffect(() => {
        if (!hoverable) {
            return
        }
        const anchorEl = getAnchorElement()
        if (!anchorEl) {
            return
        }
        const pointerOver = (e: PointerEvent) => {
            if (!isOvering.current && isChildOf(e.target as Element, anchorEl)) {
                isOvering.current = true
                pointerEnterFn()
            }
        }
        const pointerLeave = () => {
            isOvering.current = false
            pointerLeaveFn()
        }
        anchorEl.addEventListener('pointerover', pointerOver)
        anchorEl.addEventListener('pointerleave', pointerLeave)
        return () => {
            anchorEl.removeEventListener('pointerover', pointerOver)
            anchorEl.removeEventListener('pointerleave', pointerLeave)
        }
    }, [])

    // 绑定弹框元素，鼠标移入弹框也要保持弹框打开
    useEffect(() => {
        if (!hoverable || !innerPopperRef.current) {
            return
        }
        const popperEl = innerPopperRef.current!
        popperEl.addEventListener('pointerenter', pointerEnterFn)
        popperEl.addEventListener('pointerleave', pointerLeaveFn)
        return () => {
            popperEl.removeEventListener('pointerenter', pointerEnterFn)
            popperEl.removeEventListener('pointerleave', pointerLeaveFn)
        }
    }, [innerOpen.current, mouseLeaveDelay])

    /**
     * focus相关
     */

    const focusable = triggersSet.has('focus')

    useEffect(() => {
        if (!focusable) {
            return
        }
        const anchorEl = getAnchorElement()
        if (!anchorEl) {
            return
        }
        const focus = () => openAndHold(true)
        const blur = () => openAndHold(false)
        anchorEl.addEventListener('focus', focus)
        anchorEl.addEventListener('blur', blur)
        return () => {
            anchorEl.removeEventListener('focus', focus)
            anchorEl.removeEventListener('blur', blur)
        }
    }, [focusable])

    /**
     * enter相关
     */

    const enterable = triggersSet.has('enter')

    useEffect(() => {
        if (!enterable) {
            return
        }
        const anchorEl = getAnchorElement()
        if (!anchorEl) {
            return
        }
        const keyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                openAndHold(true)
            }
        }
        anchorEl.addEventListener('keydown', keyDown)
        return () => {
            anchorEl.removeEventListener('keydown', keyDown)
        }
    }, [enterable])

    /**
     * click相关
     */

    const clickable = triggersSet.has('click')

    useEffect(() => {
        if (!clickable) {
            return
        }
        const anchorEl = getAnchorElement()
        if (!anchorEl) {
            return
        }
        const click = () => openAndHold(true)
        anchorEl.addEventListener('click', click)
        return () => {
            anchorEl.removeEventListener('click', click)
        }
    }, [])

    const onClickAway = () => {
        innerOpen.current && setOpenForce(false)
    }

    /**
     * clickToClose
     */

    useEffect(() => {
        if (clickToClose) {
            const anchorEl = getAnchorElement()
            if (!anchorEl) {
                return
            }
            const click = () => {
                setOpenForce(false)
            }
            anchorEl.addEventListener('click', click)
            return () => {
                anchorEl.removeEventListener('click', click)
            }
        }
    }, [clickToClose])

    /**
     * contextmenu相关
     */

    const contextMenuable = triggersSet.has('contextMenu')

    useEffect(() => {
        if (!contextMenuable) {
            return
        }
        const anchorEl = getAnchorElement()
        if (!anchorEl) {
            return
        }
        const contextMenu = (e: MouseEvent) => {
            e.preventDefault()
            setContextMenuEvent(e)
            openAndHold(true)
        }
        anchorEl.addEventListener('contextmenu', contextMenu)
        return () => {
            anchorEl.removeEventListener('contextmenu', contextMenu)
        }
    }, [])

    /**
     * --------------------------------------------------------------
     * PopperContext
     */

    const beforeOpenCallbacks = useRef(new Set<() => void>())

    const triggerBeforeOpen = () => {
        for (const cb of beforeOpenCallbacks.current) {
            cb()
        }
    }

    const contextValue = useMemo(() => ({
        autoClose,
        open: innerOpen.current,
        setOpen: setOpenForce,
        onChildrenOpenChange,
        beforeOpenCallbacks: beforeOpenCallbacks.current
    }), [innerOpen.current, autoClose])

    const childRef = useCallback(
        cloneRef(children?.props.ref, anchorRef, ref),
        [children?.props.ref, ref]
    )

    return (
        <>
            {isValidElement(children)
                ? cloneElement(children as any, {
                    ref: childRef
                })
                : children
            }
            {renderedOnce.current && containerEl.current && createPortal(
                <ClickAway
                    disabled={!clickable && !enterable && !contextMenuable}
                    // 右键菜单点击anchor需要关闭弹框
                    targets={() => contextMenuEvent.current ? void 0 : getAnchorElement()}
                    onClickAway={onClickAway}
                >
                    <div
                        {...props}
                        ref={innerPopperRef}
                        css={style}
                        className={clsx(classes.root, props.className)}
                        style={{
                            ...popperBounding,
                            ...!openNextFrame.current && {
                                transition: 'none',
                                transform: 'scale(1)'
                            },
                            ...props.style
                        }}
                        data-open={innerOpen.current}
                        data-variant={variant}
                        data-place-a={placeA.current}
                        data-place-b={placeB.current}
                        onTransitionEnd={onTransitionEnd}
                    >
                        <PopperContext value={contextValue}>
                            {content}
                        </PopperContext>
                    </div>
                </ClickAway>,
                containerEl.current
            )}
        </>
    )
}