import {css} from '@emotion/react'
import {defineInnerClasses, responsiveVariables, useCss} from '../../utils'
import {ResponsiveValue} from '../../types'

export const classes = defineInnerClasses('drawer', [
    'drawer',
    'drawerWrap',
    'titleRow',
    'title',
    'close',
    'body',
    'bodyWrap'
])

export function useStyle({size}: {size: ResponsiveValue<string | number>}) {
    return useCss(({breakpoints, spacing, background, boxShadow, borderRadius, divider}) => {
        return css`
            ${responsiveVariables(breakpoints, k => {
                let _size: string | number | undefined = size[k]
                if (typeof _size === 'undefined') {
                    return ''
                }
                if (typeof _size === 'number') {
                    _size = _size + 'px'
                }
                return `--drawer-size: ${_size};`
            })}

            .${classes.drawer} {
                position: absolute;
                padding: ${spacing[2]}px;
            }
        
            &[data-placement=top] {
                .${classes.drawer} {
                    height: var(--drawer-size);
                    transform-origin: top;
                    inset: 0 0 auto;
                }
            }
        
            &[data-placement=bottom] {
                .${classes.drawer} {
                    height: var(--drawer-size);
                    transform-origin: bottom;
                    inset: auto 0 0;
                }
            }
        
            &[data-placement=left] {
                .${classes.drawer} {
                    width: var(--drawer-size);
                    transform-origin: left;
                    inset: 0 auto 0 0;
                }
            }
        
            &[data-placement=right] {
                .${classes.drawer} {
                    width: var(--drawer-size);
                    transform-origin: right;
                    inset: 0 0 0 auto;
                }
            }

            .${classes.drawerWrap} {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                background-color: ${background.content};
                box-shadow: ${boxShadow[1]};
                border-radius: ${borderRadius}px;
            }
        
            .${classes.titleRow} {
                font-size: ${16 / 14}em;
                font-weight: bold;
                display: flex;
                align-items: center;
                padding: 0 ${spacing[2]}px;
        
                .${classes.title} {
                    flex: 1;
                    padding: ${spacing[5]}px ${spacing[6]}px;
                }
        
                .${classes.close} {
                    margin: ${spacing[3]}px;
                }

                & + .${classes.body} {
                    padding-top: 0;
                }
            }

            &[data-placement=right] {
                .${classes.title}:has(+ .${classes.close}) {
                    padding-left: 0;
                }
            }
        
            &[data-placement=right] {
                .${classes.titleRow} {
                    flex-direction: row-reverse;
                }
            }
        
            .${classes.body} {
                flex: 1;
                overflow: auto;
                padding: ${spacing[6]}px ${spacing[8]}px;
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;

                &[data-bordered=true] {
                    border-top-color: ${divider};
                }
            }
        `
    })
}