import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as dateTimePickerClasses} from '../dateTimePicker/dateTimePicker.style'

export const classes = defineInnerClasses('date-time-rage-picker')

export const style = defineCss(({spacing}) => css`
    @layer reset {
        display: flex;
        align-items: center;
        gap: ${spacing[1]}px;

        .${dateTimePickerClasses.root} {
            flex: 1;
        }
    }
`)