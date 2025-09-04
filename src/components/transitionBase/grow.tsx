import {ElementType} from 'react'
import {TransitionBase, TransitionBaseProps} from './transitionBase'

export type GrowProps<T extends HTMLElement = HTMLElement, C extends ElementType = 'div'> = TransitionBaseProps<T, C>

export const Grow = (
    (props: GrowProps) => {
        return (
            <TransitionBase
                {...props}
                _mode="grow"
            />
        )
    }
) as typeof TransitionBase