import {css} from '@emotion/react'
import {defineInnerClasses, useCss} from '../../utils'
import Color from 'color'
import {useStyle as useDndStyle} from './treeDnd.style'

export const classes = defineInnerClasses('tree', [
    'search',
    'node',
    'contentWrap',
    'indent',
    'expand',
    'checkbox',
    'icon',
    'label',
    'prefix',
    'suffix'
])

export function useStyle({indent}: {
    indent: number
}) {
    return [
        useCss(({spacing, mode, borderRadius, text, easing, gray, divider, colors}) => {
            const c = Color(colors.primary.main)
            const hover = gray(mode === 'light' ? .05 : .2)
            const active = gray(mode === 'light' ? .1 : .12)
            const selectedBg = c.alpha(mode === 'light' ? .1 : .2).string()
            const selectedHover = c.alpha(mode === 'light' ? .07 : .17).string()
            const selectedActive = c.alpha(mode === 'light' ? .13 : .23).string()

            return css`
            .${classes.search} {
                margin-bottom: ${spacing[3]}px;
            }

            .${classes.node} {
                display: flex;
                align-items: center;
                padding-right: ${spacing[2]}px;
                border-radius: ${borderRadius}px;
                transition: background-color .25s ${easing.easeOut};
                touch-action: none;
                -webkit-tap-highlight-color: transparent;

                &[data-disabled=true] {
                    color: ${text.disabled};
                    cursor: not-allowed;
                }

                &:not([data-read-only=true]) {
                    cursor: pointer;
                }

                &[data-selected=true] {
                    background-color: ${selectedBg};

                    &:hover {
                        background-color: ${selectedHover};
                    }

                    &:active {
                        transition: background-color 0s;
                        background-color: ${selectedActive};
                    }
                }

                &:not([data-disabled=true]):not([data-selected=true]):hover {
                    background-color: ${hover};
                }

                &:not([data-disabled=true]):not([data-selected=true]):active {
                    transition: background-color 0s;
                    background-color: ${active};
                }

                .${classes.indent} {
                    width: ${indent}px;
                    align-self: stretch;
                    display: flex;
                }

                .${classes.expand} {
                    width: 29px;
                    align-self: stretch;
                    align-items: center;
                    justify-content: center;

                    .${classes.icon} {
                        transition: rotate .25s ${easing.easeOut};
                    }
                }

                .${classes.contentWrap} {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    position: relative;
                }

                .${classes.checkbox} {
                    margin-right: ${spacing[3]}px;
                }

                .${classes.label} {
                    flex: 1;
                    padding: 6px 0;

                }

                .${classes.prefix} {
                    color: ${text.secondary};
                    margin-right: ${spacing[2]}px;
                }

                .${classes.suffix} {
                    color: ${text.disabled};
                    margin-left: ${spacing[2]}px;
                }
            }

            &[data-show-line=true] {
                .${classes.indent}:after {
                    content: '';
                    width: 1px;
                    height: 100%;
                    margin-left: 14px;
                    background-color: ${divider};
                }
            }
        `
        }),
        useDndStyle({indent})
    ]
}