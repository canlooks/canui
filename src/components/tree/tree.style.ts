import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import Color from 'color'

export const classes = defineInnerClasses('tree', [
    'levelBlock',
    'search',
    'node',
    'contentWrap',
    'indent',
    'expand',
    'checkbox',
    'dragHandle',
    'icon',
    'label',
    'prefix',
    'suffix',
    'dragMask',
    'dragMaskPrev',
    'dragMaskNext'
])

export const style = defineCss(({spacing, mode, borderRadius, text, easing, gray, divider, colors}) => {
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

            .${classes.dragHandle} {
                width: 20px;
                margin-right: ${spacing[3]}px;
                text-align: center;
                color: ${gray(.12)};
                cursor: grab;
            }

            .${classes.checkbox} {
                margin-right: ${spacing[3]}px;
            }

            .${classes.label} {
                flex: 1;
                padding: 5px 0;

            }

            .${classes.prefix} {
                color: ${text.secondary};
                margin-right: ${spacing[2]}px;
            }

            .${classes.suffix} {
                color: ${text.disabled};
                margin-left: ${spacing[2]}px;
            }

            .${classes.dragMask} {
                position: absolute;
                inset: 0;

                > div {
                    width: 100%;
                    height: 50%;
                    position: absolute;
                    left: 0;

                    &:before, &:after {
                        content: '';
                        display: none;
                        position: absolute;
                        pointer-events: none;
                    }

                    &:before {
                        width: 8px;
                        height: 8px;
                        border: 2px solid ${colors.primary.main};
                        border-radius: 50%;
                        left: 0;
                    }

                    &:after {
                        width: 100%;
                        height: 2px;
                        background: ${colors.primary.main};
                        left: 8px;
                    }

                    &.${classes.dragMaskPrev} {
                        top: 0;

                        &:before {
                            top: -4px;
                        }

                        &:after {
                            top: -1px;
                        }
                    }

                    &.${classes.dragMaskNext} {
                        bottom: 0;

                        &:before {
                            bottom: -4px;
                        }

                        &:after {
                            bottom: -1px;
                        }
                    }

                    &[data-offset=true] {
                        &:before {
                            width: 10px;
                            border-top: 0;
                            border-right: 0;
                            border-bottom: 2px dashed ${colors.primary.main};
                            border-left: 2px dashed ${colors.primary.main};
                            border-radius: 0;
                            left: 24px;
                            bottom: -1px;
                        }

                        &:after {
                            width: calc(100% - 36px);
                            left: 36px;
                        }
                    }

                    &[data-overing=true] {
                        &:before, &:after {
                            display: block;
                        }
                    }
                }
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

        &, .${classes.levelBlock} {
            &[data-active=true] {
                outline: 1px dashed ${colors.primary.main};
            }
        }

        &[data-sortable=true] {
            .${classes.node} {
                &:not(:has(.${classes.dragHandle})) {
                    cursor: grab;
                }

                &[data-dragging=true] {
                    &, &:active {
                        background-color: ${selectedBg};
                    }
                }

                &:has(+ .${classes.levelBlock}[data-active=true]) {
                    outline: 1px solid ${colors.primary.main};
                }
            }
        }
    `
})