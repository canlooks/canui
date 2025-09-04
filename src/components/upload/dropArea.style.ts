import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('upload-drop-area', [
    'icon',
    'description'
])

export const style = defineCss(({spacing, gray, divider, borderRadius, text, colors, easing}) => css`
    height: 100px;
    display: flex;
    gap: ${spacing[1]}px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px dashed ${divider};
    border-radius: ${borderRadius}px;
    color: ${text.disabled};
    cursor: pointer;
    background-color: ${gray(.1)};
    transition: background-color .25s ${easing.easeOut};

    &:hover {
        background-color: ${gray(.15)};
    }

    &:active {
        background-color: ${gray(.08)};
        transition: background-color 0s;
    }
    
    .${classes.icon}, .${classes.description} {
        pointer-events: none;
    }

    .${classes.icon} {
        font-size: ${30 / 14}em;
    }

    &[data-over=true] {
        border-color: ${colors.primary.main};
        color: ${colors.primary.main};
    }
`)