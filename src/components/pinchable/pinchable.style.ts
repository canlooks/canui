import {defineInnerClasses, defineCss} from '../../utils'
import {css} from '@emotion/react'

export const classes = defineInnerClasses('pinchable', [
    'content'
])

export const style = defineCss(({easing}) => css`
    @layer reset {
        display: flex;
        align-items: center;
        justify-content: center;

        &, .${classes.content} {
            touch-action: none;
        }

        .${classes.content} {
            &[data-transition=true] {
                transition: all .25s ${easing.easeOut};
            }

            &[data-transition=bounce] {
                transition: all .25s ${easing.bounce};
            }
        }
    }
`)