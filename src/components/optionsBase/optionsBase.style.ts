import {css} from '@emotion/react'
import {defineInnerClasses} from '../../utils'

export const classes = defineInnerClasses('options-base', [
    'optionsList'
])

export const style = css`
    .${classes.optionsList} {
        width: 100%;
        height: 100%;
        flex: 1;
        overflow: hidden;
        max-height: ${32 * 8}px;

        &:hover {
            overflow: hidden auto;
        }
    }
`