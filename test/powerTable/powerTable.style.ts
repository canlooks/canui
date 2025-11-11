import {defineCss} from '@canlooks/can-ui'
import {css} from '@emotion/react'

export const style = defineCss(({gray}) => css`
    min-height: 300px;
    
    th {
        text-align: center !important;
        white-space: nowrap;
    }

    td {
        text-align: right !important;
        white-space: nowrap;
        position: relative;

        &[data-no-data=true] {
            &::after {
                content: '';
                position: absolute;
                inset: 20%;
                background: linear-gradient(
                        to top right,
                        transparent 0%,
                        transparent calc(50% - 1px),
                        ${gray(.1)} 50%,
                        transparent calc(50% + 1px),
                        transparent 100%
                );
            }
        }
    }

    th, td {
        &.day-last-cell {
            border-right: 2px solid ${gray(.3)} !important;
        }
    }
`)