import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import Color from 'color'

export const classes = defineInnerClasses('upload', [
    'input',
    'files',
    'file',
    'icon',
    'info',
    'name',
    'progress',
    'control',
    'images',
    'imageWrap',
    'image',
    'sortable'
])

export const style = defineCss(({spacing, mode, text, gray, borderRadius, colors, divider, easing, background}) => {
    const maskBg = Color(background.content).alpha(.9).string()

    return css`
        @layer reset {
            position: relative;

            .${classes.input} {
                position: absolute;
                opacity: 0;
                pointer-events: none;
            }

            &[data-file-type=file] {
                .${classes.files} {
                    display: flex;
                    flex-direction: column;
                    margin-top: ${spacing[2]}px;

                    .${classes.file} {
                        display: flex;
                        align-items: center;
                        gap: ${spacing[3]}px;
                        padding-right: ${spacing[2]}px;
                        border-radius: ${borderRadius}px;

                        .${classes.icon} {
                            color: ${text.secondary};
                        }

                        .${classes.info} {
                            min-width: 0;
                            flex: 1;
                            position: relative;
                            padding: ${spacing[2]}px 0;

                            .${classes.name} {
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                overflow: hidden;
                            }

                            .${classes.progress} {
                                position: absolute;
                                inset: auto 0 0;
                            }
                        }

                        .${classes.control} {
                            display: none;
                            gap: ${spacing[4]}px;
                        }

                        &:hover {
                            background-color: ${gray(mode === 'light' ? .03 : .18)};

                            &:not([data-status=uploading]) {
                                .${classes.control} {
                                    display: flex;
                                }
                            }
                        }

                        &[data-status=error] {
                            .${classes.name} {
                                color: ${colors.error.main};
                            }

                            .${classes.control} {
                                display: flex;
                            }
                        }
                    }
                }
            }

            &[data-file-type=image] {
                .${classes.images} {
                    display: flex;
                    gap: ${spacing[3]}px;
                    flex-wrap: wrap;
                }

                .${classes.imageWrap} {
                    width: 96px;
                    height: 96px;
                    border: 1px dashed ${divider};
                    padding: 4px;

                    &[data-clickable=true] {
                        cursor: pointer;
                        transition: border-color .25s ${easing.easeOut}, color .25s ${easing.easeOut};

                        &:hover {
                            border-color: ${colors.primary.main};
                            color: ${colors.primary.main};
                        }
                    }

                    .${classes.image} {
                        width: 100%;
                        height: 100%;
                        background-color: ${gray(.05)};
                        border-radius: inherit;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        .${classes.progress} {
                            background-color: ${maskBg};
                            position: absolute;
                            inset: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }
                }

                &[data-variant=circular] {
                    .${classes.imageWrap} {
                        border-radius: 50%;
                    }
                }

                &[data-variant=square] {
                    .${classes.imageWrap} {
                        border-radius: ${borderRadius}px;
                    }
                }
            }

            .${classes.sortable}[data-dragging=true] {
                position: relative;
                z-index: 1;
            }

            &[data-sortable=true] {
                .${classes.file}, .${classes.imageWrap} {
                    cursor: grab;
                }
            }

            &:not([data-sortable=true]) {
                .${classes.file}, .${classes.imageWrap} {
                    cursor: default;
                }
            }
        }
    `
})