import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {ColorPropsValue} from '../../types'

export const classes = defineInnerClasses('avatar', [
    'img'
])

export function useStyle({color}: {color: ColorPropsValue}) {
    const colorValue = useColor(color)

    return useCss(({borderRadius}) => css`
        @layer reset {
            line-height: 1;
            aspect-ratio: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            overflow: hidden;

            &[data-shape=circular] {
                border-radius: 50%;
            }

            &[data-shape=square] {
                border-radius: ${borderRadius}px;
            }

            &:not(:has(.${classes.img})) {
                background-color: ${colorValue};
            }

            .${classes.img} {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
    `, [colorValue])
}