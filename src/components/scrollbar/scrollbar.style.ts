import {defineInnerClasses, useCss} from '../../utils'
import {css} from '@emotion/react'
import Color from 'color'

export const classes = defineInnerClasses('scrollbar', [
    'scroller',
    'scrollerWrapper',
    'track',
    'trackX',
    'trackY',
    'thumb',
    'block',
    'corner'
])

export function useStyle({size}: { size: string }) {
    return useCss(({text, easing}) => {
        const blockColor = Color(text.primary)

        return css`
            @layer reset {
                position: relative;

                .${classes.scroller} {
                    height: 100%;
                    flex: 1;
                    position: relative;
                    z-index: 0;
                    overflow: auto;
                    scrollbar-width: none;

                    &::-webkit-scrollbar {
                        display: none;
                    }
                }

                &[data-variant=contain] {
                    &[data-vertical-scrollable=true] {
                        padding-right: ${size};
                    }

                    &[data-horizontal-scrollable=true] {
                        padding-bottom: ${size};
                    }
                }

                .${classes.trackX},
                .${classes.trackY},
                .${classes.thumb},
                .${classes.corner} {
                    position: absolute;
                    touch-action: none;
                }

                .${classes.thumb} {
                    min-width: ${size};
                    min-height: ${size};

                    .${classes.block} {
                        border-radius: calc(${size} * .5);
                        position: absolute;
                        inset: 2px;
                        background: ${blockColor.alpha(.3).string()};

                        &:hover {
                            background: ${blockColor.alpha(.4).string()};
                        }
                    }

                    &[data-dragging=true] .${classes.block} {
                        background: ${blockColor.alpha(.6).string()};
                    }
                }

                .${classes.trackX} {
                    height: ${size};
                    left: 0;
                    bottom: 0;
                    right: ${size};
                    display: none;
                }

                .${classes.trackY} {
                    width: ${size};
                    right: 0;
                    top: 0;
                    bottom: ${size};
                    display: none;
                }

                &[data-vertical-scrollable=true] {
                    .${classes.trackY} {
                        display: block;
                    }
                }

                &[data-horizontal-scrollable=true] {
                    .${classes.trackX} {
                        display: block;
                    }
                }

                &[data-autohide=true][data-variant=cover] {
                    .${classes.trackX},
                    .${classes.trackY},
                    .${classes.corner} {
                        opacity: 0;
                        transition: opacity .5s ${easing.easeIn};
                    }

                    &[data-hover=true], &[data-dragging=true] {
                        .${classes.trackX},
                        .${classes.trackY},
                        .${classes.corner} {
                            opacity: 1;
                            transition: opacity 0s;
                        }
                    }
                }
            }
        `
    }, [size])
}