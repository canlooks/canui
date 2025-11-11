import {css, keyframes} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {CheckboxBaseProps} from './checkboxBase'
import Color from 'color'

export const classes = defineInnerClasses('checkbox-base', [
    'checkbox',
    'radio',
    'radioChecked',
    'icon',
    'indeterminate',
    'input',
    'label'
])

export function useStyle({color}: Required<Pick<CheckboxBaseProps, 'color'>>) {
    const colorValue = useColor(color)

    return useCss(({mode, easing, gray, text}) => {
        const lighter = Color(colorValue).lighten(.2).hex()

        return css`
            @layer reset {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                position: relative;
                -webkit-tap-highlight-color: transparent;

                .${classes.checkbox} {
                    min-width: 16px;
                    min-height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid ${gray(.7)};
                    border-radius: 4px;
                    transition: border-color .25s ${easing.easeOut};
                    position: relative;

                    .${classes.icon} {
                        font-size: .9em;
                        color: #ffffff;
                        animation: ${iconAnim} .25s ${easing.swing};
                        position: absolute;
                    }

                    .${classes.indeterminate} {
                        width: 60%;
                        height: 4px;
                        background-color: ${colorValue};
                        animation: ${iconAnim} .25s ${easing.swing};
                        position: absolute;
                    }

                    > * {
                        pointer-events: none;
                    }
                }

                .${classes.radio} {
                    border-radius: 50%;

                    .${classes.radioChecked} {
                        border-radius: inherit;
                        background-color: ${colorValue};
                        animation: ${iconAnim} .25s ${easing.swing};
                        position: absolute;
                        inset: 3px;
                    }
                }

                .${classes.label} {
                    transition: color .25s ${easing.easeOut};
                }

                &[data-size=small] {
                    .${classes.checkbox} {
                        min-width: 13px;
                        min-height: 13px;

                        .${classes.icon} {
                            font-size: .8em;
                        }
                    }
                }

                &[data-size=large] {
                    .${classes.checkbox} {
                        min-width: 20px;
                        min-height: 20px;

                        .${classes.icon} {
                            font-size: 1em;
                        }
                    }
                }

                &:not([data-disabled=true]):hover {
                    .${classes.checkbox} {
                        border-color: ${gray(mode === 'light' ? .4 : .6)};
                    }

                    .${classes.label} {
                        opacity: ${mode === 'light' ? .7 : .8};
                    }
                }

                &:not([data-disabled=true]):active {
                    .${classes.checkbox} {
                        transition: border-color 0s;
                        border-color: ${gray(.9)};
                    }

                    .${classes.label} {
                        transition: color 0s;
                        opacity: 1;
                    }
                }

                &[data-checked=true] {
                    .${classes.checkbox} {
                        transition: border-color 0s;
                    }

                    &:not([data-disabled=true]) {
                        .${classes.checkbox} {
                            background-color: ${colorValue};
                            border-color: ${colorValue};
                        }

                        .${classes.radio} {
                            background-color: transparent;
                        }
                    }
                }

                &[data-disabled=true] {
                    cursor: not-allowed;

                    .${classes.checkbox} {
                        background-color: ${gray(.1)};
                    }

                    .${classes.icon} {
                        color: ${text.disabled};
                    }

                    .${classes.indeterminate},
                    .${classes.radioChecked} {
                        background-color: ${text.disabled};
                    }
                }

                .${classes.input} {
                    position: absolute;
                    opacity: 0;
                    pointer-events: none;
                }

                &:has(.${classes.input}:focus) {
                    .${classes.checkbox} {
                        outline: 3px solid ${lighter};
                        outline-offset: 1px;;
                    }
                }
            }
        `
    }, [colorValue])
}

const iconAnim = keyframes`
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
`