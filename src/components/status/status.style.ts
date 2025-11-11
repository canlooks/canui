import {css, keyframes} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('status', [
    'icon',
    'label',
    'dot'
])

export const style = defineCss(({spacing, easing}) => css`
    @layer reset {
        display: inline-flex;
        align-items: center;
        gap: ${spacing[2]}px;

        .${classes.dot} {
            width: 6px;
            height: 6px;
            border-radius: 50%;
        }

        &[data-animation=true] {
            .${classes.icon} {
                animation: ${statusAnim} .8s ${easing.easeInOut} infinite;
            }
        }
    }
`)

const statusAnim = keyframes`
    0% {
        opacity: 1;
        transform: scale(1);
    }

    80% {
        transform: scale(1.4);
        opacity: 0;
    }

    100% {
        opacity: 0;
        transform: scale(1.8);
    }
`