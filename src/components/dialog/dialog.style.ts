import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as modalClasses} from '../modal/modal.style'
import {classes as overlayBaseClasses} from '../overlayBase/overlayBase.style'

export const classes = defineInnerClasses('dialog', [
    'card',
    'icon',
    'content',
    'titleRow',
    'title',
    'close',
    'body',
    'bodyWrap',
    'prefix',
    'suffix',
    'footer'
])

export const style = defineCss(({background, borderRadius, boxShadow, spacing, colors, divider}) => css`
    .${classes.card} {
        display: flex;
        background-color: ${background.content};
        border-radius: ${borderRadius}px;
        box-shadow: ${boxShadow[0]};
    }

    .${modalClasses.childrenWrap} {
        padding: 40px;
    }

    &[data-scroll-behavior=card] {
        .${modalClasses.childrenWrap} {
            height: 100%;
        }
        
        .${classes.card} {
            max-height: 100%;
        }
    }

    &[data-scroll-behavior=body] {
        .${modalClasses.modal} {
            height: auto;
        }

        .${overlayBaseClasses.childrenWrap} {
            overflow: hidden auto;
        }
    }

    .${classes.icon} {
        color: ${colors.primary.main};
        font-size: ${21 / 14}em;
        padding: ${spacing[6]}px 0 ${spacing[6]}px ${spacing[8]}px;
        display: flex;
        align-items: flex-start;

        & + .${classes.content} {
            padding-left: ${spacing[4]}px;
        }
    }

    .${classes.content} {
        min-width: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0 ${spacing[8]}px;
    }

    .${classes.titleRow} {
        display: flex;
        align-items: center;
        font-size: ${16 / 14}em;
        font-weight: bold;
        margin-right: -${spacing[8]}px;

        .${classes.title} {
            flex: 1;
            padding: ${spacing[6]}px 0 ${spacing[3]}px;
        }

        .${classes.close} {
            margin: ${spacing[3]}px ${spacing[4]}px;
        }

        & + .${classes.body} {
            padding-top: ${spacing[3]}px;
        }
    }

    &[data-draggable=true] {
        .${classes.titleRow} {
            cursor: move;
            touch-action: none;
        }
    }

    .${classes.body} {
        overflow: hidden auto;
        padding: ${spacing[6]}px 0;
        border-top: 1px solid transparent;
        border-bottom: 1px solid transparent;
        display: flex;
        gap: ${spacing[6]}px;

        &:has(+ .${classes.footer}) {
            padding-bottom: 0;
        }

        &[data-border-top=true] {
            border-top-color: ${divider};
        }

        &[data-border-bottom=true] {
            border-bottom-color: ${divider};
        }

        .${classes.bodyWrap} {
            min-width: 0;
            flex: 1;
        }

        .${classes.prefix}, .${classes.suffix} {
            max-height: 100%;
            overflow: auto;
        }
    }

    .${classes.footer} {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: ${spacing[3]}px;
        padding: ${spacing[4]}px 0 ${spacing[6]}px;
    }
`)