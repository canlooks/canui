import {defineCss, defineInnerClasses} from '../../utils'
import {css} from '@emotion/react'

export const classes = defineInnerClasses('serial-input', [
    'inputItem'
])

export const style = defineCss(() => css`
    .${classes.inputItem} input {
        text-align: center;
    }
`)