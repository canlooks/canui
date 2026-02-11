import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('curd-column-config', [
    'content',
    'title',
    'titleText',
    'description',
    'item',
    'checkbox'
])

export const style = defineCss(({spacing, text}) => css`
    @layer reset {
        .${classes.content} {
            min-width: 160px;

            .${classes.title} {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: ${spacing[3]}px;
                
                .${classes.titleText} {
                    font-weight: bold;
                }
                
                .${classes.description} {
                    color: ${text.disabled};
                }
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