import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('action-sheet', [
    'sheet',
    'card',
    'title',
    'action'
])

export const style = defineCss(({spacing, background, boxShadow, borderRadius, text, divider}) => css`
    .${classes.sheet} {
        position: absolute;
        padding: ${spacing[8]}px;
    }

    &[data-placement=top] {
        .${classes.sheet} {
            transform-origin: top;
            inset: 0 0 auto;
        }
    }
    
    &[data-placement=bottom] {
        .${classes.sheet} {
            transform-origin: bottom;
            inset: auto 0 0;
        }
    }

    .${classes.card} {
        text-align: center;
        background-color: ${background.content};
        box-shadow: ${boxShadow[1]};
        border-radius: ${borderRadius}px;
        overflow: hidden;

        &:not(:last-of-type) {
            margin-bottom: ${spacing[8]}px;
        }
    }

    .${classes.title} {
        line-height: 3;
        color: ${text.secondary};
        font-size: ${13 / 14}em;
    }

    .${classes.action} {
        border-radius: 0;

        &:not(:last-of-type) {
            border-bottom: 1px solid ${divider};
        }
    }
`)