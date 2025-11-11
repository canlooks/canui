import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {ColorPropsValue} from '../../types'

export const classes = defineInnerClasses('rate', [
    'star',
    'starBefore',
    'starAfter'
])

export function useStyle({color}: {color: ColorPropsValue}) {
    const colorValue = useColor(color)

    return useCss(({spacing, mode, gray, easing}) => css`
        @layer reset {
            display: inline-flex;
            gap: ${spacing[3]}px;

            .${classes.star} {
                font-size: ${20 / 14}em;
                color: ${mode === 'light' ? gray(.14) : '#000000'};
                display: flex;
                position: relative;
                -webkit-tap-highlight-color: transparent;

                [data-active=true] {
                    position: absolute;
                    color: ${colorValue};

                    &[data-half=true] {
                        clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
                    }
                }

                .${classes.starBefore},
                .${classes.starAfter} {
                    width: 50%;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                }

                .${classes.starBefore} {
                    left: 0;
                }

                .${classes.starAfter} {
                    right: 0;
                }
            }

            &[data-size=small] {
                .${classes.star} {
                    font-size: ${16 / 14}em;
                }
            }

            &[data-size=large] {
                .${classes.star} {
                    font-size: ${24 / 14}em;
                }
            }

            &:not([data-read-only=true]) {
                .${classes.star} {
                    cursor: pointer;
                    transition: transform .25s ${easing.easeOut};

                    &:hover {
                        transform: scale(1.2);
                    }

                    &:active {
                        transition: transform 0s;
                        transform: scale(.9);
                    }
                }
            }

            &[data-disabled=true] {
                &, .${classes.star} {
                    cursor: not-allowed;
                }
            }
        }
    `, [colorValue])
}