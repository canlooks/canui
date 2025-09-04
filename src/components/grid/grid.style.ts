import {css} from '@emotion/react'
import {defineInnerClasses, responsiveVariables, useCss} from '../../utils'
import {ResponsiveValue} from '../../types'

export const classes = defineInnerClasses('grid', [
    'item'
])

export function useContainerStyle({columnCount, columnGap, rowGap}: {
    columnCount: ResponsiveValue
    columnGap: ResponsiveValue
    rowGap: ResponsiveValue
}) {
    return useCss(theme => css`
        ${responsiveVariables(theme.breakpoints, k => `
            ${k in columnCount ? `--grid-columnCount: ${columnCount[k]}` : ''};
            ${k in columnGap ? `--grid-column-gap: ${columnGap[k]}px` : ''};
            ${k in rowGap ? `--grid-row-gap: ${rowGap[k]}px` : ''};
        `)}

        flex-wrap: wrap;
        gap: var(--grid-row-gap) var(--grid-column-gap);
    `)
}

export function useItemStyle({span, offset}: {
    span: ResponsiveValue
    offset: ResponsiveValue
}) {
    return useCss(theme => css`
        ${responsiveVariables(theme.breakpoints, k => `
            ${k in span ? `--grid-item-span: ${span[k]}` : ''};
            ${k in offset ? `--grid-item-offset: ${offset[k]}` : ''};
        `)}

        --grid-item-width: calc((100% - var(--grid-column-gap) * (var(--grid-columnCount) - 1)) / var(--grid-columnCount));

        width: calc(var(--grid-item-width) * var(--grid-item-span) + var(--grid-column-gap) * (var(--grid-item-span) - 1));
        margin-left: calc(var(--grid-item-width) * var(--grid-item-offset) + var(--grid-column-gap) * var(--grid-item-offset));
    `)
}