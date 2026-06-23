import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as alertClasses} from '../alert/alert.style'

export const classes = defineInnerClasses('selected-list', [
    'optionWrap'
])

export const style = defineCss(({spacing}) => css`
    @layer override {
        .${classes.optionWrap} {
            margin-bottom: ${spacing[3]}px;
            
            &[data-draggable=true] {
                cursor: grab;
            }
        }

        .${alertClasses.title}, .${alertClasses.description} {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .${alertClasses.description} {
            margin-top: 0;
        }
    }
`)