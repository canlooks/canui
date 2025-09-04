import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {StepProps} from './step'
import Color from 'color'

export const classes = defineInnerClasses('step', [
    'indicatorWrap',
    'indicator',
    'label',
    'title',
    'titleText',
    'description'
])

export function useStyle({color, gap}: Required<Pick<StepProps, 'color' | 'gap'>>) {
    const colorValue = useColor(color)

    return useCss(({mode, spacing, gray, divider, text, colors, borderRadius, easing}) => {
        const finishedBg = Color(colorValue).alpha(mode === 'light' ? .1 : .2).string()

        return css`
            flex: 1;
            display: flex;
            align-items: flex-start;
            gap: ${spacing[4]}px;
            -webkit-tap-highlight-color: transparent;

            .${classes.indicator} {
                min-width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color .25s ${easing.easeOut}, color .25s ${easing.easeOut};
            }

            &[data-variant=dot] {
                .${classes.indicator} {
                    min-width: ${spacing[3]}px;
                    height: ${spacing[3]}px;
                    margin-top: ${(32 - spacing[3]) / 2}px;
                }
            }

            .${classes.label} {
                flex: 1;
            }

            .${classes.title} {
                display: flex;
                align-items: center;
                gap: ${gap}px;

                .${classes.titleText} {
                    max-width: calc(100% - 39px);
                    font-weight: bold;
                    font-size: ${17 / 14}em;
                    padding: calc((32px - 1.5em) / 2) 0;
                }

                &:after {
                    content: '';
                    flex: 1;
                    align-self: flex-start;
                    margin-top: ${32 / 2}px;
                    height: 1px;
                    background-color: ${divider};
                }
            }

            &:last-of-type .${classes.title}:after {
                display: none;
            }

            &[data-size=small] {
                .${classes.indicator} {
                    min-width: 24px;
                    height: 24px;
                }

                &[data-variant=dot] {
                    .${classes.indicator} {
                        min-width: ${spacing[2]}px;
                        height: ${spacing[2]}px;
                        margin-top: ${(24 - spacing[2]) / 2}px;
                    }
                }

                .${classes.title} {
                    .${classes.titleText} {
                        padding: calc((24px - 1.5em) / 2) 0;
                        font-size: ${15 / 14}em;
                    }

                    &:after {
                        margin-top: ${24 / 2}px;
                    }
                }
            }

            &[data-size=large] {
                .${classes.indicator} {
                    min-width: 40px;
                    height: 40px;
                }

                &[data-variant=dot] {
                    .${classes.indicator} {
                        min-width: ${spacing[4]}px;
                        height: ${spacing[4]}px;
                        margin-top: ${(40 - spacing[4]) / 2}px;
                    }
                }

                .${classes.title} {
                    .${classes.titleText} {
                        padding: calc((40px - 1.5em) / 2) 0;
                    }

                    &:after {
                        margin-top: ${40 / 2}px;
                    }
                }
            }

            .${classes.description} {
                color: ${text.secondary};
            }
    
            &[data-status=waiting],
            &[data-status=skipped] {
                .${classes.indicator} {
                    background-color: ${gray(.1)};
                }

                .${classes.titleText} {
                    color: ${text.secondary};
                }
            }
    
            &[data-status=processing] {
                .${classes.indicator} {
                    background-color: ${colorValue};
                    color: #ffffff;
                }

                &[data-variant=dot] {
                    .${classes.indicator} {
                        outline: 1px solid ${colorValue};
                        outline-offset: 2px;
                    }
                }
            }

            &[data-status=finished] {
                .${classes.indicator} {
                    background-color: ${finishedBg};
                    color: ${colorValue};
                }

                &[data-variant=dot] {
                    .${classes.indicator} {
                        background-color: ${colorValue};
                    }
                }

                .${classes.title}:after {
                    background-color: ${colorValue};
                }
            }

            &[data-status=error] {
                .${classes.indicator} {
                    background-color: ${colors.error.main};
                    color: #ffffff;
                }
                
                &[data-variant=dot] {
                    .${classes.indicator} {
                        outline: 1px solid ${colors.error.main};
                        outline-offset: 2px;
                    }
                }
            }

            &[data-status=warning] {
                .${classes.indicator} {
                    background-color: ${colors.warning.main};
                    color: #ffffff;
                }
                
                &[data-variant=dot] {
                    .${classes.indicator} {
                        outline: 1px solid ${colors.warning.main};
                        outline-offset: 2px;
                    }
                }
            }

            &[data-clickable=true] {
                cursor: pointer;
                border-radius: ${borderRadius}px;
                transition: background-color .25s ${easing.easeOut};
                
                &:hover {
                    background-color: ${gray(mode === 'light' ? .03 : .18)};
                }

                &:active {
                    transition: background-color 0s;
                    background-color: ${gray(mode === 'light' ? .06 : .15)};
                }
            }

            &[data-orientation=vertical] {
                .${classes.indicatorWrap} {
                    align-self: stretch;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: ${gap}px;

                    &:after {
                        content: '';
                        flex: 1;
                        width: 1px;
                        background-color: ${divider};
                    }
                }

                &:not(:last-of-type) {
                    .${classes.label} {
                        padding-bottom: ${gap}px;
                    }
                }

                &:last-of-type {
                    .${classes.indicatorWrap}:after {
                        display: none;
                    }
                }

                .${classes.title}:after {
                    display: none;
                }

                &[data-status=finished] {
                    .${classes.indicatorWrap}:after {
                        background-color: ${colorValue};
                    }
                }
            }

            &[data-label-placement=bottom]:not([data-orientation=vertical]) {
                flex-direction: column;
                align-items: center;

                .${classes.indicatorWrap} {
                    align-self: stretch;
                    display: flex;
                    align-items: center;
                    gap: ${gap}px;
                    transform: translateX(calc(50% - 32px / 2));

                    &:after {
                        content: '';
                        flex: 1;
                        height: 1px;
                        background-color: ${divider};
                    }
                }

                &:last-of-type {
                    .${classes.indicatorWrap}:after {
                        display: none;
                    }
                }

                &[data-variant=dot] {
                    .${classes.indicatorWrap} {
                        transform: translateX(calc(50% - ${spacing[3]}px / 2));
                    }

                    .${classes.indicator} {
                        margin: 0;
                    }
                }

                &[data-size=small] {
                    .${classes.indicatorWrap} {
                        transform: translateX(calc(50% - 24px / 2));
                    }

                    &[data-variant=dot] {
                        .${classes.indicatorWrap} {
                            transform: translateX(calc(50% - ${spacing[2]}px / 2));
                        }
                    }
                }

                &[data-size=large] {
                    .${classes.indicatorWrap} {
                        transform: translateX(calc(50% - 40px / 2));
                    }

                    &[data-variant=dot] {
                        .${classes.indicatorWrap} {
                            transform: translateX(calc(50% - ${spacing[4]}px / 2));
                        }
                    }
                }

                &[data-status=finished] {
                    .${classes.indicatorWrap}:after {
                        background-color: ${colorValue};
                    }
                }

                

                .${classes.title} {
                    justify-content: center;

                    &:after {
                        display: none;
                    }
                }

                .${classes.description} {
                    text-align: center;
                }
            }
        `
    }, [colorValue, gap])
}