import {css, keyframes} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {TypographyProps} from './typography'
import Color from 'color'

export const classes = defineInnerClasses('typography', [
    'text',
    'ellipsis',
    'expand',
    'action',
    'copied',
    'editWrap',
    'editComponent'
])

export function useStyle({color}: Required<Pick<TypographyProps, 'color'>>) {
    const colorValue = useColor(color)

    return useCss(({mode, colors, gray, borderRadius, easing}) => {
        return css`
            color: ${colorValue};

            &[data-component=p] {
                margin: 1em 0;
            }

            &[data-component=h1],
            &[data-component=h2],
            &[data-component=h3],
            &[data-component=h4],
            &[data-component=h5],
            &[data-component=h6] {
                margin-top: 1em;
                margin-bottom: 0.5em;
            }

            &[data-component=h1] {
                font-size: ${38 / 14}em;
            }

            &[data-component=h2] {
                font-size: ${30 / 14}em;
            }

            &[data-component=h3] {
                font-size: ${24 / 14}em;
            }

            &[data-component=h4] {
                font-size: ${20 / 14}em;
            }

            &[data-component=h5] {
                font-size: ${17 / 14}em;
            }

            &[data-component=h6] {
                font-size: 1em;
            }

            &[data-component=mark] {
                background-color: ${Color(colors.warning.main).lighten(.5).hex()};
            }

            &[data-component=kbd] {
                background-color: ${gray(mode === 'light' ? .06 : .22)};
                font-size: ${13 / 14}em;
                padding: 4px 6px;
                border-radius: ${borderRadius / 2}px;
                box-shadow: ${mode === 'light'
                        ? '0 1px 2px rgba(0, 0, 0, .4), -1px 2px rgba(255, 255, 255, .4)'
                        : '-1px 2px rgba(255, 255, 255, .2), 0 1px 2px rgba(0, 0, 0, .6)'
                };
                margin: 0 3px;
            }

            &[data-component=code] {
                background-color: ${gray(.06)};
                font-size: ${13 / 14}em;
                font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
                padding: 3px 6px;
                border-radius: .15em;
                margin: 0 4px;
                outline: none;
            }

            &[data-component=a] {
                color: ${colors.primary.main};
                transition: color .25s ${easing.easeOut};
                -webkit-tap-highlight-color: transparent;

                &:hover {
                    color: ${colors.primary.light};
                }

                &:active {
                    transition: color 0s;
                    color: ${colors.primary.dark};
                }
            }

            &:not([data-ellipsis-rows="0"]) {
                display: flex;
                max-width: 100%;
                align-items: flex-end;

                &[data-component=mark],
                &[data-component=kbd],
                &[data-component=code],
                &[data-component=a] {
                    display: inline-flex;
                }

                .${classes.text} {
                    overflow: hidden;
                }

                &[data-ellipsis-rows="1"] {
                    .${classes.text} {
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }

                &:not([data-ellipsis-rows="1"]) {
                    .${classes.text} {
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                    }
                }
            }

            .${classes.action},
            .${classes.copied} {
                height: 1.5em;
                vertical-align: text-bottom;
                margin-left: .5em;
                white-space: nowrap;
            }

            .${classes.copied} {
                align-items: center;
                color: ${colors.success.main};
                animation: ${copyCheckAnim} .3s ${easing.swing};
            }
        `
    }, [colorValue])
}

const copyCheckAnim = keyframes`
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
`

export const editStyle = css`
    display: flex;
    align-items: center;

    .${classes.editComponent} {
        flex: 1;
    }
`