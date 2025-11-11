import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {appStyleCallback} from '../app/app.style'
import {zIndex} from '../theme'

export const classes = defineInnerClasses('snackbar-base', [
    'itemWrap',
    'item',
    'icon',
    'text',
    'titleRow',
    'title',
    'close',
    'content'
])

export const style = defineCss(theme => {
    const {spacing, background, borderRadius} = theme
    return [
        appStyleCallback(theme),
        css`
            @layer reset {
                width: 100%;
                height: auto;
                display: flex;
                flex-direction: column;
                padding: ${spacing[5]}px;
                position: fixed;
                z-index: ${zIndex.snackbar};
                pointer-events: none;

                &[data-use-to=notification] {
                    flex-direction: column-reverse;
                }

                .${classes.itemWrap} {
                    display: flex;
                    align-items: flex-start;
                    overflow: visible;
                }

                &[data-place="0"], &[data-place="1"], &[data-place="2"] {
                    top: 0;
                }

                &[data-place="3"], &[data-place="4"], &[data-place="5"] {
                    bottom: 0;
                }

                &[data-place="0"],
                &[data-place="3"] {
                    left: 0;

                    .${classes.itemWrap} {
                        justify-content: flex-start;
                    }
                }

                &[data-place="1"],
                &[data-place="4"] {
                    left: 50%;
                    transform: translateX(-50%);

                    .${classes.itemWrap} {
                        justify-content: center;
                    }
                }

                &[data-place="2"],
                &[data-place="5"] {
                    right: 0;

                    .${classes.itemWrap} {
                        justify-content: flex-end;
                    }
                }

                &[data-place="1"] .${classes.item} {
                    transform-origin: left top;
                }

                &[data-place="2"] .${classes.item} {
                    transform-origin: top;
                }

                &[data-place="3"] .${classes.item} {
                    transform-origin: right top;
                }

                &[data-place="4"] .${classes.item} {
                    transform-origin: left bottom;
                }

                &[data-place="5"] .${classes.item} {
                    transform-origin: bottom;
                }

                &[data-place="6"] .${classes.item} {
                    transform-origin: right bottom;
                }

                .${classes.item} {
                    pointer-events: all !important;
                    max-width: 60%;
                    display: flex;
                    gap: ${spacing[4]}px;
                    box-shadow: 2px 4px 18px rgba(0, 0, 0, .16);
                    padding: ${spacing[3]}px ${spacing[4]}px;
                    margin-bottom: ${spacing[4]}px;
                    border-radius: ${borderRadius}px;
                    background-color: ${background.content};

                    &[data-variant=filled] {
                        color: #ffffff;
                    }

                    .${classes.icon} {
                        font-size: ${17 / 14}em;
                    }

                    .${classes.text} {
                        flex: 1;

                        .${classes.title} {
                            flex: 1;
                            font-weight: bold;
                            font-size: ${15 / 14}em;
                            margin-top: 2px;

                            & + .${classes.content} {
                                margin-top: 4px;
                            }
                        }

                        .${classes.content} {
                            margin-top: 2px;
                        }
                    }

                    .${classes.close} {
                        margin: -4px -4px 0 0;
                    }
                }

                &[data-use-to=notification] {
                    .${classes.item} {
                        width: 360px;
                    }
                }
            }
        `
    ]
})