import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import Color from 'color'
import {ColorPropsValue} from '../../types'

export const classes = defineInnerClasses('segmented', [
    'option',
    'label',
    'prefix',
    'suffix',
    'indicator'
])

export function useStyle({indicatorColor}: {indicatorColor: ColorPropsValue}) {
    const indicatorColorValue = useColor(indicatorColor)

    return useCss(({mode, background, borderRadius, easing, text}) => {
        const bgColor = Color(background.body)
        const hoverBg = bgColor.darken(mode === 'light' ? .04 : .12).hex()
        const activeBg = bgColor.darken(mode === 'light' ? .08 : .24).hex()

        return css`
            display: inline-flex;
            background-color: ${background.body};
            border-radius: ${borderRadius}px;
            padding: 2px;
            position: relative;

            .${classes.option} {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                padding: 4px 12px;
                border-radius: ${borderRadius}px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                z-index: 1;
                transition: background-color .3s ${easing.easeOut};
                -webkit-tap-highlight-color: transparent;

                &[data-active=true] {
                    transition: background-color 0s;
                }

                &[data-orientation=vertical] {
                    flex-direction: column;
                }

                &[data-disabled=true] {
                    cursor: not-allowed;
                    color: ${text.disabled};
                }
            }

            &[data-size=small] {
                .${classes.option} {
                    padding: 3px 12px;
                }
            }

            &[data-size=large] {
                .${classes.option} {
                    padding: 11px 12px;
                }
            }

            &[data-full-width=true] {
                display: flex;

                .${classes.option} {
                    flex: 1;
                }
            }

            &[data-orientation=vertical] {
                flex-direction: column;
            }

            .${classes.indicator} {
                border-radius: ${borderRadius}px;
                background-color: ${indicatorColorValue};
                box-shadow: 0 1px 4px rgba(0, 0, 0, .1);
                position: absolute;
                transition: all .3s ${easing.bounce};
            }

            &[data-animating=true] {
                .${classes.option} {
                    transition: background-color 0s;
                }
            }

            &:not([data-animating=true]) {
                .${classes.option}[data-active=true] {
                    background-color: ${indicatorColorValue};
                    box-shadow: 0 1px 4px rgba(0, 0, 0, .1);
                }
            }

            &:not(:has([data-active=true])) {
                .${classes.indicator} {
                    display: none;
                }
            }

            &:not([data-read-only=true]):not([data-disabled=true]) {
                .${classes.option}:not([data-disabled=true]) {
                    cursor: pointer;

                    &:not([data-active=true]):hover {
                        background-color: ${hoverBg};
                    }

                    &:not([data-active=true]):active {
                        transition: background-color 0s;
                        background-color: ${activeBg};
                    }
                }
            }

            &[data-disabled=true] {
                .${classes.option} {
                    cursor: not-allowed;
                }
            }
        `
    }, [indicatorColorValue])
}