import {defineInnerClasses, responsiveStyles} from '@'
import {css} from '@emotion/react'

export const classes = defineInnerClasses('global-search', [
    'searchInput',
    'searchButton'
])

export const style = [
    css`
        .${classes.searchInput} {
            margin-right: 9px;

            &, input {
                cursor: pointer;
            }
        }

        .${classes.searchButton} {
            display: none;
        }
    `,
    responsiveStyles({
        sm: css`
            .${classes.searchInput} {
                display: none;
            }

            .${classes.searchButton} {
                display: flex !important;
            }
        `
    })
]