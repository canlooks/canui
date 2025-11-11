import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as tagClasses} from '../tag/tag.style'
import {menuListPadding} from '../menuItem/menuItem.style'
import {popperStyleCallback} from '../popper/popper.style'

export const classes = defineInnerClasses('cascade', [
    'contentWrap',
    'placeholder',
    'backfill',
    'backfillWrap',
    'arrow',
    'searchInput',
    'panelContainer',
    'panel',
    'searchResult'
])

export const style = defineCss(({spacing, text, easing}) => css`
    @layer reset {
        cursor: pointer;
        position: relative;

        .${classes.contentWrap} {
            display: flex;
            align-items: center;
            gap: ${spacing[1]}px;
        }

        .${classes.placeholder} {
            flex: 1;
            color: ${text.placeholder};
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }

        .${classes.arrow} {
            color: ${text.placeholder};
            transition: transform .25s ${easing.easeOut};

            &[data-open=true] {
                transform: rotate(180deg);
            }
        }

        .${classes.backfill} {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-wrap: wrap;
            gap: ${spacing[1]}px;

            .${tagClasses.root} {
                min-width: 0;
            }

            .${tagClasses.content},
            .${classes.backfillWrap} {
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                direction: rtl;
            }
        }
    }
`)

export const cascadePopperStyle = defineCss(theme => [
    popperStyleCallback(theme),
    css`
        @layer reset {
            .${classes.searchInput} {
                margin-bottom: ${menuListPadding}px;
            }

            .${classes.panelContainer} {
                display: flex;
                gap: ${menuListPadding}px;
            }

            .${classes.panel} {
                min-width: 120px;
                overflow: hidden;
                max-height: ${32 * 8 + 8}px;
                position: relative;

                &:hover {
                    overflow: hidden auto;
                }

            }

            .${classes.searchResult} {
                min-width: 360px;
            }
        }
    `
])