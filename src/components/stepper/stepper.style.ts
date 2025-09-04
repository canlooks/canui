import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('stepper')

export const style = defineCss(() => css`
    display: flex;

    &[data-orientation=vertical] {
        flex-direction: column;
    }
`)