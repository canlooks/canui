import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('accordion', [
    'titleRow',
    'expandIcon',
    'title',
    'prefix',
    'suffix',
    'content'
])

export const style = defineCss(({divider, borderRadius, background, spacing, text, gray, easing}) => css`
    @layer reset {
        border: 1px solid ${divider};
        border-radius: ${borderRadius}px;
        background-color: ${background.content};
        transition: margin .25s ${easing.easeOut};

        .${classes.titleRow} {
            display: flex;
            align-items: center;
            gap: ${spacing[2]}px;
            padding: 9px ${spacing[5]}px;
            transition: padding .25s ${easing.easeOut};

            .${classes.expandIcon} {
                color: ${text.disabled};
                transition: transform .25s ${easing.easeOut};
            }

            .${classes.title} {
                flex: 1;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .${classes.prefix},
            .${classes.suffix} {
                color: ${text.secondary};
            }
        }

        &:not([data-read-only=true]):not([data-disabled=true]) {
            .${classes.titleRow} {
                cursor: pointer;
            }
        }

        &[data-disabled=true] {
            background-color: ${gray(.1)};

            .${classes.titleRow} {
                cursor: not-allowed;
            }
        }

        &[data-expanded=true] {
            .${classes.titleRow} {
                padding: 15px ${spacing[5]}px;
            }

            .${classes.expandIcon} {
                transform: rotate(90deg);
            }
        }

        .${classes.content} {
            padding: 0 ${spacing[5]}px ${spacing[5]}px;
        }

        &[data-size=small] {
            .${classes.titleRow} {
                padding: 6px ${spacing[5]}px;
            }

            &[data-expanded=true] {
                .${classes.titleRow} {
                    padding: 11px ${spacing[5]}px;
                }
            }
        }

        &[data-size=large] {
            .${classes.titleRow} {
                padding: 12px ${spacing[5]}px;
            }

            &[data-expanded=true] {
                .${classes.titleRow} {
                    padding: 17px ${spacing[5]}px;
                }
            }
        }

        &[data-compact=column] {
            &:not([data-first=true]) {
                border-top-left-radius: 0;
                border-top-right-radius: 0;
                margin-top: -1px;
            }

            &:not([data-last=true]) {
                border-bottom-left-radius: 0;
                border-bottom-right-radius: 0;
            }

            &[data-expanded=true] {
                &:not([data-first=true]) {
                    margin-top: ${spacing[3]}px;
                }

                &:not([data-last=true]):not(:has(+ [data-expanded=true])) {
                    margin-bottom: ${spacing[3]}px
                }
            }
        }

        &[data-compact=row] {
            &:not([data-first=true]) {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                margin-left: -1px;
            }

            &:not([data-last=true]) {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
        }
    }
`)