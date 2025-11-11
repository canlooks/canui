import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '../../utils'

export const classes = defineInnerClasses('placeholder', [
    'image',
    'title',
    'description',
    'extra'
])

export const style = defineCss(({spacing, text}) => css`
    @layer reset {
        width: 100%;
        height: 100%;
        flex: 1;
        padding: ${spacing[8]}px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .${classes.image} {
            height: 60px;
            object-fit: cover;
        }

        .${classes.title} {
            font-size: 1.7em;
            margin-top: ${spacing[8]}px;
            font-weight: bold;
            white-space: nowrap;
        }

        .${classes.description} {
            margin-top: ${spacing[4]}px;
            color: ${text.placeholder};
        }

        .${classes.extra} {
            margin-top: ${spacing[8]}px;
        }
    }
`)