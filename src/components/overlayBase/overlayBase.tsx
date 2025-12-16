import React, {useEffect} from 'react'
import {DivProps, DefineElement} from '../../types'
import {classes, style} from './overlayBase.style'
import {clsx, mergeComponentProps, useContainer, useDerivedState} from '../../utils'
import {createPortal} from 'react-dom'
import {Fade, FadeProps, TransitionBaseProps} from '../transitionBase'

export interface OverlayBaseProps extends DivProps {
    /** 模态的容器元素，默认为document.body */
    container?: DefineElement<HTMLElement>
    /** 同{@link container}，但会在useEffect后取值，且只会执行一次 */
    effectContainer?: DefineElement<HTMLElement>
    /**
     * @enum {true} 跟随父组件强制渲染
     * @enum {false} 打开时渲染，关闭后销毁
     * @enum {undefined} 第一次打开时渲染，跟随父组件销毁
     * 默认为`undefined`
     */
    forceRender?: boolean | undefined
    open?: boolean
    onMaskClick?: React.MouseEventHandler<HTMLDivElement>
    /** 是否只显示一层遮罩，默认为true */
    singleLayer?: boolean
    onOpened?(): void
    onClosed?(): void

    maskProps?: TransitionBaseProps<HTMLDivElement>
    /** 遮罩层打开时是否移除当前焦点，默认为`true` */
    removeFocusOnOpen?: boolean
}

export const overlayBaseTransitionDuration = 300

export function OverlayBase({
    container,
    effectContainer,
    forceRender,
    open,
    onMaskClick,
    singleLayer,
    onOpened,
    onClosed,
    maskProps,
    removeFocusOnOpen = true,
    ...props
}: OverlayBaseProps) {
    const [shouldRender, setShouldRender] = useDerivedState<boolean>((prev = false) => {
        if (open) {
            return true
        }
        return forceRender === true || prev
    }, [open, forceRender])

    const containerEl = useContainer(container, effectContainer)

    useEffect(() => {
        if (!open) {
            return
        }
        removeFocusOnOpen && (document.activeElement as HTMLElement)?.blur?.()
        containerEl.current!.style.overflow = 'hidden'
        return () => {
            containerEl.current!.style.overflow = ''
        }
    }, [open])

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        onMaskClick?.(e)
    }

    const onEntered = () => {
        onOpened?.()
    }

    const onExited = () => {
        onClosed?.()
        forceRender === false && setShouldRender(false)
    }

    return shouldRender.current && containerEl.current && createPortal(
        <div
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
            data-open={open}
            data-custom-container={containerEl.current !== document.body}
        >
            <Fade
                timeout={overlayBaseTransitionDuration}
                {...mergeComponentProps<FadeProps>(
                    maskProps,
                    {
                        in: open,
                        className: classes.mask,
                        onClick,
                        onEntered,
                        onExited
                    }
                )}
            />
            {props.children}
        </div>,
        containerEl.current
    )
}