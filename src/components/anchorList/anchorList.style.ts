import {defineInnerClasses, defineCss} from '../../utils'
import {css} from '@emotion/react'

export const classes = defineInnerClasses('anchor-list', [
    'item',
    'indicator'
])

export const style = defineCss(({colors, easing}) => css`
    @layer reset {
        position: relative;

        .${classes.item} {
            padding: 5px 0;
            color: inherit;
            text-decoration: none;
            position: relative;
            transition: all .25s ${easing.easeOut};
            -webkit-tap-highlight-color: transparent;

            &:hover, &[data-active=true] {
                color: ${colors.primary.main};
            }

            &:not([data-active=true]):active {
                transition: all 0s;
                opacity: .7;
            }

            &::before {
                content: '';
                top: 8px;
                display: none;
            }
        }

        .${classes.item}::before, .${classes.indicator} {
            width: 2px;
            height: 1em;
            background: ${colors.primary.main};
            position: absolute;
            left: 0;
        }

        .${classes.indicator} {
            top: 0;
            transition: top .3s ${easing.bounce};
        }


        &:not([data-animating=true]) {
            .${classes.item}[data-active=true]::before {
                display: block;
            }

            .${classes.indicator} {
                display: none;
            }
        }
    }
`)