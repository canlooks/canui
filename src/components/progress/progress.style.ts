import {css, keyframes} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {ProgressProps} from './progress'
import Color from 'color'

export const classes = defineInnerClasses('progress', [
    'info',
    'icon',
    'bar',
    'svg',
    'track'
])

export function useStyle({color, variant}: Required<Pick<ProgressProps, 'color' | 'variant'>>) {
    const colorValue = useColor(color)

    return useCss(({spacing, gray, easing, colors}) => {
        const indeterminateBg = Color(colorValue).alpha(.3).string()

        return variant === 'linear'
            ? css`
                    @layer reset {
                        display: flex;
                        gap: ${spacing[3]}px;
                        align-items: center;

                        .${classes.track} {
                            flex: 1;
                            background-color: ${gray(.1)};
                            border-radius: 1000em;
                            overflow: hidden;
                            position: relative;

                            &::before, .${classes.bar} {
                                background-color: ${colorValue};
                                border-radius: inherit;
                                transition: width .25s ${easing.easeOut};
                                position: absolute;
                                inset: 0 auto 0 0;
                            }

                            &::before {
                                content: '';
                            }
                        }

                        &[data-indeterminate=true] {
                            .${classes.track} {
                                background-color: ${indeterminateBg};

                                &::before {
                                    animation: ${indeterminateAnim2} 2.25s ${easing.linear} infinite 1.1s;
                                }

                                .${classes.bar} {
                                    animation: ${indeterminateAnim1} 2.25s ${easing.linear} infinite;
                                }
                            }
                        }

                        .${classes.info} {
                            line-height: 1;

                            .${classes.icon} {
                                animation: ${iconAnim} .25s ${easing.swing}
                            }
                        }

                        &[data-success=true] {
                            .${classes.bar} {
                                background-color: ${colors.success.main};
                            }
                        }

                        &[data-error=true] {
                            .${classes.bar} {
                                background-color: ${colors.error.main};
                            }
                        }

                        &[data-processing=true] {
                            .${classes.bar} {
                                &::after {
                                    content: '';
                                    background-image: linear-gradient(90deg, transparent, rgba(255, 255, 255, .5));
                                    border-radius: inherit;
                                    position: absolute;
                                    inset: 0;
                                    animation: ${processingAnim} 2s infinite ${easing.easeOut};
                                }
                            }
                        }
                    }
            `
            // variant === 'circular' || variant === 'gauge'
            : css`
                    @layer reset {
                        display: inline-flex;
                        position: relative;

                        .${classes.svg} {
                            transform: rotate(-90deg);
                        }

                        .${classes.track} {
                            stroke: ${gray(.1)};
                            fill: transparent;
                        }

                        .${classes.bar} {
                            stroke: ${colorValue};
                            fill: transparent;
                            transition: stroke-dashoffset .25s ${easing.easeOut};
                        }

                        &[data-success=true] {
                            .${classes.bar} {
                                stroke: ${colors.success.main};
                            }
                        }

                        &[data-error=true] {
                            .${classes.bar} {
                                stroke: ${colors.error.main};
                            }
                        }

                        .${classes.info} {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: absolute;
                            inset: 0;

                            .${classes.icon} {
                                animation: ${iconAnim} .25s ${easing.swing}
                            }
                        }

                        &[data-indeterminate=true] {
                            .${classes.svg} {
                                animation: ${indeterminateAnim3} 1.6s ${easing.linear} infinite;
                            }

                            .${classes.track} {
                                stroke: none;
                            }
                        }
                    }
            `
    }, [colorValue, variant])
}

const processingAnim = keyframes`
    0% {
        left: 0;
        right: 100%;
        opacity: 1;
    }

    50% {
        left: 0;
        right: 0;
        opacity: 1;
    }

    100% {
        left: 100%;
        right: 0;
        opacity: 0;
    }
`

const iconAnim = keyframes`
    0% {
        transform: scale(0);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
`

const indeterminateAnim1 = keyframes`
    0% {
        left: 0;
        right: 100%;
    }

    10% {
        left: 0;
        right: 60%;
    }

    30% {
        left: 40%;
        right: 0;
    }

    50%,
    100% {
        left: 100%;
        right: 0;
    }
`

const indeterminateAnim2 = keyframes`
    0% {
        left: 0;
        right: 100%;
    }

    15% {
        left: 0;
        right: 10%;
    }

    30% {
        left: 70%;
        right: 0;
    }

    50%,
    100% {
        left: 100%;
        right: 0;
    }
`

const indeterminateAnim3 = keyframes`
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
`