import {css} from '@emotion/react'
import {defineInnerClasses} from '../../utils'

export const classes = defineInnerClasses('loading', [
    'container',
    'mask'
])

export const style = css`
    position: relative;
    z-index: 0;
    
    &[data-fill=true] {
        width: 100%;
        height: 100%;
        flex: 1;
    }

    .${classes.container} {
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 0;
    }


    .${classes.mask} {
        z-index: 1;
    }
`