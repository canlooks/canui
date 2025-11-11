import {css, keyframes} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {LoadingIndicatorProps} from './loadingIndicator'
import Color from 'color'

export const classes = defineInnerClasses('loading-indicator', [
    'indicator'
])

export function useStyle({color, borderWidth}: Required<Pick<LoadingIndicatorProps, 'color' | 'borderWidth'>>) {
    const colorValue = useColor(color)

    return useCss(({mode}) => {
        const borderColor = mode === 'light' ? Color(colorValue).alpha(.6).string() : colorValue
        return css`
            @layer reset {
                .${classes.indicator} {
                    width: 100%;
                    height: 100%;
                    aspect-ratio: 1;
                    border-radius: 50%;
                    border: ${borderWidth}px solid;
                    border-color: ${borderColor} transparent;
                    animation: ${spinning} 1.25s infinite;
                }
            }
        `
    }, [colorValue, borderWidth])
}

const spinning = keyframes`
    100% {
        transform: rotate(1.5turn)
    }
`