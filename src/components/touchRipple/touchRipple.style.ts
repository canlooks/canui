import {defineInnerClasses, useColor, useCss} from '../../utils'
import {css, keyframes} from '@emotion/react'
import {ColorPropsValue} from '../../types'
import {zIndex} from '../theme'
import Color from 'color'

export const classes = defineInnerClasses('touch-ripple-overlay', [
    'ripple'
])

export function useStyle({color}: { color: ColorPropsValue }) {
    const colorValue = useColor(color)

    return useCss(({easing}) => css`
        @layer reset {
            position: absolute;
            inset: 0;
            z-index: ${zIndex.touchRipple};
            overflow: hidden;
            pointer-events: none;

            .${classes.ripple} {
                aspect-ratio: 1;
                border-radius: 50%;
                background-color: ${Color(colorValue).alpha(.1).string()};
                position: absolute;
                scale: 0;
                translate: -50% -50%;
                animation: ${rippleAnim} .4s ${easing.easeOut} forwards;
                transition: opacity .4s ${easing.easeIn};

                &[data-leaving=true] {
                    opacity: 0;
                }
            }
        }
    `, [colorValue])
}

const rippleAnim = keyframes`
    0% {
        scale: 0;
    }
    
    100% {
        scale: 1;
    }
`