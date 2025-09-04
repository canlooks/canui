import {defineInnerClasses, responsiveVariables, useCss} from '../../utils'
import {ResponsiveValue} from '../../types'
import {css} from '@emotion/react'

export const classes = defineInnerClasses('waterfall', [
    'item'
])

export function useStyle({columnCount, columnGap, rowGap}: {
    columnCount: ResponsiveValue
    columnGap: ResponsiveValue
    rowGap: ResponsiveValue
}) {
    return useCss(theme => css`
        ${responsiveVariables(theme.breakpoints, k => `
            ${k in columnCount ? `--waterfall-columnCount: ${columnCount[k]}` : ''};
            ${k in columnGap ? `--waterfall-column-gap: ${columnGap[k]}px` : ''};
            ${k in rowGap ? `--waterfall-row-gap: ${rowGap[k]}px` : ''};
        `)}

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        column-gap: var(--waterfall-column-gap);
    `)
}