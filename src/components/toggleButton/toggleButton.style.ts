import {defineCss, defineInnerClasses} from '../../utils'
import {css} from '@emotion/react'
import {classes as buttonClasses} from '../button/button.style'

export const classes = defineInnerClasses('buttonGroup')

export const style = defineCss(({divider}) => css`
    @layer reset {
        .${buttonClasses.root}[data-variant=outlined] {
            border-color: ${divider};

            &:not(:disabled):not([data-read-only=true]):not([data-loading=true]) {
                &:hover {
                    color: inherit;
                }
            }
        }
    }
`)