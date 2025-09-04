import React, {ReactNode, useEffect, useRef} from 'react'
import {Modal, ModalProps} from '../modal'
import {classes, style} from './dialog.style'
import {clsx, cloneRef, useControlled, useEscapeClosable, useLoading} from '../../utils'
import {Button, ButtonProps} from '../button'
import {Draggable} from '../draggable'
import {DrawerCloseReason} from '../drawer'
import {Icon} from '../icon'
import {faXmark} from '@fortawesome/free-solid-svg-icons/faXmark'

// 只有关闭才有closeReason参数，分别表示按ESC键、点击取消按钮、点击右上角关闭、点击遮罩层、点击确定
export type DialogCloseReason = DrawerCloseReason | 'canceled' | 'confirmed'

export interface DialogProps extends Omit<ModalProps, 'title' | 'prefix'> {
    icon?: ReactNode
    title?: ReactNode
    footer?: ReactNode
    prefix?: ReactNode
    suffix?: ReactNode
    /** 默认为`420` */
    width?: string | number
    minWidth?: string | number
    /** 默认为`100%` */
    maxWidth?: string | number

    showClose?: boolean
    closeProps?: ButtonProps

    showConfirm?: boolean
    confirmText?: ReactNode
    confirmProps?: ButtonProps
    onConfirm?(e: React.MouseEvent<HTMLButtonElement>): any
    confirmLoading?: boolean

    showCancel?: boolean
    cancelText?: ReactNode
    cancelProps?: ButtonProps
    onCancel?(e: React.MouseEvent<HTMLButtonElement | HTMLDivElement> | KeyboardEvent): void

    draggable?: boolean
    /** 是否可通过点击遮罩层关闭对话框，默认为true */
    maskClosable?: boolean
    /** 是否可通过键盘的【ESC】键关闭对话框，默认为true */
    escapeClosable?: boolean

    defaultOpen?: boolean
    onClose?(closeReason: DialogCloseReason): void
}

export function Dialog({
    icon,
    title,
    footer,
    prefix,
    suffix,
    width = 420,
    minWidth,
    maxWidth = '100%',
    showClose = true,
    closeProps,
    showConfirm = true,
    confirmText = '确 定',
    confirmProps,
    onConfirm,
    confirmLoading = false,
    showCancel = true,
    cancelText = '取 消',
    cancelProps,
    onCancel,
    draggable = true,
    maskClosable = true,
    escapeClosable = true,
    defaultOpen = false,
    open,
    onClose,
    ...props
}: DialogProps) {
    const [innerOpen, _setInnerOpen] = useControlled(defaultOpen, open)
    const close = (closeReason: DialogCloseReason) => {
        if (!innerLoading.current || closeReason === 'confirmed') {
            onClose?.(closeReason)
            _setInnerOpen(false)
        }
    }

    // 绑定ESC键
    const overlayRef = useEscapeClosable({escapeClosable, close}, onCancel)

    // 点击遮罩层
    const onMaskClick = (e: React.MouseEvent<HTMLDivElement>) => {
        props.onMaskClick?.(e)
        if (maskClosable) {
            onCancel?.(e)
            close('maskClicked')
        }
    }

    // 点击取消按钮
    const cancelHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        cancelProps?.onClick?.(e)
        onCancel?.(e)
        close('canceled')
    }

    // 点击关闭按钮
    const closeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        closeProps?.onClick?.(e)
        onCancel?.(e)
        close('closed')
    }

    // 点击确定
    const [innerLoading, confirmHandler] = useLoading(async e => {
        confirmProps?.onClick?.(e)
        await onConfirm?.(e)
        close('confirmed')
    }, confirmLoading)

    /**
     * ---------------------------------------------------------------------
     * 长内容滚动
     */

    const bodyRef = useRef<HTMLDivElement>(null)
    const bodyWrapRef = useRef<HTMLDivElement>(null)

    const onScroll = () => {
        const el = bodyRef.current!
        if (el.scrollHeight > el.clientHeight) {
            el.dataset.borderTop = (el.scrollTop > 0).toString()
            el.dataset.borderBottom = (el.scrollHeight - el.clientHeight > el.scrollTop).toString()
        }
    }

    useEffect(() => {
        if (innerOpen.current) {
            const resizeObserver = new ResizeObserver(onScroll)
            resizeObserver.observe(bodyWrapRef.current!)
            return () => {
                resizeObserver.disconnect()
            }
        }
        return
    }, [innerOpen.current])

    /**
     * ---------------------------------------------------------------------
     * 渲染
     */

    const renderFooter = () => {
        if (typeof footer === 'undefined' || footer === true) {
            return (
                <>
                    {showCancel &&
                        <Button
                            variant="outlined"
                            {...cancelProps}
                            onClick={cancelHandler}
                        >
                            {cancelText}
                        </Button>
                    }
                    {showConfirm &&
                        <Button
                            loading={innerLoading.current}
                            {...confirmProps}
                            onClick={confirmHandler}
                        >
                            {confirmText}
                        </Button>
                    }
                </>
            )
        }
        return footer
    }

    return (
        <Modal
            {...props}
            ref={cloneRef(overlayRef, props.ref)}
            css={style}
            className={clsx(classes.root, props.className)}
            open={innerOpen.current}
            onMaskClick={onMaskClick}
            data-draggable={draggable}
        >
            <Draggable container={() => overlayRef.current}>
                {(targetProps, handleProps) =>
                    <div
                        className={classes.card}
                        {...targetProps}
                        style={{width, minWidth, maxWidth, ...targetProps.style}}
                    >
                        {!!icon &&
                            <div className={classes.icon}>{icon}</div>
                        }
                        <div className={classes.content}>
                            {!!(title || showClose) &&
                                <div className={classes.titleRow} {...handleProps}>
                                    <div className={classes.title}>{title}</div>
                                    {showClose &&
                                        <Button
                                            shape="circular"
                                            variant="text"
                                            color="text.secondary"
                                            {...closeProps}
                                            className={clsx(classes.close, closeProps?.className)}
                                            onClick={closeHandler}
                                        >
                                            <Icon icon={faXmark}/>
                                        </Button>
                                    }
                                </div>
                            }
                            <div ref={bodyRef} className={classes.body} onScroll={onScroll}>
                                {!!prefix &&
                                    <div className={classes.prefix}>{prefix}</div>
                                }
                                <div ref={bodyWrapRef} className={classes.bodyWrap}>
                                    {props.children}
                                </div>
                                {!!suffix &&
                                    <div className={classes.suffix}>{suffix}</div>
                                }
                            </div>
                            {(typeof footer === 'undefined' || !!footer) &&
                                <div className={classes.footer}>{renderFooter()}</div>
                            }
                        </div>
                    </div>
                }
            </Draggable>
        </Modal>
    )
}