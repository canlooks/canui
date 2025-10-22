import {defineCss} from '../../utils'
import {css} from '@emotion/react'

export const style = defineCss(({background, easing}) => css`
    overflow: auto;

    th, td {
        &[data-sticky=left], &[data-sticky=right] {
            overflow: visible;
            position: sticky;
            z-index: 2;

            &:after {
                content: '';
                width: 30px;
                height: 100%;
                position: absolute;
                top: 0;
                transition: all .3s ${easing.easeOut};
                pointer-events: none;
            }
        }

        &[data-sticky=left]:after {
            left: 100%;
        }

        &[data-sticky=right]:after {
            right: 100%;
        }
    }

    &[data-scrolled-left=true] {
        th, td {
            &[data-sticky=left]:not(:has(+ [data-sticky=left])):after {
                box-shadow: inset 12px 0 9px -9px rgba(0, 0, 0, .08);
            }
        }
    }

    &[data-scrolled-right=true] {
        th, td {
            &:not([data-sticky=right]) + [data-sticky=right]:after {
                box-shadow: inset -12px 0 9px -9px rgba(0, 0, 0, .08);
            }
        }
    }
`)