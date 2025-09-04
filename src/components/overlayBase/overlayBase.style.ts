import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {appStyleCallback} from '../app/app.style'
import {zIndex} from '../theme'

export const classes = defineInnerClasses('overlay-base', [
    'mask'
])

export const style = defineCss(theme => {
    return [
        appStyleCallback(theme),
        css`
        position: fixed;
        inset: 0;
        z-index: ${zIndex.overlay};

        &[data-custom-container=true] {
            position: absolute;
        }
        
        .${classes.mask} {
            background-color: rgba(0, 0, 0, .5);
            position: absolute;
            inset: 0;
        }

        &:not([data-open=true]) {
            pointer-events: none;
        }
    `
    ]
})