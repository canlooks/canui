import {css} from '@emotion/react'
import {defineInnerClasses} from '../../utils'

export const classes = defineInnerClasses('modal', [
    'modal',
])

export const style = css`
    @layer reset {
        .${classes.modal} {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;

            > * {
                pointer-events: all;
            }
        }
    }
`