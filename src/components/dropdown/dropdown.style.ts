import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {popperArrowStyle} from '../popper/popper.style'
import {zIndex} from '../theme'

export const classes = defineInnerClasses('dropdown', [
    'content'
])

export const style = defineCss(({background, boxShadow, borderRadius}) => css`
    z-index: ${zIndex.dropdown};

    .${classes.content} {
        background-color: ${background.content};
        box-shadow: ${boxShadow[0]};
        border-radius: ${borderRadius}px;
        padding: 4px;
    }

    ${popperArrowStyle(background.content)}
`)