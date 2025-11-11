import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as alertClasses} from '../alert/alert.style'

export const classes = defineInnerClasses('selected-list', [
    'option',
    'optionWrap'
])

export const style = defineCss(({spacing}) => css`
    @layer reset {
        .${classes.optionWrap} {
            margin-bottom: ${spacing[3]}px;
        }

        .${alertClasses.title}, .${alertClasses.description} {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
    }
`)