import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {Theme} from '../theme'

export const classes = defineInnerClasses('app')

export const appStyleCallback = (theme: Theme) => css`
    line-height: ${20 / 14};
    box-sizing: border-box;
    font-size: ${theme.fontSize}px;
    color: ${theme.text.primary};
    color-scheme: ${theme.mode};
    zoom: ${theme.zoom};

    *, *:before, *:after {
        box-sizing: border-box;
        font-family: ${theme.fontFamily};
    }

    svg.MuiSvgIcon-root {
        font-size: 1em;
        transform: scale(1.2);
    }

    .anticon {
        line-height: 1;
        display: inline-flex;
    }
`

export const style = defineCss(appStyleCallback)