import {ElementType} from 'react'
import {TransitionBase, TransitionBaseProps} from './transitionBase'

export type SlideProps<T extends HTMLElement = HTMLElement, C extends ElementType = 'div'> = TransitionBaseProps<T, C>

export const Slide = (
    (props: SlideProps) => {
        return (
            <TransitionBase
                {...props}
                _mode="slide"
            />
        )
    }
) as typeof TransitionBase