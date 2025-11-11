import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as placeholderClasses} from '../placeholder/placeholder.style'

export const classes = defineInnerClasses('error-boundary')

export const style = defineCss(({spacing, background, borderRadius}) => css`
    @layer reset {
        justify-content: flex-start;
        padding: ${spacing[8]}px;

        .${placeholderClasses.description} {
            width: 100%;
            background-color: ${background.content};
            border-radius: ${borderRadius}px;
            padding: ${spacing[8]}px;
            margin-top: ${spacing[8]}px;
            overflow: auto;
        }
    }
`)