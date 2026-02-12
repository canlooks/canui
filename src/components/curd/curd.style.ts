import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {classes as buttonClasses} from '../button/button.style'
import {classes as loadingClasses} from '../loading/loading.style'

export const classes = defineInnerClasses('curd', [
    'filterForm',
    'filter',
    'filterGridContainer',
    'filterGrid',
    'filterItem',
    'filterControl',
    'filtered',
    'filteredTitle',
    'filteredContent',
    'toolbar',
    'toolbarLeft',
    'toolbarRight',
    'divider',
    'card',
    'control',
    'dialogTitle',
    'copyButton'
])

export const style = defineCss(({spacing, text, background, borderRadius}) => css`
    @layer reset {
        flex: 1;
        width: 100%;
        height: 100%;
        min-height: 0;
        display: flex;
        flex-direction: column;
        
        .${classes.filterForm} {
            min-height: 0;
            display: flex;
            flex-direction: column;
        }

        .${classes.filter} {
            display: flex;
            gap: ${spacing[6]}px;

            .${classes.filterGrid}, .${classes.filterGridContainer} {
                flex: 1;
                opacity: 1;
                justify-content: flex-end;
            }

            .${classes.filterControl} {
                align-self: flex-end;
                margin-bottom: ${spacing[6]}px;
            }
        }

        .${classes.filtered} {
            display: flex;
            align-items: center;
            margin-bottom: ${spacing[6]}px;

            .${classes.filteredTitle} {
                color: ${text.secondary};
                font-size: ${13 / 14}em;
            }

            .${classes.filteredContent} {
                flex: 1;
                display: flex;
                flex-wrap: wrap;
                gap: ${spacing[2]}px;
            }
        }

        .${classes.toolbar} {
            display: flex;
            justify-content: space-between;
            margin-bottom: ${spacing[4]}px;

            .${classes.toolbarLeft} {
                display: flex;
                gap: ${spacing[2]}px;
            }

            .${classes.toolbarRight} {
                display: flex;

                .${classes.divider} {
                    padding: 8px 0;
                }
            }
        }

        .${classes.card} {
            min-height: 0;
            border-radius: ${borderRadius}px;

            .${loadingClasses.root} {
                height: 100%;
            }
        }

        &[data-variant=standard] {
            .${classes.card} {
                background-color: ${background.content};
                padding: ${spacing[8]}px;
            }
        }

        .${classes.control} {
            display: flex;
            gap: ${spacing[5]}px;
        }
    }
`)

export const dialogStyle = defineCss(({spacing}) => css`
    @layer reset {
        .${classes.dialogTitle} {
            display: flex;
            align-items: center;
            gap: ${spacing[8]}px;

            .${buttonClasses.root} {
                font-size: 1rem;
            }
        }
    }
`)