import {useMemo, useRef} from 'react'
import {OverlayBase, OverlayBaseProps, overlayBaseTransitionDuration} from '../overlayBase'
import {classes, style} from './modal.style'
import {clsx} from '../../utils'
import {Grow, TransitionBaseProps} from '../transitionBase'
import {useTheme} from '../theme'
import {useEventDelegation} from '../app/globalEventDelegation'

export interface ModalProps extends OverlayBaseProps {
    modalProps?: TransitionBaseProps<HTMLDivElement>
}

export function Modal({
    modalProps,
    ...props
}: ModalProps) {
    const {zoom} = useTheme()

    const transformOrigin = useRef<string | undefined>(void 0)

    const eventDelegation = useEventDelegation()

    useMemo(() => {
        const e = eventDelegation.current || event as PointerEvent
        if (props.open && typeof e === 'object' && e.clientX && e.clientY) {
            transformOrigin.current = `${e.clientX / zoom}px ${e.clientY / zoom}px`
        }
    }, [props.open, zoom])

    return (
        <OverlayBase
            {...props}
            css={style}
            className={clsx(classes.root, props.className)}
        >
            <Grow
                timeout={overlayBaseTransitionDuration}
                {...modalProps}
                in={props.open}
                className={clsx(classes.modal, modalProps?.className)}
                style={{
                    transformOrigin: transformOrigin.current,
                    ...modalProps?.style
                }}
            >
                {props.children}
            </Grow>
        </OverlayBase>
    )
}