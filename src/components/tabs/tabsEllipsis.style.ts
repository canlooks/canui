import {css} from '@emotion/react'
import {defineCss} from '../../utils'
import {popperStyleCallback} from '../popper/popper.style'
import {classes as optionsBaseClasses} from '../optionsBase/optionsBase.style'

export const tabsEllipsisPopperStyle = defineCss(theme => [
    popperStyleCallback(theme),
    css`
        @layer reset {
            .${optionsBaseClasses.root} .${optionsBaseClasses.optionsList} {
                max-width: 360px;
                overflow: hidden auto;
            }
        }
    `
])