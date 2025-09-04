import {defineInnerClasses} from '@'
import {css} from '@emotion/react'

export const classes = defineInnerClasses('appearance', [
    'title'
])

export const style = css`
    width: 390px;
    padding: 12px;
    
    .${classes.title} {
        margin-bottom: 12px;
        font-weight: bold;
    }
`