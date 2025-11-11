import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as loadingClasses} from '../loading/loading.style'

export const classes = defineInnerClasses('data-grid', [
    'filterForm',
    'container',
    'title',
    'functionalCell',
    'sortIcon',
    'filterButton',
    'expandable',
    'expandableWrap',
    'selectable',
    'sub',
    'subTd',
    'children',
    'empty',
    'resizeHandle'
])

export const style = defineCss(({spacing, mode, gray, text, colors, easing}) => css`
    @layer reset {
        .${loadingClasses.container} {
            display: flex;
            flex-direction: column;
            gap: ${spacing[5]}px;
        }

        .${classes.filterForm} {
            min-height: 0;
        }

        .${classes.container} {
            height: 100%;
        }

        .${classes.functionalCell} {
            display: flex;
            align-items: center;

            .${classes.title} {
                flex: 1;
            }

            .${classes.sortIcon} {
                color: ${text.placeholder};
                transition: translate .25s ${easing.swing};
            }

            .${classes.filterButton} {
                width: ${20 / 14}em;
                height: ${20 / 14}em;
                margin-left: ${spacing[2]}px;
            }
        }

        th[data-sortable=true] {
            cursor: pointer;
            transition: background-color .25s ${easing.easeOut};
            -webkit-tap-highlight-color: transparent;

            &:hover {
                background-color: ${gray(mode === 'light' ? .05 : .26)};
            }

            &:active {
                transition: background-color 0s;
                background-color: ${gray(mode === 'light' ? .01 : .22)};
            }

            &[data-ordering=true] {
                .${classes.sortIcon} {
                    color: ${colors.primary.main};
                }
            }

            &[data-order-type=ascend] {
                .${classes.sortIcon} {
                    translate: 0 -3px;
                    rotate: 180deg;
                }
            }

            &[data-order-type=descend] {
                .${classes.sortIcon} {
                    translate: 0 3px;
                    rotate: 0deg;
                }
            }
        }

        tr {
            &.${classes.sub} {
                background-color: ${gray(mode === 'light' ? .02 : .22)};
            }

            .${classes.subTd} {
                padding: 0;
                border: none;

                .${classes.children} {
                    padding: ${spacing[4]}px ${spacing[5]}px;
                    border-bottom: 1px solid ${gray(mode === 'light' ? .12 : .32)};
                }
            }
        }

        th, td {
            &.${classes.selectable} {
                width: 0;
                padding-top: 0;
                padding-bottom: 0;

                + *::before {
                    display: none;
                }

                .${classes.resizeHandle} {
                    display: none;
                }
            }

            &[data-grouped=true] {
                text-align: center;
            }
        }

        .${classes.expandable} {
            padding-top: 0;
            padding-bottom: 0;
            padding-left: 0;

            .${classes.expandableWrap} {
                display: flex;
                align-items: center;
                gap: ${spacing[1]}px;
            }
        }

        .${classes.empty} {
            height: auto;
            position: sticky;
            left: 0;
        }

        .${classes.resizeHandle} {
            width: 8px;
            height: 100%;
            cursor: col-resize;
            touch-action: none;
            position: absolute;
            top: 0;
            right: -4px;
            z-index: 1;
        }

        &[data-column-resizable=true] table {
            width: max-content;
            table-layout: fixed;
        }

        th:last-of-type {
            .${classes.resizeHandle} {
                width: 4px;
                right: 0;
            }
        }

        th:has(.${classes.resizeHandle}) {
            overflow: visible;
        }
    }
`)