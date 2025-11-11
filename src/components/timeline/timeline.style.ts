import {css} from '@emotion/react'
import {defineInnerClasses, defineCss, useColor, useCss} from '../../utils'
import {ColorPropsValue} from '../../types'

export const classes = defineInnerClasses('timeline', ['item', 'opposite', 'dotArea', 'dot', 'content'])

export const style = defineCss(() => css`
    @layer reset {
        display: flex;
        flex-direction: column;

        &[data-orientation=vertical] {
            &[data-label-position='alternate'],
            &[data-label-position='alternate-reverse'],
            &:has(.${classes.opposite}[data-show=true]) {
                .${classes.opposite} {
                    display: flex;
                }
            }

            &[data-label-position='start'] .${classes.item}, &[data-label-position='alternate'] .${classes.item}:nth-of-type(even),
            &[data-label-position='alternate-reverse'] .${classes.item}:nth-of-type(odd) {
                flex-direction: row-reverse;

                .${classes.content} {
                    align-items: flex-end;
                }

                .${classes.opposite} {
                    align-items: stretch;
                }
            }
        }

        &[data-orientation=horizontal] {
            flex-direction: row;

            &[data-label-position='alternate'],
            &[data-label-position='alternate-reverse'],
            &:has(.${classes.opposite}[data-show=true]) {
                .${classes.opposite} {
                    display: flex;

                    &::before {
                        content: '1';
                        width: 0;
                        overflow: hidden;
                    }
                }
            }

            &[data-label-position='start'] .${classes.item}, &[data-label-position='alternate'] .${classes.item}:nth-of-type(even),
            &[data-label-position='alternate-reverse'] .${classes.item}:nth-of-type(odd) {
                flex-direction: column-reverse;

                .${classes.content} {
                    align-items: flex-end;
                }

                .${classes.opposite} {
                    align-items: stretch;
                }
            }
        }
    }
`)

export function useTimelineItemStyle({color}: {color: ColorPropsValue}) {
    const colorValue = useColor(color)

    return useCss(({spacing, divider}) => css`
        @layer reset {
            display: flex;
            gap: ${spacing[3]}px ${spacing[5]}px;

            .${classes.dotArea} {
                display: flex;
                align-items: baseline;
                position: relative;

                &::before {
                    content: '1';
                    width: 0;
                    overflow: hidden;
                }

                &::after {
                    content: '';
                    background-color: ${divider};
                    position: absolute;
                }
            }

            .${classes.dot} {
                width: 9px;
                height: 9px;
                border: 2px solid ${colorValue};
                border-radius: 50%;
            }

            &[data-variant='filled'] {
                .${classes.dot} {
                    background-color: ${colorValue};
                }
            }

            .${classes.content}, .${classes.opposite} {
                flex-direction: column;
                flex: 1;
            }

            .${classes.content} {
                display: flex;
            }

            .${classes.opposite} {
                align-items: flex-end;
                display: none;
            }

            &:not(:last-of-type) {
                .${classes.dotArea}::after {
                    width: 1px;
                    height: calc(100% - 1.5em);
                    bottom: 0;
                    left: 4px;
                }

                .${classes.content}, .${classes.opposite} {
                    padding-bottom: ${spacing[6]}px;
                }
            }

            &[data-orientation=horizontal] {
                flex-direction: column;

                .${classes.dotArea} {
                    &::before {
                        display: none;
                    }
                }

                &:not(:last-of-type) {
                    .${classes.dotArea}::after {
                        width: calc(100% - 9px - 8px);
                        height: 1px;
                        bottom: 4px;
                        left: auto;
                        right: 4px;
                    }
                }

                .${classes.content}, .${classes.opposite} {
                    padding-bottom: 0;
                    padding-right: ${spacing[6]}px;
                }
            }
        }
    `, [colorValue])
}