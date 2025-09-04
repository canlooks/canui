import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {TabsProps} from './tabs'

export const classes = defineInnerClasses('tabs', [
    'scroll',
    'scrollWrap',
    'start',
    'end',
    'ellipsis',
    'prefix',
    'suffix',
    'tab',
    'label',
    'tabPrefix',
    'tabSuffix',
    'indicator'
])

export const indicatorWidth = 2

export function useStyle({color, variant}: Required<Pick<TabsProps, 'color' | 'variant'>>) {
    const colorValue = useColor(color)

    return useCss(({divider, text, easing, background, spacing, borderRadius, gray, colors}) => {
        const commonStyle = css`
            display: flex;
            position: relative;
            overflow: hidden;
            
            .${classes.scroll} {
                flex: 1;
                display: flex;
                overflow: auto;
                scrollbar-width: none;
                position: relative;

                &::-webkit-scrollbar {
                    display: none;
                }
    
                .${classes.scrollWrap} {
                    flex: 1;
                    display: flex;
                    position: relative;
                }
            }

            .${classes.start}, .${classes.end} {
                display: flex;
                z-index: 2;
                border-bottom: 1px solid ${divider};
                transition: box-shadow .25s ${easing.easeOut};

                &[data-show=true] {
                    box-shadow: 0 0 12px rgba(0, 0, 0, .2);
                }
            }

            .${classes.prefix}, .${classes.suffix} {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: ${background.content};
            }

            .${classes.ellipsis} {
                height: 100%;
                display: flex;
                align-items: center;
                margin-right: ${spacing[6]}px;
                cursor: pointer;

                &:hover {
                    color: ${colorValue};
                }
            }

            &[data-position=top],
            &[data-position=bottom] {
                .${classes.prefix}, .${classes.suffix} {
                    padding: 0 16px;
                }

                &[data-size=small] {
                    .${classes.prefix}, .${classes.suffix} {
                        padding: 0 14px;
                    }
                }

                &[data-size=large] {
                    .${classes.prefix}, .${classes.suffix} {
                        padding: 0 18px;
                    }
                }
            }

            &[data-position=left],
            &[data-position=right] {
                .${classes.prefix}, .${classes.suffix} {
                    padding: 12px 0;
                }

                &[data-size=small] {
                    .${classes.prefix}, .${classes.suffix} {
                        padding: 10px 0;
                    }
                }

                &[data-size=large] {
                    .${classes.prefix}, .${classes.suffix} {
                        padding: 14px 0;
                    }
                }
            }

            &:after {
                content: '';
                background-color: ${divider};
                position: absolute;
            }

            .${classes.tab} {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
                gap: 6px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                z-index: 1;
                -webkit-tap-highlight-color: transparent;

                &[data-orientation=vertical] {
                    flex-direction: column;
                }

                &[data-disabled=true] {
                    cursor: not-allowed;
                    color: ${text.disabled};
                }
            }

            &[data-full-width=true] {
                .${classes.tab} {
                    flex: 1;
                }
            }

            &[data-position=top],
            &[data-position=bottom] {
                &:after {
                    height: 1px;
                }

                &[data-position=top] {
                    &:after {
                        inset: auto 0 0 0;
                    }
                }

                &[data-position=bottom] {
                    &:after {
                        inset: 0 0 auto 0;
                    }
                }
            }

            &[data-position=left],
            &[data-position=right] {
                &, .${classes.scrollWrap} {
                    flex-direction: column;
                }

                &:after {
                    width: 1px;
                }

                &[data-position=left] {
                    &:after {
                        inset: 0 0 0 auto;
                    }
                }

                &[data-position=right] {
                    &:after {
                        inset: 0 auto 0 0;
                    }
                }
            }

            &:not([data-read-only=true]):not([data-disabled=true]) {
                .${classes.tab}:not([data-disabled=true]) {
                    cursor: pointer;
                    
                    &:not([data-active=true]):hover {
                        color: ${gray(.65)};
                    }
                
                    &:not([data-active=true]):active {
                        transition: color 0s;
                        color: ${text.primary};
                    }
                }
            }
    
            &[data-disabled=true] {
                .${classes.tab} {
                    cursor: not-allowed;
                }
            }
        `

        return variant === 'line'
            ? css`
                ${commonStyle}

                .${classes.scrollWrap} {
                    gap: 0 ${spacing[10]}px;
                }

                .${classes.tab} {
                    transition: color .25s ${easing.easeOut};
                }

                &[data-position=top],
                &[data-position=bottom] {
                    .${classes.tab} {
                        padding: 10px 0;
                    }

                    &[data-size=small] {
                        .${classes.tab} {
                            padding: 6px 0;
                        }
                    }
            
                    &[data-size=large] {
                        .${classes.tab} {
                            padding: 14px 0;
                        }
                    }
                }

                &[data-position=top] {
                    .${classes.tab} {
                        border-bottom: ${indicatorWidth}px solid transparent;
                    }
                }

                &[data-position=bottom] {
                    .${classes.tab} {
                        border-top: ${indicatorWidth}px solid transparent;
                    }
                }

                &[data-position=left],
                &[data-position=right] {
                    .${classes.tab} {
                        padding: 10px 18px;
                    }

                    &[data-size=small] {
                        .${classes.tab} {
                            padding: 6px 18px;
                        }
                    }
            
                    &[data-size=large] {
                        .${classes.tab} {
                            padding: 14px 18px;
                        }
                    }
                }

                &[data-position=left] {
                    .${classes.tab} {
                        border-right: ${indicatorWidth}px solid transparent;
                    }
                }

                &[data-position=right] {
                    .${classes.tab} {
                        border-left: ${indicatorWidth}px solid transparent;
                    }
                }

                .${classes.indicator} {
                    position: absolute;
                    z-index: 1;
                    transition-property: width, height, left, top;
                    transition-duration: .3s;
                    transition-timing-function: ${easing.bounce};
                }

                &:not([data-animating=true]) {
                    .${classes.indicator} {
                        display: none;
                    }
                }
            `
            // variant === 'card'
            : css`
                ${commonStyle}

                .${classes.scrollWrap} {
                    gap: ${spacing[1]}px;
                }

                .${classes.tab} {
                    border: 1px solid ${gray(.1)};
                    background-color: ${background.body};
                    transition: color .25s ${easing.easeOut}, background-color .25s ${easing.easeOut};

                    &[data-active=true] {
                        background-color: ${background.content};
                    }
                }

                &[data-position=top],
                &[data-position=bottom] {
                    .${classes.tab} {
                        padding: 10px 15px;
                    }

                    &[data-size=small] {
                        .${classes.tab} {
                            padding: 6px 15px;
                        }
                    }
            
                    &[data-size=large] {
                        .${classes.tab} {
                            padding: 14px 15px;
                        }
                    }
                }

                &[data-position=top] {
                    .${classes.tab} {
                        border-radius: ${borderRadius}px ${borderRadius}px 0 0;

                        &[data-active=true] {
                            border-bottom-color: ${background.content};
                        }
                    }
                }

                &[data-position=bottom] {
                    .${classes.tab} {
                        border-radius: 0 0 ${borderRadius}px ${borderRadius}px;

                        &[data-active=true] {
                            border-top-color: ${background.content};
                        }
                    }
                }

                &[data-position=left],
                &[data-position=right] {
                    .${classes.tab} {
                        padding: 9px 18px;
                    }

                    &[data-size=small] {
                        .${classes.tab} {
                            padding: 5px 18px;
                        }
                    }
            
                    &[data-size=large] {
                        .${classes.tab} {
                            padding: 13px 18px;
                        }
                    }
                }

                &[data-position=left] {
                    .${classes.tab} {
                        border-radius: ${borderRadius}px 0 0 ${borderRadius}px;

                        &[data-active=true] {
                            border-right-color: ${background.content};
                        }
                    }
                }

                &[data-position=right] {
                    .${classes.tab} {
                        border-radius: 0 ${borderRadius}px ${borderRadius}px 0;

                        &[data-active=true] {
                            border-left-color: ${background.content};
                        }
                    }
                }
            `
    }, [colorValue, variant])
}