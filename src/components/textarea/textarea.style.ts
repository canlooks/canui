import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as inputBaseClasses} from '../inputBase/inputBase.style'

export const classes = defineInnerClasses('textarea', [
    'textarea'
])

export const style = defineCss(({spacing}) => css`
    height: auto;

    &[data-size] {
        padding: 1px;
    }

    .${classes.textarea} {
        flex: 1;
        border: none;
        outline: none;
        background-color: transparent;
        font-size: 1em;
        padding: ${spacing[3]}px;
        display: block;
    }

    &[data-full-width=true] {
        .${classes.textarea} {
            min-width: 100%;
            max-width: 100%;
        }
    }

    &:not([data-full-width=true]) {
        display: inline-flex;
    }

    .${inputBaseClasses.clear} {
        position: absolute;
        top: ${spacing[2]}px;
        right: ${spacing[3]}px;
    }
`)