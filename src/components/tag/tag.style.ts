import {css} from '@emotion/react'
import {defineInnerClasses, useColor, useCss} from '../../utils'
import {TagProps} from './tag'
import Color from 'color'

export const classes = defineInnerClasses('tag', [
    'content',
    'prefix',
    'suffix',
    'close'
])

export function useStyle({color}: Required<Pick<TagProps, 'color'>>) {
    const colorValue = useColor(color)
    
    return useCss(({spacing, borderRadius, divider, gray, easing}) => {
        const c = Color(colorValue)
        
        return css`
            line-height: 1;
            display: inline-flex;
            align-items: center;
    
            .${classes.content} {
                flex: 1;
                min-width: 0;
            }
    
            font-size: 1em;
            gap: ${spacing[1]}px;
            border-radius: ${borderRadius}px;
    
            &[data-size=small] {
                font-size: ${13 / 14}em;
                gap: 4px;
                border-radius: 4px;
                padding: ${spacing[1]}px ${spacing[2]}px;
            }
    
            &[data-shape=rounded] {
                border-radius: 1000em;
                padding: ${spacing[1]}px 8px;
            }
    
            &[data-size=medium] {
                padding: ${spacing[2]}px ${spacing[3]}px;
            }
    
            &[data-size=large] {
                padding: 10px ${spacing[4]}px;
            }
    
            border-width: 1px;
    
            &[data-variant=pure] {
                border-width: 0;
                padding: ${spacing[1] + 1}px ${spacing[2] + 1}px;
            }
    
            border-style: solid;
            border-color: ${color === 'text' ? divider : c.alpha(.5).string()};
            
    
            &[data-variant=outlined],
            &[data-variant=pure] {
                color: ${colorValue};
                background-color: ${c.alpha(.1).string()};
            }
    
            &[data-variant=filled] {
                color: #ffffff;
                background-color: ${colorValue};
            }
    
            &[data-size=small] {
                .${classes.close} {
                    font-size: ${13 / 14}em;
                }
            }
    
            &[data-variant=filled] {
                .${classes.close} {
                    color: ${gray(.1)};
                    -webkit-tap-highlight-color: transparent;
                    
                    &:hover {
                        color: ${gray(.2)};
                    }
                
                    &:active {
                        transition: color 0s;
                        color: ${gray(.3)}
                    }
                }
            }
    
            &[data-clickable=true] {
                cursor: pointer;
                transition: filter .25s ${easing.easeOut};
    
                &:hover {
                    filter: brightness(1.2);
                }
    
                &:active {
                    transition: filter 0s;
                    filter: brightness(.8);
                }
            }
    
            &[data-compact=row] {
                &:not([data-last=true]) {
                    border-top-right-radius: 0;
                    border-bottom-right-radius: 0;
                }
    
                &:not([data-first=true]) {
                    border-top-left-radius: 0;
                    border-bottom-left-radius: 0;
                    margin-left: -1px;
                }
            }
        `
    }, [colorValue])
}