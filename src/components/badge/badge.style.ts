import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {ColorPropsValue} from '../../types'

export const classes = defineInnerClasses('badge', [
    'children',
    'badge',
    'badgeWrap'
])

export function useStyle({color}: {color: ColorPropsValue}) {
    const colorValue = useColor(color)

    return useCss(({easing}) => css`
        @layer reset {
            display: inline-flex;
            position: relative;

            .${classes.badge} {
                .${classes.badgeWrap} {
                    line-height: 1;
                    background-color: ${colorValue};
                    color: #ffffff;
                    border: 1px solid #ffffff;
                    font-size: ${13 / 14}em;
                    top: 0;
                    left: 0;
                    transition: transform .25s ${easing.swing};
                }
            }

            &:has(.${classes.children}) {
                .${classes.badge},
                .${classes.badgeWrap} {
                    position: absolute;
                }

                .${classes.badgeWrap} {
                    transform: translate(-50%, -50%);
                }
            }

            &[data-variant=standard] {
                .${classes.badgeWrap} {
                    border-radius: 1000em;
                    padding: 2px 6px 3px;
                }
            }

            &[data-variant=dot] {
                .${classes.badgeWrap} {
                    width: 9px;
                    height: 9px;
                    border-radius: 50%;
                }
            }

            &[data-zero=true] {
                .${classes.badgeWrap} {
                    transform: scale(0);
                    transition: transform .25s ${easing.easeOut};
                }

                &:has(.${classes.children}) {
                    .${classes.badgeWrap} {
                        transform: translate(-50%, -50%) scale(0);
                    }
                }
            }
        }
    `, [colorValue])
}