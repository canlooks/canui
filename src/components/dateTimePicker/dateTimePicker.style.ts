import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as calendarClasses} from '../calendar/calendar.style'
import {classes as timerClasses} from './timer.style'
import {popperStyleCallback} from '../popper/popper.style'

export const classes = defineInnerClasses('date-time-picker', [
    'container',
    'dateTimeIcon',
    'placeholder',
    'backfill'
])

export const style = defineCss(({text, spacing}) => css`
    @layer reset {
        cursor: pointer;

        .${classes.container} {
            display: flex;
            align-items: center;
            gap: ${spacing[1]}px;

            .${classes.placeholder} {
                flex: 1;
                color: ${text.placeholder};
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .${classes.backfill} {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-wrap: wrap;
                gap: ${spacing[1]}px;
            }

            .${classes.dateTimeIcon} {
                color: ${text.secondary};
            }
        }
    }
`)

export const datePickerPopperStyle = defineCss(theme => [
    popperStyleCallback(theme),
    css`
        @layer reset {
            flex-direction: row;
            padding: 0;

            .${calendarClasses.root} + .${timerClasses.root} {
                border-left: 1px solid ${theme.divider};
            }
        }
    `
])