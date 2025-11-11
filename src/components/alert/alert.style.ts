import {css} from '@emotion/react'
import {ColorPropsValue} from '../../types'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import Color from 'color'

export const classes = defineInnerClasses('alert', [
    'icon',
    'content',
    'title',
    'description',
    'prefix',
    'suffix',
    'close'
])

export function useStyle({color}: {color: ColorPropsValue}) {
    const colorValue = useColor(color)

    return useCss(({mode, spacing, borderRadius, text}) => {
        const c = Color(colorValue)
        const border = c.alpha(.5).string()
        const bg = c.alpha(mode === 'light' ? .1 : .16).string()
        const filledBg = mode === 'light' ? colorValue : c.alpha(.8).string()

        return css`
            @layer reset {
                display: flex;
                align-items: center;
                gap: ${spacing[3]}px;
                padding: ${spacing[4]}px ${spacing[5]}px;
                border-radius: ${borderRadius}px;

                .${classes.icon} {
                    display: block;
                    color: ${colorValue};
                }

                &[data-variant=standard],
                &[data-variant=outlined] {
                    background-color: ${bg};
                }

                &[data-variant=outlined] {
                    border: 1px solid ${border};
                }

                &[data-variant=filled] {
                    background-color: ${filledBg};
                    color: #ffffff;

                    .${classes.icon} {
                        color: #ffffff;
                    }
                }

                &:has(.${classes.title}) {
                    .${classes.icon} {
                        display: flex;
                        font-size: ${20 / 14}em;
                    }
                }

                .${classes.content} {
                    flex: 1;
                    min-width: 0;
                }

                .${classes.title} {
                    font-weight: bold;
                    font-size: ${15 / 14}em;

                    & + .${classes.description} {
                        margin-top: ${spacing[3]}px;
                    }
                }

                &:not([data-variant=filled]) .${classes.description} {
                    color: ${text.secondary};
                }

                .${classes.close} {
                    align-self: flex-start;
                }
            }
        `
    }, [colorValue])
}