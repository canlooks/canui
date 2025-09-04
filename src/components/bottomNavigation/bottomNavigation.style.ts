import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'
import Color from 'color'

export const classes = defineInnerClasses('bottom-navigation', [
    'item',
    'icon',
    'label'
])

export const style = defineCss(({background, text, easing, colors}) => {
    const primaryColor = Color(colors.primary.main)

    return css`
        height: 56px;
        background-color: ${background.content};
        display: flex;
        position: absolute;
        inset: auto 0 0;

        .${classes.item} {
            line-height: 1;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            cursor: pointer;
            color: ${text.secondary};
            transition: background-color .25s ${easing.easeOut};
            -webkit-tap-highlight-color: transparent;
            
            &:hover {
                &:not([data-active=true]) {
                    background-color: ${Color(text.primary).alpha(.03).string()};
                }

                &[data-active=true] {
                    background-color: ${primaryColor.alpha(.03).string()};
                }
            }

            &:active {
                transition: background-color 0s;

                &:not([data-active=true]) {
                    background-color: rgba(0, 0, 0, .06);
                }

                &[data-active=true] {
                    background-color: ${primaryColor.alpha(.06).string()};
                }
            }
            
            &[data-active=true] {
                color: ${colors.primary.main};
            }

            .${classes.icon} {
                display: flex;
                font-size: ${18 / 14}em;
            }

            .${classes.label} {
                transition-property: font-size, transform, height;
                transition-duration: .25s;
                transition-timing-function: ${easing.easeOut};
            }

            &[data-show-label-inactive=true]:not([data-active=true]) {
                .${classes.label} {
                    font-size: ${12 / 14}em;
                }
            }

            &:not([data-show-label-inactive=true]):not([data-active=true]) {
                .${classes.label} {
                    height: 0;
                    transform: scale(0);
                }
            }

            &[data-active=true] {
                .${classes.label} {
                    height: 1em;
                    font-size: 1em;
                    transform: scale(1);
                    transition-timing-function: ${easing.bounce};
                }
            }
        }
    `
})