import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {ColorPropsValue} from '../../types'
import Color from 'color'

export const classes = defineInnerClasses('slider', [
    'rail',
    'railWrap',
    'track',
    'trackCorner',
    'mark',
    'label',
    'handle',
    'prefix',
    'suffix'
])

export function useStyle({color}: {color: ColorPropsValue}) {
    const colorValue = useColor(color)

    return useCss(({spacing, mode, gray, divider, text, background, easing}) => {
        const c = Color(colorValue)
        const lighter = c.lighten(.1).hex()
        const darker = c.darken(.1).hex()
        const outlineColor = c.alpha(.15).string()

        return css`
            @layer reset {
                min-height: 24px;
                display: flex;
                align-items: center;
                gap: ${spacing[2]}px;

                &[data-inset=true] {
                    min-height: 0;
                }

                .${classes.rail} {
                    flex: 1;
                    border-radius: 1000em;
                    cursor: pointer;
                    background-color: ${gray(.1)};
                    transition: background-color .25s ${easing.easeOut};
                    touch-action: none;

                    &:hover {
                        background-color: ${mode === 'light' ? divider : gray(.05)};
                    }

                    .${classes.railWrap} {
                        height: 100%;
                        position: relative;
                        border-radius: inherit;
                    }
                }

                &[data-orientation=vertical] {
                    min-height: auto;
                    height: 100%;
                    flex-direction: column;

                    .${classes.rail} {
                        height: 100%;
                    }

                    .${classes.handle} {
                        transform: translate(-50%, 50%);
                    }
                }

                .${classes.handle} {
                    cursor: pointer;
                    padding: 0;
                    border-radius: 50%;
                    border: 0 solid ${colorValue};
                    position: absolute;
                    z-index: 1;
                    transform: translate(-50%, -50%);
                    -webkit-tap-highlight-color: transparent;
                }

                &:not([data-disable-outline=true]) {
                    .${classes.handle} {
                        outline: 0 solid ${outlineColor};
                    }
                }

                &[data-variant=filled] {
                    .${classes.handle} {
                        transition: background-color .25s ${easing.easeOut}, outline-width .25s ${easing.easeOut};
                        background-color: ${colorValue};

                        &:hover {
                            outline-width: 6px;
                            background-color: ${lighter};
                        }

                        &:active {
                            transition: background-color 0s, outline-width .25s ${easing.swing};
                            background-color: ${darker};
                            outline-width: 9px;
                        }

                        &:focus {
                            transition: background-color .25s ${easing.easeOut}, outline-width .25s ${easing.swing};
                            outline-width: 9px;
                        }
                    }
                }

                &[data-variant=outlined] {
                    .${classes.handle} {
                        transition: outline-width .25s ${easing.easeOut};
                        background-color: ${background.content};
                        border-width: 2px;

                        &:hover {
                            outline-width: 6px;
                        }

                        &:active,
                        &:focus {
                            transition: outline-width .25s ${easing.swing};
                            outline-width: 9px;
                        }
                    }
                }

                .${classes.track} {
                    position: absolute;
                    background-color: ${colorValue};

                    &::before {
                        content: '';
                        aspect-ratio: 1;
                        border-radius: 50%;
                        position: absolute;
                        background-color: inherit;
                    }
                }

                &[data-orientation=horizontal] {
                    .${classes.track}::before {
                        height: 100%;
                        top: 0;
                        left: 0;
                        transform: translateX(-50%);
                    }
                }

                &[data-orientation=vertical] {
                    .${classes.track}::before {
                        width: 100%;
                        bottom: 0;
                        left: 0;
                        transform: translateY(50%);
                    }
                }

                .${classes.mark} {
                    aspect-ratio: 1;
                    border: 2px solid ${gray(mode === 'light' ? .2 : .1)};
                    border-radius: 50%;
                    background-color: ${background.content};
                    position: absolute;
                    transform: translate(-50%, -50%);

                    &[data-active=true] {
                        border-color: ${colorValue};
                    }

                    .${classes.label} {
                        color: ${text.secondary};
                        position: absolute;
                        font-size: ${13 / 14}em;
                    }
                }

                &[data-orientation=vertical] {
                    .${classes.mark} {
                        transform: translate(-50%, 50%);
                    }
                }

                &[data-inset=true] {
                    .${classes.mark} {
                        z-index: 2;
                    }
                }
            }
        `
    }, [colorValue])
}