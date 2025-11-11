import {css} from '@emotion/react'
import {defineInnerClasses} from '../../utils'
import {menuListPadding} from '../menuItem/menuItem.style'

export const classes = defineInnerClasses('menu')

export const style = css`
    @layer reset {
        padding: ${menuListPadding}px;
    }
`