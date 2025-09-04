import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {popperArrowStyle} from '../popper/popper.style'
import {zIndex} from '../theme'

export const classes = defineInnerClasses('bubble-confirm', [
    'bubble',
    'icon',
    'info',
    'title',
    'content',
    'footer'
])

export const style = defineCss(({boxShadow, borderRadius, background, spacing, colors, text}) => css`
    min-width: 180px;
    max-width: 340px;
    z-index: ${zIndex.bubbleConfirm};

    .${classes.bubble} {
        border-radius: ${borderRadius}px;
        box-shadow: ${boxShadow[0]};
        background-color: ${background.content};
        display: flex;
        gap: ${spacing[4]}px;
        padding: ${spacing[5]}px;

        .${classes.icon} {
            color: ${colors.warning.main};
            font-size: 1.2em;
        }

        .${classes.info} {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: ${spacing[3]}px;

            .${classes.title} {
                font-weight: bold;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .${classes.content} {
                color: ${text.secondary};
            }

            .${classes.footer} {
                display: flex;
                justify-content: flex-end;
                gap: ${spacing[2]}px;
            }
        }
    }

    ${popperArrowStyle(background.content)}
`)