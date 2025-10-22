import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import Color from 'color'

export const classes = defineInnerClasses('table', [
    'container',
    'cell'
])

export const style = defineCss(({mode, spacing, gray, divider, background, easing, colors}) => {
    const headerBg = gray(mode === 'light' ? .03 : .22)
    const stripedBg = gray(mode === 'light' ? .02 : .21)
    const selectedBg = Color(colors.primary.main).alpha(mode === 'light' ? .05 : .1).string()

    return css`
        width: 100%;
        border-spacing: 0;

        thead, tfoot {
            position: sticky;
            z-index: 3;

            th, td {
                background-color: ${headerBg};
            }
        }

        thead {
            top: 0;
        }

        tfoot {
            bottom: 0;

            th, td {
                border-top: 1px solid ${divider};
            }
        }

        tbody tr {
            &:not(:hover):not([data-selected=true]) {
                th, td {
                    background-color: ${background.content};
                }
            }
        }

        th, td {
            position: relative;
            text-align: left;
            padding: 12px ${spacing[5]}px;
            border-bottom: 1px solid ${divider};
            transition: background-color .25s ${easing.easeOut};
        }

        &[data-size=small] {
            th, td {
                padding: 7px ${spacing[4]}px;
            }
        }

        &[data-size=large] {
            th, td {
                padding: 17px ${spacing[6]}px;
            }
        }

        &[data-bordered=all], &[data-bordered=true] {
            th, td {
                border-right: 1px solid ${divider};
                
                &:first-of-type {
                    border-left: 1px solid ${divider};
                }
            }
            
            thead tr:first-of-type {
                th, td {
                    border-top: 1px solid ${divider};
                }
            }
        }

        &:not([data-bordered=all], [data-bordered=true]) {
            thead {
                th, td {
                    &:not(:first-of-type) {
                        &:before {
                            content: '';
                            width: 2px;
                            height: 1em;
                            background-color: ${divider};
                            position: absolute;
                            top: calc(50% - .5em);
                            left: 0;
                        }
                    }
                }
            }
        }

        &[data-bordered=out] {
            border-top: 1px solid ${divider};

            th, td {
                &:first-of-type {
                    border-left: 1px solid ${divider};
                }

                &:last-of-type {
                    border-right: 1px solid ${divider};
                }
            }
        }

        tbody tr {
            &[data-selected=true] {
                th, td {
                    background-color: ${selectedBg};
                }
            }

            &:not([data-selected=true]):hover {
                th, td {
                    background-color: ${headerBg};
                }
            }
        }

        &[data-striped=true] {
            tbody tr:nth-of-type(even):not(:hover):not([data-selected=true]) {
                th, td {
                    background-color: ${stripedBg};
                }
            }
        }
    `
})