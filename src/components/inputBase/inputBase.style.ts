import {css, keyframes} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {InputBaseProps} from './inputBase'

export const classes = defineInnerClasses('input-base', [
    'prefix',
    'content',
    'suffix',
    'clear'
])

export function useStyle({color}: Required<Pick<InputBaseProps<any>, 'color'>>) {
    const colorValue = useColor(color)

    return useCss(({spacing, background, divider, borderRadius, text, easing, gray}) => css`
        @layer reset {
            display: flex;
            gap: ${spacing[2]}px;
            align-items: center;
            cursor: text;
            transition: border-color .25s ${easing.easeOut};
            position: relative;

            &[data-variant=outlined] {
                background-color: ${background.content};
            }

            &[data-size=medium] {
                min-height: 32px;
                padding: 0 ${spacing[4]}px;
            }

            &[data-size=small] {
                min-height: 24px;
                padding: 0 ${spacing[3]}px;
            }

            &[data-size=large] {
                min-height: 40px;
                padding: 3px ${spacing[5]}px;
            }

            &[data-variant=outlined] {
                border: 1px solid ${color === 'primary' ? divider : colorValue};
                border-radius: ${borderRadius}px;

                &::before,
                &::after {
                    content: '';
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-color: transparent;
                    border-width: 2px;
                    border-radius: inherit;
                    position: absolute;
                    display: none;
                    pointer-events: none;
                    z-index: 3;
                }

                &::before {
                    top: -1px;
                    right: -1px;
                    border-top-color: ${colorValue};
                    border-left-color: ${colorValue};
                }

                &::after {
                    bottom: -1px;
                    left: -1px;
                    border-bottom-color: ${colorValue};
                    border-right-color: ${colorValue};
                }

                &:not(:has([data-disabled=true])):hover {
                    ${color === 'primary' ? `border-color: ${gray(.5)};` : ''}
                }

                &:not(:has([data-read-only=true]))[data-focused=true],
                &:not(:has([data-read-only=true])):has(:focus) {
                    &::before, &::after {
                        display: block;
                        animation: ${borderAnim} .4s ${easing.easeOut} forwards;
                    }
                }

                &[data-shape=rounded] {
                    border-radius: 1000em;
                }
            }

            &[data-variant=underlined] {
                border-bottom: 1px solid ${divider};

                &:not([data-disabled=true]):hover {
                    border-color: ${gray(.5)};
                }

                &::after {
                    content: '';
                    width: 0;
                    height: 2px;
                    background-color: ${colorValue};
                    position: absolute;
                    bottom: -1px;
                    left: 0;
                    transition: width .25s ${easing.easeOut};
                    z-index: 3;
                }

                &:not(:has([data-read-only=true]))[data-focused=true],
                &:not(:has([data-read-only=true])):has(:focus) {
                    &::after {
                        width: 100%;
                    }
                }
            }

            &:has([data-disabled=true]) {
                cursor: not-allowed;
                background-color: ${gray(.1)};

                [data-disabled=true] {
                    cursor: not-allowed;
                }
            }

            &:has([data-read-only=true]) {
                cursor: default;

                [data-read-only=true] {
                    cursor: default;
                }
            }

            .${classes.content} {
                flex: 1;
                min-width: 0;

                input, textarea {
                    color: ${text.primary};

                    &::placeholder {
                        color: ${text.placeholder};
                    }

                    &[data-hidden=true] {
                        position: absolute;
                        opacity: 0;
                        inset: 0;
                        pointer-events: none;
                    }
                }
            }

            &[data-compact=row] {
                &:hover {
                    z-index: 1;
                }

                &:not(:has([data-read-only=true]))[data-focused=true],
                &:not(:has([data-read-only=true])):has(:focus) {
                    z-index: 2;
                }

                &:not([data-last=true]) {
                    &, &::before, &::after {
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                    }
                }

                &:not([data-first=true]) {
                    margin-left: -1px;

                    &, &::before, &::after {
                        border-top-left-radius: 0;
                        border-bottom-left-radius: 0;
                    }
                }
            }

            &[data-compact=column] {
                &:hover {
                    z-index: 1;
                }

                &:not(:has([data-read-only=true]))[data-focused=true],
                &:not(:has([data-read-only=true])):has(:focus) {
                    z-index: 2;
                }

                &:not([data-last=true]) {
                    &, &::before, &::after {
                        border-bottom-left-radius: 0;
                        border-bottom-right-radius: 0;
                    }
                }

                &:not([data-first=true]) {
                    margin-top: -1px;

                    &, &::before, &::after {
                        border-top-left-radius: 0;
                        border-top-right-radius: 0;
                    }
                }
            }

            .${classes.prefix},
            .${classes.suffix} {
                color: ${text.secondary};
            }
        }
    `, [colorValue])
}

const borderAnim = keyframes`
    0% {
        width: 0;
        height: 0;
    }

    50% {
        width: calc(100% + 2px);
        height: 0;
    }

    100% {
        width: calc(100% + 2px);
        height: calc(100% + 2px);
    }
`