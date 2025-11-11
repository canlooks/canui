import {css} from '@emotion/react'
import {defineInnerClasses, defineCss, useColor, useCss} from '../../utils'
import {MenuItemProps} from './menuItem'
import Color from 'color'

export const classes = defineInnerClasses('menu-item', [
    'content',
    'checkbox',
    'prefix',
    'suffix',
    'content',
    'children',
    'childrenWrap',
    'arrow'
])

// 原始横向内边距，用于缩进时计算
export const paddingHorizontal = {
    small: 2,
    medium: 6,
    large: 10
}

export function useStyle({color}: Required<Pick<MenuItemProps, 'color'>>) {
    const colorValue = useColor(color)

    return useCss(({spacing, mode, borderRadius, gray, easing, text}) => {
        const c = Color(colorValue)
        const selectedBg = c.alpha(.1).string()
        const selectedAndFocused = c.alpha(.15).string()
        const selectedActive = c.alpha(.08).string()
        const focusedBg = gray(mode === 'light' ? .05 : .23)
        const disabledOrActive = gray(mode === 'light' ? .1 : .17)

        return css`
            @layer reset {
                display: flex;
                align-items: center;
                gap: ${spacing[3]}px;
                border-radius: ${borderRadius}px;
                cursor: pointer;
                color: ${text.primary};
                padding: ${paddingHorizontal.medium}px 12px;
                position: relative;
                -webkit-tap-highlight-color: transparent;

                &[data-size=small] {
                    gap: ${spacing[2]}px;
                    padding: ${paddingHorizontal.small}px 6px;
                }

                &[data-size=large] {
                    gap: ${spacing[4]}px;
                    padding: ${paddingHorizontal.large}px 15px;
                }

                transition: background-color .25s ${easing.easeOut};

                &:hover, &[data-focused=true] {
                    background-color: ${focusedBg};
                }

                &[data-emphasized=true] {
                    color: ${colorValue};
                }

                &:active {
                    transition: background-color 0s;
                    background-color: ${disabledOrActive};
                }

                &[data-selected=true] {
                    background-color: ${selectedBg};

                    &:hover, &[data-focused=true] {
                        background-color: ${selectedAndFocused};
                    }

                    .${classes.content} {
                        font-weight: bold;
                        color: ${colorValue};
                    }

                    &:active {
                        background-color: ${selectedActive};
                    }
                }

                &[data-disabled=true] {
                    cursor: not-allowed;
                    color: ${text.disabled};
                    background-color: ${disabledOrActive};
                }

                .${classes.checkbox} {
                    display: flex;
                }

                .${classes.content} {
                    flex: 1;
                }

                &[data-ellipsis=true] {
                    .${classes.content} {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                }

                .${classes.suffix} {
                    max-width: 70%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }

                .${classes.prefix} {
                    color: ${text.secondary};
                }

                &[data-emphasized=true],
                &[data-selected=true] {
                    .${classes.prefix} {
                        color: ${colorValue};
                    }
                }

                &:has(+ .${classes.children} .${classes.root}[data-selected=true]) {
                    .${classes.content} {
                        color: ${colorValue};
                    }

                    .${classes.prefix},
                    .${classes.arrow} {
                        color: ${colorValue};
                    }
                }

                .${classes.suffix} {
                    color: ${text.disabled};
                }

                .${classes.arrow} {
                    color: ${text.placeholder};
                    transition: transform .25s ${easing.easeOut};

                    &[data-open=true] {
                        transform: rotate(180deg);
                    }
                }
            }
        `
    }, [colorValue])
}

export const menuListPadding = 4

export const childrenStyle = defineCss(({background}) => css`
    @layer reset {
        .${classes.childrenWrap} {
            padding: ${menuListPadding}px;
            background-color: ${background.fixed};
        }
    }
`)