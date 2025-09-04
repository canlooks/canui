import {css} from '@emotion/react'
import {defineCss} from '@'

export const style = defineCss(({mode}) => css`
    html, body {
        margin: 0;
    }

    body {
        overflow-x: hidden;
    }

    html, body, .scrollbar {
        color-scheme: ${mode};
        
        &::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: ${mode === 'light' ? 'rgba(0, 0, 0, .3)' : 'rgba(255, 255, 255, .5)'};
            border-radius: 1000em;

            &:hover {
                background-color: ${mode === 'light' ? 'rgba(0, 0, 0, .5)' : 'rgba(255, 255, 255, .7)'};
            }
        }
    }
`)