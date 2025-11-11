import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as dividerClasses} from '../divider/divider.style'
import {classes as alertClasses} from '../alert/alert.style'

export const classes = defineInnerClasses('picker-dialog', [
    'content',
    'selectedArea',
    'count',
    'list',
    'confirm'
])

export const style = defineCss(({spacing}) => css`
    @layer reset {
        .${classes.selectedArea} {
            width: 320px;
            max-height: 100%;
            display: flex;
            flex-direction: column;
            gap: ${spacing[3]}px;

            .${classes.count} {
                b {
                    margin: 0 ${spacing[2]}px;
                }

                .${dividerClasses.content} {
                    display: flex;
                    gap: 12px;
                }
            }

            .${classes.list} {
                flex: 1;
                overflow: hidden auto;

                .${alertClasses.description} {
                    margin-top: 0;
                }
            }

            .${classes.confirm} {
                margin-top: ${spacing[4]}px;
            }
        }
    }
`)