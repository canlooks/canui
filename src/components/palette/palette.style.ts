import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as sliderClasses} from '../slider/slider.style'

export const classes = defineInnerClasses('palette', [
    'main',
    'mask',
    'handle',
    'slidersRow',
    'sliders',
    'hue',
    'alpha',
    'alphaMask',
    'preview',
    'previewColor',
    'inputRow',
    'inputsWrap',
    'inputItem',
    'input',
    'inputItemLabel'
])

export const getTransparentBackground = (a: string, b: string) => `background-image: conic-gradient(${a} 0 25%, ${b} 25% 50%, ${a} 50% 75%, ${b} 75% 100%);`

export const style = defineCss(({spacing, borderRadius, background, divider, text}) => css`
    @layer reset {
        width: 240px;
        display: flex;
        flex-direction: column;
        gap: ${spacing[3]}px;
        user-select: none;

        .${classes.main} {
            aspect-ratio: 3 / 2;
            border-radius: ${borderRadius}px;
            /* overflow: hidden; */
            position: relative;
            touch-action: none;

            .${classes.mask} {
                background-image: linear-gradient(0deg, #000, transparent);
                border-radius: inherit;
                position: absolute;
                inset: 0;
                pointer-events: none;
            }

            .${classes.handle} {
                cursor: pointer;
                width: 12px;
                height: 12px;
                border: 2px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 0 2px ${text.primary}, inset 0 0 1px ${text.primary};
                position: absolute;
                transform: translate(-50%, -50%);
            }
        }

        .${classes.slidersRow} {
            display: flex;
            gap: ${spacing[3]}px;

            .${classes.sliders} {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .${sliderClasses.root} {
                    min-height: 0;

                    .${sliderClasses.handle} {
                        background-color: transparent;
                        border-color: #ffffff;
                        box-shadow: 0 0 2px #000000, inset 0 0 1px #000000;
                    }
                }

                .${classes.hue} {
                    .${sliderClasses.rail} {
                        background-image: linear-gradient(90deg,
                        #f00 0%,
                        #ff0 ${100 / 6}%,
                        #0f0 ${100 / 6 * 2}%,
                        #0ff 50%, #00f ${100 / 6 * 4}%,
                        #f0f ${100 / 6 * 5}%,
                        #f00 100%
                        );
                    }
                }

                .${classes.alpha} {
                    .${sliderClasses.rail} {
                        position: relative;
                        background-color: transparent;

                        &::before,
                        .${classes.alphaMask} {
                            border-radius: inherit;
                            position: absolute;
                            inset: 0;
                        }

                        &::before {
                            content: '';
                            ${getTransparentBackground(background.body, background.content)}
                            background-size: 9px;
                        }
                    }
                }
            }

            .${classes.preview} {
                width: 30px;
                height: 30px;
                border-radius: ${borderRadius}px;
                border: 1px solid ${divider};
                overflow: hidden;
                ${getTransparentBackground(background.body, background.content)}
                background-size: 50% 50%;
                position: relative;

                .${classes.previewColor} {
                    position: absolute;
                    inset: 0;
                }
            }
        }

        .${classes.inputRow} {
            display: flex;
            gap: 12px;
            font-size: ${13 / 14}em;

            .${classes.inputsWrap} {
                flex: 1;
                display: flex;
                gap: ${spacing[1]}px;

                .${classes.inputItem} {
                    flex: 1;
                    display: flex;
                    flex-direction: column;

                    &[data-wide=true] {
                        flex: 3;
                    }

                    .${classes.input} {
                        padding: 0 ${spacing[1]}px;
                    }

                    &:not([data-wide=true]) {
                        .${classes.input} input {
                            text-align: center;
                        }
                    }

                    .${classes.inputItemLabel} {
                        text-align: center;
                        color: ${text.placeholder};
                    }
                }
            }
        }
    }
`)