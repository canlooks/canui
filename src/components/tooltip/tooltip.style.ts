import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {popperArrowStyle} from '../popper/popper.style'
import Color from 'color'
import {zIndex} from '../theme'
import {ColorPropsValue} from '../../types'

export const classes = defineInnerClasses('tooltip', [
    'title'
])

export function useStyle({color}: {color: ColorPropsValue}) {
    let colorValue = useColor(color)
    colorValue = Color(colorValue).alpha(.7).string()

    return useCss(({spacing, borderRadius, boxShadow}) => css`
        pointer-events: none;
        z-index: ${zIndex.tooltip};

        .${classes.title} {
            font-size: ${13 / 14}em;
            padding: ${spacing[2]}px ${spacing[3]}px;
            background-color: ${colorValue};
            color: #ffffff;
            border-radius: ${borderRadius}px;
            box-shadow: ${boxShadow[0]};
        }

        ${popperArrowStyle(colorValue)}
    `, [colorValue])
}