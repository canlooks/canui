import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import {menuListPadding} from '../menuItem/menuItem.style'

export const classes = defineInnerClasses('transfer', [
    'panel',
    'header',
    'checkbox',
    'info',
    'title',
    'count',
    'list',
    'buttons',
])

export const style = defineCss(({spacing, background, divider, borderRadius, text}) => css`
    @layer reset {
        display: inline-flex;
        gap: ${spacing[3]}px;

        .${classes.panel} {
            width: 180px;
            background-color: ${background.content};
            border: 1px solid ${divider};
            border-radius: ${borderRadius}px;
            display: flex;
            flex-direction: column;

            .${classes.header} {
                display: flex;
                gap: ${spacing[2]}px;
                align-items: center;
                padding: 10px 16px;
                border-bottom: 1px solid ${divider};

                .${classes.checkbox} {
                    display: flex;
                }

                .${classes.title} {
                    flex: 1
                }

                .${classes.count} {
                    color: ${text.secondary};
                }
            }

            .${classes.list} {
                flex: 1;
                padding: ${menuListPadding}px;

                > * {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        &[data-full-width=true] {
            width: 100%;

            .${classes.panel} {
                flex: 1;
            }
        }

        .${classes.buttons} {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: ${spacing[3]}px;
        }
    }
`)