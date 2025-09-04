import {css} from '@emotion/react'
import {defineInnerClasses} from '../../utils'

export const classes = defineInnerClasses('input', [
    'input',
    'adaptable'
])

export const commonNativeInputStyle = css`
    width: 100%;
    height: 22px;
    flex: 1;
    border: none;
    outline: none;
    padding: 0;
    background-color: transparent;
    font-size: 1em;
`

export const style = css`
    position: relative;

    .${classes.input} {
        ${commonNativeInputStyle}
    
        &::-webkit-search-cancel-button {
            display: none;
        }
    
        &::-ms-clear,
        &::-webkit-search-cancel-button {
            display: none;
        }
    
        &::-webkit-inner-spin-button,
        &::-webkit-outer-spin-button {
            width: 12px;
        }
    }

    &[data-adaptable=true] {
        .${classes.input} {
            height: 100%;
            position: absolute;
            inset: 0;
        }
    }

    .${classes.adaptable} {
        opacity: 0;
        pointer-events: none;
    }
`