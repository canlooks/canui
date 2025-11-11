import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as buttonClasses} from '../button/button.style'
import {classes as inputClasses} from '../input/input.style'

export const classes = defineInnerClasses('counter', [
    'input'
])

export const style = defineCss(({divider}) => css`
    @layer reset {
        display: inline-flex;

        .${buttonClasses.root} {
            z-index: 1;

            &[data-variant=outlined], &[data-variant=dashed] {
                border-color: ${divider};
            }
        }

        .${classes.input} {
            input {
                text-align: center;

                &::-webkit-inner-spin-button,
                &::-webkit-outer-spin-button {
                    display: none;
                }
            }

            .${inputClasses.adaptable} {
                display: flex;
                min-width: 60px;
            }
        }
    }
`)