import {css} from '@emotion/react'
import {defineInnerClasses, useCss} from '../../utils'
import Color from 'color'
import {BackdropProps} from './backdrop'

export const classes = defineInnerClasses('backdrop')

export function useStyle({variant}: Pick<BackdropProps, 'variant'>) {
    return useCss(({background, text, spacing}) => {
        const bgColor = variant === 'dark'
            ? Color(text.primary).alpha(.8).string()
            : Color(background.content).alpha(.8).string()

        return css`
            @layer reset {
                position: absolute;
                inset: 0;
                z-index: 1;
                background-color: ${bgColor};
                display: flex;
                flex-direction: column;
                gap: ${spacing[3]}px;
                align-items: center;
                justify-content: center;
            }
        `
    }, [variant])
}