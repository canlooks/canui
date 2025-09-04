import React, {ReactNode, SetStateAction} from 'react'
import {Popper, PopperProps} from '../popper'
import {classes, style} from './bubbleConfirm.style'
import {clsx, mergeComponentProps, useControlled, useLoading} from '../../utils'
import {Button} from '../button'
import {useTheme} from '../theme'
import {Icon} from '../icon'
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons/faCircleQuestion'

export interface BubbleConfirmProps extends Omit<PopperProps, 'title'> {
    icon?: ReactNode
    title?: ReactNode
    footer?: ReactNode
    showArrow?: boolean
    loading?: boolean
    onConfirm?(e: React.MouseEvent<HTMLButtonElement>): any
}

export function BubbleConfirm({
    icon = <Icon icon={faCircleQuestion}/>,
    title,
    footer,
    showArrow = true,
    offset,
    loading = false,
    onConfirm,

    defaultOpen = false,
    open,
    onOpenChange,
    ...props
}: BubbleConfirmProps) {
    const {spacing} = useTheme()

    offset ??= showArrow ? spacing[3] : spacing[2]

    const [innerOpen, _setInnerOpen] = useControlled(defaultOpen, open, onOpenChange)

    const setInnerOpen = (open: SetStateAction<boolean>) => {
        // loading过程中不能开关弹框
        !innerLoading.current && _setInnerOpen(open)
    }

    const [innerLoading, confirmHandler] = useLoading(async e => {
        await onConfirm?.(e)
        _setInnerOpen(false)
    }, loading)

    return (
        <Popper
            {...mergeComponentProps<PopperProps>(
                {trigger: 'click'},
                props,
                {
                    css: style,
                    className: classes.root,
                    offset,
                    open: innerOpen.current,
                    onOpenChange: setInnerOpen,
                    content: (
                        <div
                            className={classes.bubble}
                            data-show-arrow={showArrow}
                        >
                            <div className={classes.icon}>{icon}</div>
                            <div className={classes.info}>
                                <div className={classes.title}>{title}</div>
                                <div className={classes.content}>{props.content}</div>
                                <div className={classes.footer}>
                                    {footer ??
                                        <>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => setInnerOpen(false)}
                                            >
                                                取消
                                            </Button>
                                            <Button
                                                size="small"
                                                loading={innerLoading.current}
                                                onClick={confirmHandler}
                                            >
                                                确定
                                            </Button>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            )}
        />
    )
}