import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('divider', [
    'line',
    'beforeLine',
    'afterLine',
    'content'
])

export const style = defineCss(({spacing, divider}) => css`
    @layer reset {
        gap: ${spacing[4]}px;
        align-items: center;

        .${classes.line} {
            background-color: ${divider};
        }

        &[data-orientation=horizontal] {
            display: flex;

            .${classes.line} {
                height: 1px;
            }
        }

        &[data-orientation=vertical] {
            display: inline-flex;
            flex-direction: column;

            .${classes.line} {
                width: 1px;
            }
        }
    }
`)