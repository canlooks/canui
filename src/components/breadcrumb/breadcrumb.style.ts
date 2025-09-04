import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('breadcrumb', [
    'separator'
])

export const style = defineCss(({spacing, text}) => css`
    display: flex;
    align-items: center;
    gap: ${spacing[3]}px;
    
    .${classes.separator} {
        color: ${text.disabled};
    }
`)