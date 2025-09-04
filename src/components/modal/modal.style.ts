import {css} from '@emotion/react'
import {defineInnerClasses} from '../../utils'

export const classes = defineInnerClasses('modal', [
    'modal'
])

export const style = css`
    .${classes.modal} {
        width: 100%;
        height: 100%;
        padding: 40px;
        pointer-events: none;
        display: flex;
        align-items: center;
        justify-content: center;

        > * {
            pointer-events: all;
        }
    }
`