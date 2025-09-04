import {DivProps, OverridableComponent, OverridableProps, SlotsAndProps} from '../../types'
import React, {ElementType, Ref, useEffect, useRef} from 'react'
import {clsx, cloneRef, useDraggable} from '../../utils'
import {classes, useStyle} from './scrollbar.style'

export interface ScrollbarOwnProps extends SlotsAndProps<{
    scroller: DivProps
    scrollerWrapper: DivProps
}> {
    /**
     * 默认为`contain`
     * @enum `contain` 滚动条会挤压内容区域
     * @enum `cover` 滚动条会覆盖在内容上
     */
    variant?: 'contain' | 'cover'
    /** 是否自动隐藏滚动条，默认为`true` */
    autoHide?: boolean
    /** 默认为`0.8em` */
    size?: number | string

    /** 默认的`ref`属性传递至`scroller`元素，外层元素的`ref`需要指定`wrapperRef` */
    wrapperRef?: Ref<HTMLDivElement>
}

export type ScrollbarProps<C extends ElementType = 'div'> = OverridableProps<ScrollbarOwnProps, C>

export const Scrollbar = (
    ({
        component: Component = 'div',
        variant = 'contain',
        autoHide = true,
        size = '.8em',
        wrapperRef,
        onScroll,
        slots = {},
        slotProps = {},
        ...props
    }: ScrollbarProps) => {
        const containerRef = useRef<HTMLDivElement>(null)
        const scrollerRef = useRef<HTMLElement>(null)
        const scrollerWrapperRef = useRef<HTMLElement>(null)

        if (typeof size === 'number') {
            size = size + 'px'
        }

        const trackXRef = useRef<HTMLDivElement>(null)
        const trackYRef = useRef<HTMLDivElement>(null)
        const thumbXRef = useRef<HTMLDivElement>(null)
        const thumbYRef = useRef<HTMLDivElement>(null)

        const verticalInfo = useRef({
            thumbScrollLength: 0,
            scrollRatio: 1
        })

        const horizontalInfo = useRef({
            thumbScrollLength: 0,
            scrollRatio: 1
        })

        useEffect(() => {
            const container = containerRef.current
            const scroller = scrollerRef.current
            const scrollerWrapper = scrollerWrapperRef.current
            if (!container || !scroller || !scrollerWrapper) {
                return
            }

            const resizeObserver = new ResizeObserver(() => {
                container.dataset.verticalScrollable = container.dataset.horizontalScrollable = 'true'
                const {scrollHeight, clientHeight, scrollWidth, clientWidth} = scroller

                if (scrollHeight > clientHeight) {
                    const {offsetHeight} = trackYRef.current!
                    thumbYRef.current!.style.height = offsetHeight * (clientHeight / scrollHeight) + 'px'
                    const contentScrollLength = scrollHeight - clientHeight
                    const thumbScrollLength = verticalInfo.current.thumbScrollLength = offsetHeight - thumbYRef.current!.offsetHeight
                    verticalInfo.current.scrollRatio = thumbScrollLength / contentScrollLength
                } else {
                    container.dataset.verticalScrollable = 'false'
                }

                if (scrollWidth > clientWidth) {
                    const {offsetWidth} = trackXRef.current!
                    thumbXRef.current!.style.width = offsetWidth * (clientWidth / scrollWidth) + 'px'
                    const contentScrollLength = scrollWidth - clientWidth
                    const thumbScrollLength = horizontalInfo.current.thumbScrollLength = offsetWidth - thumbXRef.current!.offsetWidth
                    horizontalInfo.current.scrollRatio = thumbScrollLength / contentScrollLength
                } else {
                    container.dataset.horizontalScrollable = 'false'
                }
            })

            resizeObserver.observe(scroller)
            resizeObserver.observe(scrollerWrapper)

            return () => {
                resizeObserver.disconnect()
            }
        }, [])

        const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
            onScroll?.(e)
            scrollerProps?.onScroll?.(e)

            const {scrollTop, scrollLeft} = scrollerRef.current!
            thumbYRef.current!.style.top = scrollTop * verticalInfo.current.scrollRatio + 'px'
            thumbXRef.current!.style.left = scrollLeft * horizontalInfo.current.scrollRatio + 'px'
        }

        const updateScrollTop = (top: number) => {
            top = Math.max(
                Math.min(top, verticalInfo.current.thumbScrollLength),
                0
            )
            thumbYRef.current!.style.top = top + 'px'
            scrollerRef.current!.scrollTop = top / verticalInfo.current.scrollRatio
        }

        const draggableHandleY = useDraggable({
            onDragStart(e) {
                e.stopPropagation()
                containerRef.current!.dataset.dragging = thumbYRef.current!.dataset.dragging = 'true'
                if (e.target === trackYRef.current) {
                    updateScrollTop(e.clientY - trackYRef.current!.getBoundingClientRect().top - thumbYRef.current!.offsetHeight / 2)
                }
                return parseInt(thumbYRef.current!.style.top || '0')
            },
            onDrag({diff: [, dy], data}) {
                updateScrollTop(data + dy)
            },
            onDragEnd() {
                containerRef.current!.dataset.dragging = thumbYRef.current!.dataset.dragging = 'false'
            }
        })

        const updateScrollLeft = (left: number) => {
            left = Math.max(
                Math.min(left, horizontalInfo.current.thumbScrollLength),
                0
            )
            thumbXRef.current!.style.left = left + 'px'
            scrollerRef.current!.scrollLeft = left / horizontalInfo.current.scrollRatio
        }

        const draggableHandleX = useDraggable({
            onDragStart(e) {
                containerRef.current!.dataset.dragging = thumbXRef.current!.dataset.dragging = 'true'
                e.stopPropagation()
                if (e.target === trackXRef.current) {
                    updateScrollLeft(e.clientX - trackXRef.current!.getBoundingClientRect().left - thumbXRef.current!.offsetWidth / 2)
                }
                return parseInt(thumbXRef.current!.style.left || '0')
            },
            onDrag({diff: [dx], data}) {
                updateScrollLeft(data + dx)
            },
            onDragEnd() {
                containerRef.current!.dataset.dragging = thumbXRef.current!.dataset.dragging = 'false'
            }
        })

        const {
            scroller: Scroller = 'div',
            scrollerWrapper: ScrollerWrapper = 'div',
        } = slots

        const {
            scroller: scrollerProps,
            scrollerWrapper: scrollerWrapperProps
        } = slotProps

        return (
            <Component
                {...props}
                ref={cloneRef(containerRef, wrapperRef)}
                css={useStyle({size})}
                className={clsx(classes.root, props.className)}
                data-variant={variant}
                data-autohide={autoHide}
                {...variant === 'cover' && autoHide && {
                    onPointerEnter: e => {
                        e.currentTarget.dataset.hover = 'true'
                        props.onPointerEnter?.(e)
                    },
                    onPointerLeave: e => {
                        e.currentTarget.dataset.hover = 'false'
                        props.onPointerLeave?.(e)
                    }
                }}
            >
                <Scroller
                    {...scrollerProps}
                    ref={cloneRef(scrollerRef, props.ref, scrollerProps?.ref)}
                    className={clsx(classes.scroller, scrollerProps?.className)}
                    onScroll={scrollHandler}
                >
                    <ScrollerWrapper
                        {...scrollerWrapperProps}
                        ref={cloneRef(scrollerWrapperRef, scrollerWrapperProps?.ref)}
                        className={clsx(classes.scrollerWrapper, scrollerWrapperProps?.className)}
                    >
                        {props.children}
                    </ScrollerWrapper>
                </Scroller>
                <div
                    ref={trackYRef}
                    className={classes.trackY}
                    {...draggableHandleY}
                >
                    <div
                        ref={thumbYRef}
                        className={classes.thumb}
                        {...draggableHandleY}
                    >
                        <div className={classes.block}/>
                    </div>
                </div>
                <div
                    ref={trackXRef}
                    className={classes.trackX}
                    {...draggableHandleX}
                >
                    <div
                        ref={thumbXRef}
                        className={classes.thumb}
                        {...draggableHandleX}
                    >
                        <div className={classes.block}/>
                    </div>
                </div>
            </Component>
        )
    }
) as OverridableComponent<ScrollbarOwnProps>