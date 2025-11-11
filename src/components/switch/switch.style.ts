import {css} from '@emotion/react'
import {ColorPropsValue} from '../../types'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import Color from 'color'

export const classes = defineInnerClasses('switch', [
    'input',
    'track',
    'label',
    'checkedLabel',
    'uncheckedLabel',
    'thumb',
])

export function useStyle({color}: {color: ColorPropsValue}) {
    const colorValue = useColor(color)

    return useCss(({gray, easing, text}) => {
        const c = Color(colorValue)
        const lighter = c.lighten(.2).hex()
        const outlineColor = c.alpha(.4).string()

        return css`
            @layer reset {
                display: inline-flex;
                align-items: center;
                position: relative;

                .${classes.input} {
                    position: absolute;
                    opacity: 0;
                    inset: 0;
                    pointer-events: none;
                }

                .${classes.track} {
                    display: inline-flex;
                    align-items: center;
                    border-radius: 1000em;
                    position: relative;
                    overflow: hidden;
                    outline-offset: 1px;
                    outline: 0 solid ${outlineColor};
                    background-color: ${gray(.1)};
                    transition: background-color .25s ${easing.easeOut};
                }

                &:has(:focus-visible) {
                    .${classes.track} {
                        transition: background-color .25s ${easing.easeOut}, outline-width .25s ${easing.swing};
                        outline-width: 3px;
                    }
                }

                .${classes.thumb} {
                    aspect-ratio: 1;
                    background-color: #ffffff;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: 2px;
                    transition: left .25s ${easing.bounce};
                }

                &:not([data-disabled=true]):not([data-read-only=true]) {
                    cursor: pointer;

                    &:hover {
                        .${classes.track} {
                            background-color: ${gray(.2)};
                        }
                    }
                }

                &[data-disabled=true] {
                    cursor: not-allowed;

                    &[data-checked=true] {
                        .${classes.track} {
                            background-color: ${outlineColor};
                        }
                    }
                }

                &[data-checked=true] {
                    .${classes.track} {
                        background-color: ${colorValue};
                    }

                    &:not([data-disabled=true]):not([data-read-only=true]):hover {
                        .${classes.track} {
                            background-color: ${lighter};
                        }
                    }
                }

                .${classes.label} {
                    height: 100%;
                    align-self: flex-start;
                    white-space: nowrap;
                    transition: all .25s ${easing.bounce};

                    .${classes.checkedLabel},
                    .${classes.uncheckedLabel} {
                        text-align: center;
                    }

                    .${classes.checkedLabel} {
                        color: #ffffff;
                        padding: 0 6px 0 12px;
                    }

                    .${classes.uncheckedLabel} {
                        color: ${text.secondary};
                        padding: 0 12px 0 6px;
                    }
                }
            }
        `
    }, [colorValue])
}