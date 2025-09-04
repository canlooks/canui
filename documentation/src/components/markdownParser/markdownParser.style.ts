import {css} from '@emotion/react'
import {defineInnerClasses, defineCss} from '@'

export const skeletonStyle = css`
    margin-top: 42px;
`

export const classes = defineInnerClasses('markdown-parser', [
    'table'
])

export const markdownStyle = defineCss(() => css`
    .${classes.table} {
        thead {
            white-space: nowrap;
        }

        th, td {
            &:first-of-type {
                font-weight: bold;
            }

            &:last-of-type {
                min-width: 200px;
            }
        }
    }

    li {
        margin-bottom: 6px;
    }
`)