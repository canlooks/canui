import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import Color from 'color'
import {ColorPropsValue} from '../../types'

export const classes = defineInnerClasses('button', [
    'prefix',
    'suffix',
    'content'
])

export function useStyle({color}: { color: ColorPropsValue }) {
    const colorValue = useColor(color)

    return useCss(({borderRadius, easing, spacing, text, gray}) => {
        const c = Color(colorValue)
        const outlineColor = c.alpha(.4).string()
        let light, lighter, lightest
        if (c.hue()) {
            light = c.lighten(.1).hex()
            lighter = c.lighten(.15).hex()
            lightest = c.lighten(.2).hex()
        } else {
            light = c.lightness(20).hex()
            lighter = c.lightness(30).hex()
            lightest = c.lightness(60).hex()
        }
        const darkC = c.darken(.1)
        const dark = darkC.hex()

        const defaultStyle = css`
            @layer reset {
                line-height: inherit;
                vertical-align: top;
                font-size: 1em;
                user-select: none;
                appearance: none;
                -webkit-tap-highlight-color: transparent;
                border: none;
                border-radius: ${borderRadius}px;
                position: relative;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                transition-property: outline-width, background-color, filter, color, border-color;
                transition-duration: .25s;
                transition-timing-function: ${easing.easeOut};

                &[data-orientation=vertical] {
                    flex-direction: column;
                }

                &:active {
                    transition-duration: 0s;
                }
            }
        `
        const sizeStyle = css`
            @layer reset {
                gap: ${spacing[2]}px;

                &[data-size=small] {
                    gap: ${spacing[1]}px;
                }

                &[data-variant=filled], &[data-variant=flatted], &[data-variant=text], &[data-variant=ghost] {
                    padding: 6px 16px;

                    &[data-size=small] {
                        padding: 2px 8px;
                    }

                    &[data-size=large] {
                        padding: 10px 20px;
                    }

                    &[data-orientation=vertical] {
                        padding-top: 9px;
                        padding-bottom: 9px;

                        &[data-size=small] {
                            padding-top: 4px;
                            padding-bottom: 4px;
                        }

                        &[data-size=large] {
                            padding-top: 15px;
                            padding-bottom: 15px;
                        }
                    }
                }

                &[data-variant=outlined], &[data-variant=dashed] {
                    padding: 5px 15px;

                    &[data-size=small] {
                        padding: 1px 7px;
                    }

                    &[data-size=large] {
                        padding: 9px 19px;
                    }

                    &[data-orientation=vertical] {
                        padding-top: 8px;
                        padding-bottom: 8px;

                        &[data-size=small] {
                            padding-top: 3px;
                            padding-bottom: 3px;
                        }

                        &[data-size=large] {
                            padding-top: 14px;
                            padding-bottom: 14px;
                        }
                    }
                }
            }
        `
        const flattedStyle = css`
            @layer reset {
                &[data-variant=flatted] {
                    color: #fff;
                    background-color: ${colorValue};

                    &:not(:disabled):not([data-read-only=true]):not([data-loading=true]) {
                        &:hover {
                            background-color: ${lighter};
                        }

                        &:active {
                            background-color: ${dark};
                        }
                    }
                }
            }
        `
        const filledStyle = css`
            @layer reset {
                &[data-variant=filled] {
                    color: #fff;
                    background-image: linear-gradient(0deg, ${dark}, ${light});

                    &:not(:disabled):not([data-read-only=true]):not([data-loading=true]) {
                        &:hover {
                            filter: brightness(1.1);
                        }

                        &:active {
                            filter: none;
                            background-image: linear-gradient(0deg, ${light}, ${dark});
                        }
                    }
                }
            }
        `
        const outlinedAndDashedStyle = css`
            @layer reset {
                &[data-variant=outlined], &[data-variant=dashed] {
                    color: ${colorValue};
                    border: 1px solid ${colorValue};
                    background-color: transparent;

                    &:not(:disabled):not([data-read-only=true]):not([data-loading=true]) {
                        &:hover {
                            color: ${lightest};
                            border-color: ${lightest};
                        }

                        &:active {
                            color: ${dark};
                            border-color: ${dark};
                        }
                    }
                }

                &[data-variant=dashed] {
                    border-style: dashed;
                }
            }
        `
        const ghostStyle = css`
            @layer reset {
                &[data-variant=ghost] {
                    color: ${colorValue};
                    background-color: ${c.alpha(.05).string()};

                    &:not(:disabled):not([data-read-only=true]):not([data-loading=true]) {
                        &:hover {
                            background-color: ${c.alpha(.1).string()};
                        }

                        &:active {
                            background-color: ${darkC.alpha(.15).string()};
                        }
                    }
                }
            }
        `
        const textStyle = css`
            @layer reset {
                &[data-variant=text] {
                    color: ${colorValue};
                    background-color: transparent;

                    &:not(:disabled):not([data-read-only=true]):not([data-loading=true]) {
                        &:hover {
                            background-color: ${c.alpha(.05).string()};
                        }

                        &:active {
                            background-color: ${darkC.alpha(.1).string()};
                        }
                    }
                }
            }
        `
        const plainStyle = css`
            @layer reset {
                &[data-variant=plain] {
                    padding: 0;
                    color: ${colorValue};
                    background-color: transparent;

                    &:not(:disabled):not([data-read-only=true]):not([data-loading=true]) {
                        &:hover {
                            color: ${lightest};
                        }

                        &:active {
                            color: ${dark};
                        }
                    }
                }
            }
        `
        const statusStyle = css`
            @layer reset {
                &:not(:disabled):not([data-read-only=true]):not([data-loading=true]) {
                    cursor: pointer;
                }

                outline-offset: 1px;
                outline: ${outlineColor} solid 0;

                &:focus-visible {
                    transition-timing-function: ${easing.swing}, ${easing.easeOut};
                    outline-width: 3px;
                }

                &:disabled {
                    cursor: not-allowed;
                    color: ${text.disabled};
                    border-color: ${text.disabled};

                    &:not([data-variant=text]):not([data-variant=plain]) {
                        background-image: none;
                        background-color: ${gray(.1)};
                    }
                }

                &[data-loading=true] {
                    transition: all 0s;

                    &[data-variant=flatted], &[data-variant=filled] {
                        background-image: none;
                        background-color: ${lightest};
                        border-color: ${lightest};
                    }

                    &:not([data-variant=flatted]):not([data-variant=filled]) {
                        color: ${lightest};
                    }
                }
            }
        `
        const shapeStyle = css`
            @layer reset {
                &[data-shape=rounded] {
                    border-radius: 1000em;
                }

                &[data-shape=circular] {
                    border-radius: 50%;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    aspect-ratio: 1;

                    &[data-size=small] {
                        width: 24px;
                        height: 24px;
                        padding: 0;
                    }

                    &[data-size=large] {
                        width: 40px;
                        height: 40px;
                        padding: 0;
                    }
                }
            }
        `
        const compactStyle = css`
            @layer reset {
                &[data-compact=row] {
                    &:not([data-last=true]) {
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                    }

                    &:not([data-first=true]) {
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;

                        &[data-variant=outlined], &[data-variant=dashed] {
                            border-left-color: transparent;
                        }
                    }
                }

                &[data-compact=column] {
                    &:not([data-last=true]) {
                        border-bottom-left-radius: 0;
                        border-bottom-right-radius: 0;
                    }

                    &:not([data-first=true]) {
                        border-top-left-radius: 0;
                        border-top-right-radius: 0;

                        &[data-variant=outlined], &[data-variant=dashed] {
                            border-top-color: transparent;
                        }
                    }
                }
            }
        `

        return [
            defaultStyle,
            sizeStyle,
            flattedStyle,
            filledStyle,
            outlinedAndDashedStyle,
            ghostStyle,
            textStyle,
            plainStyle,
            statusStyle,
            shapeStyle,
            compactStyle
        ]
    }, [colorValue])
}