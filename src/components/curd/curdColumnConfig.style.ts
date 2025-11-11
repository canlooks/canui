import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('curd-column-config', [
    'content',
    'title',
    'item',
    'checkbox'
])

export const style = defineCss(({spacing}) => css`
    @layer reset {
        .${classes.content} {
            min-width: 160px;

            .${classes.title} {
                font-weight: bold;
                padding: ${spacing[3]}px;
            }

            .${classes.item} {
                cursor: move;

                &[data-dragging=true] {
                    position: relative;
                    z-index: 1;
                }
            }

            .${classes.checkbox} {
                display: flex;
                margin-right: ${spacing[1]}px;
            }
        }
    }
`)