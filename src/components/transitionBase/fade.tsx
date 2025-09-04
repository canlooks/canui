import {ElementType} from 'react'
import {TransitionBase, TransitionBaseProps} from './transitionBase'

export type FadeProps<T extends HTMLElement = HTMLElement, C extends ElementType = 'div'> = TransitionBaseProps<T, C>

export const Fade = (
    (props: FadeProps) => {
        return (
            <TransitionBase
                {...props}
                _mode="fade"
            />
        )
    }
) as typeof TransitionBase