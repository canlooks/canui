import React, {ReactNode, useEffect, useRef} from 'react'
import {classes, useStyle} from './drawer.style'
import {clsx, mergeComponentProps, useControlled} from '../../utils'
import {OverlayBase, OverlayBaseProps} from '../overlayBase'
import {Button} from '../button'
import {DivProps, ResponsiveProp, SlotsAndProps} from '../../types'
import {Slide, TransitionBaseProps} from '../transitionBase'
import {Icon} from '../icon'
import {faAnglesRight} from '@fortawesome/free-solid-svg-icons/faAnglesRight'

export interface DrawerProps extends Omit<OverlayBaseProps, 'title'>, SlotsAndProps<{
    scroller: DivProps
}> {
    title?: ReactNode
    footer?: ReactNode
    showClose?: ReactNode
    size?: ResponsiveProp<string | number>
    placement?: 'left' | 'right' | 'top' | 'bottom'

    /** 是否可通过点击遮罩层关闭对话框，默认为`true` */
    maskClosable?: boolean
    /** 是否可通过键盘的【ESC】键关闭对话框，默认为`true` */
    escapeClosable?: boolean

    defaultOpen?: boolean
    onClose?(reason: DrawerCloseReason): void

    slideProps?: TransitionBaseProps<HTMLDivElement>

    onScrollToTop?(): void
    /** 距离底部`toBottomThreshold`像素即提前触发{@link onScrollToBottom}，默认为`5` */
    toBottomThreshold?: number
    onScrollToBottom?(): void
}

export type DrawerCloseReason = 'escape' | 'closed' | 'maskClicked'

const placementToDirection = {
    left: 'right' as const,
    right: 'left' as const,
    top: 'down' as const,
    bottom: 'up' as const
}

export function Drawer({
    slots = {},
    slotProps = {},
    title,
    footer,
    showClose = true,
    size = {xs: '100%', sm: '75%', md: '50%', lg: '25%'},
    placement = 'right',
    maskClosable = true,
    escapeClosable = true,
    defaultOpen = false,
    open,
    onClose,
    slideProps,
    onScrollToTop,
    toBottomThreshold = 5,
    onScrollToBottom,
    ...props
}: DrawerProps) {
    const [innerOpen, setInnerOpen] = useControlled(defaultOpen, open)
    const close = (reason: DrawerCloseReason) => {
        onClose?.(reason)
        setInnerOpen(false)
    }

    const onMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
        props.onMaskClick?.(e)
        maskClosable && close('maskClicked')
    }

    const closeHandler = () => {
        close('closed')
    }

    /**
     * ---------------------------------------------------------------------
     * 长内容滚动
     */

    const bodyRef = useRef<HTMLDivElement>(null)
    const bodyWrapRef = useRef<HTMLDivElement>(null)

    const onScroll = () => {
        const el = bodyRef.current!
        el.dataset.bordered = (el.scrollHeight > el.clientHeight && el.scrollTop > 0).toString()
        if (el.scrollTop === 0) {
            onScrollToTop?.()
        } else if (el.scrollTop >= el.scrollHeight - el.clientHeight - toBottomThreshold) {
            onScrollToBottom?.()
        }
    }

    useEffect(() => {
        if (innerOpen.current && bodyWrapRef.current) {
            const resizeObserver = new ResizeObserver(onScroll)
            resizeObserver.observe(bodyWrapRef.current)
            return () => {
                resizeObserver.disconnect()
            }
        }
        return
    }, [innerOpen.current])

    const {scroller: Scroller = 'div'} = slots
    const {scroller: scrollerProps} = slotProps

    return (
        <OverlayBase
            {...props}
            css={useStyle({size: typeof size === 'object' ? size : {xs: size}})}
            className={clsx(classes.root, props.className)}
            open={innerOpen.current}
            onMaskClick={onMaskClick}
            data-placement={placement}
        >
            <Slide
                direction={placementToDirection[placement]}
                {...slideProps}
                in={innerOpen.current}
                className={clsx(classes.drawer, slideProps?.className)}
            >
                <div className={classes.drawerWrap}>
                    {!!(title || showClose) &&
                        <div className={classes.titleRow}>
                            <div className={classes.title}>{title}</div>
                            {showClose &&
                                <Button
                                    className={classes.close}
                                    shape="circular"
                                    variant="text"
                                    color="text.secondary"
                                    onClick={closeHandler}
                                >
                                    <Icon
                                        icon={faAnglesRight}
                                        style={{
                                            rotate: {
                                                left: '180deg',
                                                right: '0',
                                                top: '-90deg',
                                                bottom: '90deg',
                                            }[placement]
                                        }}
                                    />
                                </Button>
                            }
                        </div>
                    }
                    <Scroller
                        {...mergeComponentProps(scrollerProps, {
                            ref: bodyRef,
                            className: classes.body,
                            onScroll
                        })}
                    >
                        <div ref={bodyWrapRef} className={classes.bodyWrap}>
                            {props.children}
                        </div>
                    </Scroller>
                </div>
            </Slide>
        </OverlayBase>
    )
}