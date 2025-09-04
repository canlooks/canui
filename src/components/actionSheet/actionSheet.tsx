import React, {ReactElement, ReactNode, memo} from 'react'
import {classes, style} from './actionSheet.style'
import {clsx, useControlled, useEscapeClosable, mergeComponentProps} from '../../utils'
import {OverlayBase, OverlayBaseProps} from '../overlayBase'
import {Slide, TransitionBaseProps} from '../transitionBase'
import {MenuItem, MenuItemProps} from '../menuItem'
import {Obj} from '../../types'

export type ActionSheetCloseReason = 'escape' | 'canceled' | 'confirmed' | 'maskClicked' | 'action'

export interface ActionSheetProps<A extends MenuItemProps & Obj> extends Omit<OverlayBaseProps, 'title'> {
    title?: ReactNode
    actions?: A[]
    placement?: 'top' | 'bottom'
    /** 是否可通过点击遮罩层关闭对话框，默认为`false` */
    maskClosable?: boolean
    /** 是否可通过键盘的【ESC】键关闭对话框，默认为`true` */
    escapeClosable?: boolean
    /** 点击选项 */
    onAction?(action: A): void
    onConfirm?(e: React.MouseEvent<HTMLDivElement>): void
    onCancel?(e: React.MouseEvent<HTMLButtonElement | HTMLDivElement> | KeyboardEvent): void

    defaultOpen?: boolean
    open?: boolean
    onClose?(reason: ActionSheetCloseReason): void
    /** 是否显示确定按钮，默认为`false` */
    showConfirm?: boolean
    confirmText?: ReactNode
    confirmProps?: MenuItemProps
    /** 是否显示取消按钮，默认为`true` */
    showCancel?: boolean
    cancelText?: ReactNode
    cancelProps?: MenuItemProps

    slideProps?: TransitionBaseProps<HTMLDivElement>
}

const placementToDirection = {
    top: 'down' as const,
    bottom: 'up' as const
}

export const ActionSheet = memo(<A extends MenuItemProps>({
    title,
    actions,
    placement = 'bottom',
    maskClosable,
    escapeClosable = true,
    onAction,
    onConfirm,
    onCancel,
    defaultOpen = false,
    open,
    onClose,
    showConfirm,
    confirmText = '确 定',
    confirmProps,
    showCancel = true,
    cancelText = '取 消',
    cancelProps,
    slideProps,
    ...props
}: ActionSheetProps<A>) => {
    const [innerOpen, setInnerOpen] = useControlled(defaultOpen, open)
    const close = (reason: ActionSheetCloseReason) => {
        onClose?.(reason)
        setInnerOpen(false)
    }

    const overlayRef = useEscapeClosable({escapeClosable, close}, onCancel)

    const onMaskClick = () => {
        maskClosable && close('maskClicked')
    }

    const cancelHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        onCancel?.(e)
        close('canceled')
    }

    return (
        <OverlayBase
            {...mergeComponentProps<OverlayBaseProps>(
                props,
                {
                    css: style,
                    ref: overlayRef,
                    className: classes.root,
                    open: innerOpen.current,
                    onMaskClick
                }
            )}
            data-placement={placement}
        >
            <Slide
                direction={placementToDirection[placement]}
                {...slideProps}
                className={clsx(classes.sheet, slideProps?.className)}
                in={innerOpen.current}
            >
                {!!(title || showConfirm || actions?.length) &&
                    <div className={classes.card}>
                        {!!title &&
                            <div className={classes.title}>{title}</div>
                        }
                        {showConfirm &&
                            <MenuItem
                                className={classes.action}
                                size="large"
                                label={confirmText}
                                {...confirmProps}
                                onClick={e => {
                                    confirmProps?.onClick?.(e)
                                    onConfirm?.(e)
                                    close('confirmed')
                                }}
                            />
                        }
                        {actions?.map((menuItemProps, i) =>
                            <MenuItem
                                className={clsx(classes.action, menuItemProps.className)}
                                size="large"
                                {...menuItemProps}
                                key={menuItemProps.key ?? i}
                                onClick={e => {
                                    menuItemProps.onClick?.(e)
                                    onAction?.(menuItemProps)
                                    close('action')
                                }}
                            />
                        )}
                    </div>
                }
                {showCancel &&
                    <div className={classes.card}>
                        <MenuItem
                            color="error"
                            emphasized
                            size="large"
                            label={cancelText}
                            {...cancelProps}
                            onClick={cancelHandler}
                        />
                    </div>
                }
            </Slide>
        </OverlayBase>
    )
}) as <A extends MenuItemProps & Obj>(props: ActionSheetProps<A>) => ReactElement