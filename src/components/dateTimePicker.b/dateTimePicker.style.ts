import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {commonNativeInputStyle} from '../input/input.style'
import {classes as calendarClasses} from '../calendar/calendar.style'
import {classes as timerClasses} from './timer.style'
import {popperStyleCallback} from '../popper/popper.style'

export const classes = defineInnerClasses('date-time-picker', [
    'input',
    'container',
    'inputGroup',
    'inputUnit',
    'dateTimeIcon',
    'calendar',
    'calendarHead',
    'calendarHeadSide',
    'calendarHeadControl',
    'calendarHeadCenter',
    'calendarHeadButton',
    'calendarBody',
    'calendarDays',
    'dateItem'
])

export const style = defineCss(({text}) => css`
    .${classes.container} {
        display: flex;
        align-items: center;

        .${classes.input} {
            ${commonNativeInputStyle}
        }
    
        .${classes.dateTimeIcon} {
            color: ${text.secondary};
        }
    }
`)

export const datePickerPopperStyle = defineCss(theme => [
    popperStyleCallback(theme),
    css`
        flex-direction: row;
        padding: 0;
        
        .${calendarClasses.root} + .${timerClasses.root} {
            border-left: 1px solid ${theme.divider};
        }
    `
])