import {PropsWithoutRef} from 'react'
import {clsx} from '../../utils'
import {Fade, FadeProps} from '../transitionBase'
import {classes, useStyle} from './backdrop.style'

export interface BackdropProps<T extends HTMLElement = HTMLElement> extends Omit<FadeProps<T>, 'in'> {
    open?: boolean
    /** 默认为'dark' */
    variant?: 'light' | 'dark'
}

export function Backdrop<T extends HTMLElement = HTMLElement>({
    open,
    variant = 'dark',
    ...props
}: PropsWithoutRef<BackdropProps<T>>) {
    return (
        <Fade
            {...props}
            css={useStyle({variant})}
            in={open}
            className={clsx(classes.root, props.className)}
        />
    )
}