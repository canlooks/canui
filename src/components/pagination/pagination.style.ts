import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as inputClasses} from '../input/input.style'

export const classes = defineInnerClasses('pagination', [
    'button',
    'pager',
    'sizer',
    'jumper',
    'input',
    'counter'
])

export const style = defineCss(({spacing}) => css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    gap: ${spacing[3]}px;

    .${classes.pager} {
        display: flex;
    }

    .${classes.button} {
        padding-left: 3px;
        padding-right: 3px;

        &[data-size=small] {
            min-width: 24px;
        }

        &[data-size=medium] {
            min-width: 32px;
        }

        &[data-size=large] {
            min-width: 40px;
        }
    }

    .${classes.jumper} {
        display: flex;
        align-items: center;
        gap: ${spacing[3]}px;
        
        .${classes.input} {
            width: 45px;

            .${inputClasses.input} {
                text-align: center;
            }
        }
    }
`)